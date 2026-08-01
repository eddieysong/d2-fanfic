import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "../../../components/Reader";
import { findEntry, getNeighbors, library } from "../../../lib/library";

export function generateStaticParams() {
  return library.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return {};
  return {
    title: entry.shortTitle,
    description: entry.description,
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();
  const { previous, next } = getNeighbors(slug);
  return <Reader entry={entry} previous={previous} next={next} />;
}
