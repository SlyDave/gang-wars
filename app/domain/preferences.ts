import { findRequirement } from './classification'
import { isCurrencyCode } from './currencies'
import { DEFAULT_DESTINATION, findDestination } from './destinations'
import { GIFTS } from './gift'

import type { ExtraTag, GameLine, Preferences } from './types'

/** The games, in the order they are offered. Gang Wars is the campaign; Scarface 1920 a reprint. */
export const LINES: readonly {
  readonly line: GameLine
  readonly label: string
  readonly description: string
  readonly icon: string
  /** Said of an item that comes with the game, however the game is bought. */
  readonly brings: string
}[] = [
  {
    line: 'gangwars',
    label: 'Gang Wars',
    description: 'The new game this crowdfunding is for, with its Solo Mode.',
    icon: 'i-fa-gangwars',
    brings: 'Comes in the Gang Wars core game, free',
  },
  {
    line: 'scarface',
    label: 'Scarface 1920',
    description: 'The reprint of the first game, with The Enforcers expansion.',
    icon: 'i-fa-scarface',
    brings: 'Comes in the box with Scarface 1920',
  },
]

/** The extras, one switch each. Each applies to every game that is included. */
export const EXTRAS: readonly {
  readonly tag: ExtraTag
  readonly label: string
  readonly icon: string
}[] = [
  { tag: 'expansions', label: 'Expansions', icon: 'i-fa-expansions' },
  { tag: 'minis', label: 'Mini-Expansions', icon: 'i-fa-minis' },
  { tag: 'deluxe', label: 'Deluxe Components', icon: 'i-fa-deluxe' },
  { tag: 'safes', label: 'Safe Boxes', icon: 'i-fa-safes' },
  { tag: 'playmat', label: 'Playmat(s)', icon: 'i-fa-playmat' },
  { tag: 'sleeves', label: 'Sleeves', icon: 'i-fa-sleeves' },
  { tag: 'artbook', label: 'Art Book(s)', icon: 'i-fa-artbook' },
  { tag: 'storage', label: 'Storage', icon: 'i-fa-storage' },
  { tag: 'solo', label: 'Extra Solo Sets', icon: 'i-fa-solo' },
  { tag: 'vinyl', label: 'Vinyl Soundtrack', icon: 'i-fa-vinyl' },
]

export const DEFAULT_PREFERENCES: Preferences = {
  followedBeforeLaunch: false,
  earlyBacker: false,
  returningBacker: false,
  lines: { gangwars: true, scarface: false },
  extras: {
    expansions: false,
    minis: false,
    deluxe: false,
    safes: false,
    playmat: false,
    sleeves: false,
    artbook: false,
    storage: false,
    solo: false,
    vinyl: false,
  },
  overrides: {},
  includeTax: true,
  destination: DEFAULT_DESTINATION,
  taxRate: null,
  currency: 'EUR',
}

/*
 * The preferences as a short string, for the address bar and for remembering between visits:
 * the on/off choices packed into one number, then the destination, the currency and any
 * corrected tax rate — "9x-GB-GBP-20". Where single items have been picked out against their
 * category, two more parts list them, taken then left — "…-2oo8.2onz-2oo4".
 */

const SEPARATOR = '-'
const LIST_SEPARATOR = '.'
const RADIX = 36
const MAX_TAX_RATE = 100

/** The on/off choices, in the order their bits are packed. Append, never reorder. */
const flags = (preferences: Preferences): readonly boolean[] => [
  preferences.includeTax,
  ...LINES.map(({ line }) => preferences.lines[line]),
  ...EXTRAS.map(({ tag }) => preferences.extras[tag]),
  ...GIFTS.map(({ claim }) => preferences[claim]),
]

export const encodePreferences = (preferences: Preferences): string => {
  let packed = 0
  for (const flag of [...flags(preferences)].reverse()) {
    packed = packed * 2 + (flag ? 1 : 0)
  }
  const parts = [
    packed.toString(RADIX),
    preferences.destination,
    preferences.currency,
    preferences.taxRate === null ? '' : String(preferences.taxRate),
  ]

  const picks = Object.entries(preferences.overrides)
  if (picks.length > 0) {
    const list = (wanted: boolean): string =>
      picks
        .filter(([, value]) => value === wanted)
        .map(([id]) => Number(id))
        .sort((a, b) => a - b)
        .map((id) => id.toString(RADIX))
        .join(LIST_SEPARATOR)
    parts.push(list(true), list(false))
  }
  return parts.join(SEPARATOR)
}

/**
 * Reads one of the lists of picked-out items; null if it is not a list of numbers. Ids the
 * catalogue no longer has, or that are not extras, are dropped rather than refused: a link
 * should outlive a product being withdrawn.
 */
const decodeList = (text: string | undefined): readonly number[] | null => {
  if (text === undefined || text === '') {
    return []
  }
  const parts = text.split(LIST_SEPARATOR)
  if (!parts.every((part) => /^[0-9a-z]+$/.test(part))) {
    return null
  }
  return parts
    .map((part) => Number.parseInt(part, RADIX))
    .filter((id) => {
      const requirement = findRequirement(id)
      return requirement !== undefined && requirement.tag !== 'core'
    })
}

/** Reads a string written by encodePreferences; null for anything else. */
export const decodePreferences = (code: string): Preferences | null => {
  const [packedText, destination, currency, taxText, takenText, leftText, ...surplus] =
    code.split(SEPARATOR)
  if (
    packedText === undefined ||
    destination === undefined ||
    currency === undefined ||
    taxText === undefined ||
    // The two lists of picked-out items come together or not at all.
    (takenText === undefined) !== (leftText === undefined) ||
    surplus.length > 0
  ) {
    return null
  }

  let bits = Number.parseInt(packedText, RADIX)
  if (!/^[0-9a-z]+$/.test(packedText) || !Number.isSafeInteger(bits)) {
    return null
  }
  const next = (): boolean => {
    const flag = bits % 2 === 1
    bits = Math.floor(bits / 2)
    return flag
  }

  const includeTax = next()
  const lines = { ...DEFAULT_PREFERENCES.lines }
  for (const { line } of LINES) {
    lines[line] = next()
  }
  const extras = { ...DEFAULT_PREFERENCES.extras }
  for (const { tag } of EXTRAS) {
    extras[tag] = next()
  }
  const claims = {
    followedBeforeLaunch: false,
    earlyBacker: false,
    returningBacker: false,
  }
  for (const { claim } of GIFTS) {
    claims[claim] = next()
  }

  const taken = decodeList(takenText)
  const left = decodeList(leftText)
  const taxRate = taxText === '' ? null : Number(taxText)
  if (
    taken === null ||
    left === null ||
    bits !== 0 ||
    findDestination(destination) === undefined ||
    !isCurrencyCode(currency) ||
    (taxRate !== null && !(taxRate >= 0 && taxRate <= MAX_TAX_RATE))
  ) {
    return null
  }

  const overrides: Record<number, boolean> = {}
  for (const id of left) {
    overrides[id] = false
  }
  for (const id of taken) {
    overrides[id] = true
  }

  return {
    ...claims,
    lines,
    extras,
    overrides,
    includeTax,
    destination,
    taxRate,
    currency,
  }
}
