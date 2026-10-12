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

  // Campaign Updates #28 and #33: the two stretch goals unlocked by 12 October 2026.
  test('has the two stretch goals, each with what the campaign says becomes of it', () => {
    const goals = UNLOCKS.filter((unlock) => unlock.kind === 'stretchGoal')
    expect(goals.map((goal) => [goal.name, getProduct(goal.with).name])).toEqual([
      ['The Untouchables Mini-Expansion', 'Gang Wars (Core Game)'],
      ['The Nightclub and its Night Associates', 'Gangland Empire Expansion'],
    ])
    for (const goal of goals) {
      expect(goal.after, goal.name).not.toBeNull()
    }
  })
})

describe('what an order earns', () => {
  test('is what comes with Gang Wars, for Gang Wars alone', () => {
    expect(earned(preferencesWith())).toEqual(['untouchables', 'news-cards'])
  })

  // The Nightclub is "free for all backers with Gangland Empire in their pledge".
  test('has the Nightclub and the new buildings once Gangland Empire is in it', () => {
    expect(earned(preferencesWith({ extras: ['expansions'] }))).toEqual([
      'untouchables',
      'nightclub',
      'factory-newspaper',
      'news-cards',
    ])
    // City of Violence alone does not earn them.
    expect(
      earned(preferencesWith({ extras: ['expansions'], overrides: { [GANGLAND_EMPIRE]: false } })),
    ).toEqual(['untouchables', 'news-cards'])
  })

  test('has them for Gangland Empire bought beside Scarface 1920, without Gang Wars', () => {
    expect(earned(preferencesWith({ lines: ['scarface'], extras: ['expansions'] }))).toEqual([
      'nightclub',
      'factory-newspaper',
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
    expect(items.find((item) => item.id === CITY_OF_VIOLENCE)?.gains).toBeNull()
  })
})
