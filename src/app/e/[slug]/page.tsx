import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CAPTURED, EXHIBITS } from "@/data/exhibits";

/* Every exhibit is its own page. That is what keeps the wall a wall instead of
   turning into one more long scroll, and it gives each finding a URL somebody
   can send to the company it names.
 *
 * `generateStaticParams` returns all of them, so every one of these prerenders
 * at build time and shows as ○ in the route table. Day 2 shipped a dynamic
 * segment with `revalidate` and no params, and every shared link was `ƒ` and
 * `no-store` for a whole day. Read the route table on every build. */

export const dynamicParams = false;

export function generateStaticParams() {
  return EXHIBITS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = EXHIBITS.find((x) => x.slug === slug);
  if (!e) return {};
  const title = `${e.site} — ${e.headline}`;
  return {
    title,
    description: e.standfirst,
    openGraph: { title, description: e.standfirst, images: [e.shot] },
    twitter: { card: "summary_large_image", title, description: e.standfirst, images: [e.shot] },
  };
}

export default async function ExhibitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = EXHIBITS.find((x) => x.slug === slug);
  if (!e) notFound();

  const i = EXHIBITS.indexOf(e);
  const next = EXHIBITS[(i + 1) % EXHIBITS.length];
  const big = e.facts.find((f) => f.heavy) ?? e.facts[0];

  return (
    <main className="pb-20">
      <nav className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-3 font-display text-[11px] uppercase tracking-[.16em] sm:px-8">
        <Link href="/" className="text-lime hover:underline">
          ← the wall
        </Link>
        <span className="text-dim">
          {String(i + 1).padStart(2, "0")} / {EXHIBITS.length}
        </span>
      </nav>

      <header className="px-5 pb-7 pt-9 sm:px-8">
        <p className="font-display text-[11px] font-extrabold uppercase tracking-[.2em] text-lime">
          {e.family}
          <span className="mx-2 text-dim" aria-hidden="true">
            ·
          </span>
          <span className="text-dim">{e.site}</span>
        </p>
        <h1 className="mt-3 max-w-[22ch] font-display text-[clamp(30px,6.6vw,66px)] font-normal uppercase leading-[1.2] text-ink">
          {big.value}
        </h1>
        <p className="mt-4 max-w-[54ch] text-[17px] leading-snug text-ink">{e.headline}</p>
        <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-relaxed text-dim">{e.standfirst}</p>
      </header>

      <figure className="border-y border-rule">
        {/* The pins belong to the IMAGE, not the figure. When they were measured
            against the figure they sat a caption's worth too low, and pin one
            landed under the button it was naming. */}
        <div className="relative">
          <img
            src={e.shot}
            alt={`Screen capture of ${e.site}. ${e.headline}`}
            width={1500}
            height={1055}
            className="block w-full"
          />
          {e.pins.map((p) => (
            <span
              key={p.n}
              aria-hidden="true"
              className="absolute z-10 grid h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 place-items-center bg-lime font-display text-[11px] font-extrabold text-page shadow-[0_0_0_3px_rgba(214,255,63,.25)] sm:h-[28px] sm:w-[28px] sm:text-[14px]"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.n}
            </span>
          ))}
        </div>
        <figcaption className="flex flex-wrap gap-x-3 gap-y-1 px-5 py-2.5 font-display text-[10.5px] uppercase tracking-[.1em] text-dim sm:px-8">
          <a
            href={e.url}
            target="_blank"
            rel="noopener nofollow"
            className="text-lime hover:underline"
          >
            {e.site} ↗
          </a>
          <span>{e.stage}</span>
          <span>captured {CAPTURED}</span>
          <span>Chromium 1280×900 · en-GB from Switzerland</span>
        </figcaption>
      </figure>

      {e.pins.length > 0 && (
        <ol className="grid gap-3 px-5 py-8 sm:px-8">
          {e.pins.map((p) => (
            <li key={p.n} className="grid grid-cols-[28px_1fr] items-start gap-3">
              <span className="grid h-[28px] w-[28px] place-items-center bg-lime font-display text-[14px] font-extrabold text-page">
                {p.n}
              </span>
              <p className="max-w-[76ch] text-[15px] leading-relaxed text-body">{p.note}</p>
            </li>
          ))}
        </ol>
      )}

      {/* Counted, not estimated. Every figure came out of the same visit that
          produced the image above it. */}
      <dl className="grid gap-[3px] px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {e.facts.map((f, n) => (
          <div key={`${e.slug}-${n}`} className="bg-card px-4 py-4">
            <dt className="font-display text-[10px] font-extrabold uppercase tracking-[.14em] text-dim">
              {f.label}
            </dt>
            <dd
              className={`mt-1.5 font-display text-[22px] font-normal uppercase leading-[1.25] ${
                f.heavy ? "text-lime" : "text-ink"
              }`}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {e.quote && (
        <blockquote className="mx-5 mt-8 border-l-4 border-lime pl-4 text-[14px] italic leading-relaxed text-body sm:mx-8">
          {e.quote}
          <footer className="mt-2 font-display text-[10px] not-italic uppercase tracking-[.14em] text-dim">
            the dialog&rsquo;s own words
          </footer>
        </blockquote>
      )}

      {/* What this exhibit does NOT claim. Not a disclaimer bolted on the end:
          several of these sites do the awkward thing in one place and a fair
          thing right beside it, and leaving that out would make the wall more
          damning than the evidence supports. */}
      <section className="mt-9 px-5 sm:px-8">
        <h2 className="font-display text-[10px] font-extrabold uppercase tracking-[.18em] text-dim">
          Not claimed
        </h2>
        <p className="mt-2 max-w-[80ch] text-[14px] leading-relaxed text-dim">{e.limit}</p>
      </section>

      <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-rule px-5 pt-6 sm:px-8">
        <Link href="/" className="font-display text-[11px] uppercase tracking-[.16em] text-dim hover:text-ink">
          ← all {EXHIBITS.length} exhibits
        </Link>
        <Link
          href={`/e/${next.slug}`}
          className="font-display text-[11px] uppercase tracking-[.16em] text-lime hover:underline"
        >
          {next.site} · {next.family} →
        </Link>
      </nav>
    </main>
  );
}
