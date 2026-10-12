import { GANG_WARS } from './classification'

/**
 * What the campaign has added, free, while it runs: the stretch goals it has unlocked, and
 * things revealed along the way that go into a product already on sale.
 *
 * None of them is a product: there is nothing to choose and nothing to pay. But each comes
 * only to a backer with a certain thing in their pledge, so an order either earns one or does
 * not, and that is worth knowing when deciding what to back. They are typed out from the
 * campaign's updates, which is the only place they are announced.
 */

export type UnlockKind =
  /** Unlocked by the campaign's funding passing a mark. */
  | 'stretchGoal'
  /** Added to a product during the campaign, as one of its reveals. */
  | 'reveal'

export interface Unlock {
  readonly id: string
  readonly kind: UnlockKind
  readonly name: string
  /** The Gamefound product that has to be in the pledge for it to come. */
  readonly with: number
  readonly what: string
  /** What the campaign says becomes of it once the campaign is over, where it says. */
  readonly after: string | null
  /** The campaign update that announced it, whose cover is the picture the site stores. */
  readonly update: number
}

const GANGLAND_EMPIRE = 126721

export const UNLOCKS: readonly Unlock[] = [
  {
    id: 'untouchables',
    kind: 'stretchGoal',
    name: 'The Untouchables Mini-Expansion',
    with: GANG_WARS,
    what: 'Eliot Ness’s agents, who close in on whoever makes the most noise: four boards, four Raid markers and 45 cards.',
    after: 'It becomes a paid add-on once the campaign ends.',
    update: 28,
  },
  {
    id: 'nightclub',
    kind: 'stretchGoal',
    name: 'The Nightclub and its Night Associates',
    with: GANGLAND_EMPIRE,
    what: 'A thirteenth building for Gangland Empire, with its cards for Gang Wars and for Scarface 1920, and eight Night Associates for each game.',
    after: 'It will not be sold as an add-on.',
    update: 33,
  },
  {
    id: 'factory-newspaper',
    kind: 'reveal',
    name: 'The Factory and the Newspaper Tower',
    with: GANGLAND_EMPIRE,
    what: 'Two more buildings for Gangland Empire, which bring it to twelve, each with its cards for both games.',
    after: null,
    update: 32,
  },
  {
    id: 'news-cards',
    kind: 'reveal',
    name: 'Six extra News cards',
    with: GANG_WARS,
    what: 'Six more front pages for Gang Wars, for thirty-six in all.',
    after: null,
    update: 32,
  },
]

/** Where the site keeps an unlock's picture, relative to its root. */
export const unlockImage = (unlock: Unlock): string =>
  `images/unlocks/${String(unlock.update)}.webp`

/** The unlocks that come with a product. */
export const unlocksWith = (productId: number): readonly Unlock[] =>
  UNLOCKS.filter((unlock) => unlock.with === productId)

/** The unlocks an order earns, given the single items in it. */
export const unlocksFor = (itemIds: ReadonlySet<number>): readonly Unlock[] =>
  UNLOCKS.filter((unlock) => itemIds.has(unlock.with))
