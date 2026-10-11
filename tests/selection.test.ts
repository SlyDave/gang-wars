import { describe, expect, test } from 'bun:test'

import { describeExtra, wantedRequirements } from '../app/domain/selection'

import { ALL_EXTRAS, ALL_LINES, preferencesWith } from './support'

import type { ExtraItem } from '../app/domain/selection'
import type { ExtraTag, Preferences } from '../app/domain/types'

const CITY_OF_VIOLENCE = 126720
const GANGLAND_EMPIRE = 126721
const BIG_TRUCK = 126723
const BLOODY_BUSINESS = 126731
const RED_DRAGONS = 126729
const MELVIN_PURVIS = 126734
const BB_DELUXIFICATION = 128691
const ANNEX_PLAYMAT = 128711
const ORIGINAL_PLAYMAT = 128712
const XL_PLAYMAT = 128714
const SMALLER_PLAYMAT = 128715
const GW_PLAYMAT = 126726
const VINYL = 126732
const GW_SOLO = 128817
const SCARFACE_SOLO = 128688

const item = (preferences: Preferences, tag: ExtraTag, id: number): ExtraItem | undefined =>
  describeExtra(preferences, tag).items.find((candidate) => candidate.id === id)

const wants = (preferences: Preferences, id: number): boolean =>
  wantedRequirements(preferences).has(id)

describe('an extras switch', () => {
  test('takes what goes with the included games', () => {
    const preferences = preferencesWith({ lines: ['gangwars'], extras: ['playmat'] })
    expect(wants(preferences, GW_PLAYMAT)).toBe(true)
    expect(wants(preferences, ORIGINAL_PLAYMAT)).toBe(false)
    expect(item(preferences, 'playmat', ORIGINAL_PLAYMAT)?.passedOver).toBe(
      'For Scarface 1920, which is not included',
    )
  })

  test('takes its whole category where none of it goes with them', () => {
    // The record is the Scarface 1920 soundtrack, and plays without the game.
    const preferences = preferencesWith({ lines: ['gangwars'], extras: ['vinyl'] })
    expect(wants(preferences, VINYL)).toBe(true)
    expect(describeExtra(preferences, 'vinyl').state).toBe('on')
  })

  test('is off, on, or somewhere between', () => {
    const off = preferencesWith({ lines: ALL_LINES })
    expect(describeExtra(off, 'solo').state).toBe('off')
    const on = preferencesWith({ lines: ALL_LINES, extras: ['solo'] })
    expect(describeExtra(on, 'solo').state).toBe('on')
    expect(describeExtra(on, 'solo').size).toBe(2)
    const some = preferencesWith({
      lines: ALL_LINES,
      extras: ['solo'],
      overrides: { [GW_SOLO]: false },
    })
    expect(describeExtra(some, 'solo').state).toBe('some')
    expect(wants(some, SCARFACE_SOLO)).toBe(true)
  })

  test('lets any item be picked without its game', () => {
    const preferences = preferencesWith({ lines: ['gangwars'], overrides: { [RED_DRAGONS]: true } })
    expect(wants(preferences, RED_DRAGONS)).toBe(true)
    expect(describeExtra(preferences, 'expansions').state).toBe('some')
  })

  test('lists every item of its category, for both games, with a name and a price', () => {
    for (const tag of ALL_EXTRAS) {
      const { items } = describeExtra(preferencesWith({ lines: [] }), tag)
      expect(items.length, tag).toBeGreaterThan(0)
      for (const entry of items) {
        expect(entry.name.trim(), tag).not.toBe('')
        expect(entry.price, entry.name).toBeGreaterThan(0)
      }
    }
  })
})

// "Gangland Empire … is also compatible with Scarface 1920", and the Big Truck and the Safe
// Boxes "also enhance your original Scarface 1920 experience" (campaign Update #31).
describe('an add-on that is played in both games', () => {
  test('goes with either', () => {
    const scarface = preferencesWith({ lines: ['scarface'], extras: ['expansions', 'deluxe'] })
    expect(wants(scarface, GANGLAND_EMPIRE)).toBe(true)
    expect(wants(scarface, BIG_TRUCK)).toBe(true)
    // City of Violence is for Gang Wars alone.
    expect(wants(scarface, CITY_OF_VIOLENCE)).toBe(false)
    expect(item(scarface, 'expansions', CITY_OF_VIOLENCE)?.passedOver).toBe(
      'For Gang Wars, which is not included',
    )
  })
})

describe('an accessory to Bloody Business', () => {
  const accessories: readonly (readonly [ExtraTag, number])[] = [
    ['minis', MELVIN_PURVIS],
    ['deluxe', BB_DELUXIFICATION],
    ['playmat', ANNEX_PLAYMAT],
  ]

  test('waits for it', () => {
    const without = preferencesWith({ lines: ['scarface'], extras: ['minis', 'deluxe', 'playmat'] })
    for (const [tag, id] of accessories) {
      expect(wants(without, id), String(id)).toBe(false)
      expect(item(without, tag, id)?.passedOver).toBe(
        'For Bloody Business (Reprint), which is not included',
      )
    }
  })

  test('comes once it is asked for, by its switch or by a pick', () => {
    const bySwitch = preferencesWith({
      lines: ['scarface'],
      extras: ['minis', 'deluxe', 'playmat', 'expansions'],
    })
    const byPick = preferencesWith({
      lines: ['scarface'],
      extras: ['minis', 'deluxe', 'playmat'],
      overrides: { [BLOODY_BUSINESS]: true },
    })
    for (const [, id] of accessories) {
      expect(wants(bySwitch, id), String(id)).toBe(true)
      expect(wants(byPick, id), String(id)).toBe(true)
    }
  })

  test('can be ticked without it all the same', () => {
    const preferences = preferencesWith({
      lines: ['scarface'],
      overrides: { [MELVIN_PURVIS]: true },
    })
    expect(wants(preferences, MELVIN_PURVIS)).toBe(true)
  })
})

// Four playmats for one game, and nobody wants all four.
describe('the Scarface 1920 playmats', () => {
  test('are the original by the switch, and the annex beside it with Bloody Business', () => {
    const alone = preferencesWith({ lines: ['scarface'], extras: ['playmat'] })
    expect(wants(alone, ORIGINAL_PLAYMAT)).toBe(true)
    expect(wants(alone, ANNEX_PLAYMAT)).toBe(false)
    expect(describeExtra(alone, 'playmat').state).toBe('on')

    const withExpansion = preferencesWith({
      lines: ['scarface'],
      extras: ['playmat', 'expansions'],
    })
    expect(wants(withExpansion, ORIGINAL_PLAYMAT)).toBe(true)
    expect(wants(withExpansion, ANNEX_PLAYMAT)).toBe(true)
  })

  test('leave the two all-in-one mats to be picked in their place', () => {
    const preferences = preferencesWith({ lines: ['scarface'], extras: ['playmat', 'expansions'] })
    for (const id of [XL_PLAYMAT, SMALLER_PLAYMAT]) {
      expect(wants(preferences, id)).toBe(false)
      expect(item(preferences, 'playmat', id)?.passedOver).toContain('in place of the Original')
    }
    const picked = preferencesWith({
      lines: ['scarface'],
      overrides: { [XL_PLAYMAT]: true },
    })
    expect(wants(picked, XL_PLAYMAT)).toBe(true)
    expect(wants(picked, ORIGINAL_PLAYMAT)).toBe(false)
  })
})
