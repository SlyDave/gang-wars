import { buyableProducts, getProduct, leavesOf } from './catalog'
import { findRequirement, lineOf, providedBy } from './classification'
import { destinationFor } from './destinations'
import { giftFor, priceFor } from './gift'
import { EXTRAS, LINES } from './preferences'
import { wantedRequirements } from './selection'
import { WAVE_OF, describeWaves, hasShippingTier, shippingOf } from './shipping'
import { solve } from './solver'
import { unlocksFor } from './unlocks'

import type { Product } from './catalog'
import type { Destination } from './destinations'
import type { Gift } from './gift'
import type { Offer } from './solver'
import type { Cents, GameLine, Preferences, Tag } from './types'
import type { Unlock } from './unlocks'

/** One item inside something in the cart. */
export interface ContentLine {
  readonly product: Product
  /** Whether it is something the visitor asked for, rather than something that came along. */
  readonly wanted: boolean
}

/** One thing to add to the Gamefound cart. */
export interface CartLine {
  readonly product: Product
  /** What this visitor pays for it, which for a gift is nothing. */
  readonly price: Cents
  /** The gift it is to this visitor, if it is one. */
  readonly gift: Gift | null
  /** The game it is listed under. */
  readonly group: GameLine
  /** Which of the campaign's two shipments it goes out in. */
  readonly wave: 1 | 2
  readonly contents: readonly ContentLine[]
  /** The campaign's shipping estimate, or null for an add-on, which has none. */
  readonly shipping: Cents | null
}

/** The best combination for a set of preferences, and what it comes to. All sums in euro cents. */
export interface Quote {
  readonly lines: readonly CartLine[]
  /** What the cart's contents list for, before bundle discounts and any gift. */
  readonly listTotal: Cents
  /** What they cost. */
  readonly itemsTotal: Cents
  readonly savings: Cents
  /** The shipping the campaign has published an estimate for: the pledges' and bundles'. */
  readonly shippingTotal: Cents
  /** The cart lines whose shipping will only be priced in the pledge manager. */
  readonly unpricedShipping: readonly Product[]
  /** How many shipments the order goes out in: one for each wave it has something in. */
  readonly shipments: number
  readonly waves: string
  readonly destination: Destination
  /** The rate applied, in percent: zero when tax is switched off. */
  readonly taxRate: number
  readonly taxTotal: Cents
  readonly total: Cents
  /** Items in the cart that nobody asked for, because a bundle was the cheaper way. */
  readonly bonus: readonly Product[]
  /** What the campaign adds free to this order: stretch goals and the like (unlocks.ts). */
  readonly unlocks: readonly Unlock[]
  /** How many separate items were asked for. */
  readonly wantedCount: number
  /** Wanted items nothing on sale provides. Empty unless the catalogue and the switches disagree. */
  readonly unavailable: readonly number[]
}

const PERCENT = 100

const unique = <T>(values: readonly T[]): readonly T[] => [...new Set(values)]

/**
 * Everything that can go in a cart, as the solver sees it.
 *
 * The last tie-break is whether the campaign's shipping tables price the thing. It is what
 * makes the Basic Pledge the answer for the game alone, and not the same game at the same
 * price listed among the add-ons: the pledges are what the campaign's gifts and stretch goals
 * are promised to.
 */
export const offersFor = (preferences: Preferences): readonly Offer[] =>
  buyableProducts.map((product) => ({
    id: product.id,
    cost: {
      price: priceFor(product, preferences),
      items: 1,
      unpriced: hasShippingTier(product.id) ? 0 : 1,
    },
    provides: unique(leavesOf(product).flatMap((leaf) => providedBy(leaf.id))),
  }))

const contentsOf = (product: Product, wanted: ReadonlySet<number>): readonly ContentLine[] =>
  leavesOf(product).map((leaf) => ({
    product: leaf,
    wanted: providedBy(leaf.id).some((id) => wanted.has(id)),
  }))

const sum = (values: readonly Cents[]): Cents => values.reduce((total, value) => total + value, 0)

/** The games in the order the cart lists them. */
const CART_GROUPS: readonly GameLine[] = LINES.map(({ line }) => line)

/** Within a game: the game first, then the extras in the order of their switches. */
const CATEGORY_ORDER: readonly Tag[] = ['core', ...EXTRAS.map(({ tag }) => tag)]

/** The category of a single item, whether it is a requirement itself or stands in for some. */
const tagOf = (leaf: Product): Tag | undefined =>
  providedBy(leaf.id)
    .map((id) => findRequirement(id)?.tag)
    .find((tag) => tag !== undefined)

/**
 * The game a product is listed under: the one its first item belongs to. Every bundle on sale
 * is of one game, and Gamefound lists each product under one, so there is no choosing.
 */
const groupOf = (product: Product): GameLine => {
  const games = leavesOf(product).map((leaf) => lineOf(leaf.id))
  return CART_GROUPS.find((group) => games.includes(group)) ?? 'gangwars'
}

/** A product's category: a game if it holds one, else that of its contents. */
const categoryOf = (product: Product): number => {
  const tags = leavesOf(product).map(tagOf)
  const tag = tags.includes('core') ? 'core' : tags.find((candidate) => candidate !== undefined)
  return tag === undefined ? CATEGORY_ORDER.length : CATEGORY_ORDER.indexOf(tag)
}

/** By game, then by category, then by name. */
const byCartOrder = (a: Product, b: Product): number => {
  const steps = [
    CART_GROUPS.indexOf(groupOf(a)) - CART_GROUPS.indexOf(groupOf(b)),
    categoryOf(a) - categoryOf(b),
    a.name.localeCompare(b.name, 'en', { numeric: true }),
  ]
  return steps.find((step) => step !== 0) ?? 0
}

/** The best combination for a set of preferences, and what it comes to. */
export const buildQuote = (preferences: Preferences): Quote => {
  const destination = destinationFor(preferences.destination)
  const wanted = wantedRequirements(preferences)
  const offers = offersFor(preferences)

  // Anything nothing provides is set aside, so the rest can still be priced.
  const obtainable = new Set(offers.flatMap((offer) => offer.provides))
  const unavailable = [...wanted].filter((id) => !obtainable.has(id))
  const solution = solve(new Set([...wanted].filter((id) => obtainable.has(id))), offers)

  const lines: readonly CartLine[] = (solution?.offerIds ?? [])
    .map((id) => getProduct(id))
    .sort(byCartOrder)
    .map((product) => {
      const group = groupOf(product)
      return {
        product,
        price: priceFor(product, preferences),
        gift: giftFor(product.id, preferences) ?? null,
        group,
        wave: WAVE_OF[group],
        contents: contentsOf(product, wanted),
        shipping: shippingOf(product, destination.region),
      }
    })

  const listTotal = sum(lines.map((line) => line.product.price))
  const itemsTotal = sum(lines.map((line) => line.price))
  const shippingTotal = sum(lines.map((line) => line.shipping ?? 0))

  const taxRate = preferences.includeTax ? (preferences.taxRate ?? destination.taxRate) : 0
  const taxTotal = Math.round(((itemsTotal + shippingTotal) * taxRate) / PERCENT)

  const contents = lines.flatMap((line) => line.contents)
  const games = new Set(lines.map((line) => line.group))

  return {
    lines,
    listTotal,
    itemsTotal,
    savings: listTotal - itemsTotal,
    shippingTotal,
    // A gift is one of these too: it is free, but it still has to be sent.
    unpricedShipping: lines.filter((line) => line.shipping === null).map((line) => line.product),
    shipments: games.size,
    waves: describeWaves({ gangwars: games.has('gangwars'), scarface: games.has('scarface') }),
    destination,
    taxRate,
    taxTotal,
    total: itemsTotal + shippingTotal + taxTotal,
    bonus: contents.filter((content) => !content.wanted).map((content) => content.product),
    unlocks: unlocksFor(new Set(contents.map((content) => content.product.id))),
    wantedCount: wanted.size,
    unavailable,
  }
}
