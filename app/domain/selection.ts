import { getProduct } from './catalog'
import { REQUIREMENTS, findRequirement, goesWith } from './classification'
import { isGift, priceFor } from './gift'
import { LINES } from './preferences'

import type { Requirement } from './classification'
import type { Cents, ExtraTag, GameLine, Preferences } from './types'

/**
 * What the preferences come to, item by item.
 *
 * A game's switch asks for the game. An extra's switch asks for everything in its category
 * that goes with the games included — or for all of the category, where nothing in it does: a
 * record needs no game. Beneath the switch, any single item can be picked out, whatever game
 * it belongs to: taken though the switch would not, or left though it would. Those picks win
 * (`Preferences.overrides`).
 *
 * A few items are both: in the box with their game, and sold by themselves. With the game
 * they come regardless, and are shown under their switch as there already; without it they
 * are extras like the rest.
 */

/** Whether an item is in the order already, as part of an included game. */
export const comesWithGame = (requirement: Requirement, preferences: Preferences): boolean =>
  requirement.withGame === true && preferences.lines[requirement.line]

/**
 * Whether a category's switch reaches an item. It reaches what goes with the included games,
 * and failing any such item in the category, everything in it.
 */
const isInScope = (requirement: Requirement, preferences: Preferences): boolean =>
  goesWith(requirement, preferences.lines) ||
  !REQUIREMENTS.some((other) => other.tag === requirement.tag && goesWith(other, preferences.lines))

/**
 * Whether the thing an accessory waits on is asked for. Nothing that is waited on waits on
 * anything itself, so this stops here and does not go round.
 */
const isAskedFor = (requirement: Requirement, preferences: Preferences): boolean => {
  if (requirement.tag === 'core') {
    return goesWith(requirement, preferences.lines)
  }
  return (
    comesWithGame(requirement, preferences) ||
    (preferences.overrides[requirement.id] ??
      (preferences.extras[requirement.tag] && isInScope(requirement, preferences)))
  )
}

/** Whether an item is an accessory to something that is not in the order. */
const isWaiting = (requirement: Requirement, preferences: Preferences): boolean => {
  const needed = requirement.needs === undefined ? undefined : findRequirement(requirement.needs)
  return needed !== undefined && !isAskedFor(needed, preferences)
}

/** Whether an extra follows from its category's switch alone, before any picking out. */
export const isOnByDefault = (requirement: Requirement, preferences: Preferences): boolean => {
  if (requirement.tag === 'core' || comesWithGame(requirement, preferences)) {
    return true
  }
  // A gift is taken without being asked for: it costs nothing, and is the backer's to have.
  if (isGift(requirement.id, preferences)) {
    return true
  }
  return (
    preferences.extras[requirement.tag] &&
    isInScope(requirement, preferences) &&
    !isWaiting(requirement, preferences)
  )
}

const isWanted = (requirement: Requirement, preferences: Preferences): boolean => {
  if (requirement.tag === 'core') {
    // A game comes with its switch, and not otherwise.
    return goesWith(requirement, preferences.lines)
  }
  // What a game holds cannot be left out of it, whatever was picked while the game was off.
  if (comesWithGame(requirement, preferences)) {
    return true
  }
  return preferences.overrides[requirement.id] ?? isOnByDefault(requirement, preferences)
}

/** The ids of everything the preferences ask for. */
export const wantedRequirements = (preferences: Preferences): ReadonlySet<number> =>
  new Set(
    REQUIREMENTS.filter((requirement) => isWanted(requirement, preferences)).map(
      (requirement) => requirement.id,
    ),
  )

/** All of a category, none of it, or some. */
export type CategoryState = 'on' | 'off' | 'some'

/** One item under a category's switch. */
export interface ExtraItem {
  readonly id: number
  readonly name: string
  /** What it costs this visitor: nothing, for a gift. */
  readonly price: Cents
  readonly wanted: boolean
  /**
   * Why the switch passes this item over, for one it does: it belongs to a game that is not
   * included, or is an accessory to something not asked for, or is an alternative to what the
   * switch takes. Such an item stays out unless it is picked, and does not count against its
   * category being "all". Null for the rest.
   */
  readonly passedOver: string | null
  /**
   * How this item is in the order already, for one that comes with an included game. It is
   * shown as there, cannot be left out, and is no part of what the switch counts. Null for
   * the rest.
   */
  readonly included: string | null
}

export interface ExtraCategory {
  /** Everything in the category, for both games. */
  readonly items: readonly ExtraItem[]
  readonly state: CategoryState
  /** How many are asked for, not counting what comes with a game anyway. */
  readonly wantedCount: number
  /** How many items the switch stands for: all, less those it passes over or a game holds. */
  readonly size: number
}

const lineEntry = (line: GameLine): (typeof LINES)[number] | undefined =>
  LINES.find((entry) => entry.line === line)

const gameName = (line: GameLine): string => lineEntry(line)?.label ?? line

const lineOrder = (line: GameLine): number => LINES.findIndex((entry) => entry.line === line)

/** Whose an item is, said of one whose game — or games, if it is played in both — is left out. */
const notIncluded = (requirement: Requirement): string =>
  requirement.alsoWith === undefined
    ? `For ${gameName(requirement.line)}, which is not included`
    : `For ${gameName(requirement.line)} or ${gameName(requirement.alsoWith)}, neither of which is included`

const reasonPassedOver = (requirement: Requirement, preferences: Preferences): string | null => {
  if (!isInScope(requirement, preferences)) {
    return requirement.whenNote ?? notIncluded(requirement)
  }
  if (requirement.needs !== undefined && isWaiting(requirement, preferences)) {
    return `For ${getProduct(requirement.needs).name}, which is not included`
  }
  return null
}

/** A category as the page shows it: its items, and how much of it is asked for. */
export const describeExtra = (preferences: Preferences, tag: ExtraTag): ExtraCategory => {
  const items = REQUIREMENTS.filter((requirement) => requirement.tag === tag)
    .map((requirement) => {
      const product = getProduct(requirement.id)
      const isIncluded = comesWithGame(requirement, preferences)
      return {
        line: requirement.line,
        item: {
          id: requirement.id,
          name: product.name,
          price: priceFor(product, preferences),
          wanted: isWanted(requirement, preferences),
          // A gift is the backer's whatever is in the order, so the switch has no reason to give.
          passedOver:
            isIncluded || isGift(requirement.id, preferences)
              ? null
              : reasonPassedOver(requirement, preferences),
          included: isIncluded ? (lineEntry(requirement.line)?.brings ?? null) : null,
        },
      }
    })
    .sort((a, b) => {
      const games = lineOrder(a.line) - lineOrder(b.line)
      return games === 0 ? a.item.name.localeCompare(b.item.name, 'en') : games
    })
    .map(({ item }) => item)

  // What a game brings is neither the switch's to give nor a sign that it is on.
  const choices = items.filter((item) => item.included === null)
  const counted = choices.filter((item) => item.passedOver === null || item.wanted)
  const wantedCount = choices.filter((item) => item.wanted).length

  let state: CategoryState = 'some'
  if (wantedCount === 0) {
    state = 'off'
  } else if (counted.every((item) => item.wanted)) {
    state = 'on'
  }

  return { items, state, wantedCount, size: counted.length }
}
