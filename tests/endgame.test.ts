import { describe, expect, test } from 'bun:test'

import { catalog } from '../app/domain/catalog'
import { ENDGAME_ADDON, endgamePhase } from '../app/domain/endgame'
import { updateCover } from '../app/domain/unlocks'

describe('the Endgame', () => {
  test('begins at the campaign’s scheduled end, and not a moment before', () => {
    const end = catalog.campaignEnd
    expect(endgamePhase(end, new Date(Date.parse(end) - 1))).toBe('ahead')
    expect(endgamePhase(end, new Date(end))).toBe('begun')
    expect(endgamePhase(end, new Date(Date.parse(end) + 1))).toBe('begun')
  })

  // Campaign Update #34: "for just 4 € during the Endgame", then "its regular price of €12".
  test('brings an add-on that is cheaper while it lasts', () => {
    expect(ENDGAME_ADDON.price).toBe(400)
    expect(ENDGAME_ADDON.priceAfter).toBe(1200)
    expect(ENDGAME_ADDON.update).toBe(34)
  })

  test('has a stored picture of it', async () => {
    expect(await Bun.file(`public/${updateCover(ENDGAME_ADDON.update)}`).exists()).toBe(true)
  })

  // The page tells of the deck as something not yet on sale. Once a capture has it, it is a
  // product: classify it in app/domain/classification.ts, and retire the notice.
  test('is told of only while its add-on is not in the catalogue', () => {
    const decks = catalog.products
      .filter((product) => /poker/iu.test(product.name))
      .map((product) => product.name)
    expect(decks).toEqual([])
  })
})
