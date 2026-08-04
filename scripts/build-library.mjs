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
    id: "grail",
    label: "The Fourth Discipline",
    kicker: "The Grail adventures",
    description:
      "Cordelia meets the woman behind the Lost Horadrim’s legend, unlocks a new branch of Arcane magic, and makes the Holy Grail hunt considerably less sensible.",
  },
  {
    id: "zephira",
    label: "Knots of Her Own",
    kicker: "Zephira’s adventures",
    description:
      "An independent Amazon discovers magical self-bondage, an inconvenient four-week setting, and the unexpected appeal of being known.",
  },
  {
    id: "archives",
    label: "The Beneficent Archives",
    kicker: "Fifteen to twenty years later",
    description:
      "Later scholars and Rogues uncover the private records, inventions, and persistent legend of Cordelia’s adventures.",
  },
];

const illustrationRoot = "/illustrations";
const art = (file, alt, caption, placement = 0.55) => ({
  src: `${illustrationRoot}/${file}`,
  alt,
  caption,
  placement,
});

const illustrations = {
  "01-a-very-small-cave": [
    art("01_Stage1_Classic_Outfit.jpg", "Cordelia in her original sorceress attire", "Cordelia at the beginning of her journey.", 0.12),
  ],
  "03-the-wrong-order": [
    art("Fight_Stony_Circle_Stage1.jpg", "Cordelia fights Fallen at the Cairn Stones", "The battle at the Cairn Stones.", 0.34),
    art("Capture_Rakanishu_Fallen_Stage1.jpg", "The Fallen capture Cordelia near the Cairn Stones", "Rakanishu's pack closes in.", 0.7),
  ],
  "04-the-countess": [
    art("Fight_Countess_Stage1.jpg", "Cordelia confronts the Countess in the Forgotten Tower", "The confrontation beneath the Forgotten Tower.", 0.32),
    art("Countess_Capture_Stage1.jpg", "The Countess holds Cordelia captive", "The Countess claims the advantage.", 0.7),
  ],
  "05-the-horadric-malus": [
    art("Smith_Fight_Stage1.jpg", "Cordelia battles the Smith in the Monastery Barracks", "The Smith guards the Horadric Malus.", 0.32),
    art("Smith_Capture_Stage1.jpg", "The Smith captures Cordelia in the Monastery Barracks", "A hard reversal in the Barracks.", 0.7),
  ],
  "06-the-maiden-of-anguish": [
    art("Fight_Andariel_Stage1.jpg", "Cordelia faces Andariel beneath the Monastery", "The Maiden of Anguish awaits.", 0.35),
    art("Andariel_Capture_Stage1.jpg", "Andariel captures Cordelia in her throne room", "Andariel turns the encounter to her liking.", 0.67),
    art("Stage2_Outfit_Base.jpg", "Cordelia wearing the second stage of the Beneficent Attire", "The Beneficent Attire, Stage II.", 0.9),
  ],
  "07-radament-s-lair": [art("05_Radament_Stage2.jpg", "Cordelia encounters Radament beneath Lut Gholein", "Radament's lair.")],
  "08-the-horadric-staff": [art("06_Coldworm_Stage2.jpg", "Cordelia confronts Coldworm in the Maggot Lair", "Deep within the Maggot Lair.")],
  "09-the-tainted-sun": [art("07_Fangskin_Stage2.jpg", "Cordelia faces Fangskin in the Claw Viper Temple", "The altar of the Tainted Sun.")],
  "10-the-arcane-sanctuary": [art("08_Palace_Cellar_Stage2.jpg", "Cordelia is surrounded in the Palace Cellar", "Below Jerhyn's palace.")],
  "11-the-summoner": [art("09_Summoner_Stage2.jpg", "Cordelia confronts the Summoner in the Arcane Sanctuary", "At the heart of the Arcane Sanctuary.")],
  "12-the-seven-tombs": [
    art("10_Duriel_Stage2.jpg", "Cordelia faces Duriel in Tal Rasha's Tomb", "Duriel's chamber.", 0.62),
    art("Stage3_Outfit_Base.jpg", "Cordelia wearing the third stage of the Beneficent Attire", "The Beneficent Attire, Stage III.", 0.9),
  ],
  "13-the-golden-bird": [art("11_Golden_Bird_Stage3.jpg", "Cordelia is captured while seeking the Golden Bird", "The search for the Golden Bird.")],
  "14-the-gidbinn": [art("12_Gidbinn_Stage3.jpg", "Cordelia is restrained near the Gidbinn", "The Gidbinn's overgrown shrine.")],
  "15-khalim-s-will": [art("13_Sszark_Stage3.jpg", "Sszark's brood captures Cordelia beneath Kurast", "Sszark's webbed lair.")],
  "16-lam-esen-s-tome": [art("14_Battlemaid_Sarina_Stage3.jpg", "Cordelia faces Battlemaid Sarina in the Ruined Temple", "Battlemaid Sarina guards the forgotten tome.")],
  "17-the-blackened-temple": [art("15_High_Council_Stage3.jpg", "Cordelia confronts the High Council in Travincal", "The High Council of Travincal.")],
  "18-the-lord-of-hatred": [
    art("16_Mephisto_Stage3.jpg", "Cordelia faces Mephisto beneath Travincal", "The Lord of Hatred waits below.", 0.62),
    art("Stage4_Outfit_Base.jpg", "Cordelia wearing the fourth stage of the Beneficent Attire", "The Beneficent Attire, Stage IV.", 0.9),
  ],
  "19-the-fallen-angel": [art("17_Izual_Stage4.jpg", "Cordelia confronts Izual on the Plains of Despair", "The Fallen Angel.")],
  "20-hell-s-forge": [art("18_Hephasto_Stage4.jpg", "Cordelia faces Hephasto at the Hellforge", "Hephasto guards the Hellforge.")],
  "21-terror-s-end": [
    art("19_Diablo_Stage4.jpg", "Cordelia faces Diablo in the Chaos Sanctuary", "Terror's End.", 0.62),
    art("Stage5_Outfit_Base.jpg", "Cordelia wearing the fifth stage of the Beneficent Attire", "The Beneficent Attire, Stage V.", 0.9),
  ],
  "22-the-siege-of-harrogath": [art("20_Shenk_Stage5.jpg", "Cordelia confronts Shenk outside Harrogath", "Breaking the siege.")],
  "23-prisoners-of-war": [art("21_Prison_Camp_Stage5.jpg", "Cordelia is captured in a siege camp", "Inside the prison camp.")],
  "24-prison-of-ice": [art("22_Frozenstein_Stage5.jpg", "Cordelia faces Frozenstein in the Frozen River", "The Prison of Ice.")],
  "25-betrayal-of-harrogath": [art("23_Nihlathak_Stage5.jpg", "Cordelia confronts Nihlathak in his temple", "Beneath Nihlathak's temple.")],
  "26-rite-of-passage": [art("24_Ancients_Stage5.jpg", "Cordelia stands before the Ancients on Arreat Summit", "The Rite of Passage.")],
  "27-eve-of-destruction": [
    art("25_Lister_Declined_Stage5.jpg", "Cordelia faces Lister and his pack in the Throne of Destruction", "Lister's final wave.", 0.34),
    art("26_Baal_Duplicates_Stage5.jpg", "Baal's duplicates surround Cordelia", "The last deception before the Worldstone.", 0.72),
  ],
  "28-the-holy-grail": [
    art("Spent_Beneath_Worldstone_Stage6.jpg", "Cordelia rests beneath the Worldstone after defeating Baal", "Baal defeated; the chamber finally still.", 0.1),
    art("Harrogath_Anya_Runed_Bindings.jpg", "Anya checks on Cordelia in Harrogath", "Back in Harrogath, Anya makes certain she is all right.", 0.43),
    art("06_Stage6_Full_Beneficent_Attire.jpg", "Cordelia wearing the complete Beneficent Attire", "The complete Beneficent Attire.", 0.7),
    art("Setting_Out_Holy_Grail_Stage6.jpg", "Cordelia enters a portal while Charsi and Kashya watch", "A new adventure—and a very long Holy Grail—begins.", 0.96),
  ],
  "29-a-small-personalization": [art("Small_Personalization_Anya_Study.jpg", "Anya studies a magical personalization for Cordelia", "A small personalization in Anya's study.")],
  "30-the-lost-horadrim": [art("Lost_Horadrim.jpg", "Cordelia investigates the workshop of the Lost Horadrim", "The first chamber of Edran Vohl's legacy.")],
  "31-the-rose-sentence": [art("Rose_Sentence_Cage_Stage6.jpg", "Cordelia waits out the Rose Sentence in a runed cage", "The long final days of the Rose Sentence.")],
  "32-the-penitent-coil": [art("The_Penitent_Coil.jpg", "The enchanted Penitent Coil binds Cordelia", "The Penitent Coil accepts a challenging task.")],
  "33-the-mutable-instrument": [art("Mutable_Instrument_Stage6.jpg", "Cordelia tests the cheerful mutable instrument", "The mutable instrument is very eager to help.")],
  "34-the-whore-maker": [art("Whore_Maker_Stage6.jpg", "Cordelia examines the Lost Horadrim's final training device", "The artifact known only as the Whore-Maker.")],
  "35-the-intended-effects": [art("Intended_Effects.jpg", "Seris reads Cain's account of the Beneficent Attire", "A dusty tome and its unexpectedly absorbing scholarship.")],
};

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
    illustrations: illustrations[entry.slug] ?? [],
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

async function splitGrailNovel() {
  const sourceFile = "cordelia_emily_grail_arc.md";
  const source = await readFile(path.join(contentRoot, sourceFile), "utf8");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const chapters = [];
  let current = null;

  function closeCurrent() {
    if (!current) return;
    current.content = current.lines.join("\n").trim();
    delete current.lines;
    chapters.push(current);
  }

  for (const line of lines) {
    const chapterMatch = line.match(/^## (Chapter ([A-Za-z-]+): (.+))$/);
    if (chapterMatch) {
      closeCurrent();
      const chapterNumber = chapters.length + 1;
      const shortTitle = chapterMatch[3];
      current = {
        slug: `grail-${String(chapterNumber).padStart(2, "0")}-${shortTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
        title: chapterMatch[1],
        shortTitle,
        eyebrow: `The Fourth Discipline · ${String(chapterNumber).padStart(2, "0")} of 13`,
        collectionId: "grail",
        sourceFile,
        lines: [],
      };
      continue;
    }
    if (current) current.lines.push(line);
  }

  closeCurrent();
  return chapters;
}

async function splitZephiraNovel() {
  const sourceFiles = ["zephira_arc_01.md", "zephira_arc_02.md", "zephira_arc_03.md"];
  const chapters = [];

  for (const sourceFile of sourceFiles) {
    const source = await readFile(path.join(contentRoot, sourceFile), "utf8");
    const lines = source.replace(/\r\n/g, "\n").split("\n");
    let current = null;

    function closeCurrent() {
      if (!current) return;
      current.content = current.lines.join("\n").trim();
      delete current.lines;
      chapters.push(current);
      current = null;
    }

    for (const line of lines) {
      const chapterMatch = line.match(/^## (Chapter ([A-Za-z-]+): (.+))$/);
      if (chapterMatch) {
        closeCurrent();
        const chapterNumber = chapters.length + 1;
        const shortTitle = chapterMatch[3];
        current = {
          slug: `zephira-${String(chapterNumber).padStart(2, "0")}-${shortTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`,
          title: chapterMatch[1],
          shortTitle,
          eyebrow: `Knots of Her Own · ${String(chapterNumber).padStart(2, "0")} of 14`,
          collectionId: "zephira",
          sourceFile,
          lines: [],
        };
        continue;
      }
      if (current) current.lines.push(line);
    }

    closeCurrent();
  }

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
const grail = await splitGrailNovel();
const zephira = await splitZephiraNovel();
const aftermath = later.filter((entry) => entry.collectionId === "aftermath");
const archives = later.filter((entry) => entry.collectionId === "archives");
const entries = [...core, ...aftermath, ...grail, ...zephira, ...archives].map(finalize);

await mkdir(outputRoot, { recursive: true });
const generated = `// Generated by scripts/build-library.mjs. Do not edit by hand.\n` +
  `import type { Collection, LibraryEntry } from "./library-types";\n\n` +
  `export const collections: Collection[] = ${JSON.stringify(collections, null, 2)};\n\n` +
  `export const library: LibraryEntry[] = ${JSON.stringify(entries, null, 2)};\n`;

await writeFile(path.join(outputRoot, "library.generated.ts"), generated);
console.log(`Built ${entries.length} chronological entries from ${standalone.length + 5} source files.`);
