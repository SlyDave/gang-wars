import { describe, expect, test } from 'bun:test'

import { buyableProducts, leavesOf } from '../app/domain/catalog'
import { REQUIREMENTS, findRequirement, providedBy } from '../app/domain/classification'
import { buildQuote } from '../app/domain/quote'
import { describeExtra, wantedRequirements } from '../app/domain/selection'

import { preferencesWith } from './support'

import type { Quote } from '../app/domain/quote'
import type { ExtraItem } from '../app/domain/selection'
import type { ExtraTag, Preferences } from '../app/domain/types'

const BASIC_PLEDGE = 120122
const SCARFACE = 126728
const ENFORCERS = 128687
const SAFES_OF_FOUR = 128816
const SAFES_OF_TWO = 128721
const SAFES_OF_SIX = 128719

const cart = (quote: Quote): readonly number[] => quote.lines.map((line) => line.product.id)

const item = (preferences: Preferences, tag: ExtraTag, id: number): ExtraItem | undefined =>
  describeExtra(preferences, tag).items.find((candidate) => candidate.id === id)

/** No tax, to read the sums off directly. */
const plain = { includeTax: false } as const

// The Enforcers is in the box with Scarface 1920, and is sold by itself as well, for whoever
// has the game without it.
describe('an expansion that comes with its game and is also sold on its own', () => {
  test('is listed under Expansions as there already, when its game is included', () => {
    const preferences = preferencesWith({ lines: ['scarface'] })
    const enforcers = item(preferences, 'expansions', ENFORCERS)
    expect(enforcers?.wanted).toBe(true)
    expect(enforcers?.passedOver).toBeNull()
    expect(enforcers?.included).toBe('Comes in the box with Scarface 1920')
  })

  test('is no part of what the switch counts, nor a sign that it is on', () => {
    const off = describeExtra(preferencesWith({ lines: ['scarface'] }), 'expansions')
    expect(off.state).toBe('off')
    expect(off.wantedCount).toBe(0)
    // Bloody Business, the two gangs, and Gangland Empire, which is played in both games.
    expect(off.size).toBe(4)
  })

  test('adds nothing to the order with its game', () => {
    const quote = buildQuote(preferencesWith({ ...plain, lines: ['scarface'] }))
    expect(cart(quote)).toEqual([SCARFACE])
    expect(quote.itemsTotal).toBe(12000)
    expect(quote.bonus).toEqual([])
  })

  test('cannot be left out of a game that holds it', () => {
    const preferences = preferencesWith({ lines: ['scarface'], overrides: { [ENFORCERS]: false } })
    expect(wantedRequirements(preferences).has(ENFORCERS)).toBe(true)
    expect(cart(buildQuote(preferences))).toEqual([SCARFACE])
  })

  test('is an add-on like any other without its game', () => {
    const passed = preferencesWith({ lines: ['gangwars'], extras: ['expansions'] })
    expect(item(passed, 'expansions', ENFORCERS)?.wanted).toBe(false)
    expect(item(passed, 'expansions', ENFORCERS)?.passedOver).toBe(
      'For Scarface 1920, which is not included',
    )

    const picked = preferencesWith({
      ...plain,
      lines: ['gangwars'],
      overrides: { [ENFORCERS]: true },
    })
    expect(cart(buildQuote(picked))).toEqual([BASIC_PLEDGE, ENFORCERS])
    expect(buildQuote(picked).itemsTotal).toBe(8900 + 2900)
  })
})

// Four Safe Boxes are in the Gang Wars core game, free (campaign Update #15). The same four
// are sold as a pack for Scarface 1920, with two more for the gangs only that game has.
describe('the Safe Boxes', () => {
  test('are in the Gang Wars order already, the four of its gangs', () => {
    const preferences = preferencesWith({ lines: ['gangwars'], extras: ['safes'] })
    expect(item(preferences, 'safes', SAFES_OF_FOUR)?.included).toBe(
      'Comes in the Gang Wars core game, free',
    )
    // The other two are for gangs Gang Wars does not have.
    expect(item(preferences, 'safes', SAFES_OF_TWO)?.wanted).toBe(false)
    expect(cart(buildQuote(preferences))).toEqual([BASIC_PLEDGE])
  })

  test('are the pack of six for Scarface 1920 alone, which is cheaper than four and two', () => {
    const quote = buildQuote(preferencesWith({ ...plain, lines: ['scarface'], extras: ['safes'] }))
    expect(cart(quote)).toEqual([SAFES_OF_SIX, SCARFACE])
    expect(quote.itemsTotal).toBe(1900 + 12000)
    expect(quote.bonus).toEqual([])
  })

  test('are the pack of two beside Gang Wars, whose box has the other four', () => {
    const quote = buildQuote(
      preferencesWith({ ...plain, lines: ['gangwars', 'scarface'], extras: ['safes'] }),
    )
    expect(cart(quote)).toEqual([BASIC_PLEDGE, SAFES_OF_TWO, SCARFACE])
    expect(quote.itemsTotal).toBe(8900 + 800 + 12000)
  })

  test('can be had as the four alone', () => {
    const quote = buildQuote(
      preferencesWith({
        ...plain,
        lines: ['scarface'],
        extras: ['safes'],
        overrides: { [SAFES_OF_TWO]: false },
      }),
    )
    expect(cart(quote)).toEqual([SAFES_OF_FOUR, SCARFACE])
  })
})

describe('the classification, against what is on sale', () => {
  test('says an item comes with a game only where every way of buying the game holds it', () => {
    const held = REQUIREMENTS.filter((requirement) => requirement.withGame === true)
    expect(held.map(({ id }) => id).sort((a, b) => a - b)).toEqual([ENFORCERS, SAFES_OF_FOUR])

    for (const requirement of held) {
      const ways = buyableProducts.filter((product) =>
        leavesOf(product).some((leaf) =>
          providedBy(leaf.id).some((id) => {
            const provided = findRequirement(id)
            return provided?.tag === 'core' && provided.line === requirement.line
          }),
        ),
      )
      expect(ways.length).toBeGreaterThan(0)
      for (const way of ways) {
        const holds = leavesOf(way).flatMap((leaf) => providedBy(leaf.id))
        expect(holds, `${way.name} holds ${String(requirement.id)}`).toContain(requirement.id)
      }
    }
  })
})
