import { describe, expect, test } from 'bun:test'

import { buildQuote } from '../app/domain/quote'
import { WAVE_ONE, WAVE_TWO } from '../app/domain/shipping'

import { ALL_EXTRAS, ALL_LINES, preferencesWith } from './support'

import type { Quote } from '../app/domain/quote'

const BASIC = 120122
const MOBSTER = 126737
const BIG_BOSS = 126738
const EMPIRE = 126740
const GANG_WARS_CORE = 126719
const CITY_OF_VIOLENCE = 126720
const GANGLAND_EMPIRE = 126721
const GW_PLAYMAT = 126726
const SCARFACE = 126728
const RED_DRAGONS = 126729
const GOLDEN_OAKS = 126730
const BLOODY_BUSINESS = 126731
const GAMEPLAY_BUNDLE = 126745
const EXPANSIONS_BUNDLE = 126746
const LEGACY_ALL_IN = 126747
const BB_SLEEVES = 128705
const VINYL = 126732

const cart = (quote: Quote): readonly number[] => quote.lines.map((line) => line.product.id)

/** No tax and nothing but the items, to check the combination itself. */
const itemsOnly = { includeTax: false } as const

describe('the best combination for Gang Wars', () => {
  test('is the Basic Pledge by default', () => {
    const quote = buildQuote(preferencesWith(itemsOnly))
    expect(cart(quote)).toEqual([BASIC])
    expect(quote.itemsTotal).toBe(8900)
    expect(quote.savings).toBe(0)
  })

  // The same game at the same price is also listed among the add-ons. The pledge is what the
  // campaign's gifts and stretch goals are promised to, and what its shipping table prices.
  test('is the pledge, and not the core game listed among the add-ons', () => {
    expect(cart(buildQuote(preferencesWith(itemsOnly)))).not.toContain(GANG_WARS_CORE)
  })

  test('is nothing when nothing is asked for', () => {
    const quote = buildQuote(preferencesWith({ lines: [] }))
    expect(quote.lines).toEqual([])
    expect(quote.total).toBe(0)
    expect(quote.shipments).toBe(0)
  })

  test('is the Mobster Pledge with both expansions', () => {
    const quote = buildQuote(preferencesWith({ ...itemsOnly, extras: ['expansions'] }))
    expect(cart(quote)).toEqual([MOBSTER])
    expect(quote.itemsTotal).toBe(12500)
    expect(quote.listTotal).toBe(16200)
    expect(quote.savings).toBe(3700)
  })

  // 89 + 35 = 124, a euro under the Mobster Pledge.
  test('is the Basic Pledge and one expansion, where only one is wanted', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        extras: ['expansions'],
        overrides: { [GANGLAND_EMPIRE]: false },
      }),
    )
    expect(cart(quote)).toEqual([BASIC, CITY_OF_VIOLENCE])
    expect(quote.itemsTotal).toBe(12400)
  })

  // Mobster (125) + playmat (22) = 147, under the Big Boss Pledge's 155.
  test('adds the playmat to the Mobster Pledge, the Big Boss costing more', () => {
    const quote = buildQuote(preferencesWith({ ...itemsOnly, extras: ['expansions', 'playmat'] }))
    expect(cart(quote)).toEqual([MOBSTER, GW_PLAYMAT])
    expect(quote.itemsTotal).toBe(14700)
  })

  test('is the Big Boss Pledge with the playmat and the sleeves', () => {
    const quote = buildQuote(
      preferencesWith({ ...itemsOnly, extras: ['expansions', 'playmat', 'sleeves'] }),
    )
    expect(cart(quote)).toEqual([BIG_BOSS])
    expect(quote.itemsTotal).toBe(15500)
    expect(quote.bonus).toEqual([])
  })

  test('is the Empire Pledge for everything it holds, saving €75', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        extras: ['expansions', 'playmat', 'sleeves', 'artbook', 'deluxe'],
      }),
    )
    expect(cart(quote)).toEqual([EMPIRE])
    expect(quote.itemsTotal).toBe(19500)
    expect(quote.savings).toBe(7500)
  })

  // Without the playmat the same things come to 211 one by one, so the pledge still wins.
  test('takes a pledge that brings something not asked for, when it is cheaper', () => {
    const quote = buildQuote(
      preferencesWith({ ...itemsOnly, extras: ['expansions', 'sleeves', 'artbook', 'deluxe'] }),
    )
    expect(cart(quote)).toEqual([EMPIRE])
    expect(quote.bonus.map((product) => product.id)).toEqual([GW_PLAYMAT])
  })
})

describe('the best combination for Scarface 1920', () => {
  test('is the game with The Enforcers, which is how it is sold', () => {
    const quote = buildQuote(preferencesWith({ ...itemsOnly, lines: ['scarface'] }))
    expect(cart(quote)).toEqual([SCARFACE])
    expect(quote.itemsTotal).toBe(12000)
  })

  test('is the Gameplay Bundle with its expansions', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        lines: ['scarface'],
        extras: ['expansions'],
        // A Gang Wars expansion that is played in Scarface 1920 too: left aside here.
        overrides: { [GANGLAND_EMPIRE]: false },
      }),
    )
    expect(cart(quote)).toEqual([GAMEPLAY_BUNDLE])
    expect(quote.itemsTotal).toBe(19500)
    expect(quote.bonus).toEqual([])
  })

  // 120 + 49 + 36 = 205, against 195 for the bundle with the other gang thrown in.
  test('is the Gameplay Bundle even for one gang short of it', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        lines: ['scarface'],
        overrides: { [BLOODY_BUSINESS]: true, [RED_DRAGONS]: true },
      }),
    )
    expect(cart(quote)).toEqual([GAMEPLAY_BUNDLE])
    expect(quote.bonus.map((product) => product.id)).toEqual([GOLDEN_OAKS])
  })

  test('is the game and Bloody Business bought apart, which is cheaper than the bundle', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        lines: ['scarface'],
        overrides: { [BLOODY_BUSINESS]: true },
      }),
    )
    expect(cart(quote)).toEqual([SCARFACE, BLOODY_BUSINESS])
    expect(quote.itemsTotal).toBe(16900)
  })

  test('is the Expansions Bundle for whoever has the game already', () => {
    const quote = buildQuote(
      preferencesWith({
        ...itemsOnly,
        lines: [],
        overrides: { [BLOODY_BUSINESS]: true, [RED_DRAGONS]: true, [GOLDEN_OAKS]: true },
      }),
    )
    expect(cart(quote)).toEqual([EXPANSIONS_BUNDLE])
    expect(quote.itemsTotal).toBe(9500)
  })

  test('is the Legacy All-in with every extra, and what the All-in leaves out beside it', () => {
    const quote = buildQuote(
      preferencesWith({ ...itemsOnly, lines: ['scarface'], extras: ALL_EXTRAS }),
    )
    expect(cart(quote)).toContain(LEGACY_ALL_IN)
    // Its list has one sleeves pack, taken to be the core game's.
    expect(cart(quote)).toContain(BB_SLEEVES)
    expect(quote.bonus).toEqual([])
    expect(quote.unavailable).toEqual([])
  })
})

describe('the cart', () => {
  test('lists Gang Wars, then Scarface 1920; the game first, then by category, then by name', () => {
    const quote = buildQuote(preferencesWith({ lines: ALL_LINES, extras: ALL_EXTRAS }))
    const groups = quote.lines.map((line) => line.group)
    expect(groups).toEqual([...groups].sort((a, b) => ALL_LINES.indexOf(a) - ALL_LINES.indexOf(b)))
    expect(cart(quote)[0]).toBe(EMPIRE)
    expect(quote.lines.find((line) => line.group === 'scarface')?.product.id).toBe(LEGACY_ALL_IN)
  })

  test('says what is inside each thing, and whether it was asked for', () => {
    const quote = buildQuote(preferencesWith({ extras: ['expansions'] }))
    const [mobster] = quote.lines
    expect(mobster?.contents.map((content) => content.product.name)).toEqual([
      'Gang Wars (Core Game)',
      'City of Violence Expansion',
      'Gangland Empire Expansion',
    ])
    expect(mobster?.contents.every((content) => content.wanted)).toBe(true)
  })
})

describe('shipping', () => {
  test('is the campaign’s estimate for the pledge, by region', () => {
    const shipping = (destination: string): number =>
      buildQuote(preferencesWith({ ...itemsOnly, destination })).shippingTotal
    expect(shipping('GB')).toBe(2100)
    expect(shipping('DE')).toBe(2200)
    expect(shipping('US')).toBe(2400)
    expect(shipping('UH')).toBe(2800)
    expect(shipping('CA')).toBe(2600)
    expect(shipping('NO')).toBe(3100)
    expect(shipping('AU')).toBe(2700)
    expect(shipping('NZ')).toBe(3100)
    expect(shipping('HK')).toBe(2100)
    expect(shipping('MX')).toBe(4500)
    expect(shipping('XS')).toBe(5400)
    expect(shipping('JP')).toBe(3700)
    expect(shipping('XW')).toBe(7500)
  })

  test('is each game’s own, added up, since the two never travel together', () => {
    const quote = buildQuote(
      preferencesWith({ ...itemsOnly, lines: ALL_LINES, extras: ['expansions'] }),
    )
    expect(cart(quote)).toEqual([MOBSTER, GAMEPLAY_BUNDLE])
    expect(quote.shippingTotal).toBe(2200 + 2500)
    expect(quote.shipments).toBe(2)
    expect(quote.lines.map((line) => line.wave)).toEqual([2, 1])
  })

  test('has no estimate for a single add-on, and says which', () => {
    const quote = buildQuote(preferencesWith({ ...itemsOnly, extras: ['playmat'] }))
    expect(cart(quote)).toEqual([BASIC, GW_PLAYMAT])
    expect(quote.shippingTotal).toBe(2100)
    expect(quote.unpricedShipping.map((product) => product.id)).toEqual([GW_PLAYMAT])
  })

  test('is nothing yet for add-ons alone', () => {
    const quote = buildQuote(
      preferencesWith({ ...itemsOnly, lines: [], overrides: { [VINYL]: true } }),
    )
    expect(cart(quote)).toEqual([VINYL])
    expect(quote.shippingTotal).toBe(0)
    expect(quote.unpricedShipping).toHaveLength(1)
  })
})

describe('the waves', () => {
  test('are the second for Gang Wars alone', () => {
    const quote = buildQuote(preferencesWith())
    expect(quote.shipments).toBe(1)
    expect(quote.waves).toContain('Wave 2')
    expect(quote.waves).toContain(WAVE_TWO)
    expect(quote.waves).not.toContain(WAVE_ONE)
  })

  test('are the first for Scarface 1920 alone', () => {
    const quote = buildQuote(preferencesWith({ lines: ['scarface'] }))
    expect(quote.shipments).toBe(1)
    expect(quote.waves).toContain('Wave 1')
    expect(quote.waves).toContain(WAVE_ONE)
  })

  test('are both, as two shipments, for an order with something of each', () => {
    const quote = buildQuote(preferencesWith({ lines: ALL_LINES }))
    expect(quote.shipments).toBe(2)
    expect(quote.waves).toContain(WAVE_ONE)
    expect(quote.waves).toContain(WAVE_TWO)
  })

  // Gangland Empire is a Gang Wars product whatever it is played in, and ships with Gang Wars.
  test('are both for Scarface 1920 with a Gang Wars add-on', () => {
    const quote = buildQuote(preferencesWith({ lines: ['scarface'], extras: ['expansions'] }))
    expect(cart(quote)).toEqual([GANGLAND_EMPIRE, GAMEPLAY_BUNDLE])
    expect(quote.shipments).toBe(2)
  })
})

describe('tax', () => {
  test('is charged on the rewards and the shipping, at the destination’s rate', () => {
    const quote = buildQuote(preferencesWith({ destination: 'GB' }))
    expect(quote.taxRate).toBe(20)
    expect(quote.taxTotal).toBe(Math.round((8900 + 2100) * 0.2))
    expect(quote.total).toBe(8900 + 2100 + 2200)
  })

  test('follows the destination', () => {
    expect(buildQuote(preferencesWith({ destination: 'DE' })).taxRate).toBe(19)
    expect(buildQuote(preferencesWith({ destination: 'DE' })).taxTotal).toBe(2109)
    expect(buildQuote(preferencesWith({ destination: 'AU' })).taxRate).toBe(10)
    expect(buildQuote(preferencesWith({ destination: 'CA' })).taxRate).toBe(5)
  })

  test('is nothing where the campaign collects none', () => {
    for (const destination of ['NZ', 'NO', 'JP', 'MX', 'XW']) {
      expect(buildQuote(preferencesWith({ destination })).taxTotal, destination).toBe(0)
    }
  })

  test('can be corrected, or left out', () => {
    expect(buildQuote(preferencesWith({ destination: 'US', taxRate: 8.5 })).taxTotal).toBe(
      Math.round((8900 + 2400) * 0.085),
    )
    const without = buildQuote(preferencesWith({ includeTax: false }))
    expect(without.taxTotal).toBe(0)
    expect(without.total).toBe(8900 + 2100)
  })
})
