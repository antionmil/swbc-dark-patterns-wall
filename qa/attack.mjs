/* The brief's one hard rule is "describe the pattern, never assert intent".
 * A rule that lives only in a markdown file is a rule that gets broken on the
 * evening you are tired, so it is fired at here instead.
 *
 *   node qa/attack.mjs
 *
 * Every check below is an ATTEMPT at the thing the site must not do, and the
 * run fails if the attempt succeeds. Day 1 shipped a rate limiter that
 * compiled, deployed and did nothing; the lesson was to attack the guard
 * rather than read it. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = readFileSync(join(root, "src/data/exhibits.ts"), "utf8");
const page = readFileSync(join(root, "src/app/page.tsx"), "utf8");

let pass = 0;
const fails = [];
const check = (name, ok, detail = "") => {
  if (ok) pass++;
  else fails.push(`${name}${detail ? ` — ${detail}` : ""}`);
};

/* Pull the exhibits out of the TS source without importing TypeScript: every
   string that a reader will actually see, per exhibit. */
const EXHIBITS = [];
for (const block of src.split(/\n  \{\n    id: "/).slice(1)) {
  const id = block.slice(0, 2);
  const grab = (k) => [...block.matchAll(new RegExp(`${k}:\\s*\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"))].map((m) => m[1]);
  EXHIBITS.push({
    id,
    company: grab("company")[0] ?? "",
    host: grab("host")[0] ?? "",
    url: grab("url")[0] ?? "",
    shot: grab("shot")[0] ?? "",
    headline: grab("headline")[0] ?? "",
    standfirst: grab("standfirst")[0] ?? "",
    limit: grab("limit")[0] ?? "",
    notes: grab("note"),
    facts: [...block.matchAll(/label: "((?:[^"\\]|\\.)*)", value: "((?:[^"\\]|\\.)*)"/g)].map((m) => ({
      label: m[1],
      value: m[2],
    })),
    pins: [...block.matchAll(/x:\s*([\d.]+),\s*\n?\s*y:\s*([\d.]+)/g)].map((m) => ({
      x: +m[1],
      y: +m[2],
    })),
  });
}

check("parsed six exhibits", EXHIBITS.length === 6, `got ${EXHIBITS.length}`);

/* --- ATTACK 1: can an intent claim reach a caption? --- */
const BANNED = [
  "trick", "deceive", "dupe", "manipulat", "sneaky", "shady", "evil", "malicious",
  "designed to", "intended to", "wants you to", "want you to", "on purpose",
  "deliberately", "cynical", "predatory", "scam", "mislead", "dishonest",
  "greedy", "exploit", "prey on", "dark pattern", "hopes you",
];
for (const e of EXHIBITS) {
  const prose = [e.headline, e.standfirst, e.limit, ...e.notes].join(" ").toLowerCase();
  const hit = BANNED.find((w) => prose.includes(w));
  check(`${e.id} asserts no intent`, !hit, hit && `found "${hit}"`);
}
/* and the same for the page's own copy, which is where a stray adjective is
   likeliest to land */
{
  const prose = page.replace(/className="[^"]*"/g, " ").toLowerCase();
  const hit = BANNED.filter((w) => prose.includes(w));
  check("page copy asserts no intent", hit.length === 0, hit.join(", "));
}

/* --- ATTACK 2: can a caption name a company the exhibit is not about? --- */
const ALL = EXHIBITS.map((e) => e.company);
for (const e of EXHIBITS) {
  const prose = [e.headline, e.standfirst, ...e.notes].join(" ");
  const stray = ALL.filter((c) => c !== e.company && prose.includes(c));
  check(`${e.id} names only its own subject`, stray.length === 0, stray.join(", "));
}

/* --- ATTACK 3: can a pin point off the image? --- */
for (const e of EXHIBITS) {
  check(`${e.id} has pins`, e.pins.length > 0);
  const bad = e.pins.filter((p) => p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100);
  check(`${e.id} pins land inside the capture`, bad.length === 0, JSON.stringify(bad));
}

/* --- ATTACK 4: can an exhibit ship without its evidence? --- */
for (const e of EXHIBITS) {
  check(`${e.id} has a capture`, /^\/shots\/.+\.webp$/.test(e.shot), e.shot);
  check(`${e.id} links to the live page`, /^https:\/\//.test(e.url), e.url);
  check(`${e.id} links to its own host`, e.url.includes(e.host), `${e.url} vs ${e.host}`);
  check(`${e.id} states what it does not claim`, e.limit.length > 60);
  check(`${e.id} carries counted facts`, e.facts.length >= 3, String(e.facts.length));
  /* A missing capture used to throw ENOENT and take the whole run down with a
     stack trace. A guard that crashes still blocks a deploy, but it reports
     nothing useful about the other five exhibits, so the read is caught and
     turned into an ordinary failure line. */
  let bytes = 0;
  try {
    bytes = readFileSync(join(root, "public/shots", e.shot.split("/").pop())).length;
  } catch (err) {
    bytes = -1;
  }
  check(`${e.id} capture file exists`, bytes > 1000, bytes < 0 ? "file not found" : `${bytes} bytes`);
}

/* --- ATTACK 5: can a superlative sneak in? "the worst", "the most" --- */
const SUPER = ["worst", "most egregious", "hall of shame", "guilty", "offender", "villain"];
for (const e of EXHIBITS) {
  const prose = [e.headline, e.standfirst, e.limit, ...e.notes].join(" ").toLowerCase();
  const hit = SUPER.find((w) => prose.includes(w));
  check(`${e.id} ranks nobody`, !hit, hit);
}

/* --- ATTACK 6: is there a submission form anywhere? The brief forbids one. --- */
const appFiles = [page, readFileSync(join(root, "src/components/Exhibit.tsx"), "utf8")].join("\n");
check("no form element", !/<form\b/i.test(appFiles));
check("no text input", !/<input\b/i.test(appFiles));
check("no server action", !/"use server"/.test(appFiles));

/* --- ATTACK 7: does anything but the pin use the pin colour? --- */
{
  const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
  check("pin colour is a token", css.includes("--color-pin: #ff4d88"));
  /* the page footer link and the focus ring are the two sanctioned exceptions;
     anything else claiming text-pin would compete with the numerals */
  const uses = [...appFiles.matchAll(/text-pin\b/g)].length;
  check("pin colour stays rare", uses <= 6, `${uses} uses`);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log(`  FAIL  ${f}`);
process.exit(fails.length ? 1 : 0);
