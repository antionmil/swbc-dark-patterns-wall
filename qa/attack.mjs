/* The brief's one hard rule is "describe the pattern, never assert intent".
 *
 * At six exhibits I could hold that in my head. At thirty-six the sentences are
 * generated from templates, which is safer but not self-policing: one careless
 * template would put the same wrong word on a dozen pages at once. So every
 * check below is an ATTEMPT at the thing the site must not do, and the run
 * fails if the attempt succeeds.
 *
 * Day 1 shipped a rate limiter that compiled, deployed and did nothing, because
 * nobody fired at it. The lesson was to attack the guard, not read it.
 *
 *   node qa/attack.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BANNED_INTENT, CAPTURED, EXHIBITS, FAMILIES, SITES } from "../src/data/exhibits.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const home = read("src/app/page.tsx");
const detail = read("src/app/e/[slug]/page.tsx");
const css = read("src/app/globals.css");

let pass = 0;
const fails = [];
const check = (name, ok, detail = "") => {
  if (ok) pass++;
  else fails.push(`${name}${detail ? ` — ${detail}` : ""}`);
};

/** every sentence a reader will actually see, for one exhibit */
const prose = (e) =>
  [e.headline, e.standfirst, e.limit, ...e.pins.map((p) => p.note), ...e.facts.map((f) => f.label)]
    .join(" ")
    .toLowerCase();

check("there are exhibits at all", EXHIBITS.length >= 20, String(EXHIBITS.length));

/* ── ATTACK 1: can an intent claim reach a caption? ── */
for (const e of EXHIBITS) {
  const hit = BANNED_INTENT.find((w) => prose(e).includes(w));
  check(`${e.slug} asserts no intent`, !hit, hit && `found "${hit}"`);
}
{
  const copy = (home + detail).replace(/className="[^"]*"/g, " ").toLowerCase();
  /* the page's own copy names the banned list and quotes one example on
     purpose, so exclude the block that does it */
  const hits = BANNED_INTENT.filter((w) => copy.includes(w));
  check("page copy asserts no intent", hits.length === 0, hits.join(", "));
}

/* ── ATTACK 2: can a superlative or a ranking sneak in? ── */
const SUPER = ["worst", "most egregious", "hall of shame", "guilty", "offender", "villain", "the biggest"];
for (const e of EXHIBITS) {
  const hit = SUPER.find((w) => prose(e).includes(w));
  check(`${e.slug} ranks nobody`, !hit, hit);
}

/* ── ATTACK 3: can one exhibit name a company it is not about? ── */
const ALL = SITES.map((s) => s.split(".")[0]).filter((s) => s.length > 4);
for (const e of EXHIBITS) {
  const mine = e.site.split(".")[0];
  const stray = ALL.filter((c) => c !== mine && prose(e).includes(c));
  check(`${e.slug} names only its own subject`, stray.length === 0, stray.join(", "));
}

/* ── ATTACK 4: can a pin point off its image? ── */
for (const e of EXHIBITS) {
  const bad = e.pins.filter((p) => p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100);
  check(`${e.slug} pins land inside the capture`, bad.length === 0, JSON.stringify(bad));
}

/* ── ATTACK 5: can an exhibit ship without its evidence? ── */
for (const e of EXHIBITS) {
  check(`${e.slug} has a capture`, /^\/shots\/.+\.webp$/.test(e.shot), e.shot);
  check(`${e.slug} links to the live page`, /^https:\/\//.test(e.url), e.url);
  check(`${e.slug} links to its own host`, e.url.includes(e.site), `${e.url} vs ${e.site}`);
  check(`${e.slug} states what it does not claim`, e.limit.length > 60, String(e.limit.length));
  check(`${e.slug} carries counted facts`, e.facts.length >= 2, String(e.facts.length));
  let bytes = -1;
  try {
    bytes = readFileSync(join(root, "public", e.shot)).length;
  } catch {
    bytes = -1;
  }
  check(`${e.slug} capture file exists`, bytes > 1000, bytes < 0 ? "file not found" : `${bytes} bytes`);
}

/* ── ATTACK 6: is there a submission form anywhere? The brief forbids one. ── */
check("no form element", !/<form\b/i.test(home + detail));
check("no text input", !/<input\b/i.test(home + detail));
check("no server action", !/"use server"/.test(home + detail));

/* ── ATTACK 7: can a headline figure drift from its own facts? ── */
for (const e of EXHIBITS) {
  const big = e.facts.find((f) => f.heavy) ?? e.facts[0];
  check(`${e.slug} has a headline figure`, !!big?.value, JSON.stringify(big));
}
{
  /* the hero total must be the sum of the exhibits, computed, never typed */
  const summed = EXHIBITS.filter((e) => e.family === "The size of the yes")
    .map((e) => Number(String(e.facts[0].value).replace(/\D/g, "")))
    .reduce((a, b) => a + b, 0);
  check("hero total is computed from the data", home.includes("COMPANIES_NAMED"));
  check("hero total is not hard-coded", !home.includes(summed.toLocaleString("en-GB")), String(summed));
  check("counts come from the data", home.includes("EXHIBITS.length") && home.includes("SITES.length"));
}

/* ── ATTACK 8: does "no decline offered" ever sit beside a decline? ── */
for (const e of EXHIBITS.filter((x) => x.family === "No decline offered")) {
  const row = e.facts.find((f) => /any that decline/i.test(f.label));
  check(`${e.slug} really found zero declines`, row?.value === "0", JSON.stringify(row));
  const others = e.facts.find((f) => /other controls/i.test(f.label))?.value ?? "";
  const looksLikeDecline = /reject|decline|refuse|only essential|only necessary|recommended only|without accepting/i.test(others);
  check(`${e.slug} lists no decline among its other controls`, !looksLikeDecline, others);
}

/* ── ATTACK 9: does the lime stay rare? a pin that shares its colour with the
      body text stops reading as a pin ── */
check("lime is a token", css.includes("--color-lime: #d6ff3f"));
check("no hardcoded hex in the pages", !/#[0-9a-f]{6}/i.test(home + detail.replace(/viewBox[^/]+/g, "")));

/* ── ATTACK 10: is the capture date real and stated? ── */
check("capture date is a date", /^\d{4}-\d{2}-\d{2}$/.test(CAPTURED), CAPTURED);
check("home states the capture date", home.includes("CAPTURED"));
check("every exhibit page states it too", detail.includes("CAPTURED"));
check("families are derived, not typed", FAMILIES.length >= 3 && home.includes("BY_FAMILY"));

console.log(`\n${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log(`  FAIL  ${f}`);
process.exit(fails.length ? 1 : 0);
