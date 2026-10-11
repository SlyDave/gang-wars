import type { Product } from './catalog'
import type { Cents, GiftClaim, Preferences } from './types'

/**
 * The campaign's three gifts: add-ons on sale to everyone, and free to those who did
 * something for it.
 *
 * - The Newsboy, to whoever followed the campaign before it launched. Its own listing says it
 *   "will be added at checkout for all backers who followed the campaign before launch".
 * - The Boss Ring, to "everyone who backs Gang Wars during the first 72 hours" (Update #10).
 *   Those ended on 25 September 2026 at 16:00 UTC (Update #14).
 * - The two Safe Boxes of the Red Dragons and the Golden Oaks, to returning backers: those
 *   who backed an earlier campaign of the Scarface 1920 saga. "If you back Gang Wars, you get
 *   the two new safes add-on for free", as "an Add-on featuring the two safes … at zero cost,
 *   which you can add to your pledge" (Update #27).
 *
 * All three are for backers of Gang Wars, so none is free on an order without the game.
 */
export interface Gift {
  readonly claim: GiftClaim
  /** The Gamefound product id of the add-on that is free. */
  readonly product: number
  /** What the visitor says of themselves to have it. */
  readonly label: string
  readonly hint: string
  /** What it is and why it is free, for the panel. */
  readonly story: string
  /** How it gets into the pledge, said on its line in the cart. */
  readonly how: string
  readonly icon: string
  /** The campaign update that announced it. */
  readonly update: number
}

export const GIFTS: readonly Gift[] = [
  {
    claim: 'followedBeforeLaunch',
    product: 106734,
    label: 'I followed the campaign before launch',
    hint: 'On Gamefound, before 22 September',
    story:
      'The Newsboy Mini-Expansion is free for everyone who followed the campaign before it launched.',
    how: 'Gamefound adds it at checkout for those who followed the campaign before launch.',
    icon: 'i-fa-newsboy',
    update: 10,
  },
  {
    claim: 'earlyBacker',
    product: 126722,
    label: 'I pledged in the first 72 hours',
    hint: 'Before 25 September, 16:00 UTC',
    story:
      'The Boss Ring Mini-Expansion is free for everyone who pledged for Gang Wars in its first 72 hours.',
    how: 'Free with a pledge made in the campaign’s first 72 hours.',
    icon: 'i-fa-ring',
    update: 10,
  },
  {
    claim: 'returningBacker',
    product: 128721,
    label: 'I’ve backed Scarface 1920 before',
    hint: 'Scarface 1920 or Bloody Business, in an earlier campaign',
    story:
      'The two Safe Boxes for the Red Dragons and Golden Oaks gangs are free for returning backers.',
    how: 'On Gamefound, add the one listed at 0,00 € for returning backers.',
    icon: 'i-fa-safes',
    update: 27,
  },
]

export const updateUrl = (update: number): string =>
  `https://gamefound.com/en/projects/redzen/gang-wars/updates/${String(update)}`

/** The gift a product is to this visitor, if it is one: claimed, on an order with Gang Wars. */
export const giftFor = (productId: number, preferences: Preferences): Gift | undefined =>
  preferences.lines.gangwars
    ? GIFTS.find((gift) => gift.product === productId && preferences[gift.claim])
    : undefined

/** Whether a product is a gift, for someone it is a gift to. */
export const isGift = (productId: number, preferences: Preferences): boolean =>
  giftFor(productId, preferences) !== undefined

/** What a product costs this visitor: its price, or nothing if it is their gift. */
export const priceFor = (product: Product, preferences: Preferences): Cents =>
  isGift(product.id, preferences) ? 0 : product.effectivePrice
