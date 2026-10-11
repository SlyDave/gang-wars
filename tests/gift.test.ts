import { describe, expect, test } from 'bun:test'

import { getProduct } from '../app/domain/catalog'
import { findRequirement } from '../app/domain/classification'
import { GIFTS } from '../app/domain/gift'
import { decodePreferences, encodePreferences } from '../app/domain/preferences'
import { buildQuote } from '../app/domain/quote'
import { describeExtra } from '../app/domain/selection'

import { preferencesWith } from './support'

import type { Quote } from '../app/domain/quote'

const BASIC_PLEDGE = 120122
const NEWSBOY = 106734
const BOSS_RING = 126722
const SAFES_OF_TWO = 128721
const SAFES_OF_SIX = 128719
const SCARFACE = 126728

const cart = (quote: Quote): readonly number[] => quote.lines.map((line) => line.product.id)

const line = (quote: Quote, id: number): Quote['lines'][number] | undefined =>
  quote.lines.find((candidate) => candidate.product.id === id)

/** No tax, to read the sums off directly. */
const plain = { includeTax: false } as const

describe('the campaign’s gifts', () => {
  test('are three add-ons on sale, each to its own claim', () => {
    expect(GIFTS.map(({ product }) => getProduct(product).name)).toEqual([
      'Newsboy Mini-Expansion',
      'Boss Ring Mini-Expansion',
      'Safe Boxes (2-pack)',
    ])
    expect(new Set(GIFTS.map(({ claim }) => claim)).size).toBe(GIFTS.length)
    for (const { product } of GIFTS) {
      expect(getProduct(product).buyable).toBe(true)
      expect(findRequirement(product)?.tag).not.toBe('core')
    }
  })

  test('are in the cart with Gang Wars, free, without being asked for', () => {
    const quote = buildQuote(
      preferencesWith({
        ...plain,
        followedBeforeLaunch: true,
        earlyBacker: true,
        returningBacker: true,
      }),
    )
    expect(cart(quote)).toEqual([BASIC_PLEDGE, BOSS_RING, NEWSBOY, SAFES_OF_TWO])
    for (const id of [NEWSBOY, BOSS_RING, SAFES_OF_TWO]) {
      expect(line(quote, id)?.price).toBe(0)
      expect(line(quote, id)?.gift).not.toBeNull()
    }
    // The pledge is paid for; the gifts are value received and money saved.
    expect(quote.itemsTotal).toBe(8900)
    expect(quote.listTotal).toBe(8900 + 1200 + 1200 + 800)
    expect(quote.savings).toBe(3200)
  })

  test('each come only to whoever can claim it', () => {
    expect(cart(buildQuote(preferencesWith({ ...plain, followedBeforeLaunch: true })))).toEqual([
      BASIC_PLEDGE,
      NEWSBOY,
    ])
    expect(cart(buildQuote(preferencesWith({ ...plain, earlyBacker: true })))).toEqual([
      BASIC_PLEDGE,
      BOSS_RING,
    ])
    expect(cart(buildQuote(preferencesWith({ ...plain, returningBacker: true })))).toEqual([
      BASIC_PLEDGE,
      SAFES_OF_TWO,
    ])
    expect(cart(buildQuote(preferencesWith(plain)))).toEqual([BASIC_PLEDGE])
  })

  test('are free, but still have to be sent: each waits for a shipping price', () => {
    const quote = buildQuote(preferencesWith({ ...plain, earlyBacker: true }))
    expect(quote.unpricedShipping.map((product) => product.id)).toEqual([BOSS_RING])
    expect(quote.shippingTotal).toBe(buildQuote(preferencesWith(plain)).shippingTotal)
  })

  // All three are for backers of Gang Wars.
  test('are not free, nor added, on an order without Gang Wars', () => {
    const quote = buildQuote(
      preferencesWith({
        ...plain,
        lines: ['scarface'],
        followedBeforeLaunch: true,
        earlyBacker: true,
        returningBacker: true,
      }),
    )
    expect(cart(quote)).toEqual([SCARFACE])

    const bought = buildQuote(
      preferencesWith({
        ...plain,
        lines: ['scarface'],
        earlyBacker: true,
        overrides: { [BOSS_RING]: true },
      }),
    )
    expect(line(bought, BOSS_RING)?.price).toBe(1200)
    expect(line(bought, BOSS_RING)?.gift).toBeNull()
  })

  test('are ordinary add-ons for anyone else', () => {
    const bought = buildQuote(preferencesWith({ ...plain, overrides: { [NEWSBOY]: true } }))
    expect(line(bought, NEWSBOY)?.price).toBe(1200)
    expect(line(bought, NEWSBOY)?.gift).toBeNull()
    expect(bought.itemsTotal).toBe(8900 + 1200)
  })

  test('can be turned down', () => {
    const quote = buildQuote(
      preferencesWith({ ...plain, earlyBacker: true, overrides: { [BOSS_RING]: false } }),
    )
    expect(cart(quote)).toEqual([BASIC_PLEDGE])
  })

  test('show as free under their switches, and are not said to be for a game left out', () => {
    const preferences = preferencesWith({ earlyBacker: true, returningBacker: true })
    const ring = describeExtra(preferences, 'minis').items.find((item) => item.id === BOSS_RING)
    expect(ring?.price).toBe(0)
    expect(ring?.wanted).toBe(true)
    expect(describeExtra(preferences, 'minis').state).toBe('some')
    // The two safes are for Scarface 1920's gangs, which a returning backer already has.
    const safes = describeExtra(preferences, 'safes').items.find((item) => item.id === SAFES_OF_TWO)
    expect(safes?.price).toBe(0)
    expect(safes?.passedOver).toBeNull()
  })

  test('are remembered in the preferences string', () => {
    for (const { claim } of GIFTS) {
      const preferences = preferencesWith({ [claim]: true })
      expect(decodePreferences(encodePreferences(preferences))).toEqual(preferences)
    }
  })
})

describe('the returning backer’s two Safe Boxes', () => {
  // With Gang Wars the four of its gangs are in the box, so the free two make six.
  test('are taken free in place of the pack of six, which would cost', () => {
    const quote = buildQuote(
      preferencesWith({
        ...plain,
        lines: ['gangwars', 'scarface'],
        extras: ['safes'],
        returningBacker: true,
      }),
    )
    expect(cart(quote)).toContain(SAFES_OF_TWO)
    expect(cart(quote)).not.toContain(SAFES_OF_SIX)
    expect(line(quote, SAFES_OF_TWO)?.price).toBe(0)
  })
})
