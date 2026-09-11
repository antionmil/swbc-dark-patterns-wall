# What one click agrees to

Day 9 of [onedaybuilt.com](https://onedaybuilt.com) — one website a day, all September.

Live: **https://darkpatterns.onedaybuilt.com**

Ninety sites measured. Every consent dialog counted: how many companies one
press covers, which offer no way to decline, and which charge you for declining.

## What this is

A grid of 36 findings across 25 sites, each with the browser capture it came
from, numbered pins on the elements being described, and a short table of
numbers counted on the live page in the same visit that produced the picture.

The one rule it hangs on: **describe the pattern, never assert intent.** "No
control on this screen declines" is observable. "They are trying to trick you"
is a claim about a named company's state of mind that nobody outside that
company can make. Only the first kind appears here.

Every exhibit carries a **Not claimed** line. Several of these sites do the
awkward thing in one place and a fair thing right beside it — Ticketmaster names
128 partners and offers a plain Reject All — and leaving that out would make the
wall more damning than the evidence supports.

## The sentences are generated, not written

At six exhibits the captions were hand-written. At thirty-six that stops being
possible, and hand-writing is exactly where an intent claim gets in. So the
patterns are **measured** in the page and the sentences come from templates
filled with those measurements. A template can only say what was measured.

No model is involved anywhere in the pipeline.

```
prep/pipeline/probes.mjs      the detectors — one copy, shared
prep/pipeline/detect2.mjs     sweep: which of 90 sites carry something
prep/pipeline/capture2.mjs    capture: screenshot + measure in the SAME visit
prep/pipeline/compose.mjs     templates: measurements → sentences
prep/pipeline/emit.mjs        generates src/data/exhibits.ts
prep/pipeline/verify_sheets.py builds the sheets used to check every exhibit by eye
```

The screenshot and the measurement happen in one page load on purpose. Content
shifts between visits; a pin measured in run A sits over nothing in the image
from run B, and a count from run A can describe a page that no longer looks like
the picture beside it.

## The detectors were wrong before they were right

Worth writing down, because the numbers look authoritative either way:

- An early pass flagged ten sites for shaming language. Every one was a news
  headline — the pattern had matched inside a French or German word.
- It read a hotel occupancy selector ("1 room") as a scarcity claim on 24 of 24
  results.
- It paired real disclosures with the wrong buttons, so one finding was right
  and twelve were not.
- It reported that ten dialogs offered no way to decline. Six of those ten did:
  two behind a paid subscription, two in Italian and German the pattern did not
  know, and two labelled "Allow recommended cookies only" and "Accept only
  essential", which the accept pattern matched first and swallowed.
- The Guardian, the site this project started from, came back empty three times.
  Its dialog is in an iframe, and the probe kept picking the main frame's empty
  panel because it answered first.

Every one of those was found by looking at what the detector actually matched
rather than at how many things it matched.

## The guards

```bash
node qa/attack.mjs         # 424 checks
node qa/audit-claims.mjs   # 463 claims re-derived
```

`attack.mjs` fires at the thing the site must not do: an intent word in a
caption, a ranking word, an exhibit naming a company it is not about, a pin
outside its image, an exhibit without its capture, a form element, a hard-coded
hero total. All seven classes were injected and all seven were caught.

`audit-claims.mjs` reads `prep/facts-*.json` — written by the capture script at
photograph time — and **re-derives** each claim from the stored controls rather
than trusting the capture's own verdict. That is what caught the last five
disagreements, including a J.Crew exhibit still claiming a small-print size
difference when the disclosure had measured 16px against a 15px button.

## Verified by eye as well

Scripts cannot tell you that a picture shows the thing its caption is about.
Every exhibit was cropped to the region its claim concerns and looked at. That
pass changed twelve of them and is the reason the wall is shorter than the
detectors wanted it to be.

## No database, no model, no form

`/` is static and each exhibit prerenders at build time, so `pnpm build` prints
`○` for the home page and `●` for `/e/[slug]`. There is no Postgres, no model
call and no submission form — a wall anyone can add to needs somebody checking
every entry against the live page, and an unchecked accusation about a named
company is the thing this page exists to avoid.

Dependencies: `next`, `react`, `react-dom`, `@vercel/analytics`. Nothing else.

## Running it

```bash
pnpm install
pnpm dev            # localhost:3026
pnpm check          # typecheck + attack + audit
NEXT_DIST_DIR=.next-build pnpm build   # never writes .next, so dev survives
```

## What it does not cover

Consent dialogs vary by country and change often. These are what one Chromium
profile saw from Switzerland on 11 September 2026, in en-GB, each in a clean
browser profile. Every exhibit says so and links to the live page.
