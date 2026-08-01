import { collections, library } from "./library.generated";

export { collections, library };

export function findEntry(slug: string) {
  return library.find((entry) => entry.slug === slug);
}

export function getNeighbors(slug: string) {
  const index = library.findIndex((entry) => entry.slug === slug);
  return {
    previous: index > 0 ? library[index - 1] : null,
    next: index >= 0 && index < library.length - 1 ? library[index + 1] : null,
  };
}

export const totalWords = library.reduce((sum, entry) => sum + entry.wordCount, 0);
