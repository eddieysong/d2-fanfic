export type Collection = {
  id: string;
  label: string;
  kicker: string;
  description: string;
};

export type LibraryEntry = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  collectionId: string;
  sourceFile: string;
  content: string;
  position: number;
  wordCount: number;
  readingMinutes: number;
  description: string;
};
