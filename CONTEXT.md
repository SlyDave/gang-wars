# CONTEXT — Gang Wars Rewards Calculator

A handover document. It records what was asked for, what was decided and why, and the things
to watch, so that someone picking this up — a person or an agent — can carry on without
guessing at decisions already made.

It is a companion to three shorter files: [README.md](README.md) is the developer's how-to,
[SECURITY.md](SECURITY.md) is the security posture, and [CHANGELOG.md](CHANGELOG.md) is what
changed and when. Where they overlap, this file has the reasoning and they have the summary.

State described: 13 October 2026, after campaign Update #34. The project was built and
committed on 11 October, held at the owner's word, and first pushed on 12 October (section 3).
**Something is due on 15 October**: section 7.8.

## 1. Snapshot

|                  |                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| What it is       | A static site that works out the cheapest way to back Gang Wars on Gamefound                                   |
| Live at          | <https://gangwars.slydave.com/>                                                                                |
| Repository       | <https://github.com/SlyDave/gang-wars> — public, GPL v3, default branch `main`                                 |
| Hosting          | GitHub Pages, built by GitHub Actions, custom domain (DNS through Cloudflare)                                  |
| Stack            | Nuxt 4.5 + Nuxt UI 4 (Tailwind 4), TypeScript, Bun; pre-rendered, no server                                    |
| Campaign         | <https://gamefound.com/en/projects/redzen/gang-wars/rewards>, by Redzen Games                                  |
| Campaign dates   | 22 September to 16 October 2026, 01:10 UTC: due to end at 20:00 UTC on the 15th, its Endgame ran five hours on |
| Catalogue        | Captured 16 October 2026, 18:59 UTC, after the campaign closed (Update #40)                                    |
| Catalogue size   | 45 products: 4 pledges (sets), 4 bundles typed out by hand, 37 sold singly                                     |
| Classified items | 37 requirements in `app/domain/classification.ts`                                                              |
| Tests            | 131, all passing (`bun test`)                                                                                  |

## 2. The brief

### The request

"Just like we have been doing for Nemesis, we're going to do the same for Gang Wars (+
Scarface 1920 Reprint)": a new project in a folder `gang-wars`, a new site themed on Gang
Wars, a static page with all logic client-side, "all the features we've added for Nemesis to
be used here where possible", a new GitHub repository called `gang-wars`, and the site at
`gangwars.slydave.com`. Nothing was to leak into the Nemesis project.

The Nemesis project is the owner's `nemesis-rewards-calculator`: the same kind of calculator
for the Nemesis Legacy campaign. This one began as an export of that repository's tracked
files, and its `CONTEXT.md` is the fuller account of the shared design.

### What the owner decided when asked

| Question                                        | Answer                                                                     |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| When the site goes live                         | **Hold until I say**: build, commit, create the repo, push nothing         |
| The repository                                  | Public, GPL v3, as Nemesis is                                              |
| The Font Awesome token                          | Copy the git-ignored `.env` from Nemesis; the owner adds the GitHub secret |
| The MSRP tiles, for a game with no retail price | Leave them out; keep "Reward value" and "Saving"                           |

### Which Nemesis features carried over

| Feature                                        | Here                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| Game switches, extras switches, picks          | Yes: two games, eleven extras (section 7)                                 |
| Exact cheapest-combination search              | Yes, unchanged                                                            |
| Shipping from the campaign's table             | Yes: two tables, thirteen regions (section 6)                             |
| Split or single shipping                       | **No.** The campaign always sends the two games apart; there is no choice |
| Tax by destination, correctable                | Yes                                                                       |
| Currencies, searchable, EUR/USD/GBP first      | Yes: thirty-two                                                           |
| Returning-backer gift                          | Yes, and two more gifts beside it (section 7.6)                           |
| Standard/Special edition, miniatures finish    | **No.** The campaign has neither: its only option is the language         |
| MSRP and saving against it                     | **No**, by the owner's answer: Gang Wars will never be at retail          |
| Themes, one per game                           | Yes: two                                                                  |
| Share link and remembered choices              | Yes                                                                       |
| Donate link, "What's New?", changelog          | Yes                                                                       |
| Things that come with a game shown as included | Yes (`withGame`)                                                          |
| Add-ons played in two games                    | Yes (`alsoWith`)                                                          |

### Where each decision came from

Decisions are marked **[owner]** where the owner asked for exactly that, and **[reading]**
where the request left room and a reading was chosen. Every reading here was made on the day
of the build and reported to the owner; none has been confirmed yet. They are the ones to
raise first.

## 3. Working agreements

Set by the owner on the Nemesis project and carried over, or set for this one.

- **Do not push until told to.** The owner's words, for this project too: "Hold until I say".
  A push to `main` is a production deploy.
- **Do not touch the Nemesis project.** It may be read; nothing is written to its folder.
- **Write a change down as it is made**: `CHANGELOG.md`, and the "What's New?" list if a
  visitor would notice it (section 8.4).
- **Verify before reporting.** Run `bun run check`, and look at a change in a browser if it can
  be seen there.
- **Wording the owner dictates is used exactly.**
- **Look up library documentation rather than recalling it.** The owner's standing rule is to
  use the Context7 documentation tool for any question about a library, framework or CLI.
- **Repository and DNS settings are the owner's to change** (section 10).
- **The Font Awesome token is never printed, logged or committed** (section 11).
- **Gamefound's bot protection is never worked around** (section 6).
- Commits have a short subject in plain words and a body that says why. Commits made by an
  agent end with a `Co-Authored-By` trailer naming it.
- The prose in the code and the page is plain British English: "catalogue", "colour".

## 4. Glossary

| Term         | Meaning                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| Line         | One of the two games: `gangwars`, `scarface`                                                                |
| Pledge       | One of the four Gang Wars rewards: Basic, Mobster, Big Boss, Empire. Sets, on Gamefound                     |
| Bundle       | One of the three Scarface 1920 bundles, or the pack of six Safe Boxes: single products on Gamefound         |
| Requirement  | One single item a visitor can want, by Gamefound product id                                                 |
| Tag          | What an item is: `core` (a game itself) or one of the eleven extras                                         |
| Extra        | A category with a switch: expansions, minis, deluxe, safes, playmat, sleeves, artbook, storage, solo, vinyl |
| Pick         | A single item ticked or unticked against its switch (`Preferences.overrides`)                               |
| Gift         | An add-on that is free to a backer who can claim it (section 7.6)                                           |
| Claim        | What a backer did to earn a gift: followed before launch, pledged early, or backed before                   |
| Wave         | One of the campaign's two shipments: the Scarface 1920 reprint is Wave 1, Gang Wars is Wave 2               |
| Tier         | One of the eight columns of the shipping tables                                                             |
| Reward value | Gamefound's full (list) price for what is in the cart                                                       |
| Late pledge  | Buying after the campaign, at full price: what the campaign compares its pledge prices with                 |
| Cents        | Euro cents, the unit of every sum. Other currencies are for display only                                    |

## 5. Stack, versions and layout

As the Nemesis project, from which the tooling was exported unchanged: Bun 1.4.2, Nuxt
`~4.5.2` (**held back on purpose**: 4.6.0 fails to render on Windows), Nuxt UI 4, TypeScript
6.0.3, ESLint 10, Prettier 3, Font Awesome Pro 7 with Free as the fallback, sharp for the
images.

| Command                  | What it does                                                               |
| ------------------------ | -------------------------------------------------------------------------- |
| `bun install`            | Installs, generates the icons, runs `nuxt prepare`, sets up the hook       |
| `bun run dev`            | Development server                                                         |
| `bun run build`          | `nuxt generate`: the static site, into `.output/public`                    |
| `bun run check`          | Lint, format check, type check and tests: everything CI runs but the build |
| `bun run catalog:build`  | Rebuilds the catalogue and images from the capture                         |
| `bun run icons:generate` | Rebuilds the icon collection                                               |

`.claude/launch.json` defines the development server on port 3220 for agent browser previews
(the Nemesis project uses 3210, so both can run).

```text
app/
  app.vue, app.config.ts      Shell; Nuxt UI's colours and its internal icons
  assets/css/main.css         Palettes, the two themes, the gw-* utilities
  assets/icons/fa/            GENERATED and git-ignored: the icon SVGs
  components/                 The page, in pieces (section 8)
  composables/                usePreferences, useTheme, useRates, useMoney
  data/catalog.json           GENERATED: the catalogue the site ships with
  domain/                     All the logic. Plain TypeScript, no Vue, no Nuxt
    types.ts                  The vocabulary: GameLine, ExtraTag, Preferences…
    catalog.ts                Typed catalogue; getProduct, leavesOf, buyableProducts
    classification.ts         What every product is: REQUIREMENTS, PROVIDES, BUNDLE_CONTENTS
    selection.ts              Preferences -> the set of wanted requirement ids
    gift.ts                   The three gifts
    solver.ts                 The search for the cheapest combination
    quote.ts                  A solution -> cart lines, shipping, tax, totals
    shipping.ts               The two shipping tables and the waves, typed out by hand
    destinations.ts           Countries -> shipping region and tax
    preferences.ts            Labels, defaults, and the share code
    currencies.ts             The currencies offered: code, name, symbol, where it goes
    money.ts                  Rates and writing amounts out
    changes.ts                What has changed, by day: the "What's New?" list
  pages/index.vue             The one page
data/gamefound.json           The capture, committed
public/                       CNAME, .nojekyll, favicon.svg, images/products/*.webp
scripts/                      capture-gamefound.js, build-catalog.ts, generate-fa-icons.ts
tests/                        bun:test; support.ts has the helpers
```

## 6. Where the data comes from

### Prices, products and pledge contents

Gamefound sits behind Cloudflare bot protection. **It is not to be bypassed.** The catalogue is
read from a real browser session, asking Gamefound's page for exactly what the page itself
asks for: open the rewards page, paste `scripts/capture-gamefound.js` into the console, move
the downloaded file to `data/gamefound.json`, run `bun run catalog:build`, then `bun test`,
then read `git diff data/gamefound.json`. The capture lists products in order of id, so the
diff is exactly what Gamefound changed.

An agent driving a browser pane can run the same capture and read the result back. In a pane
that is not on screen Gamefound's page never mounts and its text is empty, but
`window.__INITIAL_STATE__` and the page's endpoints still answer, and the page's content is in
the props of its `App.registerComponent(...)` scripts: the story in `ProjectContent`
(`descriptionModel.descriptionSections`), an update in `ProjectUpdateContent`, the FAQ in
`ProjectFaqContent`.

`catalog:build` fails if any product has an option that changes its price. The campaign has
none — its only option is the language, in English, Spanish, French or German — and the
calculator asks about none, so one appearing needs a decision.

### What Gamefound does not say, typed out by hand

| What                                   | Where                                    | Read from                                                       |
| -------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| What the Scarface 1920 bundles hold    | `BUNDLE_CONTENTS` in `classification.ts` | The "Scarface 1920 Reprint Bundles" graphic on the project page |
| What the pack of six Safe Boxes holds  | the same                                 | Campaign Update #27                                             |
| What each product is                   | `REQUIREMENTS`                           | Its name, its listing, the updates                              |
| The shipping estimates                 | `shipping.ts`                            | The two tables in the "Shipping" graphic                        |
| The waves                              | `shipping.ts`                            | The "Timeline & Waves" graphic                                  |
| Tax, and who is charged it             | `destinations.ts`                        | The "Taxes & Tariffs" graphic and the "Customs friendly" note   |
| Stretch goals and other free additions | `unlocks.ts`                             | Updates #28, #32 and #33                                        |
| The gifts                              | `gift.ts`                                | Updates #10, #14 and #27, and the Newsboy's own listing         |
| Currency symbols                       | `currencies.ts`                          | Convention, looked up                                           |

The story is almost all images. On 11 October 2026 the ones that matter were, under
`https://imgcdn.gamefound.com/richtextimage/richtext/`:

| Graphic                       | File                                       |
| ----------------------------- | ------------------------------------------ |
| Shipping (both tables)        | `e19a1ceb-1400-4a33-9532-8207eefc4af3.png` |
| Timeline & Waves              | `3b0228a0-ad3b-4959-a8ed-4f39d150e98a.png` |
| Taxes & Tariffs               | `aadfda22-c6b8-4914-973a-9b3ba673fcac.png` |
| Scarface 1920 Reprint Bundles | `1fe7c793-56fa-4731-849e-ce08108fcef0.png` |

Gamefound gives a replaced image a new file name, so a different name in the story means the
graphic has changed and must be read again. The campaign had no FAQ entries on that day.

On 13 October 2026 at 19:05 UTC it was captured again after Update #34, with the same
result, and that capture is the one committed now.

On 12 October 2026 at 18:42 UTC the catalogue was captured again, after campaign Updates #32
and #33, and compared field by field with the capture of the day before: nothing had changed —
no product, price, description, option or picture — and the four graphics were the same
files. That capture is the one committed. What those two updates added is free content, which
is not in the catalogue at all: section 7.7.

**How a campaign update is checked**, as those were: read its text in the props of its page's
`ProjectUpdateContent` script (each update gives the address of the next); capture the
catalogue again and compare every field; see that the four graphics above are the same files;
and add what it gives away to `unlocks.ts`, with its cover picture named in
`scripts/build-catalog.ts`.

**The bundles' list prices are not the sum of their parts.** The Gang Wars pledges' are (162 =
89 + 35 + 38), but the Gameplay Bundle lists at 228 against 241 for its contents today, so the
list price is no check on what was typed out. The tests hold what they can: each typed-out
bundle is one Gamefound gives no contents for, is made of single items on sale, and costs less
than those items bought apart.

**[reading] The Legacy All-in's sleeves.** Its list has one "Card Sleeves Pack"; two are on
sale, one for the core game and one for Bloody Business. It is taken to be the first. So with
every extra on, the calculator adds the Bloody Business Sleeves Pack (€18) beside the All-in.
If the All-in holds both, that is €18 too many.

### The pledges and bundles at capture

Prices are euros, list then effective where they differ.

| Id     | Name                                    | Price     | Holds                                                    |
| ------ | --------------------------------------- | --------- | -------------------------------------------------------- |
| 120122 | Gang Wars - Basic Pledge                | 89        | The core game                                            |
| 126737 | Gang Wars - Mobster Pledge              | 162 → 125 | + City of Violence, Gangland Empire                      |
| 126738 | Gang Wars - Big Boss Pledge             | 203 → 155 | + Neoprene Playmat, Sleeves Pack                         |
| 126740 | Gang Wars - Empire Pledge               | 270 → 195 | + Art Book, Big Truck, Deluxification Set                |
| 126728 | Scarface 1920 + The Enforcers (Reprint) | 120       | One product: the game and its first expansion            |
| 126746 | Scarface 1920 Expansions Bundle         | 113 → 95  | Bloody Business, Red Dragons, Golden Oaks                |
| 126745 | Scarface 1920 Gameplay Bundle           | 228 → 195 | The game with The Enforcers, and the Expansions Bundle   |
| 126747 | Scarface 1920 Legacy All-in (Prepacked) | 502 → 379 | Sixteen products: section 6 above, and `BUNDLE_CONTENTS` |
| 128719 | Safe Boxes (6-pack)                     | 19        | The pack of four (15) and the pack of two (8)            |

The Gang Wars core game is also listed among the add-ons (126719), at the Basic Pledge's
price. The calculator recommends the pledge: section 7.9.

## 7. How it decides — the rules

### 7.1 Classification

Every single item on sale is one `Requirement`: an id, the game it belongs to, and a tag. The
eleven extras and what is in each:

| Extra (label)              | Gang Wars                         | Scarface 1920                                                                         |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `expansions` Expansions    | City of Violence, Gangland Empire | The Enforcers, Bloody Business, Red Dragons Tong, Golden Oaks                         |
| `minis` Mini-Expansions    | Newsboy, Boss Ring                | Paperboy, Melvin Purvis, Night Deck                                                   |
| `poker` Poker Deck         | Poker Deck [ENDGAME]              | —                                                                                     |
| `deluxe` Deluxe Components | Deluxification Set, Big Truck     | Bloody Business Deluxification Set, Pre-painted Goods, Business Markers, Money Tokens |
| `safes` Safe Boxes         | The pack of four, the pack of two | —                                                                                     |
| `playmat` Playmat(s)       | Neoprene Playmat                  | Original, Bloody Business Annex, XL, Smaller                                          |
| `sleeves` Sleeves          | Sleeves Pack                      | Scarface 1920 Sleeves Pack, Bloody Business Sleeves Pack                              |
| `artbook` Art Book(s)      | Art Book                          | Scarface 1920 Art Book                                                                |
| `storage` Storage          | —                                 | Expansions Box Storage Solution, Wooden Boxes                                         |
| `solo` Extra Solo Sets     | Solo Mode (extra set)             | Solo Mode - Extra set of cards                                                        |
| `vinyl` Vinyl Soundtrack   | —                                 | Gangland Grooves Vinyl Disc                                                           |

All of that is **[reading]**: the campaign has two add-on categories, one per game, and no
finer ones. The Nemesis switches were the owner's list; these were chosen to match it in kind.
The Poker Deck came last, published in the Endgame (7.8). Where it should go was put to the
owner, with a switch of its own recommended; with no answer by the time it was on sale, it got
that switch, being like nothing else in the catalogue. Moving it under another is a change to
its tag in `classification.ts`, and to `EXTRAS` and `LATER_EXTRAS` in `preferences.ts`.

### 7.2 What the switches ask for

As Nemesis, whose owner set these rules:

- A game's switch asks for the game. An extras switch reaches the items of its category that
  go with the included games — **or the whole category, where none of it does**. So "Storage"
  or "Vinyl Soundtrack" with only Gang Wars on takes the Scarface 1920 items, there being no
  Gang Wars ones; and "All" with only Gang Wars takes those too.
- Under each switch every item of the category is listed, for both games, and any can be
  ticked or unticked. A pick wins over the switch. An add-on is never restricted by which
  games are included.
- Items the switch does not reach say why, and do not count against the category being fully
  on. The switch has three states: on, off, some.
- **Reset** returns the order to its defaults but keeps destination and currency.
- Quantities are always one of each.

The defaults: Gang Wars on, Scarface 1920 off, every extra off, no gift claimed, tax on,
delivering to the United Kingdom, in euros.

### 7.3 Things that come with a game (`withGame`)

Two items are both in the box with a game and sold by themselves. With the game included they
come regardless, are listed under their switch as "Included", cannot be left out, and are no
part of what the switch counts. Without the game they are extras like any other.

- **The Enforcers** (128687) is in the box with Scarface 1920 — the product is "Scarface 1920
  - The Enforcers" — and is sold alone for whoever has the game without it.
- **The four Safe Boxes** (128816) are in the Gang Wars core game, free (Update #15), and
  sold as a pack for Scarface 1920.

A test holds that an item is only said to come with a game where every way of buying the game
holds it.

### 7.4 Add-ons played in both games (`alsoWith`)

**[reading]**, from campaign Update #31: Gangland Empire "is also compatible with Scarface
1920", and "the Barrel Truck and Safe Boxes also enhance your original Scarface 1920
experience". So the Gangland Empire Expansion, the Big Truck and the four Safe Boxes go with
either game.

The consequence to know: with only Scarface 1920 included, "Expansions" takes Gangland Empire
as well as the Scarface ones. It is a Gang Wars product, so it ships in Wave 2: a second
shipment, with shipping of its own. It can be unticked.

### 7.5 Accessories, alternatives and the Safe Boxes

- **Accessories (`needs`).** Three Scarface 1920 items are for Bloody Business and wait for
  it: the Melvin Purvis Mini-Expansion (it "replaces the G-Men token from the Bloody Business
  expansion"), the Bloody Business Deluxification Set, and the Annex Playmat. They are wanted
  once Bloody Business is — by its switch or by a pick — and can be ticked without it.
  **[reading]**
- **The four Scarface 1920 playmats. [reading]** Nobody wants all four. The switch takes the
  Original, and the Annex beside it where Bloody Business is wanted. The XL and the Smaller
  each put both boards on one mat; the switch never takes them, and they are listed to be
  picked in the others' place. (Original and Annex together cost what the XL does, €36.)
- **The Safe Boxes. [reading]** Six exist: four for the gangs of Gang Wars and two for the Red
  Dragons and Golden Oaks, gangs only Scarface 1920 has. They are sold as a pack of four
  (€15), a pack of two (€8) and a pack of six (€19); all three are Gang Wars add-ons and ship
  in Wave 2. The pack of four comes in the Gang Wars core game; the pack of two goes with an
  order that includes Scarface 1920. So: Gang Wars alone needs none; Gang Wars with Scarface
  1920 takes the pack of two; Scarface 1920 alone takes the pack of six.
- **The extra solo sets** are only for more automated opponents — every pledge has one set —
  so they have a switch of their own, off by default.

### 7.6 The gifts

Three add-ons are free to backers who can claim them (`gift.ts`). The first panel on the page
has a switch for each claim, all off by default.

| Claim                         | Gift                     | Worth | Source                                             |
| ----------------------------- | ------------------------ | ----- | -------------------------------------------------- |
| Followed before launch        | Newsboy Mini-Expansion   | €12   | Its own listing: "added at checkout"; Update #10   |
| Pledged in the first 72 hours | Boss Ring Mini-Expansion | €12   | Updates #10 and #14; ended 25 September, 16:00 UTC |
| Backed Scarface 1920 before   | Safe Boxes (2-pack)      | €8    | Update #27: an add-on "at zero cost" to add        |

- **[reading]** All three are for backers of Gang Wars, so a gift is free, and added without
  being asked for, only on an order that includes Gang Wars. Otherwise it is an ordinary
  add-on at its price.
- A gift can be unticked. In the cart it shows "Free", carries a "Free gift" badge and a line
  saying how it reaches the pledge, and is a numbered line like any other.
- Its list price counts in "Reward value", so it shows as a saving.
- **[reading]** It is counted among the add-ons whose shipping is priced later: it is free,
  but it still has to be sent. (The Nemesis campaign's FAQ said as much of its gift.)
- The returning backer's two Safe Boxes are for gangs they already own, so they are never
  described as "for Scarface 1920, which is not included".

### 7.7 What the campaign has unlocked

The campaign adds things as it goes: stretch goals, unlocked as its funding passes a mark, and
reveals that go into a product already on sale. None is a product, so none is in the
catalogue: they are typed out from the updates, in `unlocks.ts`. Each comes to a backer with a
certain thing in their pledge.

| Unlock                                 | Kind         | Comes with         | Afterwards                 | Update |
| -------------------------------------- | ------------ | ------------------ | -------------------------- | ------ |
| The Untouchables Mini-Expansion        | Stretch goal | Gang Wars          | An expansion at €12 (#35)  | #28    |
| The Nightclub and its Night Associates | Stretch goal | Gangland Empire    | "It won't become an Addon" | #33    |
| Jack “Poker” Hart                      | Stretch goal | City of Violence   | Not said                   | #36    |
| The Gang Wars comic, and Vendetta      | Stretch goal | Gang Wars          | Not said                   | #38    |
| The Factory and the Newspaper Tower    | Reveal       | Gangland Empire    | —                          | #32    |
| Six extra News cards                   | Reveal       | Gang Wars          | —                          | #32    |
| Thirty-six more acrylic tokens         | Reveal       | Deluxification Set | —                          | #35    |

- **[owner]** Asked to read Updates #32 and #33 and bring the site up to date with what they
  introduce. **[reading]** They introduce no product and change none, so what was added is a
  list: a "Free with this order" panel beneath the cart, showing the unlocks the order earns
  (`Quote.unlocks`), each with the update's cover as its picture, stored by the site. An
  unlock whose update's cover shows something else names a picture of its own (`picture`):
  Update #35's cover is a last-day poster, so the acrylic tokens use the picture of them
  inside it, set square on white. `PICTURES` in `scripts/build-catalog.ts` names each
  picture's source.
- An unlock is earned by a single item being in the order, however it got there: in a pledge,
  as an add-on, or as a bonus of a bundle. So Gangland Empire bought beside Scarface 1920
  earns the Nightclub — "free for all backers with Gangland Empire in their pledge" — which
  has cards for that game too.
- Under its switch, an item says what is free with it ("Free with it: …") whether or not it
  is in the order: Gangland Empire and City of Violence under Expansions, the Deluxification
  Set under Deluxe Components. What comes with the game itself has nowhere to say so but the
  panel.
- **[owner]** Asked on 14 October 2026 to act on Updates #35 and #36. #35 adds 36 acrylic
  tokens to the Deluxification Set, free, and prices the Untouchables after the campaign; the rest of it is
  the last-day appeal. #36 unlocks the third stretch goal.
- **[reading]** Update #36 does not say who receives Jack “Poker” Hart. He is the sixth Fixer
  for City of Violence, and is played with it, so he is listed as earned by City of Violence,
  as the Nightclub is by Gangland Empire. If the campaign says he goes to every backer, or
  with the core game, change his `with` to `GANG_WARS`.
- Nothing about what is selected or what it costs changes with an unlock.
- **[reading]** Only the stretch goals and Update #32's additions are listed. The campaign's
  earlier daily reveals — new neighbourhoods, jobs, corrupts, the Game Trayz insert — also
  went into the core game free, and are not: they were part of the game by the time this site
  was built. The four Safe Boxes, which were one of them, are modelled as an item (7.5).
- All four stretch goals were unlocked before the campaign closed. The third was the
  "character who needs no introduction" that Update #33 hinted at; the fourth (Update #38,
  15 October 2026) is two things, listed as one: a printed comic of about twelve pages, "with
  every pledge that includes Gang Wars", and Vendetta, a module with a Thompson miniature,
  "added FOR FREE to Gang Wars".
- Update #37, the campaign's recap, says the Mobster, Big Boss and Empire pledges have
  everything the campaign unlocked. They hold the core game and both expansions, so that is
  what the per-item rule above gives them too.
- **[reading]** The Untouchables is "free for backers only until the campaign ends" (Update
  #37). It is still listed as free with Gang Wars, since the site's visitors now are mostly
  backers finishing their orders; whether a late backer in the Pledge Manager gets it is not
  said.

### 7.8 The Endgame, and the Poker Deck

Campaign Update #34 (13 October 2026) announced the Endgame: Gamefound does not close the
campaign at its scheduled end, but starts a ten-minute countdown that each backer's first
purchase puts back. With it came the Gang Wars Poker Deck, an add-on published the moment the
Endgame began: €4 while it lasted, then "its regular price of €12" in the Pledge Manager. It is
the deck Jack “Poker” Hart's bets are drawn from (Update #36), though any deck will do.

Until the deck was on sale the site told of it in a panel of its own, which changed by itself
at the scheduled end. The Endgame began on 15 October 2026 at 20:00 UTC (Update #39) and ran
until 01:10 UTC on the 16th; `campaignEnd` in the capture is now that real end.

**[owner]** Asked on 16 October to read Updates #37 to #40 and act on them. The capture that
day had the deck as product 129404, "Poker Deck [ENDGAME]", at €4 with a list price of €12. So:

- It is classified, under a switch of its own (7.1), and the panel, `endgame.ts` and its tests
  are gone, as is the cover of Update #34, which only the panel showed.
- Gamefound still prices it at €4. Update #40 says that offer will be kept "for a few days
  when the Pledge Manager opens", for the backers who missed it. Under "Good to know", a note
  says so whenever the deck is in the order, with both prices taken from the catalogue.
- When the Pledge Manager opens, capture again: the deck's price, and perhaps every pledge's
  for late backers (section 13).

### 7.9 The search

Weighted set cover, solved exactly by `solver.ts`, as in Nemesis. An offer's cost is `[price,
items, unpriced]`, compared in that order: the price of the rewards decides; fewer cart lines
breaks a tie; and last, fewer things without a shipping estimate.

- **[reading]** That last tie-break is what makes the **Basic Pledge** the answer for the game
  alone, and not "Gang Wars (Core Game)" among the add-ons at the same €89. The pledges are
  what the campaign's gifts and stretch goals are promised to, and what its table prices.
- Shipping amounts are not part of the ranking: only eight things have an estimate, so
  counting them would wrongly favour buying everything as separate add-ons.
- A pledge or bundle with unwanted things in it wins whenever it is cheaper; those things are
  reported as bonuses.
- The tests check it against a brute-force search over random switch, pick and claim
  combinations. Keep that test.

### 7.10 The quote

All sums are in euro cents.

| Figure          | Definition                                                                    |
| --------------- | ----------------------------------------------------------------------------- |
| `listTotal`     | The cart lines' list prices. Shown as "Reward value"                          |
| `itemsTotal`    | What the lines cost: effective prices, nothing for a gift. Shown as "Rewards" |
| `savings`       | `listTotal − itemsTotal`: pledge and bundle discounts plus any gift           |
| `shippingTotal` | The campaign's estimates for the lines that have one                          |
| `taxTotal`      | `round((items + shipping) × rate ÷ 100)`                                      |
| `total`         | `items + shipping + tax`. Shown as "Total to pay"                             |

- **Shipping is an estimate, and none of it is paid with the pledge.** The campaign charges it
  all afterwards in the pledge manager. The total still includes the estimate, as what the
  order will come to, and the page says which part is paid now.
- **Unpriced shipping**: every cart line without an estimate is counted and flagged: "Plus
  shipping for N add-ons, which Redzen Games will only price in the pledge manager."
- **Waves**: a line ships with the game it belongs to — Scarface 1920 in Wave 1 (shipping
  starts Q3 2027), Gang Wars in Wave 2 (Q2 2028). An order with something of each is two
  shipments, each with its own charge. The dates are when the games leave China; the campaign
  gives no delivery date.
- **Reward value** is Gamefound's full price. For a Gang Wars pledge the campaign says that is
  what its contents cost in the late pledge ("save up to €75", Update #31).

### 7.11 Tax and destinations

- Campaign prices are net of tax. Tax is charged on rewards and shipping, at the destination's
  standard rate (the "Taxes & Tariffs" graphic: "based on the total value of the pledge and
  shipping").
- **[reading]** The campaign does not list where it collects tax. Its "Customs friendly" note
  names the markets it ships within — the US, the EU, the UK, Canada, Australia and China —
  and says backers elsewhere pay their own country's taxes on delivery. So: the EU and the UK
  are charged VAT; Canada GST at 5% and Australia GST at 10%; the US sales tax at 0% until the
  visitor enters their state's rate; China 0% with a note; everywhere else nothing, with a
  warning of import charges. The EU and UK rates are sure. The rest are the best reading, and
  every rate can be corrected on the page.
- The shipping table's "EU" row names twenty-five countries. Cyprus and Malta are in the EU
  and not among them, so they are charged VAT and shipped at the "Rest of EU" rate.
  **[reading]**
- US import tariffs "will be added through the Pledge Manager" at whatever rate is in force
  when the games ship. The page warns US visitors that they are not in the total.
- The campaign cannot ship to Afghanistan, Iraq, Iran, Russia or Brazil; none is listed.
- Choosing pounds switches VAT on at the UK's 20%, as in Nemesis.

### 7.12 Currency, sharing and the cart

- Everything is in euros, which is what Gamefound charges. Thirty-two currencies are offered
  for reading the total: the twelve Gamefound's menu lists beside the euro, and the currency
  of every other place the shipping tables name. A test holds the list to those two sources.
  Rates are fetched from Frankfurter by the browser, falling back to the day of the capture.
- The choices are packed into a short code — `3-GB-EUR-` for the defaults — kept in
  `localStorage` (`gang-wars:preferences`) and in the address as `?c=`. The bits are, in
  order: tax, the two games, the ten extras there were at first, the three claims, then the
  Poker Deck, whose switch came after them (`LATER_EXTRAS`). **Append, never reorder.**
- The cart lists Gang Wars, then Scarface 1920; within each, the pledge or bundle first, then
  add-ons in the order of the extras switches, then by name.

## 8. The page

### 8.1 Layout

One page, as Nemesis. Two columns on a wide screen: the choices on the left, the answer on the
right, which stays in view. On a phone a bar at the foot carries the total.

| Left: choices  | Component         | Right: answer              | Component      |
| -------------- | ----------------- | -------------------------- | -------------- |
| Free gifts     | `ChoicesBacker`   | Your best order            | `QuoteTotals`  |
| Games          | `ChoicesGames`    | Add to your Gamefound cart | `QuoteCart`    |
| Extras         | `ChoicesExtras`   | Free with this order       | `QuoteUnlocks` |
| Delivery & tax | `ChoicesDelivery` | Good to know               | `QuoteNotes`   |

The header has the name with the "What's New?" button across from it, then Style, Currency,
Reset and Donate. Every panel is a `PaperPanel`.

### 8.2 Wording

- **[owner]**, carried from Nemesis: the Donate link's hover text, "Hi! If you find this
  useful, please consider a small donation to fuel more creations and help me pay for the
  hosting - you’re the best, cheers!", and its address,
  `https://github.com/sponsors/SlyDave?frequency=one-time&sponsor=SlyDave&amount=3`; the
  button "What’s New?"; "Include Tax / VAT"; no "Include" on the games and extras.
- Everything else on the page is the builder's wording and has not been reviewed.

### 8.3 Themes

**[reading]** "Themed based on Gang Wars", with a style per game as Nemesis has.

| Theme         | Look                  | Taken from                                                                                                       |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Gang Wars     | Ink on paper, light   | The campaign page: cream sheets with a double black rule, brown gothic headings, red labels, typewritten figures |
| Scarface 1920 | Gold on oxblood, dark | The reprint's own graphics: its Night Deck and Expansions Box are black and gold                                 |

- Palettes in `main.css`: `tobacco` (brown, the primary), `brass` (gold), `blood` (red, used
  as the error and warning colour), `paper` (the warm neutral).
- A theme is the `data-theme` attribute on `<html>`, with the `dark` class beside it for
  Scarface 1920. Neither means Gang Wars. `ui.colorMode` is off; `useTheme` and an inline
  script in the head do it, so the last theme is back before the first paint.
- **Neither attribute is in `htmlAttrs`**: anything listed there is put back when the page
  hydrates.
- Typefaces: League Gothic for headings (it is narrow, so it is set large), Barlow Semi
  Condensed for reading, Special Elite for the typewritten total. All downloaded at build time
  and served from the site.

### 8.4 Icons, "What's New?" and the changelog

- Components use semantic icon names (`i-fa-safes`, `i-fa-waves`); the mapping to Font Awesome
  is the `ICONS` table in `scripts/generate-fa-icons.ts`, 52 icons. After adding one, run
  `bun run icons:generate` and restart the dev server.
- `CHANGELOG.md` follows Keep a Changelog 1.1.0, with days for versions. The site's list is
  `CHANGES` in `app/domain/changes.ts`: per day, the highlights a visitor would notice and a
  count of smaller visible changes. `tests/changes.test.ts` keeps the two in step. The first
  release is dated 12 October 2026 in both, the day it went live, though it was built the day
  before; so its link in the changelog is to every commit up to that day. A change is dated
  the day it goes live: **if a push is held over to another day, put the date right first.**

## 9. Strictness and quality gates

As Nemesis: TypeScript at its strictest in all four of Nuxt's tsconfigs, ESLint's
strict-type-checked and stylistic sets with `--max-warnings 0`, Prettier, a pre-commit hook
running lint and the format check, and CI running `bun run check` and the build.

## 10. Build and deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: install, test, `nuxt generate`, publish
to GitHub Pages. `public/CNAME` names `gangwars.slydave.com`.

The owner set up the three things that were theirs before the first push, on 12 October 2026:
the repository secret `FONTAWESOME_PACKAGE_TOKEN`; Pages, with "GitHub Actions" as its source
and `gangwars.slydave.com` as its custom domain; and the domain's DNS record, through
Cloudflare.

Still the owner's to consider, as for the Nemesis project: enforcing HTTPS (Pages reported
`https_enforced: false` on that day), Dependabot alerts, and private vulnerability reporting,
which `SECURITY.md` links to.

## 11. Security

As Nemesis (see `SECURITY.md`): no server, nothing collected, a Content Security Policy naming
each inline script by hash, actions pinned to commits, the Font Awesome token only in the
git-ignored `.env` and the repository secret, and the generated Pro icon files never
committed. `.env` was copied from the Nemesis project's folder without being displayed.

## 12. Things to watch

| Symptom                                                    | Cause                                                                                          | What to do                                                                          |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Nothing renders: "Either manifest or precomputed data…"    | Nuxt 4.6.0 on Windows                                                                          | Nuxt is held at `~4.5.2`                                                            |
| The theme snaps back after loading                         | Something in `htmlAttrs` is re-applied on hydration                                            | Keep `data-theme` and `class` out of it                                             |
| A new icon is missing in dev                               | The icon collection is read at start-up                                                        | Restart the dev server after `icons:generate`                                       |
| A shared `?c=` link is ignored on the built site           | Nuxt strips the query while hydrating a pre-rendered page                                      | The code is read at module load and applied in `onNuxtReady`                        |
| Gamefound returns 403 to scripts                           | Cloudflare bot protection                                                                      | Capture from a real browser. Do not work around it                                  |
| A new capture differs on every line                        | Products in listing order                                                                      | The capture script sorts them by id                                                 |
| A renamed product keeps its old picture                    | `catalog:build` only fetches missing images                                                    | Delete the file, or build with `--force`                                            |
| A file with a long name cannot be written in a temp folder | Windows' path limit                                                                            | Short file names                                                                    |
| An agent's preview starts the wrong project's server       | The preview tool may read its launch configuration from the session's own folder, not this one | Start it in a session opened in this folder, or add this project there with `--cwd` |

## 13. Open, and the owner's to decide

1. **HTTPS, Dependabot alerts and private vulnerability reporting** for the new repository
   (section 10).
2. **Every [reading] in section 7**, none yet confirmed. The ones with money in them: the
   Legacy All-in's sleeves (section 6); who is charged tax outside the EU and the UK (7.11);
   Gangland Empire, the Big Truck and the Safe Boxes going with a Scarface 1920 order, which
   brings a second shipment (7.4); gifts being free only with Gang Wars (7.6).
3. **The whole-category rule** (7.2) means "All" with only Gang Wars takes Scarface 1920's
   storage boxes and its record. That is the Nemesis rule, kept; it reads more oddly here.
4. **The campaign is over** (16 October 2026, 01:10 UTC, Update #40), and the page says so:
   orders are finished in the Pledge Manager, which Redzen Games expect to open in a few
   months, and the prices shown are the campaign's. When it opens, capture again: the Poker
   Deck's €4 offer is kept only for a few days then, the Untouchables becomes a €12
   expansion, and late backers may pay the list prices. Whether the site should then price a
   late pledge, or stay a record of the campaign, is the owner's to say.
5. **How the Boss Ring reaches an early backer's pledge** is not said by the campaign; the
   cart line only says it is free with a pledge made in the first 72 hours.
6. **The page's wording and the look of both themes** have not been reviewed by the owner.

## 14. Reference results

From the catalogue as captured, delivering to the UK with VAT at 20%. Use them to check that a
rebuild or a refactor still agrees. They change when the catalogue is captured again.

| Choices                            | Code           | Cart                                                         | Rewards | Shipping | Total  |
| ---------------------------------- | -------------- | ------------------------------------------------------------ | ------- | -------- | ------ |
| Defaults: Gang Wars                | `3-GB-EUR-`    | Basic Pledge                                                 | 89.00   | 21.00    | 132.00 |
| Gang Wars, Expansions              | `b-GB-EUR-`    | Mobster Pledge                                               | 125.00  | 22.00    | 176.40 |
| Gang Wars, every extra             | `6bf-GB-EUR-`  | Empire Pledge and six add-ons, three of them Scarface 1920's | 290.00  | 27.00    | 380.40 |
| The same, every gift claimed       | `1ekb-GB-EUR-` | Empire Pledge, three gifts, four add-ons                     | 266.00  | 27.00    | 351.60 |
| Gang Wars, returning backer        | `pab-GB-EUR-`  | Basic Pledge, Safe Boxes (2-pack) free                       | 89.00   | 21.00    | 132.00 |
| Scarface 1920                      | `5-GB-EUR-`    | Scarface 1920 + The Enforcers                                | 120.00  | 21.00    | 169.20 |
| Scarface 1920, Expansions          | `d-GB-EUR-`    | Gameplay Bundle, Gangland Empire                             | 233.00  | 25.00    | 309.60 |
| Scarface 1920, Safe Boxes          | `1x-GB-EUR-`   | Scarface 1920 + The Enforcers, Safe Boxes (6-pack)           | 139.00  | 21.00    | 192.00 |
| Scarface 1920, every extra         | `6bh-GB-EUR-`  | Legacy All-in and seven add-ons                              | 513.00  | 27.00    | 648.00 |
| Both games, every extra            | `6bj-GB-EUR-`  | Empire Pledge, Legacy All-in and eight add-ons               | 673.00  | 54.00    | 872.40 |
| Both games, Playmat(s), Expansions | `3z-GB-EUR-`   | Mobster Pledge, Gameplay Bundle, three playmats              | 378.00  | 47.00    | 510.00 |
| No game, the record                | `35t-GB-EUR-`  | Gangland Grooves Vinyl Disc                                  | 19.00   | 0.00     | 22.80  |

Two facts that are easy to assume wrong:

- Gang Wars with one expansion is the Basic Pledge and that expansion (€124), a euro under the
  Mobster Pledge.
- Scarface 1920 with Bloody Business and one gang is the Gameplay Bundle (€195), with the
  other gang as a bonus: the three apart are €205.

## 15. Working on it

For any change:

1. Change the rule in `app/domain/` and its test in `tests/` together. Put logic in the domain,
   not in a component.
2. `bun run check`.
3. Look at it in the browser at phone and desktop widths, in both themes.
4. If it touches loading, storage, the address bar or the security policy, check the built site
   too: `bun run build`, then `bun run preview`.
5. Write it down: `CHANGELOG.md`, and the "What's New?" list if a visitor would notice it.
6. Commit. **Do not push until the owner says to.**

| Job                           | Touch                                                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prices changed on Gamefound   | Capture, `bun run catalog:build`, `bun test`                                                                                                                                                        |
| Gamefound added a product     | Classify it in `classification.ts`: a tag, `alsoWith`, `withGame` or `needs` as it calls for                                                                                                        |
| A new pledge or bundle        | A tier in `shipping.ts` if the tables price it; `BUNDLE_CONTENTS` if Gamefound lists no contents                                                                                                    |
| The shipping tables changed   | `shipping.ts`, by hand from the campaign's image                                                                                                                                                    |
| A stretch goal, or a reveal   | An entry in `UNLOCKS` in `unlocks.ts`, and its picture's source in `PICTURES` in `scripts/build-catalog.ts` (its update's cover by number, or a `picture` of its own); then `bun run catalog:build` |
| A new gift                    | `GIFTS` in `gift.ts`, a `GiftClaim`, a default, and its bit appended in `preferences.ts`                                                                                                            |
| A new extras switch           | `ExtraTag`, `EXTRAS`, `DEFAULT_PREFERENCES`, an icon — and its bit, which shifts the claims': section 7.12                                                                                          |
| A new destination or tax rate | `destinations.ts`; a new currency follows from it (`currencies.ts`, `CurrencyCode`)                                                                                                                 |
| A new icon                    | `ICONS` in `generate-fa-icons.ts`, then `bun run icons:generate`                                                                                                                                    |
