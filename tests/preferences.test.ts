import { describe, expect, test } from 'bun:test'

import {
  DEFAULT_PREFERENCES,
  decodePreferences,
  encodePreferences,
} from '../app/domain/preferences'
import { wantedRequirements } from '../app/domain/selection'

import { ALL_EXTRAS, ALL_LINES, preferencesWith, seededRandom } from './support'

const GANG_WARS = 126719
const SAFES_OF_FOUR = 128816
const SCARFACE = 126728
const ENFORCERS = 128687

describe('the defaults', () => {
  test('are Gang Wars alone, with tax, in euros', () => {
    expect(DEFAULT_PREFERENCES.lines).toEqual({ gangwars: true, scarface: false })
    expect(Object.values(DEFAULT_PREFERENCES.extras).some(Boolean)).toBe(false)
    expect(DEFAULT_PREFERENCES.includeTax).toBe(true)
    expect(DEFAULT_PREFERENCES.currency).toBe('EUR')
    expect(DEFAULT_PREFERENCES.overrides).toEqual({})
  })

  test('claim none of the gifts', () => {
    expect(DEFAULT_PREFERENCES.followedBeforeLaunch).toBe(false)
    expect(DEFAULT_PREFERENCES.earlyBacker).toBe(false)
    expect(DEFAULT_PREFERENCES.returningBacker).toBe(false)
  })
})

describe('what is wanted', () => {
  test('is each included game, and what comes in its box', () => {
    expect([...wantedRequirements(DEFAULT_PREFERENCES)].sort((a, b) => a - b)).toEqual([
      GANG_WARS,
      SAFES_OF_FOUR,
    ])
    expect(
      [...wantedRequirements(preferencesWith({ lines: ['scarface'] }))].sort((a, b) => a - b),
    ).toEqual([SCARFACE, ENFORCERS])
    expect(wantedRequirements(preferencesWith({ lines: [] })).size).toBe(0)
  })
})

describe('the preferences as a string', () => {
  test('are short for the defaults', () => {
    expect(encodePreferences(DEFAULT_PREFERENCES)).toBe('3-GB-EUR-')
  })

  test('survive the round trip', () => {
    const random = seededRandom(7)
    for (let run = 0; run < 200; run += 1) {
      const preferences = preferencesWith({
        lines: ALL_LINES.filter(() => random() < 0.5),
        extras: ALL_EXTRAS.filter(() => random() < 0.5),
        followedBeforeLaunch: random() < 0.5,
        earlyBacker: random() < 0.5,
        returningBacker: random() < 0.5,
        includeTax: random() < 0.5,
        destination: random() < 0.5 ? 'DE' : 'US',
        currency: random() < 0.5 ? 'GBP' : 'USD',
        taxRate: random() < 0.5 ? null : 25.5,
      })
      expect(decodePreferences(encodePreferences(preferences))).toEqual(preferences)
    }
  })

  test('carry single items picked out against their switches', () => {
    const preferences = preferencesWith({ overrides: { 126720: true, 126727: false } })
    const code = encodePreferences(preferences)
    expect(code.split('-')).toHaveLength(6)
    expect(decodePreferences(code)).toEqual(preferences)
  })

  // The Poker Deck's switch came after the gifts', and its bit after theirs.
  test('read as they did before the Poker Deck had a switch', () => {
    const everything = preferencesWith({
      lines: ALL_LINES,
      extras: ALL_EXTRAS.filter((tag) => tag !== 'poker'),
      followedBeforeLaunch: true,
      earlyBacker: true,
      returningBacker: true,
    })
    // Sixteen bits, all on: tax, both games, the ten extras there were, the three gifts.
    expect(encodePreferences(everything)).toBe('1ekf-GB-EUR-')
    expect(decodePreferences('1ekf-GB-EUR-')).toEqual(everything)
    expect(
      encodePreferences(preferencesWith({ lines: [], extras: ['poker'], includeTax: false })),
    ).toBe('1ekg-GB-EUR-')
  })

  test('drop a pick for something that is not an extra, and keep the rest', () => {
    const code = `3-GB-EUR--${GANG_WARS.toString(36)}.${(126720).toString(36)}-`
    expect(decodePreferences(code)?.overrides).toEqual({ 126720: true })
  })

  test('are refused when they are not ours', () => {
    for (const code of [
      '',
      'nonsense',
      'zz-GB',
      '1-ZZ-EUR-',
      '1-GB-XXX-',
      '1-GB-EUR-900',
      '1-GB-EUR--',
      // More switches than there are.
      'zzzzzz-GB-EUR-',
    ]) {
      expect(decodePreferences(code), code).toBeNull()
    }
  })
})
