import type { Exhibit as Row } from "@/data/exhibits";

/** Direction B: the capture, numbered pins dropped on the elements, the notes
 *  underneath. The pin does the pointing so the prose does not have to say
 *  "the button on the right, below the paragraph".
 *
 *  Pin coordinates are percentages written by prep/capture.mjs from each
 *  element's own bounding box, so they scale with the image at every width and
 *  cannot drift away from what they point at. */
export function Exhibit({ e }: { e: Row }) {
  return (
    <article id={e.slug} className="scroll-mt-8 border-t border-rule pt-9">
      <header className="mb-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[.2em] text-dim">
          <span className="text-pin">{e.id}</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          {e.family}
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          {e.host}
        </p>
        <h2 className="mt-2.5 max-w-[26ch] font-display text-[clamp(21px,3vw,27px)] font-bold leading-[1.15] tracking-[-.015em] text-ink text-balance sm:max-w-[34ch]">
          {e.headline}
        </h2>
        <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-relaxed text-dim">{e.standfirst}</p>
      </header>

      <figure className="overflow-hidden rounded-lg border border-rule bg-panel">
        {/* The pins belong to the IMAGE, not to the figure. When this wrapper
            was not here the percentages were measured against the figure, which
            also contains the caption below — so every pin sat a caption's worth
            too low and pin 1 landed under the button it was naming. */}
        <div className="relative">
          <img
            src={e.shot}
            alt={`Screen capture of ${e.host}. ${e.headline}`}
            width={1600}
            height={1125}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          {e.pins.map((p) => (
            <span
              key={p.n}
              aria-hidden="true"
              className="absolute z-10 grid h-[21px] w-[21px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pin font-mono text-[11px] font-semibold text-pin-ink shadow-[0_0_0_3px_rgba(255,77,136,.22),0_2px_8px_rgba(0,0,0,.5)] sm:h-[26px] sm:w-[26px] sm:text-[13px] sm:shadow-[0_0_0_4px_rgba(255,77,136,.22),0_2px_8px_rgba(0,0,0,.5)]"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.n}
            </span>
          ))}
        </div>
        <figcaption className="border-t border-rule bg-panel px-3.5 py-2.5 font-mono text-[10.5px] text-dim">
          <a
            href={e.url}
            target="_blank"
            rel="noopener nofollow"
            className="underline decoration-dotted underline-offset-[3px] hover:text-ink"
          >
            {e.host}
          </a>{" "}
          · captured 11 Sep 2026 · Chromium 1280×900 · en-GB{" "}
          <a
            href={e.shot}
            target="_blank"
            rel="noopener"
            className="underline decoration-dotted underline-offset-[3px] hover:text-ink"
          >
            open full size
          </a>
        </figcaption>
      </figure>

      <ol className="mt-5 grid gap-3">
        {e.pins.map((p) => (
          <li key={p.n} className="grid grid-cols-[26px_1fr] items-start gap-3">
            <span className="mt-[1px] grid h-[26px] w-[26px] place-items-center rounded-full bg-pin font-mono text-[13px] font-semibold text-pin-ink">
              {p.n}
            </span>
            <p className="max-w-[72ch] text-[14.5px] leading-relaxed text-body">{p.note}</p>
          </li>
        ))}
      </ol>

      {/* Counted, not estimated. Every one of these comes out of the same visit
          that produced the image above it. */}
      <dl className="mt-5 overflow-hidden rounded-lg border border-rule">
        {e.facts.map((f, i) => (
          <div
            key={`${e.id}-${i}`}
            /* `shrink-0` on the value plus `overflow-hidden` on the card meant
               "Accept all · Reject all and subscribe" was silently cut off at
               375px. The row wraps now, and the value keeps its right edge. */
            className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-raised px-3.5 py-2.5 ${
              i ? "border-t border-rule" : ""
            }`}
          >
            <dt className="text-[13.5px] text-dim">{f.label}</dt>
            <dd
              className={`ml-auto text-right font-mono text-[13.5px] tabular-nums ${
                f.heavy ? "font-semibold text-pin" : "text-ink"
              }`}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* What this exhibit does NOT claim. It is not a disclaimer bolted on the
          end — several of these sites do the awkward thing in one place and a
          fair thing right next to it, and leaving that out would make the wall
          more damning than the evidence supports. */}
      <p className="mt-4 max-w-[74ch] border-l-2 border-rule pl-3.5 text-[13px] leading-relaxed text-dim">
        <span className="font-mono text-[10px] uppercase tracking-[.16em] text-dim">
          Not claimed —{" "}
        </span>
        {e.limit}
      </p>
    </article>
  );
}
