import type { CurrencyCode, RegionId } from './types'

/**
 * Where an order can go: which row of the shipping table it falls in, and what tax the
 * campaign adds for it.
 *
 * Every campaign price is net of tax. The campaign's "Taxes & Tariffs" note says VAT or sales
 * tax is charged at the time of purchase, on the pledge and on its shipping, wherever the law
 * has Redzen collect it. Its "Customs friendly" note names the markets it ships within —
 * the US, the EU, the UK, Canada, Australia and China — and says that backers anywhere else
 * pay their own country's taxes and duties on delivery, which the campaign does not collect.
 *
 * The rates are each country's standard rate, which is what a board game is charged at. The
 * visitor can correct the rate, since rates change and some places (US states, Canadian
 * provinces) have more than one.
 */

export type TaxCollection =
  /** Added by Gamefound when paying: for the pledge now, for its shipping in the pledge manager. */
  | 'checkout'
  /** Not collected by the campaign at all. */
  | 'none'

export interface Destination {
  readonly code: string
  readonly name: string
  readonly region: RegionId
  /**
   * The money spent there. It is why the currency is offered at all (currencies.ts); the
   * catch-alls, which are no one place, are given the euro the campaign charges in.
   */
  readonly currency: CurrencyCode
  readonly taxName: string
  /** Percent. */
  readonly taxRate: number
  readonly collection: TaxCollection
  readonly note?: string
}

const vat = (
  code: string,
  name: string,
  taxRate: number,
  currency: CurrencyCode = 'EUR',
  region: RegionId = 'eu',
): Destination => ({
  code,
  name,
  region,
  currency,
  taxName: 'VAT',
  taxRate,
  collection: 'checkout',
})

const IMPORT_NOTE =
  'The campaign collects no tax for this destination. Your country’s import VAT, GST or duty may be charged on delivery.'

const untaxed = (
  code: string,
  name: string,
  region: RegionId,
  currency: CurrencyCode = 'EUR',
): Destination => ({
  code,
  name,
  region,
  currency,
  taxName: 'Tax',
  taxRate: 0,
  collection: 'none',
  note: IMPORT_NOTE,
})

const US_NOTE =
  'Sales tax is charged at your state’s rate where the campaign has to collect it — enter it here to include it. Any US import tariff in force when the games ship is added later, in the pledge manager.'

const usa = (code: string, name: string, region: RegionId): Destination => ({
  code,
  name,
  region,
  currency: 'USD',
  taxName: 'Sales tax',
  taxRate: 0,
  collection: 'checkout',
  note: US_NOTE,
})

export const DESTINATIONS: readonly Destination[] = [
  vat('GB', 'United Kingdom', 20, 'GBP', 'uk'),

  // The twenty-five countries the shipping table names under "EU".
  vat('AT', 'Austria', 20),
  vat('BE', 'Belgium', 21),
  vat('BG', 'Bulgaria', 20),
  vat('HR', 'Croatia', 25),
  vat('CZ', 'Czech Republic', 21, 'CZK'),
  vat('DK', 'Denmark', 25, 'DKK'),
  vat('EE', 'Estonia', 24),
  vat('FI', 'Finland', 25.5),
  vat('FR', 'France', 20),
  vat('DE', 'Germany', 19),
  vat('GR', 'Greece', 24),
  vat('HU', 'Hungary', 27, 'HUF'),
  vat('IE', 'Ireland', 23),
  vat('IT', 'Italy', 22),
  vat('LV', 'Latvia', 21),
  vat('LT', 'Lithuania', 21),
  vat('LU', 'Luxembourg', 17),
  vat('NL', 'Netherlands', 21),
  vat('PL', 'Poland', 23, 'PLN'),
  vat('PT', 'Portugal', 23),
  vat('RO', 'Romania', 21, 'RON'),
  vat('SK', 'Slovakia', 23),
  vat('SI', 'Slovenia', 22),
  vat('ES', 'Spain', 21),
  vat('SE', 'Sweden', 25, 'SEK'),

  // In the EU, so charged its VAT, but not among the table's twenty-five: its "Rest of EU"
  // row is "any other continental European country".
  vat('CY', 'Cyprus', 19, 'EUR', 'restOfEurope'),
  vat('MT', 'Malta', 18, 'EUR', 'restOfEurope'),

  // The rest of that row, as the table's footnote names it.
  untaxed('NO', 'Norway', 'restOfEurope', 'NOK'),
  untaxed('IS', 'Iceland', 'restOfEurope', 'ISK'),
  untaxed('CH', 'Switzerland', 'restOfEurope', 'CHF'),
  untaxed('RS', 'Serbia', 'restOfEurope', 'RSD'),
  untaxed('BY', 'Belarus', 'restOfEurope', 'BYN'),
  untaxed('BA', 'Bosnia and Herzegovina', 'restOfEurope', 'BAM'),
  untaxed('TR', 'Turkey', 'restOfEurope', 'TRY'),
  untaxed('MK', 'North Macedonia', 'restOfEurope', 'MKD'),
  untaxed('XE', 'Rest of Europe', 'restOfEurope'),

  usa('US', 'United States (lower 48)', 'usa'),
  usa('UH', 'United States (Alaska, Hawaii)', 'hawaiiAlaska'),
  {
    code: 'CA',
    name: 'Canada',
    region: 'canada',
    currency: 'CAD',
    taxName: 'GST/HST',
    taxRate: 5,
    collection: 'checkout',
    note: 'GST/HST depends on your province: 5% GST, or 13–15% HST in the provinces that have it.',
  },
  untaxed('MX', 'Mexico', 'mexico', 'MXN'),
  untaxed('XS', 'South America', 'southAmerica'),

  {
    code: 'AU',
    name: 'Australia',
    region: 'australia',
    currency: 'AUD',
    taxName: 'GST',
    taxRate: 10,
    collection: 'checkout',
  },
  untaxed('NZ', 'New Zealand', 'newZealand', 'NZD'),

  {
    code: 'CN',
    name: 'China',
    region: 'china',
    currency: 'CNY',
    taxName: 'Tax',
    taxRate: 0,
    collection: 'checkout',
    note: 'The campaign ships within China, so there is nothing to pay on delivery. If Gamefound adds a local tax at checkout, enter its rate here to include it.',
  },
  untaxed('HK', 'Hong Kong', 'china', 'HKD'),

  // The table's "Far East", as its footnote names it.
  untaxed('JP', 'Japan', 'farEast', 'JPY'),
  untaxed('KR', 'South Korea', 'farEast', 'KRW'),
  untaxed('TW', 'Taiwan', 'farEast', 'TWD'),
  untaxed('SG', 'Singapore', 'farEast', 'SGD'),
  untaxed('MY', 'Malaysia', 'farEast', 'MYR'),
  untaxed('TH', 'Thailand', 'farEast', 'THB'),
  untaxed('VN', 'Vietnam', 'farEast', 'VND'),
  untaxed('PH', 'Philippines', 'farEast', 'PHP'),
  untaxed('IN', 'India', 'farEast', 'INR'),

  untaxed('XW', 'Rest of the world', 'restOfWorld'),
]

export const DEFAULT_DESTINATION = 'GB'

export const REGION_NAMES: Readonly<Record<RegionId, string>> = {
  usa: 'USA',
  canada: 'Canada',
  eu: 'EU',
  restOfEurope: 'Rest of EU',
  uk: 'UK',
  australia: 'Australia',
  newZealand: 'New Zealand',
  china: 'China + HK',
  mexico: 'Mexico',
  southAmerica: 'South America',
  farEast: 'Far East',
  hawaiiAlaska: 'Hawaii/Alaska',
  restOfWorld: 'Rest of the world',
}

const destinationsByCode: ReadonlyMap<string, Destination> = new Map(
  DESTINATIONS.map((destination) => [destination.code, destination]),
)

export const findDestination = (code: string): Destination | undefined =>
  destinationsByCode.get(code)

/** The destination for a code, or the default one for a code this list does not have. */
export const destinationFor = (code: string): Destination => {
  const destination = destinationsByCode.get(code) ?? destinationsByCode.get(DEFAULT_DESTINATION)
  if (destination === undefined) {
    throw new Error('The destinations list has lost its default')
  }
  return destination
}
