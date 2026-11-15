import Link from "next/link";
import { BY_FAMILY, CAPTURED, COMPANIES_NAMED, EXHIBITS, SITES, SITES_VISITED } from "@/data/exhibits";

/* Static. No database, no model, no submission form, nothing per-request — so
   `/` must build as ○ and stay that way. The exhibits are their own static
   pages, which is what stops this becoming one more long scroll. */

const noDecline = EXHIBITS.filter((e) => e.family === "No decline offered").length;
const payWalls = EXHIBITS.filter((e) => e.family === "Consent or pay").length;

export default function Home() {
  return (
    <main>
      {/* The number is the point. It is summed from the exhibits at build time,
          never typed, so it cannot drift from the evidence underneath it. */}
      <header className="border-b-4 border-lime px-5 pb-9 pt-12 text-center sm:px-8 sm:pt-16">
        <p className="font-display text-[11px] font-extrabold uppercase tracking-[.24em] text-lime">
          What one click agrees to
        </p>
        {/* The number sits in its own block with a line box that CONTAINS its
            glyphs. At leading-[.84] the box was shorter than Anton's ink, so
            the comma's descender hung below it and the word "companies" was
            laid out 33px inside the number — the comma landing on the "i" and
            the "e". Measured, not guessed: the gap between the two boxes was
            -33px and is now positive at every width. */}
        <h1 className="mt-3 font-display font-normal uppercase text-ink">
          <span className="block text-[clamp(58px,15vw,170px)] leading-[1.2] tracking-[-.01em]">
            {COMPANIES_NAMED.toLocaleString("en-GB")}
          </span>
          <span className="mt-1 block text-[clamp(16px,3.4vw,34px)] leading-[1.2] tracking-[.18em] text-lime">
            companies
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-[62ch] text-[15.5px] leading-relaxed text-body">
          That is the total named by the consent dialogs on this wall, added up. Each one asks for a
          single press. {SITES_VISITED} sites were visited, {SITES.length} carried something
          measurable, and {EXHIBITS.length} findings came out of it — {payWalls} where declining
          costs money and {noDecline} where the first screen offers no way to decline at all.
        </p>
        <p className="mx-auto mt-3.5 max-w-[62ch] text-[14px] leading-relaxed text-dim">
          Nothing here says what any of these companies meant to do. Every line is a measurement
          taken off the live page in the same visit that produced the picture beside it. Captured{" "}
          {CAPTURED}.
        </p>
      </header>

      {/* The wall. A grid, not a column — the repetition IS the finding, and you
          are meant to see the scale of it before reading any one of them. */}
      {BY_FAMILY.map(({ family, items }) => (
        <section key={family}>
          <h2 className="sticky top-0 z-10 flex items-baseline justify-between gap-4 border-y border-rule bg-page/95 px-5 py-2.5 font-display text-[12px] font-extrabold uppercase tracking-[.2em] text-lime backdrop-blur sm:px-8">
            {family}
            <span className="text-dim">{items.length}</span>
          </h2>
          <ul className="grid grid-cols-2 gap-[3px] p-[3px] sm:grid-cols-3 lg:grid-cols-4">
            {items.map((e) => {
              const big = e.facts.find((f) => f.heavy) ?? e.facts[0];
              return (
                <li key={e.slug}>
                  <Link
                    href={`/e/${e.slug}`}
                    className="group block bg-card transition-colors hover:bg-rule"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={e.shot}
                        alt={`Screen capture of ${e.site}`}
                        width={1500}
                        height={1055}
                        loading="lazy"
                        decoding="async"
                        /* grey in the grid, colour when you open one: the wall
                           reads as a wall, the evidence reads as evidence */
                        className="block aspect-[16/11] w-full object-cover object-top grayscale transition-[filter] duration-200 group-hover:grayscale-0"
                      />
                      <span className="absolute left-0 top-0 bg-lime px-1.5 py-0.5 font-display text-[10px] font-extrabold tracking-[.1em] text-page">
                        {e.site}
                      </span>
                    </div>
                    <div className="px-2.5 pb-3 pt-2">
                      <b className="block font-display text-[clamp(20px,3.4vw,28px)] font-normal uppercase leading-[1.25] text-lime">
                        {big.value}
                      </b>
                      <span className="mt-1 block text-[11.5px] leading-tight text-dim">
                        {big.label}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {/* The method belongs on the page. If the reader cannot check the work,
          the work is an assertion with a screenshot attached. */}
      <section className="border-t-4 border-lime px-5 py-11 sm:px-8">
        <h2 className="font-display text-[clamp(26px,5vw,44px)] font-normal uppercase leading-[1.2] text-ink">
          How this was counted
        </h2>
        <div className="mt-6 grid max-w-[110ch] gap-4 text-[14.5px] leading-relaxed text-body sm:grid-cols-2">
          <p>
            A script opened {SITES_VISITED} sites in a clean browser profile and measured what it
            found: which controls a consent dialog offers, how they are drawn, how many companies it
            names, which switches are already on. A clean profile matters, because most of these
            dialogs appear only on a first visit.
          </p>
          <p>
            It never pressed Accept, Agree or Subscribe anywhere. The only presses were the ones that{" "}
            <em className="not-italic text-ink">open</em> a settings panel or close a promotional
            overlay with its own close control. Neither grants anything.
          </p>
          <p>
            Every sentence on every exhibit is a template filled with those measurements. No model
            wrote any of it. That is what keeps {EXHIBITS.length} exhibits as honest as six were: a
            template can only say what was measured.
          </p>
          <p>
            The detectors were wrong several times before they were right. An early pass flagged ten
            sites for shaming language and every one was a news headline the pattern had matched
            inside a French or German word. Another read a hotel occupancy selector as a scarcity
            claim on every result.
          </p>
        </div>

        <div className="mt-8 grid gap-[3px] sm:grid-cols-4">
          {[
            ["Sites visited", String(SITES_VISITED)],
            ["Carried a finding", String(SITES.length)],
            ["Exhibits", String(EXHIBITS.length)],
            ["Submissions accepted", "none"],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-4 py-4">
              <div className="font-display text-[10px] font-extrabold uppercase tracking-[.16em] text-dim">
                {k}
              </div>
              <div className="mt-1 font-display text-[30px] font-normal uppercase leading-[1.25] text-lime">
                {v}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 max-w-[78ch] text-[13.5px] leading-relaxed text-dim">
          There is no form on this site and there never will be. A wall anyone can add to needs
          somebody checking every entry against the live page, and an unchecked accusation about a
          named company is the thing this page exists to avoid. Every exhibit here was looked at
          against its own screenshot before it shipped; that pass corrected twelve of them.
        </p>
        <p className="mt-3 max-w-[78ch] text-[13.5px] leading-relaxed text-dim">
          Consent dialogs vary by country and change often. These are what one browser saw from
          Switzerland on {CAPTURED}. If one looks different to you, it probably is — every exhibit
          links to the live page.
        </p>
      </section>

      <footer className="border-t border-rule px-5 py-7 font-display text-[11px] uppercase tracking-[.14em] text-dim sm:px-8">
        Built by{" "}
        <a className="text-lime hover:underline" href="https://onedaybuilt.com">
          Antoine Koerber
        </a>
      </footer>
    </main>
  );
}
