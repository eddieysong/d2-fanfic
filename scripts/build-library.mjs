import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const contentRoot = path.join(root, "content");
const outputRoot = path.join(root, "lib");

const collections = [
  {
    id: "core",
    label: "The Core Journey",
    kicker: "Acts I–V",
    description:
      "Cordelia’s complete journey from the Rogue Encampment to the Worldstone, arranged one quest per chapter.",
  },
  {
    id: "aftermath",
    label: "After the Worldstone",
    kicker: "Side adventures",
    description:
      "With Sanctuary safe, Cordelia explores the voluntary magic left behind—and discovers Edran Vohl’s stranger work.",
  },
  {
    id: "archives",
    label: "The Beneficent Archives",
    kicker: "Fifteen to twenty years later",
    description:
      "Later scholars and Rogues uncover the private records, inventions, and persistent legend of Cordelia’s adventures.",
  },
];

function countWords(text) {
  return (text.match(/\b[\p{L}\p{N}’'-]+\b/gu) ?? []).length;
}

function cleanInline(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*|\*|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(markdown) {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .map(cleanInline)
    .find((value) => value.length > 70);
  if (!paragraph) return "Continue reading the Cordelia archive.";
  return paragraph.length > 180 ? `${paragraph.slice(0, 177).trim()}…` : paragraph;
}

function finalize(entry, position) {
  const words = countWords(entry.content);
  return {
    ...entry,
    position,
    wordCount: words,
    readingMinutes: Math.max(1, Math.ceil(words / 235)),
    description: entry.description ?? excerpt(entry.content),
  };
}

async function splitCoreNovel() {
  const source = await readFile(path.join(contentRoot, "cordelia_manuscript.md"), "utf8");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const chapters = [];
  let act = "";
  let current = null;

  function closeCurrent() {
    if (!current) return;
    current.content = current.lines.join("\n").trim();
    delete current.lines;
    chapters.push(current);
  }

  for (const line of lines) {
    const actMatch = line.match(/^## (Act [IVX]+ — .+)$/);
    const chapterMatch = line.match(/^### (Chapter ([A-Za-z-]+) — (.+))$/);
    const epilogueMatch = line.match(/^## (Epilogue — (.+))$/);

    if (actMatch) {
      act = actMatch[1];
      continue;
    }
    if (chapterMatch) {
      closeCurrent();
      const chapterNumber = chapters.length + 1;
      current = {
        slug: `${String(chapterNumber).padStart(2, "0")}-${chapterMatch[3]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
        title: chapterMatch[1],
        shortTitle: chapterMatch[3],
        eyebrow: act,
        collectionId: "core",
        sourceFile: "cordelia_manuscript.md",
        lines: [],
      };
      continue;
    }
    if (epilogueMatch) {
      closeCurrent();
      current = {
        slug: "28-the-holy-grail",
        title: epilogueMatch[1],
        shortTitle: epilogueMatch[2],
        eyebrow: "Epilogue",
        collectionId: "core",
        sourceFile: "cordelia_manuscript.md",
        lines: [],
      };
      continue;
    }
    if (current) current.lines.push(line);
  }

  closeCurrent();
  return chapters;
}

const standalone = [
  {
    file: "cordelia_side_story_personalized_reward.md",
    slug: "29-a-small-personalization",
    collectionId: "aftermath",
    eyebrow: "A private experiment with Anya",
  },
  {
    file: "lost_horadrim_01_the_lost_horadrim.md",
    slug: "30-the-lost-horadrim",
    collectionId: "aftermath",
    eyebrow: "The Lost Horadrim · I",
  },
  {
    file: "lost_horadrim_02_the_rose_sentence.md",
    slug: "31-the-rose-sentence",
    collectionId: "aftermath",
    eyebrow: "The Lost Horadrim · II",
  },
  {
    file: "lost_horadrim_03_the_penitent_coil.md",
    slug: "32-the-penitent-coil",
    collectionId: "aftermath",
    eyebrow: "The Lost Horadrim · III",
  },
  {
    file: "lost_horadrim_04_the_mutable_instrument.md",
    slug: "33-the-mutable-instrument",
    collectionId: "aftermath",
    eyebrow: "The Lost Horadrim · IV",
  },
  {
    file: "lost_horadrim_05_the_whore_maker.md",
    slug: "34-the-whore-maker",
    collectionId: "aftermath",
    eyebrow: "The Lost Horadrim · V",
  },
  {
    file: "cordelia_side_story_intended_effects.md",
    slug: "35-the-intended-effects",
    collectionId: "archives",
    eyebrow: "Fifteen years later · Seris Vale",
  },
  {
    file: "beneficent_archives_01_commission_and_command.md",
    slug: "36-commission-and-command",
    collectionId: "archives",
    eyebrow: "Twenty years later · Mira Thorne",
    title: "The Beneficent Archives — Commission and Command",
  },
];

async function readStandalone(config) {
  const raw = (await readFile(path.join(contentRoot, config.file), "utf8")).replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  const detectedTitle = lines[0].replace(/^#\s+/, "").trim();
  const content = lines.slice(1).join("\n").trim();
  return {
    slug: config.slug,
    title: config.title ?? detectedTitle,
    shortTitle: config.title ?? detectedTitle,
    eyebrow: config.eyebrow,
    collectionId: config.collectionId,
    sourceFile: config.file,
    content,
  };
}

const core = await splitCoreNovel();
const later = await Promise.all(standalone.map(readStandalone));
const entries = [...core, ...later].map(finalize);

await mkdir(outputRoot, { recursive: true });
const generated = `// Generated by scripts/build-library.mjs. Do not edit by hand.\n` +
  `import type { Collection, LibraryEntry } from "./library-types";\n\n` +
  `export const collections: Collection[] = ${JSON.stringify(collections, null, 2)};\n\n` +
  `export const library: LibraryEntry[] = ${JSON.stringify(entries, null, 2)};\n`;

await writeFile(path.join(outputRoot, "library.generated.ts"), generated);
console.log(`Built ${entries.length} chronological entries from ${standalone.length + 1} source files.`);
