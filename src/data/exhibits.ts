/** The six exhibits.
 *
 *  Every `note` and every `fact` on this page describes something visible in
 *  the image beside it, or a number counted on the live page in the same visit
 *  that produced the image. Nothing here says what anyone intended, because
 *  nobody outside those companies knows that, and a wall that guesses at motive
 *  is a wall that can be wrong about a named business.
 *
 *  `pin.x` / `pin.y` are percentages of the capture, written by
 *  `prep/capture.mjs` from each element's own bounding box. They are not placed
 *  by hand and they cannot drift away from the thing they point at.
 *
 *  They are the element's TOP-LEFT CORNER, not its centre. A pin on the centre
 *  of "Reject all and subscribe" covers the words "Reject all" — and on this
 *  page the button's own label is the evidence, so the pin has to sit beside
 *  the thing rather than on top of it.
 *
 *  Captures: 11 September 2026, Chromium 1280x900, locale en-GB, from
 *  Switzerland. A different country or a returning visitor may see something
 *  else — consent dialogs vary by region, and several of these appear only on a
 *  first visit. */

export type Pin = { n: number; x: number; y: number; note: string };

export type Exhibit = {
  id: string;
  slug: string;
  /** the pattern family, not a verdict */
  family: string;
  company: string;
  host: string;
  url: string;
  shot: string;
  /** what the capture shows, as a phrase — never "they are trying to…" */
  headline: string;
  /** one sentence of orientation before the pins */
  standfirst: string;
  pins: Pin[];
  /** counted, not estimated */
  facts: { label: string; value: string; heavy?: boolean }[];
  /** the thing this exhibit does NOT claim */
  limit: string;
};

export const CAPTURED = "2026-09-11";

export const EXHIBITS: Exhibit[] = [
  {
    id: "01",
    slug: "declining-costs-money",
    family: "Consent or pay",
    company: "The Guardian",
    host: "theguardian.com",
    url: "https://www.theguardian.com/international",
    shot: "/shots/01-guardian-consent-or-pay.webp",
    headline: "Accepting is free. The only decline on offer costs €5 a month.",
    standfirst:
      "Two controls, the same size, side by side. One of them bills you.",
    pins: [
      {
        n: 1,
        x: 28.75,
        y: 71.61,
        note: "“Accept all” is filled and sits first in the row. Pressing it costs nothing and closes the dialog.",
      },
      {
        n: 2,
        x: 50.47,
        y: 71.61,
        note: "“Reject all and subscribe” is the same width and the same height. It leads to Guardian Ad-Lite at €5 per month. No unpaid decline appears at this step.",
      },
      {
        n: 3,
        x: 40.47,
        y: 47.21,
        note: "The dialog says the work is done with a cross section of 139 partners. The list of them is behind that link.",
      },
    ],
    facts: [
      { label: "Cost to accept", value: "nothing" },
      { label: "Cost to decline, as offered here", value: "€5 a month", heavy: true },
      { label: "Partners named", value: "139" },
      { label: "Controls at this step", value: "Accept all · Reject all and subscribe" },
    ],
    limit:
      "The small print points to a “Privacy settings” link at the foot of any page. This exhibit is about the first screen only, and says nothing about what that later route offers.",
  },
  {
    id: "02",
    slug: "scarcity-everywhere",
    family: "Scarcity",
    company: "Booking.com",
    host: "booking.com",
    url: "https://www.booking.com/searchresults.html?ss=Paris",
    shot: "/shots/02-booking-scarcity.webp",
    headline: "Thirteen of the twenty-five results were nearly gone at once.",
    standfirst:
      "A search for two nights in Paris. The urgency lines were counted on the page in the same visit.",
    pins: [
      {
        n: 1,
        x: 33.17,
        y: 5.11,
        note: "“75% of places to stay are unavailable for your dates on our site.” The last four words are part of the sentence.",
      },
      {
        n: 2,
        x: 51.29,
        y: 67.11,
        note: "“We have 7 left at this price.” The claim is attached to the price, not to the room.",
      },
    ],
    facts: [
      { label: "Results on the page", value: "25" },
      { label: "Carrying a “left at this price” line", value: "13", heavy: true },
      { label: "Share of the page", value: "52%" },
      { label: "Wording seen", value: "“We have 2 / 3 / 6 / 7 left at this price”" },
    ],
    limit:
      "Counts like this move between searches. An earlier run of the same query returned 22 of 25. The figure above belongs to this capture and nothing else.",
  },
  {
    id: "03",
    slug: "no-way-to-say-no",
    family: "Obstruction",
    company: "Superdry",
    host: "superdry.com",
    url: "https://www.superdry.com/",
    shot: "/shots/03-superdry-no-reject.webp",
    headline: "Nothing on the first screen declines.",
    standfirst:
      "Two controls appear. One accepts everything. The other opens a second screen.",
    pins: [
      {
        n: 1,
        x: 50.55,
        y: 24.3,
        note: "“Accept All Cookies” — filled black, 11.4px. One press and the banner is gone.",
      },
      {
        n: 2,
        x: 39.11,
        y: 24.3,
        note: "“Manage Cookies” — outlined, the same 11.4px. It is the only other control, and it opens a panel rather than making a choice.",
      },
    ],
    facts: [
      { label: "Presses to accept everything", value: "1" },
      { label: "Presses to reject everything", value: "2", heavy: true },
      { label: "Decline control on the first screen", value: "none" },
      { label: "Categories switched on in the panel", value: "0 of 4" },
    ],
    limit:
      "The second screen is fair: it carries a “Reject All” and every optional category starts switched off. The observation is about which screen the decline lives on, not about what it does when you reach it.",
  },
  {
    id: "04",
    slug: "ticked-on-arrival",
    family: "Preselection",
    company: "Holland & Barrett",
    host: "hollandandbarrett.com",
    url: "https://www.hollandandbarrett.com/",
    shot: "/shots/04-hollandbarrett-preticked.webp",
    headline: "The marketing box is ticked before you type anything.",
    standfirst:
      "The sign-up form near the foot of the home page, photographed on arrival. No field has been touched.",
    pins: [
      {
        n: 1,
        x: 35.31,
        y: 46.25,
        note: "The consent box is already ticked when the page finishes loading. Its label reads “Get exclusive offers, the latest health tips and simple, science-led wisdom.”",
      },
      {
        n: 2,
        x: 84.14,
        y: 36.47,
        note: "“Sign up”. The three fields beside it are empty — the tick was there first.",
      },
    ],
    facts: [
      { label: "State on load", value: "ticked", heavy: true },
      { label: "Fields filled in when photographed", value: "none" },
      { label: "Marked required", value: "no" },
      { label: "Presses to untick", value: "1" },
    ],
    limit:
      "Unticking the box is one press and the form still submits, so this is a starting position rather than a trap. The cookie banner on the same site offers a plain “Required cookies only” and is not part of this exhibit.",
  },
  {
    id: "05",
    slug: "a-second-switch",
    family: "Preselection",
    company: "Nasty Gal",
    host: "nastygal.com",
    url: "https://www.nastygal.com/",
    shot: "/shots/05-nastygal-legitimate-interest.webp",
    headline: "A second column of switches, already on.",
    standfirst:
      "Inside “Customise Consent Preferences”, on the Purposes tab, with the purposes list opened. Nothing was saved.",
    pins: [
      {
        n: 1,
        x: 56.79,
        y: 56.61,
        note: "“Legitimate Interest” — switched on. It belongs to “Use limited data to select advertising”.",
      },
      {
        n: 2,
        x: 70.87,
        y: 48.39,
        note: "“Consent” — switched off, like every other purpose in the list. The master switch above the list is off as well.",
      },
    ],
    facts: [
      { label: "Legitimate-interest switches in the panel", value: "373" },
      { label: "…on when the panel opened", value: "all 373", heavy: true },
      { label: "Consent switches in the panel", value: "1,668" },
      { label: "…on when the panel opened", value: "0" },
    ],
    limit:
      "The banner in front of this panel offers “REJECT ALL” and “ACCEPT ALL” as equals, and the panel itself explains in its own words that some vendors rely on legitimate interest. What the capture shows is the state those switches were in before anybody touched them.",
  },
  {
    id: "06",
    slug: "the-button-says-shopping",
    family: "Bundled consent",
    company: "J.Crew",
    host: "jcrew.com",
    url: "https://www.jcrew.com/",
    shot: "/shots/06-jcrew-bundled-consent.webp",
    headline: "The button says “Start shopping”. The line under it says what that agrees to.",
    standfirst:
      "The dialog a first-time visitor from outside the United States meets before the shop.",
    pins: [
      {
        n: 1,
        x: 40.23,
        y: 54.59,
        note: "“START SHOPPING” — 15px, the only filled control. The label names no agreement.",
      },
      {
        n: 2,
        x: 30.47,
        y: 73.92,
        note: "10px: pressing that button agrees to the Terms of Use, the Privacy Policy, the use of cookies, and the transfer of your personal information to the United States, “a jurisdiction that may not provide an equivalent level of data protection”.",
      },
      {
        n: 3,
        x: 40.23,
        y: 62.47,
        note: "“Take me to the U.S. site.” — the other labelled control, and the only other visible way out.",
      },
    ],
    facts: [
      { label: "Button label", value: "START SHOPPING" },
      { label: "Does the label mention an agreement", value: "no", heavy: true },
      { label: "Button type size", value: "15px" },
      { label: "Disclosure type size", value: "10px" },
    ],
    limit:
      "A control named “Close Dialog” does exist. It is the full-page backdrop behind the dialog — 1280 by 900, empty, black at 60% — so a screen reader announces a way out that nothing on screen marks. The disclosure itself is black on white and perfectly legible at 21:1. Its size is the observation, not its contrast.",
  },
];

/** Words that assert a state of mind. A caption that reaches for one of these
 *  has stopped describing and started guessing, and `qa/attack.mjs` fails the
 *  build rather than letting it ship. */
export const BANNED_INTENT = [
  "trick", "tricks", "tricking", "deceive", "deceptive", "deceive", "dupe", "duped",
  "manipulate", "manipulative", "manipulation", "sneaky", "shady", "evil", "malicious",
  "designed to", "intended to", "wants you to", "want you to", "hopes you", "on purpose",
  "deliberately", "cynical", "predatory", "scam", "con you", "mislead", "misleading",
  "dishonest", "greedy", "exploit", "exploits", "exploitative", "prey on",
];
