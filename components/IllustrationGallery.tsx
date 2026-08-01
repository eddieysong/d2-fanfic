"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Illustration } from "../lib/library-types";

export type GalleryItem = Illustration & {
  entrySlug: string;
  entryTitle: string;
  entryEyebrow: string;
  collectionId: string;
};

const filters = [
  { id: "all", label: "All illustrations" },
  { id: "core", label: "Core journey" },
  { id: "aftermath", label: "Aftermath" },
  { id: "archives", label: "Archives" },
] as const;

export function IllustrationGallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

  const visibleItems = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.collectionId === filter)),
    [filter, items],
  );
  const selectedIndex = visibleItems.findIndex((item) => item.src === selectedSrc);
  const selected = selectedIndex >= 0 ? visibleItems[selectedIndex] : null;

  function moveSelection(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    const next = (selectedIndex + direction + visibleItems.length) % visibleItems.length;
    setSelectedSrc(visibleItems[next].src);
  }

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSrc(null);
      if (event.key === "ArrowLeft") moveSelection(-1);
      if (event.key === "ArrowRight") moveSelection(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Return to the reading archive">
          <span className="sigil" aria-hidden="true">✦</span>
          <span>Cordelia</span>
        </Link>
        <nav aria-label="Gallery navigation">
          <Link href="/">Reading index</Link>
          <a href="#illustrations">Illustrations</a>
        </nav>
      </header>

      <section className="gallery-hero">
        <p className="kicker">The visual archive</p>
        <h1>Scenes from<br /><em>the journey</em></h1>
        <p>
          Forty-six glimpses of Cordelia’s path through Sanctuary—from her first steps beyond the
          Rogue Encampment to the artifacts and legends that followed the Worldstone.
        </p>
      </section>

      <section className="content-notice" aria-label="Content notice">
        <span>18+</span>
        <p><strong>Adult artwork.</strong> Fantasy peril, revealing attire, bondage imagery, and mature themes.</p>
      </section>

      <section className="gallery-shell" id="illustrations" aria-labelledby="gallery-title">
        <div className="gallery-intro">
          <div>
            <p className="kicker">Chronological collection</p>
            <h2 id="gallery-title">All illustrations</h2>
          </div>
          <p><strong>{visibleItems.length}</strong> of {items.length} images</p>
        </div>

        <div className="gallery-filters" role="group" aria-label="Filter illustrations">
          {filters.map((option) => (
            <button
              type="button"
              key={option.id}
              aria-pressed={filter === option.id}
              onClick={() => {
                setFilter(option.id);
                setSelectedSrc(null);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, index) => (
            <article className="gallery-card" data-gallery-item key={item.src}>
              <button type="button" onClick={() => setSelectedSrc(item.src)} aria-label={`View ${item.caption}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1152}
                  height={1728}
                  sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw"
                  loading={index < 4 ? "eager" : "lazy"}
                  unoptimized
                />
                <span className="gallery-card-number">{String(index + 1).padStart(2, "0")}</span>
              </button>
              <div className="gallery-card-copy">
                <p>{item.entryEyebrow}</p>
                <h3>{item.caption}</h3>
                <Link href={`/read/${item.entrySlug}`}>{item.entryTitle} <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span className="sigil" aria-hidden="true">✦</span>
        <p>An unofficial, transformative fan work. Diablo and its characters belong to Blizzard Entertainment.</p>
      </footer>

      {selected ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.caption} onClick={() => setSelectedSrc(null)}>
          <button className="lightbox-close" type="button" onClick={() => setSelectedSrc(null)} aria-label="Close illustration">Close</button>
          <button className="lightbox-arrow previous" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(-1); }} aria-label="Previous illustration">←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <Image src={selected.src} alt={selected.alt} width={1152} height={1728} sizes="100vw" priority unoptimized />
            <figcaption>
              <p>{selected.entryEyebrow}</p>
              <strong>{selected.caption}</strong>
              <Link href={`/read/${selected.entrySlug}`}>Read {selected.entryTitle} <span aria-hidden="true">→</span></Link>
            </figcaption>
          </figure>
          <button className="lightbox-arrow next" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(1); }} aria-label="Next illustration">→</button>
        </div>
      ) : null}
    </main>
  );
}
