import { describe, expect, test } from 'bun:test'

import { findProduct, getProduct } from '../app/domain/catalog'
import { findRequirement } from '../app/domain/classification'
import { buildQuote } from '../app/domain/quote'
import { describeExtra } from '../app/domain/selection'
import { UNLOCKS, unlockImage } from '../app/domain/unlocks'

import { ALL_EXTRAS, ALL_LINES, preferencesWith } from './support'

import type { Preferences } from '../app/domain/types'

const GANGLAND_EMPIRE = 126721
const CITY_OF_VIOLENCE = 126720
const DELUXIFICATION_SET = 126724

const earned = (preferences: Preferences): readonly string[] =>
  buildQuote(preferences).unlocks.map((unlock) => unlock.id)

describe('what the campaign has unlocked', () => {
  test('is each named once, and earned by a single item on sale', () => {
    const ids = UNLOCKS.map((unlock) => unlock.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const unlock of UNLOCKS) {
      expect(findProduct(unlock.with)?.isSet, unlock.name).toBe(false)
      expect(findRequirement(unlock.with), unlock.name).toBeDefined()
      expect(unlock.what.trim(), unlock.name).toMatch(/\.$/u)
    }
  })

  test('has a stored picture for each', async () => {
    for (const unlock of UNLOCKS) {
      expect(await Bun.file(`public/${unlockImage(unlock)}`).exists(), unlock.name).toBe(true)
    }
  })

  // Campaign Updates #28, #33, #36 and #38: all four of the campaign's stretch goals.
  test('has the four stretch goals, each with the item that earns it', () => {
    const goals = UNLOCKS.filter((unlock) => unlock.kind === 'stretchGoal')
    expect(goals.map((goal) => [goal.name, getProduct(goal.with).name])).toEqual([
      ['The Untouchables Mini-Expansion', 'Gang Wars (Core Game)'],
      ['The Nightclub and its Night Associates', 'Gangland Empire Expansion'],
      ['Jack “Poker” Hart', 'City of Violence Expansion'],
      ['The Gang Wars comic, and Vendetta', 'Gang Wars (Core Game)'],
    ])
  })

  // Update #35: the Untouchables "will become an expansion with a €12 price tag"; Update #33
  // says the Nightclub will not be sold on its own.
  test('says what the campaign says becomes of a stretch goal afterwards', () => {
    const after = (id: string): string | null | undefined =>
      UNLOCKS.find((unlock) => unlock.id === id)?.after
    expect(after('untouchables')).toContain('€12')
    expect(after('nightclub')).toContain('not be sold')
  })
})

describe('what an order earns', () => {
  test('is what comes with Gang Wars, for Gang Wars alone', () => {
    expect(earned(preferencesWith())).toEqual(['untouchables', 'comic-vendetta', 'news-cards'])
  })

  // The Nightclub is "free for all backers with Gangland Empire in their pledge".
  test('has the Nightclub and the new buildings once Gangland Empire is in it', () => {
    expect(earned(preferencesWith({ extras: ['expansions'] }))).toEqual([
      'untouchables',
      'nightclub',
      'jack',
      'comic-vendetta',
      'factory-newspaper',
      'news-cards',
    ])
    // City of Violence alone does not earn them; it earns its own Fixer.
    expect(
      earned(preferencesWith({ extras: ['expansions'], overrides: { [GANGLAND_EMPIRE]: false } })),
    ).toEqual(['untouchables', 'jack', 'comic-vendetta', 'news-cards'])
  })

  test('has them for Gangland Empire bought beside Scarface 1920, without Gang Wars', () => {
    expect(earned(preferencesWith({ lines: ['scarface'], extras: ['expansions'] }))).toEqual([
      'nightclub',
      'factory-newspaper',
    ])
  })

  // Update #35: the acrylic versions of the campaign's new tokens join the Deluxification Set.
  test('has the extra acrylic tokens once the Deluxification Set is in it', () => {
    expect(earned(preferencesWith({ extras: ['deluxe'] }))).toEqual([
      'untouchables',
      'comic-vendetta',
      'news-cards',
      'deluxe-tokens',
    ])
  })

  test('is nothing for Scarface 1920 alone, or for nothing at all', () => {
    expect(earned(preferencesWith({ lines: ['scarface'] }))).toEqual([])
    expect(earned(preferencesWith({ lines: [] }))).toEqual([])
  })

  test('is everything, for everything', () => {
    expect(earned(preferencesWith({ lines: ALL_LINES, extras: ALL_EXTRAS }))).toHaveLength(
      UNLOCKS.length,
    )
  })
})

describe('an item the campaign has added things to', () => {
  test('says so under its switch, whether or not it is in the order', () => {
    const items = describeExtra(preferencesWith({ lines: [] }), 'expansions').items
    expect(items.find((item) => item.id === GANGLAND_EMPIRE)?.gains).toBe(
      'Free with it: The Nightclub and its Night Associates; The Factory and the Newspaper Tower',
    )
    expect(items.find((item) => item.id === CITY_OF_VIOLENCE)?.gains).toBe(
      'Free with it: Jack “Poker” Hart',
    )
    const deluxe = describeExtra(preferencesWith({ lines: [] }), 'deluxe').items
    expect(deluxe.find((item) => item.id === DELUXIFICATION_SET)?.gains).toBe(
      'Free with it: Thirty-six more acrylic tokens',
    )
  })
})
