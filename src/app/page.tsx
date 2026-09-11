import { Exhibit } from "@/components/Exhibit";
import { EXHIBITS } from "@/data/exhibits";

/* Static. There is no database, no model, no submission form and nothing
   per-request on this page, so `/` must build as ○ and stay that way. The
   whole site is six images and the sentences that go with them. */

export default function Home() {
  const families = [...new Set(EXHIBITS.map((e) => e.family))];

  return (
    <main className="mx-auto max-w-[880px] px-5 pb-24 pt-14 sm:px-7">
      <header className="border-b-2 border-ink pb-8">
        <p className="font-mono text-[10.5px] uppercase tracking-[.2em] text-dim">
          onedaybuilt · day 09 · captured 11 September 2026
        </p>
        <h1 className="mt-3 max-w-[15ch] font-display text-[clamp(34px,7vw,60px)] font-bold leading-[.98] tracking-[-.03em] text-ink">
          Six small obstructions
        </h1>
        <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-body">
          Six consent dialogs and sign-up forms, photographed on a first visit. The awkward part of
          each one is pinned and counted. Every line under a pin describes something you can see in
          the picture above it.
        </p>
        <p className="mt-3.5 max-w-[64ch] text-[15px] leading-relaxed text-dim">
          Nothing here says what any of these companies meant to do. I have no way to know that, and
          a page that guesses at the motive of a named business is a page that can be wrong about
          one. So the wall describes and counts, and stops there.
        </p>

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {EXHIBITS.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.slug}`}
                className="inline-flex items-baseline gap-1.5 rounded-full border border-rule bg-panel px-3 py-1.5 font-mono text-[11px] text-dim transition-colors hover:border-pin hover:text-ink"
              >
                <span className="text-pin">{e.id}</span>
                {e.company}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-11 grid gap-14">
        {EXHIBITS.map((e) => (
          <Exhibit key={e.id} e={e} />
        ))}
      </div>

      {/* The method belongs on the page, not in a repo nobody opens. If the
          reader cannot check the work, the work is just an assertion with a
          screenshot attached. */}
      <section className="mt-16 border-t-2 border-ink pt-8">
        <h2 className="font-display text-[22px] font-bold tracking-[-.015em] text-ink">
          How these were taken
        </h2>
        <div className="mt-4 grid gap-3.5 text-[14.5px] leading-relaxed text-body sm:grid-cols-2">
          <p>
            A script opened each site in a clean browser profile, waited for the page to settle, and
            photographed the window at 1280×900. A clean profile matters: four of these six appear
            only on a first visit, and a browser that has been to the site before never sees them.
          </p>
          <p>
            The script never pressed Accept, Agree or Subscribe anywhere. The only presses were the
            ones that <em className="not-italic text-ink">open</em> a settings panel, plus a single
            “Required cookies only” on Holland &amp; Barrett, which was the declining choice and the
            only way past a dialog that locks the page.
          </p>
          <p>
            Every number was read off the live page in the same visit that produced the image beside
            it, so a caption and its picture cannot drift apart. Pin positions come from each
            element&rsquo;s own bounding box rather than from my eye.
          </p>
          <p>
            One check went the other way and is worth saying out loud. A countdown on a seventh site
            looked like a per-visit timer, so I loaded it in two clean profiles 125 seconds apart. It
            had fallen by 125 seconds. It was a real deadline, so it is not on this wall.
          </p>
        </div>

        <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
          {[
            ["Exhibits", String(EXHIBITS.length)],
            ["Pattern families", String(families.length)],
            ["Submissions accepted", "none"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-rule bg-raised px-3.5 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[.16em] text-dim">{k}</div>
              <div className="mt-1 font-display text-[24px] font-bold leading-none text-ink">{v}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[74ch] text-[13.5px] leading-relaxed text-dim">
          There is no form on this site and there never will be. A wall that anyone can add to needs
          somebody checking every entry against the live page, and an unchecked accusation about a
          named company is exactly the thing this page is built to avoid. Six is what I could verify
          myself in an evening.
        </p>
        <p className="mt-3 max-w-[74ch] text-[13.5px] leading-relaxed text-dim">
          Consent dialogs vary by country and change often. These are what one browser saw from
          Switzerland on 11 September 2026. If one of them looks different to you, it probably is —
          open the link under the picture and see.
        </p>
      </section>

      <footer className="mt-12 border-t border-rule pt-6 font-mono text-[11px] text-dim">
        Day 9 of 26 ·{" "}
        <a
          className="text-pin underline-offset-[3px] hover:underline"
          href="https://onedaybuilt.com"
        >
          onedaybuilt.com
        </a>{" "}
        · one website a day, built in public
      </footer>
    </main>
  );
}
