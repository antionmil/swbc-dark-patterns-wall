# Six small obstructions

Day 9 of [onedaybuilt.com](https://onedaybuilt.com) — one website a day, all September.

Live: **https://darkpatterns.onedaybuilt.com**

Six consent dialogs and sign-up forms, photographed on a first visit, with the
awkward part pinned and counted.

## What this is

Six browser captures. Each carries numbered pins placed on the elements being
described, the description under each pin, and a short table of numbers counted
on the live page in the same visit that produced the image.

The one rule the whole thing hangs on: **describe the pattern, never assert
intent.** "The reject control is not on this screen" is observable. "They are
trying to trick you" is a claim about a named company's state of mind that
nobody outside that company can make. Only the first kind appears here.

Each exhibit also carries a **Not claimed** line. Several of these sites do the
awkward thing in one place and a fair thing right beside it — Superdry's second
screen starts every category switched off — and leaving that out would make the
wall more damning than the evidence supports.

## No database, no model, no form

There is nothing per-request on this site. `/` is a static page and `pnpm build`
must keep printing `○` for it. There is no Postgres, no model call, and no
submission form — a wall anyone can add to needs somebody checking every entry
against the live page, and an unchecked accusation about a named company is the
exact thing this page exists to avoid.

The dependency list is `next`, `react`, `react-dom` and `@vercel/analytics`.
Nothing else.

## How the captures were made

`../prep/capture.mjs` (Playwright). For each site it opens a **clean browser
profile** — four of the six dialogs appear only on a first visit — waits for the
page to settle, photographs the window at 1280×900 at 2×, and writes both the
image and the measured facts in the same run, so a caption and its picture
cannot drift apart.

Pin positions come from each element's own bounding box, emitted as percentages
of the capture and written into `src/data/exhibits.ts`. None is placed by eye.
They are the element's **top-left corner**, not its centre: a pin on the middle
of "Reject all and subscribe" covers the words that are the evidence.

The script never presses Accept, Agree or Subscribe. The only presses are the
ones that *open* a settings panel, plus a single "Required cookies only" on
Holland & Barrett — the declining choice, and the only way past a dialog that
locks the page.

Originals, the facts file and the full shot list are in `../prep/`.

## The guard

```bash
node qa/attack.mjs
```

73 checks, and every one is an *attempt* at the thing the site must not do:

- an intent word in a caption ("designed to", "manipulate", "trick")
- a ranking word ("worst", "offender", "hall of shame")
- one exhibit naming a company it is not about
- a pin pointing outside its image
- an exhibit shipping without its capture file, its source link, or its
  "not claimed" line
- a `<form>`, an `<input>` or a server action appearing anywhere

All of them were fired at and all of them were caught. A guard that has never
been attacked is a guard that might do nothing — day 1 shipped a rate limiter
that compiled, deployed and counted per serverless instance, which is to say it
counted nothing.

## Running it

```bash
pnpm install
pnpm dev            # localhost:3026
pnpm attack         # the guard
pnpm typecheck
NEXT_DIST_DIR=.next-build pnpm build   # never writes .next, so dev survives
```

## What it does not cover

Consent dialogs vary by country and change often. These are what one Chromium
profile saw from Switzerland on 11 September 2026, in en-GB. Every exhibit says
so, and every exhibit links to the live page so a reader can check.
