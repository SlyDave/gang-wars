import { describe, expect, test } from 'bun:test'

import capture from '../data/gamefound.json'
import { buyableProducts, catalog, findProduct, getProduct, leavesOf } from '../app/domain/catalog'
import {
  BUNDLE_CONTENTS,
  GANG_WARS,
  PROVIDES,
  REQUIREMENTS,
  findRequirement,
  providedBy,
} from '../app/domain/classification'
import { hasShippingTier } from '../app/domain/shipping'

describe('the catalogue', () => {
  test('has products, and every set is made of products it knows', () => {
    expect(catalog.products.length).toBeGreaterThan(40)
    for (const product of catalog.products) {
      for (const id of product.setItems) {
        expect(findProduct(id), `${product.name} contains ${String(id)}`).toBeDefined()
      }
    }
  })

  test('has a stored image for every product', async () => {
    for (const product of catalog.products) {
      expect(product.image, product.name).not.toBeNull()
      expect(
        await Bun.file(`public/${product.image ?? ''}`).exists(),
        `${product.name}: ${product.image ?? ''}`,
      ).toBe(true)
    }
  })

  test('prices everything in whole cents, never above list price', () => {
    for (const product of catalog.products) {
      expect(Number.isInteger(product.price), product.name).toBe(true)
      expect(Number.isInteger(product.effectivePrice), product.name).toBe(true)
      expect(product.effectivePrice, product.name).toBeLessThanOrEqual(product.price)
      expect(product.effectivePrice, product.name).toBeGreaterThan(0)
    }
  })

  // The calculator asks nothing about options, so none may change a price.
  test('has no option that changes a price', () => {
    for (const product of capture.products) {
      for (const option of product.options) {
        for (const value of option.values) {
          expect(value.priceModifier, `${product.name}: ${option.text} ${value.text}`).toBe(0)
        }
      }
    }
  })
})

describe('the bundles typed out by hand', () => {
  const typedOut = Object.entries(BUNDLE_CONTENTS).map(([id, contents]) => ({
    bundle: getProduct(Number(id)),
    contents: contents.map((item) => getProduct(item)),
  }))

  // Gamefound may one day list a bundle's contents itself. Then its own list is the one to use.
  test('are the ones Gamefound gives no contents for', () => {
    expect(typedOut.length).toBeGreaterThan(0)
    for (const { bundle } of typedOut) {
      const captured = capture.products.find((product) => product.id === bundle.id)
      expect(captured?.setItems, bundle.name).toEqual([])
      expect(bundle.isSet, bundle.name).toBe(true)
    }
  })

  test('are each made of single items on sale, none twice', () => {
    for (const { bundle, contents } of typedOut) {
      expect(new Set(contents).size, bundle.name).toBe(contents.length)
      for (const item of contents) {
        expect(item.isSet, `${bundle.name}: ${item.name}`).toBe(false)
        expect(item.buyable, `${bundle.name}: ${item.name}`).toBe(true)
      }
    }
  })

  // A bundle that cost more than its parts would mean the parts were typed out wrong.
  test('cost less than their contents bought one by one', () => {
    for (const { bundle, contents } of typedOut) {
      const apart = contents.reduce((total, item) => total + item.effectivePrice, 0)
      expect(bundle.effectivePrice, bundle.name).toBeLessThan(apart)
    }
  })

  test('are as the campaign describes them', () => {
    const names = (id: number): readonly string[] =>
      (BUNDLE_CONTENTS[id] ?? []).map((item) => getProduct(item).name)
    expect(names(126746)).toEqual([
      'Bloody Business (Reprint)',
      'Red Dragons Tong Gang (Reprint)',
      'The Golden Oaks Gang (Reprint)',
    ])
    expect(names(126745)).toEqual([
      'Scarface 1920 + The Enforcers (Reprint)',
      'Bloody Business (Reprint)',
      'Red Dragons Tong Gang (Reprint)',
      'The Golden Oaks Gang (Reprint)',
    ])
    // The seventeen lines of "the complete Scarface 1920 collection", two of them one product.
    expect(names(126747)).toHaveLength(16)
    expect(names(128719)).toEqual(['Safe Boxes (4-pack)', 'Safe Boxes (2-pack)'])
  })
})

describe('the classification', () => {
  const leaves = catalog.products.filter((product) => !product.isSet)

  // The cue to edit app/domain/classification.ts after a new capture.
  test('knows every single item Gamefound sells', () => {
    const unknown = leaves
      .filter((leaf) => findRequirement(leaf.id) === undefined && !(leaf.id in PROVIDES))
      .map((leaf) => `${String(leaf.id)} ${leaf.name}`)
    expect(unknown).toEqual([])
  })

  test('names only products that exist', () => {
    const ids = [
      ...REQUIREMENTS.flatMap((requirement) => [
        requirement.id,
        requirement.needs ?? requirement.id,
      ]),
      ...Object.keys(PROVIDES).map(Number),
      ...Object.values(PROVIDES).flat(),
      ...Object.keys(BUNDLE_CONTENTS).map(Number),
      ...Object.values(BUNDLE_CONTENTS).flat(),
    ]
    for (const id of ids) {
      expect(findProduct(id), String(id)).toBeDefined()
    }
  })

  test('lists no requirement twice', () => {
    const ids = REQUIREMENTS.map((requirement) => requirement.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('maps every stand-in onto real requirements', () => {
    for (const leaf of leaves) {
      for (const id of providedBy(leaf.id)) {
        expect(findRequirement(id), `${leaf.name} provides ${String(id)}`).toBeDefined()
      }
    }
  })

  test('can buy every requirement somehow', () => {
    const obtainable = new Set(
      buyableProducts.flatMap((product) =>
        leavesOf(product).flatMap((leaf) => providedBy(leaf.id)),
      ),
    )
    for (const requirement of REQUIREMENTS) {
      expect(obtainable.has(requirement.id), String(requirement.id)).toBe(true)
    }
  })

  // An accessory waits on one thing, and that thing must not be waiting on another.
  test('has no accessory to an accessory', () => {
    for (const requirement of REQUIREMENTS) {
      if (requirement.needs !== undefined) {
        expect(findRequirement(requirement.needs)?.needs, String(requirement.id)).toBeUndefined()
      }
    }
  })

  // The guard against an item on sale going missing from the page.
  test('puts every single item on sale under a switch', () => {
    const hidden = buyableProducts
      .filter((product) => !product.isSet)
      .filter((product) =>
        providedBy(product.id).every((id) => {
          const requirement = findRequirement(id)
          return requirement === undefined || requirement.tag === 'core'
        }),
      )
      .map((product) => `${String(product.id)} ${product.name}`)
    // The two games themselves have a switch each, of their own kind.
    expect(hidden).toEqual([])
  })

  test('has a shipping estimate for the eight things the campaign’s tables price', () => {
    const priced = buyableProducts
      .filter((product) => hasShippingTier(product.id))
      .map((product) => product.name)
      .sort((a, b) => a.localeCompare(b, 'en'))
    expect(priced).toEqual([
      'Gang Wars - Basic Pledge',
      'Gang Wars - Big Boss Pledge',
      'Gang Wars - Empire Pledge',
      'Gang Wars - Mobster Pledge',
      'Scarface 1920 + The Enforcers (Reprint)',
      'Scarface 1920 Expansions Bundle',
      'Scarface 1920 Gameplay Bundle',
      'Scarface 1920 Legacy All-in (Prepacked)',
    ])
  })

  test('has one for every way of buying a game but one', () => {
    const games = new Set(
      REQUIREMENTS.filter((requirement) => requirement.tag === 'core').map(({ id }) => id),
    )
    const unpriced = buyableProducts
      .filter((product) =>
        leavesOf(product).some((leaf) => providedBy(leaf.id).some((id) => games.has(id))),
      )
      .filter((product) => !hasShippingTier(product.id))
      .map((product) => product.id)
    // The Gang Wars core game is also listed among the add-ons, at the Basic Pledge's price.
    // The tables price the pledge, and the pledge is what the calculator recommends.
    expect(unpriced).toEqual([GANG_WARS])
  })
})
