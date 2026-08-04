"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Collection, LibraryEntry } from "../lib/library-types";

type LastRead = { slug: string; title: string; updatedAt: number };

export function LibraryHome({
  entries,
  collections,
  totalWords,
}: {
  entries: LibraryEntry[];
  collections: Collection[];
  totalWords: number;
}) {
  const [query, setQuery] = useState("");
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("cordelia-last-read");
    if (!stored) return;
    let frame: number | undefined;
    try {
      const parsed = JSON.parse(stored) as LastRead;
      frame = window.requestAnimationFrame(() => setLastRead(parsed));
    } catch {
      window.localStorage.removeItem("cordelia-last-read");
    }
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries;
    return entries.filter((entry) =>
      `${entry.title} ${entry.eyebrow} ${entry.description}`.toLowerCase().includes(normalized),
    );
  }, [entries, query]);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Return to the top">
          <span className="sigil" aria-hidden="true">✦</span>
          <span>Cordelia</span>
        </a>
        <nav aria-label="Archive sections">
          <a href="#core">Core journey</a>
          <a href="#aftermath">Aftermath</a>
          <a href="#grail">Grail adventures</a>
          <a href="#zephira">Zephira</a>
          <a href="#archives">Archives</a>
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="kicker">A Diablo II alternate-universe archive</p>
        <h1>Cordelia and the<br /><em>Beneficent Misfortune</em></h1>
        <p className="hero-copy">
          A quest-by-quest erotic adventure through Sanctuary, followed by the private experiments,
          peculiar artifacts, and archived legends that survived the Worldstone.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href={`/read/${entries[0].slug}`}>Begin the journey</Link>
          <Link className="button button-secondary" href="/gallery">View the gallery</Link>
          {lastRead && entries.some((entry) => entry.slug === lastRead.slug) ? (
            <Link className="button button-secondary" href={`/read/${lastRead.slug}`}>Continue reading</Link>
          ) : null}
        </div>
        <div className="archive-stats" aria-label="Archive statistics">
          <span><strong>{entries.length}</strong> entries</span>
          <span><strong>{Math.round(totalWords / 1000)}k</strong> words</span>
          <span><strong>5</strong> acts</span>
        </div>
      </section>

      <section className="content-notice" aria-label="Content notice">
        <span>18+</span>
        <p><strong>Explicit adult fiction.</strong> BDSM, consensual power exchange, magical restraint, and graphic sexual content. All sexual participants are adults.</p>
      </section>

      <section className="library-shell" aria-labelledby="library-title">
        <div className="library-intro">
          <div>
            <p className="kicker">Chronological index</p>
            <h2 id="library-title">The complete reading order</h2>
          </div>
          <label className="search-field">
            <span>Find a chapter</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Countess, Kurast, Seris…"
              type="search"
            />
          </label>
        </div>

        {collections.map((collection) => {
          const collectionEntries = filtered.filter((entry) => entry.collectionId === collection.id);
          if (!collectionEntries.length) return null;
          return (
            <section className="collection" id={collection.id} key={collection.id}>
              <div className="collection-heading">
                <p>{collection.kicker}</p>
                <h3>{collection.label}</h3>
                <span>{collection.description}</span>
              </div>
              <ol className="chapter-list">
                {collectionEntries.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/read/${entry.slug}`}>
                      <span className="chapter-number">{String(entry.position + 1).padStart(2, "0")}</span>
                      <span className="chapter-name">
                        <small>{entry.eyebrow}</small>
                        <strong>{entry.shortTitle}</strong>
                      </span>
                      <span className="chapter-time">{entry.readingMinutes} min</span>
                      <span className="chapter-arrow" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        {filtered.length === 0 ? <p className="empty-state">No chapter matches that search.</p> : null}
      </section>

      <footer className="site-footer">
        <span className="sigil" aria-hidden="true">✦</span>
        <p>An unofficial, transformative fan work. Diablo and its characters belong to Blizzard Entertainment.</p>
      </footer>
    </main>
  );
}
