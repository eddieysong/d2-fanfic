"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LibraryEntry } from "../lib/library-types";
import { MarkdownProse } from "./MarkdownProse";

const sizes = ["compact", "comfortable", "generous"] as const;
type ReaderSize = (typeof sizes)[number];

export function Reader({
  entry,
  previous,
  next,
}: {
  entry: LibraryEntry;
  previous: LibraryEntry | null;
  next: LibraryEntry | null;
}) {
  const [theme, setTheme] = useState<"night" | "paper">("night");
  const [size, setSize] = useState<ReaderSize>("comfortable");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("cordelia-theme");
    const storedSize = window.localStorage.getItem("cordelia-size");
    const frame = window.requestAnimationFrame(() => {
      if (storedTheme === "paper" || storedTheme === "night") setTheme(storedTheme);
      if (sizes.includes(storedSize as ReaderSize)) setSize(storedSize as ReaderSize);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.readerSize = size;
    window.localStorage.setItem("cordelia-theme", theme);
    window.localStorage.setItem("cordelia-size", size);
  }, [theme, size]);

  useEffect(() => {
    window.localStorage.setItem(
      "cordelia-last-read",
      JSON.stringify({ slug: entry.slug, title: entry.title, updatedAt: Date.now() }),
    );

    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const current = available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 100;
      setProgress(current);
      const all = JSON.parse(window.localStorage.getItem("cordelia-progress") || "{}");
      all[entry.slug] = Math.round(current);
      window.localStorage.setItem("cordelia-progress", JSON.stringify(all));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entry.slug, entry.title]);

  function changeSize(direction: -1 | 1) {
    const current = sizes.indexOf(size);
    setSize(sizes[Math.max(0, Math.min(sizes.length - 1, current + direction))]);
  }

  return (
    <main className="reader-page">
      <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <header className="reader-header">
        <Link className="reader-index" href="/">← Index</Link>
        <div className="reader-tools" aria-label="Reading controls">
          <button onClick={() => changeSize(-1)} disabled={size === sizes[0]} aria-label="Decrease text size">A−</button>
          <button onClick={() => changeSize(1)} disabled={size === sizes[sizes.length - 1]} aria-label="Increase text size">A+</button>
          <button onClick={() => setTheme(theme === "night" ? "paper" : "night")} aria-label="Toggle reading theme">
            {theme === "night" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <article className="reader-article">
        <header className="story-heading">
          <p className="kicker">{entry.eyebrow}</p>
          <h1>{entry.title}</h1>
          <div className="story-meta"><span>{entry.wordCount.toLocaleString()} words</span><span>{entry.readingMinutes} min read</span></div>
        </header>
        <MarkdownProse markdown={entry.content} illustrations={entry.illustrations} />
      </article>

      <nav className="reader-pagination" aria-label="Chronological reading navigation">
        {previous ? (
          <Link href={`/read/${previous.slug}`} className="previous">
            <small>Previous</small><strong>{previous.shortTitle}</strong>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/read/${next.slug}`} className="next">
            <small>Next</small><strong>{next.shortTitle}</strong>
          </Link>
        ) : <Link href="/" className="next"><small>End of archive</small><strong>Return to the index</strong></Link>}
      </nav>

      <footer className="reader-footer"><Link href="/">Cordelia and the Beneficent Misfortune</Link></footer>
    </main>
  );
}
