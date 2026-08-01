import type { Metadata } from "next";
import { IllustrationGallery, type GalleryItem } from "../../components/IllustrationGallery";
import { library } from "../../lib/library";

export const metadata: Metadata = {
  title: "Illustration Gallery",
  description: "The complete chronological illustration gallery for Cordelia and the Beneficent Misfortune.",
};

const items: GalleryItem[] = library.flatMap((entry) =>
  entry.illustrations.map((illustration) => ({
    ...illustration,
    entrySlug: entry.slug,
    entryTitle: entry.title,
    entryEyebrow: entry.eyebrow,
    collectionId: entry.collectionId,
  })),
);

export default function GalleryPage() {
  return <IllustrationGallery items={items} />;
}
