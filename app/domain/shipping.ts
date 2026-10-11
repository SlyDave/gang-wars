import { toCents } from './catalog'

import type { Product } from './catalog'
import type { Cents, GameLine, RegionId } from './types'

/**
 * The campaign's shipping estimates, read off the two tables in the "Shipping" graphic on the
 * project page (it is published as an image, so there is nothing to scrape it from).
 *
 * No shipping is paid with the pledge: all of it is charged afterwards, in the pledge manager,
 * "once we know the final contents, weight, volume and destination of each order". The tables
 * are the campaign's estimates, and they price eight things only: the four Gang Wars pledges,
 * and Scarface 1920 with its three bundles. A single add-on has no figure, and none is
 * invented for it here.
 */

type Row = Readonly<Record<RegionId, Cents>>

/** In the order the tables list their rows, in euros. */
const row = (
  ...[
    usa,
    canada,
    eu,
    restOfEurope,
    uk,
    australia,
    newZealand,
    china,
    mexico,
    southAmerica,
    farEast,
    hawaiiAlaska,
    restOfWorld,
  ]: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
): Row => ({
  usa: toCents(usa),
  canada: toCents(canada),
  eu: toCents(eu),
  restOfEurope: toCents(restOfEurope),
  uk: toCents(uk),
  australia: toCents(australia),
  newZealand: toCents(newZealand),
  china: toCents(china),
  mexico: toCents(mexico),
  southAmerica: toCents(southAmerica),
  farEast: toCents(farEast),
  hawaiiAlaska: toCents(hawaiiAlaska),
  restOfWorld: toCents(restOfWorld),
})

// "Gang Wars | Wave 2", a column to a pledge.
const BASIC = row(24, 26, 22, 31, 21, 27, 31, 21, 45, 54, 37, 28, 75)
const MOBSTER = row(27, 34, 23, 32, 22, 29, 37, 25, 48, 57, 45, 32, 84)
const BIG_BOSS = row(35, 45, 26, 35, 24, 33, 42, 28, 56, 65, 50, 82, 89)
const EMPIRE = row(38, 49, 28, 37, 27, 42, 55, 32, 59, 68, 54, 89, 92)

// "Scarface 1920 | Reprint Wave 1".
const SCARFACE = row(26, 32, 23, 32, 21, 27, 33, 23, 47, 56, 42, 39, 76)
const EXPANSIONS_BUNDLE = row(25, 28, 22, 31, 21, 25, 29, 21, 46, 55, 38, 36, 74)
const GAMEPLAY_BUNDLE = row(30, 41, 27, 36, 25, 33, 42, 30, 51, 60, 52, 73, 93)
const LEGACY_ALL_IN = row(33, 46, 28, 37, 27, 45, 61, 37, 54, 63, 64, 80, 112)

/** Gamefound product id -> the table column that prices it. */
const TIERS: Readonly<Record<number, Row>> = {
  120122: BASIC,
  126737: MOBSTER,
  126738: BIG_BOSS,
  126740: EMPIRE,

  126728: SCARFACE, // Scarface 1920 + The Enforcers
  126746: EXPANSIONS_BUNDLE,
  126745: GAMEPLAY_BUNDLE,
  126747: LEGACY_ALL_IN,
}

/** The estimate for a pledge or bundle, or null for anything the tables do not price. */
export const shippingOf = (product: Product, region: RegionId): Cents | null =>
  TIERS[product.id]?.[region] ?? null

/** Whether a product is one of the eight the shipping tables name. */
export const hasShippingTier = (productId: number): boolean => productId in TIERS

/**
 * The campaign's two shipments, by its "Timeline & Waves" graphic. The dates are when the
 * games are expected to leave China, which is all it commits to.
 */
export const WAVE_OF: Readonly<Record<GameLine, 1 | 2>> = { scarface: 1, gangwars: 2 }

export const WAVE_ONE = 'Q3 2027'
export const WAVE_TWO = 'Q2 2028'

/** When things ship, which depends only on which of the two games the order has anything of. */
export const describeWaves = (content: Readonly<Record<GameLine, boolean>>): string => {
  if (content.scarface && content.gangwars) {
    return `Two shipments, each with its own shipping charge: the Scarface 1920 reprint leaves the factory first (Wave 1, from ${WAVE_ONE}) and Gang Wars follows (Wave 2, from ${WAVE_TWO}).`
  }
  if (content.scarface) {
    return `Everything ships together in Wave 1, the Scarface 1920 reprint, which leaves the factory from ${WAVE_ONE}.`
  }
  return `Everything ships together in Wave 2, with Gang Wars, which leaves the factory from ${WAVE_TWO}.`
}
