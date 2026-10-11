import type { ExtraTag, GameLine, Tag } from './types'

/**
 * How the catalogue maps onto the switches.
 *
 * Gamefound says what each product costs, and what the Gang Wars pledges contain, but not what
 * any of it *is*: that a playmat is a playmat, or that The Enforcers sold on its own is the
 * same expansion that comes in the box with Scarface 1920. Nor does it say what the Scarface
 * 1920 bundles hold: it lists them as single products. This file says all of that, by hand. A
 * test (tests/catalog.test.ts) fails when the catalogue gains a product this file has not
 * heard of, which is the cue to classify it here.
 */

/** Which of the games are included. */
export type LineSelection = Readonly<Record<GameLine, boolean>>

/** Something a visitor can want: one single item, identified by its Gamefound product id. */
export interface Requirement {
  readonly id: number
  readonly line: GameLine
  readonly tag: Tag
  /**
   * A second game the item is played in, by the campaign's own account of it. With either
   * game included it goes with the order. Without this, an item goes with exactly its own game.
   */
  readonly alsoWith?: GameLine
  /** For the rare item whose usefulness depends on more than which game it is played in. */
  readonly when?: (lines: LineSelection) => boolean
  /** Said beside such an item when its switch passes it over, in place of naming its game. */
  readonly whenNote?: string
  /**
   * For an item that is sold on its own and also comes with its game, whichever way the game
   * is bought. With the game included it simply comes, and is shown under its switch as
   * already there. Without the game it is an extra like any other: reached by its switch, or
   * picked out.
   */
  readonly withGame?: true
  /** Another item this one is an accessory to, and pointless — so unwanted — without. */
  readonly needs?: number
}

const core = (line: GameLine, ...ids: readonly number[]): readonly Requirement[] =>
  ids.map((id) => ({ id, line, tag: 'core' }))

const extra = (line: GameLine, tag: ExtraTag, ...ids: readonly number[]): readonly Requirement[] =>
  ids.map((id) => ({ id, line, tag }))

/** An extra sold with one game that the campaign says is played in the other as well. */
const shared = (
  line: GameLine,
  alsoWith: GameLine,
  tag: ExtraTag,
  ...ids: readonly number[]
): readonly Requirement[] => ids.map((id) => ({ id, line, tag, alsoWith }))

/** An accessory to another item: wanted only where that one is. */
const accessory = (
  line: GameLine,
  tag: ExtraTag,
  needs: number,
  ...ids: readonly number[]
): readonly Requirement[] => ids.map((id) => ({ id, line, tag, needs }))

export const GANG_WARS = 126719
export const SCARFACE_1920 = 126728
export const BLOODY_BUSINESS = 126731

/** The four Safe Boxes of the Gang Wars gangs, and the two of Scarface 1920's later gangs. */
export const SAFES_OF_FOUR = 128816
export const SAFES_OF_TWO = 128721

const never = (): boolean => false

export const REQUIREMENTS: readonly Requirement[] = [
  // --- Gang Wars --------------------------------------------------------------------------
  ...core('gangwars', GANG_WARS),
  ...extra('gangwars', 'expansions', 126720), // City of Violence
  // Gangland Empire "is also compatible with Scarface 1920" (campaign Update #31).
  ...shared('gangwars', 'scarface', 'expansions', 126721),
  ...extra('gangwars', 'minis', 106734, 126722), // Newsboy, Boss Ring
  ...extra('gangwars', 'deluxe', 126724), // Deluxification Set
  // The Big Truck, with the Safe Boxes, will "also enhance your original Scarface 1920
  // experience" (Update #31).
  ...shared('gangwars', 'scarface', 'deluxe', 126723),
  ...extra('gangwars', 'playmat', 126726),
  ...extra('gangwars', 'sleeves', 126727),
  ...extra('gangwars', 'artbook', 126725),
  ...extra('gangwars', 'solo', 128817),

  // The Safe Boxes. The four for the Gang Wars gangs are in the Gang Wars core game, free
  // (Update #15), and are sold as a pack for Scarface 1920, where they do the same job. The
  // other two are for the Red Dragons and the Golden Oaks, gangs only Scarface 1920 has
  // (Update #27); they are a Gang Wars add-on all the same, and ship with it.
  { id: SAFES_OF_FOUR, line: 'gangwars', tag: 'safes', alsoWith: 'scarface', withGame: true },
  {
    id: SAFES_OF_TWO,
    line: 'gangwars',
    tag: 'safes',
    when: (lines) => lines.scarface,
    whenNote: 'For the Red Dragons and Golden Oaks gangs of Scarface 1920, which is not included',
  },

  // --- Scarface 1920 ----------------------------------------------------------------------
  ...core('scarface', SCARFACE_1920),
  // The Enforcers is in the box with the game, and sold by itself for whoever has the game
  // without it.
  { id: 128687, line: 'scarface', tag: 'expansions', withGame: true },
  ...extra('scarface', 'expansions', BLOODY_BUSINESS, 126729, 126730), // …, Red Dragons, Golden Oaks
  ...extra('scarface', 'minis', 126733, 126735), // Paperboy, Night Deck
  // Melvin Purvis replaces "the G-Men token from the Bloody Business expansion".
  ...accessory('scarface', 'minis', BLOODY_BUSINESS, 126734),
  // Pre-painted Goods, Plastic Business Markers, Plastic Money Tokens
  ...extra('scarface', 'deluxe', 128692, 128693, 128698),
  ...accessory('scarface', 'deluxe', BLOODY_BUSINESS, 128691), // Bloody Business Deluxification Set
  // Four playmats, and nobody wants all four. The switch takes the original, and the annex
  // that goes beside it where there is a Bloody Business board to put on one. The other two
  // each do both jobs in one mat, and are there to be picked in their place.
  ...extra('scarface', 'playmat', 128712), // Original
  ...accessory('scarface', 'playmat', BLOODY_BUSINESS, 128711), // Bloody Business Annex
  {
    id: 128714, // XL
    line: 'scarface',
    tag: 'playmat',
    when: never,
    whenNote: 'One mat for both boards, in place of the Original and the Annex',
  },
  {
    id: 128715, // Smaller
    line: 'scarface',
    tag: 'playmat',
    when: never,
    whenNote: 'One smaller mat for both boards, in place of the Original and the Annex',
  },
  // The second pack is for "ALL the cards in Bloody Business, new gangs and the Night Deck":
  // too many things to wait on any one of them.
  ...extra('scarface', 'sleeves', 128704, 128705),
  ...extra('scarface', 'artbook', 128690),
  ...extra('scarface', 'storage', 126736, 128689), // Expansions Box, Wooden Boxes
  ...extra('scarface', 'solo', 128688),
  ...extra('scarface', 'vinyl', 126732),
]

/**
 * Items that stand in for others. An item not listed here satisfies only the requirement
 * with its own id.
 */
export const PROVIDES: Readonly<Record<number, readonly number[]>> = {
  // The Gang Wars core game has the four Safe Boxes in it.
  [GANG_WARS]: [GANG_WARS, SAFES_OF_FOUR],
  // "Scarface 1920 + The Enforcers" is one product on Gamefound, and both things.
  [SCARFACE_1920]: [SCARFACE_1920, 128687],
}

/**
 * What the bundles hold that Gamefound lists as single products, with nothing to say what is
 * in them. Typed out from the campaign's own words and graphics: the three Scarface 1920
 * bundles from the "Scarface 1920 Reprint Bundles" section of the project page, and the pack
 * of six Safe Boxes from Update #27, which is the pack of four and the pack of two together.
 *
 * The Legacy All-in's list has one "Card Sleeves Pack" and there are two on sale. It is taken
 * to be the first, for the core game; the Bloody Business one is not counted as in it.
 */
export const BUNDLE_CONTENTS: Readonly<Record<number, readonly number[]>> = {
  // Scarface 1920 Gameplay Bundle: the game with The Enforcers, Bloody Business, both gangs.
  126745: [SCARFACE_1920, BLOODY_BUSINESS, 126729, 126730],
  // Scarface 1920 Expansions Bundle: Bloody Business and both gangs.
  126746: [BLOODY_BUSINESS, 126729, 126730],
  // Scarface 1920 Legacy All-in: "the complete Scarface 1920 collection".
  126747: [
    SCARFACE_1920,
    BLOODY_BUSINESS,
    126730, // Golden Oaks
    126729, // Red Dragons
    126733, // Paperboy
    126734, // Melvin Purvis
    126735, // Night Deck
    128693, // Plastic Business Markers
    128698, // Plastic Money Tokens
    128692, // Pre-painted Goods
    128704, // Card Sleeves Pack
    128690, // Art Book
    128689, // Wooden Boxes
    126732, // Gangland Grooves Vinyl Disc
    128691, // Deluxification Set
    126736, // Expansions Box Storage Solution
  ],
  // Safe Boxes (6-pack)
  128719: [SAFES_OF_FOUR, SAFES_OF_TWO],
}

const requirementsById: ReadonlyMap<number, Requirement> = new Map(
  REQUIREMENTS.map((requirement) => [requirement.id, requirement]),
)

export const findRequirement = (id: number): Requirement | undefined => requirementsById.get(id)

/**
 * Whether an item goes with the games that are included. For a game itself that decides
 * whether it is wanted at all; for an extra it is only what its switch reaches for by
 * default, since any extra can be bought without its game.
 */
export const goesWith = (requirement: Requirement, lines: LineSelection): boolean =>
  requirement.when?.(lines) ??
  (lines[requirement.line] || (requirement.alsoWith !== undefined && lines[requirement.alsoWith]))

/** The requirements one single item satisfies. */
export const providedBy = (leafId: number): readonly number[] => PROVIDES[leafId] ?? [leafId]

/** The game a single item belongs to, whether it is a requirement itself or stands in for some. */
export const lineOf = (leafId: number): GameLine | undefined =>
  providedBy(leafId)
    .map((id) => requirementsById.get(id)?.line)
    .find((line) => line !== undefined)
