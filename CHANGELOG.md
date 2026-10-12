# Changelog

All notable changes to the Gang Wars Rewards Calculator are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project has
no version numbers, and so does not follow Semantic Versioning: the site is deployed from `main`
as changes are pushed, and each section here is a day, newest first, written year-month-day.
Each date links to that day's commits; the first, to everything up to it.

The "What's New?" list on the site is the short version of this file, with only what a visitor
would notice. It is kept in [`app/domain/changes.ts`](app/domain/changes.ts).

## [2026-10-12]

The first release.

### Added

- The calculator: a static site, running wholly in the browser, that finds the cheapest
  combination of pledges, bundles and add-ons in the Gang Wars (+ Scarface 1920 Reprint)
  campaign on Gamefound for a chosen set of games and extras, prices it, and lists what to add
  to the Gamefound cart.
  - Switches for the two games, Gang Wars and Scarface 1920, and for ten kinds of extra:
    expansions, mini-expansions, deluxe components, Safe Boxes, playmats, sleeves, art books,
    storage, extra solo sets and the vinyl soundtrack.
  - The catalogue as captured from Gamefound: 44 products, what each Gang Wars pledge contains,
    and their pictures, which the site stores itself. It was captured on 11 October and again
    on 12 October, after campaign Updates #32 and #33, which changed no product, price,
    description or picture in it.
  - What the three Scarface 1920 bundles and the pack of six Safe Boxes hold, typed out from
    the campaign's own account of them, since Gamefound lists each as a single product.
  - An exact search for the cheapest combination, checked in the tests against a brute-force
    one. A pledge or bundle that brings things not asked for wins where it is cheaper, and
    those things are shown as bonuses.
  - The campaign's shipping estimates for thirteen regions: one table for the four Gang Wars
    pledges, one for Scarface 1920 and its three bundles. All shipping is charged later, in
    the pledge manager, and the page says so.
  - The campaign's two shipments: the Scarface 1920 reprint in Wave 1, Gang Wars in Wave 2.
    They always travel apart, so there is no single or split shipping to choose.
  - VAT, GST or sales tax by destination, which can be switched off or corrected.
  - The total in any of thirty-two currencies, at central banks' reference rates: the twelve
    Gamefound's own menu lists beside the euro, and the currency of every other place the
    campaign's shipping tables name.
  - The choices are remembered in the browser and carried in the page's address, so an order
    can be shared as a link.
- A "Free with this order" list, beneath the cart: what the campaign adds free to a pledge
  that has the thing that earns it, each with its picture and the update that announced it.
  - The two stretch goals unlocked so far: The Untouchables Mini-Expansion, with Gang Wars
    (Update #28), and the Nightclub with its Night Associates, with Gangland Empire (Update
    #33). It says what the campaign says becomes of each afterwards: the first becomes a paid
    add-on, the second will not be sold.
  - The additions of Update #32: the Factory and the Newspaper Tower, with Gangland Empire,
    and six extra News cards, with Gang Wars.
  - Under Expansions, Gangland Empire says what is free with it, whether or not it is in the
    order, since that is a reason to take it.
- Switches for the campaign's three gifts, each free on an order with Gang Wars: the Newsboy
  Mini-Expansion for whoever followed the campaign before launch, the Boss Ring Mini-Expansion
  for whoever pledged in its first 72 hours, and the pack of two Safe Boxes for returning
  backers of the Scarface 1920 campaigns.
- Each extra opens to list its items with their prices, to be ticked one by one, with or
  without the game they belong to. The switch takes the whole category, and rests in a third,
  halfway position where only some items are ticked.
- Things that come in the box with a game are listed under their switch as included: The
  Enforcers with Scarface 1920, and the four Safe Boxes with Gang Wars.
- Add-ons the campaign says are played in both games go with either: the Gangland Empire
  Expansion, the Big Truck and the Safe Boxes.
- Accessories to Bloody Business wait for it: the Melvin Purvis Mini-Expansion, the Bloody
  Business Deluxification Set and the Annex Playmat.
- Of Scarface 1920's four playmats the switch takes the original, and the annex beside it with
  Bloody Business. The XL and the Smaller playmat, which each do both jobs in one, are there
  to be picked in their place.
- Two styles: Gang Wars, in ink on paper as the campaign page is, and Scarface 1920, in gold
  on black.
- A "What's New?" button opening the list of changes by date, and this changelog.
- A Donate link in the header.
- Font Awesome Pro icons, with Font Awesome Free standing in wherever there is no licence
  token, so that a fork still builds.
- TypeScript, ESLint and Prettier at their strictest, a pre-commit hook, and GitHub Actions
  that check every push and deploy the site to GitHub Pages at `gangwars.slydave.com`.
- `README.md`, `CONTEXT.md`, the handover document, and `SECURITY.md`.

### Security

- Every built page carries a Content Security Policy that names its own inline scripts by
  hash.
- The workflows pin each action to a commit, grant the least permissions each job needs and do
  not keep the checkout's credentials. Dependabot keeps the pins current.
- A capture may only contain Gamefound addresses.

[2026-10-12]: https://github.com/SlyDave/gang-wars/commits/main/?until=2026-10-12
