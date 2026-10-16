/**
 * What has changed on the site, as a visitor would notice it: the list behind "What's New?".
 *
 * There are no version numbers. The site is deployed as changes are pushed, so they are
 * grouped by the day they were made, newest first.
 *
 * This is the short version. CHANGELOG.md, at the root of the repository, is the full one,
 * and has a section for every day here. A change belongs in `highlights` if a visitor will
 * see it or get a different answer because of it. A smaller thing they could see — a tweak
 * to the layout, a correction to the wording, a fix to something that was briefly wrong — is
 * only counted, in `minor`. What nobody using the site could see, such as tests, documents
 * and the build, is in the changelog alone.
 */
export interface ChangeDay {
  /** The day, as YYYY-MM-DD. */
  readonly date: string
  /** What a visitor will notice or be affected by, the most significant first. */
  readonly highlights: readonly string[]
  /** How many smaller changes went with them, which are counted and not described. */
  readonly minor: number
}

export const CHANGELOG_URL = 'https://github.com/SlyDave/gang-wars/blob/main/CHANGELOG.md'

export const CHANGES: readonly ChangeDay[] = [
  {
    date: '2026-10-16',
    highlights: [
      'The campaign is over: it closed on 16 October 2026, after a five-hour Endgame. The page says so, and that orders are finished in the Pledge Manager, which Redzen Games expect to open in a few months.',
      'The Gang Wars Poker Deck, published when the Endgame began, has a switch of its own. Its €4 is the Endgame’s offer, which is to be kept for a few days once the Pledge Manager opens; then it is €12.',
      'The fourth and last stretch goal, from campaign Update #38: a printed Gang Wars comic, and the Vendetta module with its Thompson miniature, free with Gang Wars.',
      'Prices and bundles read again from Gamefound after the campaign closed. Only the deck is new.',
    ],
    minor: 2,
  },
  {
    date: '2026-10-14',
    highlights: [
      'Jack “Poker” Hart, the third stretch goal, from campaign Update #36: the sixth Fixer for City of Violence, now in “Free with this order” when City of Violence is in your order.',
      'Thirty-six more acrylic tokens for the Deluxification Set, from Update #35: deluxe Opium and Liquor tokens, Untouchables badges and Associate Tier tokens.',
      'The Untouchables becomes an expansion at €12 once the campaign ends, as Update #35 says.',
      'Prices and bundles read again from Gamefound after those updates. Nothing has changed.',
    ],
    minor: 1,
  },
  {
    date: '2026-10-13',
    highlights: [
      'The Endgame, from campaign Update #34: when it begins, how it keeps the campaign open, and the Gang Wars Poker Deck it brings — €4 while it lasts, €12 afterwards. The deck is not on sale until the Endgame begins, so it is not in the cart yet.',
      'Prices and bundles read again from Gamefound after that update. Nothing has changed.',
    ],
    minor: 0,
  },
  {
    date: '2026-10-12',
    highlights: [
      'The calculator goes live: switch on the games and extras you want from the Gang Wars campaign, and it finds the cheapest combination of pledges, bundles and add-ons, with the campaign’s shipping estimates, VAT and the list to add to your Gamefound cart.',
      'The Scarface 1920 reprint is in it too, with its three bundles and every reprint add-on.',
      'A “Free with this order” list of what the campaign adds to your pledge: the stretch goals it has unlocked — The Untouchables with Gang Wars, the Nightclub with Gangland Empire — and the two buildings and six News cards added in Update #32.',
      'Switches for the campaign’s three free gifts: the Newsboy for pre-launch followers, the Boss Ring for first-72-hour backers, and two Safe Boxes for returning backers.',
      'Open any extra to pick single items, with or without the game they belong to.',
      'Two styles, one for each game, and the total in any of thirty-two currencies.',
    ],
    minor: 0,
  },
]
