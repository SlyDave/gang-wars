import type { Cents } from './types'

/**
 * The Endgame, and the add-on it brings (campaign Update #34).
 *
 * Gamefound does not close a campaign on the stroke of its scheduled end. A ten-minute
 * countdown starts then, and is put back to ten minutes each time someone buys — once for
 * each backer — so the campaign runs on for as long as people keep joining. Redzen Games
 * publish one add-on at that moment for the purpose: a poker deck, cheap while the Endgame
 * lasts and dearer afterwards.
 *
 * Until it is published it is not a product: Gamefound does not list it, the catalogue does
 * not have it, and it cannot go in a cart. So it is told of here and not offered. When a
 * capture brings it in, it is to be classified like anything else and this retired; a test
 * (tests/endgame.test.ts) fails at that point, as the cue.
 */
export interface EndgameAddon {
  readonly name: string
  /** What it costs while the Endgame lasts. */
  readonly price: Cents
  /** Its "regular price", in the pledge manager, once the Endgame is over. */
  readonly priceAfter: Cents
  /** The campaign update that announced it, whose cover is the picture the site stores. */
  readonly update: number
}

export const ENDGAME_ADDON: EndgameAddon = {
  name: 'Gang Wars Poker Deck',
  price: 400,
  priceAfter: 1200,
  update: 34,
}

/** How long the countdown runs, and is put back to, in minutes. */
export const ENDGAME_COUNTDOWN_MINUTES = 10

export type EndgamePhase =
  /** The campaign has not reached its scheduled end. */
  | 'ahead'
  /** It has. How long the Endgame then ran, or whether it is over, cannot be known from here. */
  | 'begun'

/** Where things stand at a given moment, for a campaign whose scheduled end is given. */
export const endgamePhase = (scheduledEnd: string, now: Date): EndgamePhase =>
  now.getTime() < Date.parse(scheduledEnd) ? 'ahead' : 'begun'
