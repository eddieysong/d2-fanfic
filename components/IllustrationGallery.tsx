"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Illustration } from "../lib/library-types";

export type GalleryItem = Illustration & {
  entrySlug?: string;
  entryTitle: string;
  entryEyebrow: string;
  collectionId: string;
  animationSrc?: string;
};

const filters = [
  { id: "all", label: "All illustrations" },
  { id: "core", label: "Core journey" },
  { id: "aftermath", label: "Aftermath" },
  { id: "grail", label: "The Fourth Discipline" },
  { id: "zephira", label: "Knots of Her Own" },
  { id: "cruelty", label: "Black Rose" },
  { id: "archives", label: "Archives" },
  { id: "fanservice", label: "Fan service" },
  { id: "animated", label: "Animated" },
] as const;

export function IllustrationGallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);

  const visibleItems = useMemo(
    () => {
      if (filter === "all") return items;
      if (filter === "animated") return items.filter((item) => item.animationSrc);
      return items.filter((item) => item.collectionId === filter);
    },
    [filter, items],
  );
  const selectedIndex = visibleItems.findIndex((item) => item.src === selectedSrc);
  const selected = selectedIndex >= 0 ? visibleItems[selectedIndex] : null;

  function moveSelection(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    const next = (selectedIndex + direction + visibleItems.length) % visibleItems.length;
    setSelectedSrc(visibleItems[next].src);
    setIsPlayingAnimation(false);
  }

  function closeLightbox() {
    setSelectedSrc(null);
    setIsPlayingAnimation(false);
  }

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
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
        <h1>Scenes from<br /><em>Sanctuary</em></h1>
        <p>
          A growing visual archive of Cordelia’s journey, its strange aftermath, and a few
          decidedly non-canonical moments created simply because they deserved to exist.
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
                closeLightbox();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, index) => (
            <article className="gallery-card" data-gallery-item key={item.src}>
              <div className="gallery-card-media">
                <button className="gallery-image-button" type="button" onClick={() => { setSelectedSrc(item.src); setIsPlayingAnimation(false); }} aria-label={`View ${item.caption}`}>
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
                {item.animationSrc ? (
                  <button
                    className="gallery-animation-button"
                    data-animated-scene
                    type="button"
                    onClick={() => { setSelectedSrc(item.src); setIsPlayingAnimation(true); }}
                    aria-label={`Play animated scene: ${item.caption}`}
                  >
                    <span aria-hidden="true">▶</span> Play scene
                  </button>
                ) : null}
              </div>
              <div className="gallery-card-copy">
                <p>{item.entryEyebrow}</p>
                <h3>{item.caption}</h3>
                {item.entrySlug ? (
                  <Link href={`/read/${item.entrySlug}`}>{item.entryTitle} <span aria-hidden="true">→</span></Link>
                ) : (
                  <span className="gallery-card-note">{item.entryTitle}</span>
                )}
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
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.caption} onClick={closeLightbox}>
          <button className="lightbox-close" type="button" onClick={closeLightbox} aria-label="Close illustration">Close</button>
          <button className="lightbox-arrow previous" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(-1); }} aria-label="Previous illustration">←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            {isPlayingAnimation && selected.animationSrc ? (
              <video
                src={selected.animationSrc}
                poster={selected.src}
                controls
                autoPlay
                loop
                playsInline
                preload="metadata"
                aria-label={`Animated scene: ${selected.caption}`}
              />
            ) : (
              <Image src={selected.src} alt={selected.alt} width={1152} height={1728} sizes="100vw" priority unoptimized />
            )}
            <figcaption>
              <p>{selected.entryEyebrow}</p>
              <strong>{selected.caption}</strong>
              {selected.animationSrc ? (
                <button
                  className="lightbox-media-toggle"
                  type="button"
                  onClick={() => setIsPlayingAnimation((current) => !current)}
                >
                  {isPlayingAnimation ? "View still illustration" : "▶ Play animated scene"}
                </button>
              ) : null}
              {selected.entrySlug ? (
                <Link href={`/read/${selected.entrySlug}`}>Read {selected.entryTitle} <span aria-hidden="true">→</span></Link>
              ) : (
                <span className="gallery-card-note">{selected.entryTitle}</span>
              )}
            </figcaption>
          </figure>
          <button className="lightbox-arrow next" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(1); }} aria-label="Next illustration">→</button>
        </div>
      ) : null}
    </main>
  );
}
