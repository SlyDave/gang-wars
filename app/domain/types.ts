/** The two games the campaign sells. Everything in the catalogue belongs to one of them. */
export type GameLine = 'gangwars' | 'scarface'

/** One per extras switch. */
export type ExtraTag =
  | 'expansions'
  | 'minis'
  | 'poker'
  | 'deluxe'
  | 'safes'
  | 'playmat'
  | 'sleeves'
  | 'artbook'
  | 'storage'
  | 'solo'
  | 'vinyl'

/** What a catalogue item is: its game itself, or one of the extras. */
export type Tag = 'core' | ExtraTag

/** The euro, which is what Gamefound charges, and the currencies a total can be read in. */
export type CurrencyCode =
  | 'EUR'
  | 'USD'
  | 'GBP'
  | 'AUD'
  | 'BAM'
  | 'BYN'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'CZK'
  | 'DKK'
  | 'HKD'
  | 'HUF'
  | 'INR'
  | 'ISK'
  | 'JPY'
  | 'KRW'
  | 'MKD'
  | 'MXN'
  | 'MYR'
  | 'NOK'
  | 'NZD'
  | 'PHP'
  | 'PLN'
  | 'RON'
  | 'RSD'
  | 'SEK'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'TWD'
  | 'VND'
export type ThemeName = 'gangwars' | 'scarface'

/** The rows of the campaign's shipping table. */
export type RegionId =
  | 'usa'
  | 'canada'
  | 'eu'
  | 'restOfEurope'
  | 'uk'
  | 'australia'
  | 'newZealand'
  | 'china'
  | 'mexico'
  | 'southAmerica'
  | 'farEast'
  | 'hawaiiAlaska'
  | 'restOfWorld'

/** The three things a backer can have done that the campaign rewards with a free add-on. */
export type GiftClaim = 'followedBeforeLaunch' | 'earlyBacker' | 'returningBacker'

/** Everything the visitor chooses. */
export interface Preferences {
  /** Whether the visitor followed the campaign before it launched: the Newsboy is free. */
  readonly followedBeforeLaunch: boolean
  /** Whether they pledged in the campaign's first 72 hours: the Boss Ring is free. */
  readonly earlyBacker: boolean
  /** Whether they backed an earlier Scarface 1920 campaign: two more Safe Boxes are free. */
  readonly returningBacker: boolean
  readonly lines: Readonly<Record<GameLine, boolean>>
  readonly extras: Readonly<Record<ExtraTag, boolean>>
  /**
   * Single items picked out against their category's switch, by Gamefound product id: true
   * to take one whose category is off, false to leave one whose category is on.
   */
  readonly overrides: Readonly<Record<number, boolean>>
  readonly includeTax: boolean
  /** A code from the destinations list. */
  readonly destination: string
  /** The tax rate in percent; null follows the destination's own. */
  readonly taxRate: number | null
  readonly currency: CurrencyCode
}

/** An amount of money in euro cents, the unit every sum is done in. */
export type Cents = number
