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
    id: "cruelty",
    label: "Strictly Optional Cruelty",
    kicker: "The Black Rose settings",
    description:
      "Cordelia and Zephira unlock the artifacts’ dormant severe settings and discover exactly how much humiliation two volunteers can request.",
  },
  {
    id: "curriculum",
    label: "The Long Curriculum",
    kicker: "Five years, if they last",
    description:
      "Emily rebuilds the Whore-Maker as a long-term Rose curriculum, offering Cordelia and Zephira impossible wealth for an equally impossible education.",
  },
  {
    id: "archives",
    label: "The Beneficent Archives",
    kicker: "Fifteen to twenty years later",
    description:
      "Later scholars uncover the private records, inventions, and persistent legend of Cordelia’s adventures.",
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
  "grail-01-the-fifth-branch": [
    art("Grail_01_The_Fifth_Branch.jpg", "Cordelia meets Emily Vohl in a forgotten Horadric workshop", "The Lost Horadrim reveals herself—and the jewelry's hidden fifth branch.", 0.52),
  ],
  "grail-02-the-fourth-discipline": [
    art("Grail_02_The_Fourth_Discipline.jpg", "Cordelia practices the jewelry's newly unlocked Arcane discipline", "Arcane power, paid for with a rather different source of energy.", 0.58),
  ],
  "grail-03-the-green-sentence": [
    art("Grail_03_The_Green_Sentence.jpg", "Cordelia completes the Green Sentence with a final set-item drop", "The third green treasure finally falls.", 0.78),
  ],
  "grail-04-the-burden-of-charms": [
    art("Grail_04_The_Burden_of_Charms.jpg", "Cordelia carries the increasingly physical burden of unidentified charms", "Every charm is worth keeping. Probably.", 0.6),
  ],
  "grail-05-a-productive-day-off": [
    art("Grail_05_A_Productive_Day_Off.jpg", "Cordelia balances within a lantern-lit predicament beneath the Lut Gholein docks", "A day off becomes unexpectedly productive.", 0.57),
  ],
  "grail-06-the-high-rune-stampede": [
    art("Grail_06_The_High_Rune_Stampede.jpg", "Cordelia flees a stampede in the Secret Cow Level", "A high-rune challenge with unusually immediate consequences.", 0.52),
  ],
  "grail-07-one-day-one-jah": [
    art("Grail_07_One_Day_One_Jah.jpg", "Emily borrows Cordelia's body for one day in exchange for a Jah rune", "One day, one Jah, and entirely too much confidence.", 0.5),
  ],
  "grail-08-the-eight-foot-solution": [
    art("Grail_08_The_Eight_Foot_Solution.jpg", "Cordelia and her friends confront an eccentric foot-based curse", "The solution requires four volunteers and eight bare feet.", 0.48),
  ],
  "grail-09-alkor-s-excellent-judgment": [
    art("Grail_09_Alkors_Excellent_Judgment.jpg", "Cordelia realizes why Alkor recommended drinking only one potion", "Alkor's recommendation proves characteristically sound.", 0.63),
  ],
  "grail-10-the-last-acceptable-moment": [
    art("Grail_10_The_Last_Acceptable_Moment.jpg", "Cordelia unleashes a Beneficent Cataclysm in a buried Zakarum vault", "Every chamber opened; every guardian gathered; one last acceptable moment.", 0.84),
  ],
  "grail-11-the-rose-of-tristram": [
    art("Grail_11_The_Rose_of_Tristram.jpg", "Cordelia rests in a restored Tristram after releasing the Rose Sentence", "Forty-five days of stored power bloom across Tristram.", 0.88),
  ],
  "grail-12-the-replication-requirement": [
    art("Grail_12_The_Replication_Requirement.jpg", "Cordelia and a physically manifested Emily face the replicated curse together", "The requirement has doubled. The volunteers have not become less enthusiastic.", 0.52),
  ],
  "grail-13-the-mercenary-experiment": [
    art("Grail_13_The_Mercenary_Experiment.jpg", "Cordelia and Emily are caught together by an ancient paired restraint ward", "One mercenary, two matching sets, and a field test neither woman planned.", 0.62),
  ],
  "zephira-01-the-first-lock": [
    art("Zephira_01_The_First_Lock.jpg", "Zephira admires her first enchanted hogtie in the Appraising Glass", "The first lock reveals a surprisingly pretty kind of helplessness.", 0.58),
  ],
  "zephira-02-strictly-practical-purchases": [
    art("Zephira_02_Strictly_Practical_Purchases.jpg", "Zephira tests a frog-tie supported against the bed footboard", "A strictly practical purchase receives a thorough private trial.", 0.62),
  ],
  "zephira-03-private-experiments": [
    art("Zephira_03_Private_Experiments.jpg", "Zephira crosses the sleeping Lut Gholein market in enchanted hobble chains", "A private experiment ventures briefly into the sleeping city.", 0.78),
  ],
  "zephira-04-found-by-chance": [
    art("Zephira_04_Found_By_Chance.jpg", "Cordelia and Emily discover Zephira's forward-leaning rope predicament in the Lost City baths", "Found by chance—and examined only after Zephira's careful permission.", 0.46),
  ],
  "zephira-05-four-hours-four-weeks": [
    art("Zephira_05_Four_Hours_Four_Weeks.jpg", "Zephira endures the mistaken four-week setting inside a cliffside shrine", "Four hours and four weeks differ by only one unfortunate selector mark.", 0.52),
  ],
  "zephira-06-you-asked-me-to": [
    art("Zephira_06_You_Asked_Me_To.jpg", "Cordelia offers water during Zephira's quiet aftercare", "After the locks open, Cordelia helps make the world manageable again.", 0.82),
  ],
  "zephira-07-someone-knows": [
    art("Zephira_07_Someone_Knows_X-frame.jpg", "Zephira tests a demanding X-frame predicament with Cordelia nearby", "For the first time, someone else knows exactly where she has placed herself.", 0.62),
  ],
  "zephira-08-one-additional-pair-of-hands": [
    art("Zephira_08_One_Additional_Pair_Of_Hands.jpg", "Cordelia contributes one additional pair of hands to Zephira's design", "Zephira supplies the framework; Cordelia supplies the complication.", 0.58),
  ],
  "zephira-09-special-delivery": [
    art("Zephira_09_Special_Delivery.jpg", "Zephira travels from Lut Gholein as carefully secured private cargo", "Special delivery to the Rogue Monastery.", 0.55),
  ],
  "zephira-10-two-locks": [
    art("Zephira_10_Two_Locks.jpg", "Cordelia and Zephira prepare a matching two-person restraint experiment", "Two women, two locks, and decisions made while both could still reach the keys.", 0.55),
  ],
  "zephira-11-an-impractical-pillow": [
    art("Zephira_11_An_Impractical_Pillow.jpg", "Cordelia curls around a securely bound Zephira in the monastery bedroom", "An impractical pillow proves unexpectedly comfortable.", 0.58),
  ],
  "zephira-12-maximum-occupancy": [
    art("Zephira_12_Maximum_Occupancy.jpg", "Cordelia and Zephira test the maximum occupancy of a very small cage", "The eastern cell was designed for one. This is treated as a suggestion.", 0.6),
  ],
  "cruelty-01-the-whore-has-returned": [
    art("Cruelty_01_The_Whore_Has_Returned.jpg", "Cordelia returns voluntarily to the awakened severe training apparatus", "The Black Rose reawakens a particularly severe curriculum.", 0.58),
  ],
  "cruelty-02-written-all-over-her": [
    art("Cruelty_02_Written_All_Over_Her.jpg", "The Beneficent jewelry writes its severe assessment across Cordelia", "The jewelry remains silent. Its inscriptions do not.", 0.52),
  ],
  "cruelty-03-sufficient-technique": [
    art("Cruelty_03_Sufficient_Technique.jpg", "The Penitent Coil evaluates Cordelia's attentive service", "Freedom must be earned through sufficient technique.", 0.5),
  ],
  "cruelty-04-the-glass-does-not-flatter": [
    art("Cruelty_04_The_Glass_Does_Not_Flatter.jpg", "Zephira confronts the Appraising Glass and its unhelpfully accurate angles", "The Glass changes nothing. It merely removes the ability to pretend.", 0.55),
  ],
  "cruelty-05-one-chance-in-four": [
    art("Cruelty_05_One_Chance_In_Four.jpg", "Zephira chooses among four covered runes with one bare foot", "One chance in four feels different when the Pearl is already winning.", 0.5),
  ],
  "cruelty-06-below-the-threshold": [
    art("Cruelty_06_Below_The_Threshold.jpg", "Courteous Silence waits for Zephira's composure to break", "The timer will begin after one sufficiently undignified sound.", 0.5),
  ],
  "cruelty-07-coverage-incomplete": [
    art("Cruelty_07_Coverage_Incomplete.jpg", "The Mutable Instrument evaluates Cordelia and Zephira together", "Two clients detected. Coverage remains incomplete.", 0.52),
  ],
  "cruelty-08-the-complete-curriculum": [
    art("Cruelty_08_The_Complete_Curriculum.jpg", "Cordelia and Zephira activate every compatible Black Rose artifact", "The complete curriculum begins.", 0.48),
  ],
  "seris-01-voluntary-applications": [
    art("Archives_01_Voluntary_Applications.jpg", "Seris opens Emily Vohl's first catalogue of recovered instruments", "Volume I: recovered instruments and unusually argumentative footnotes.", 0.2),
  ],
  "seris-02-forty-five-days": [
    art("Archives_02_Forty_Five_Days.jpg", "Seris studies the forty-five-day record of the Rose of Tristram", "Volume II: forty-five days, three Prime Evils, and one technically exact mechanism.", 0.2),
  ],
  "seris-03-private-field-equipment": [
    art("Archives_03_Private_Field_Equipment.jpg", "Seris examines Emily's catalogue of Zephira's private field equipment", "Volume III: private field equipment, accurately diagrammed.", 0.24),
  ],
  "seris-04-the-black-rose-addendum": [
    art("Archives_04_Black_Rose_Addendum.jpg", "Seris opens the silver Black Rose addendum", "Volume IV opens only after the reader admits she wants to continue.", 0.16),
  ],
  "seris-a-nonzero-possibility": [
    art("Archives_05_A_Nonzero_Possibility.jpg", "Seris watches Kashya's authorized crystal simulation", "Possibility is not prediction.", 0.84),
  ],
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

async function splitCrueltyNovel() {
  const sourceFile = "strictly_optional_cruelty.md";
  const source = await readFile(path.join(contentRoot, sourceFile), "utf8");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const chapters = [];
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
        slug: `cruelty-${String(chapterNumber).padStart(2, "0")}-${shortTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
        title: chapterMatch[1],
        shortTitle,
        eyebrow: `Strictly Optional Cruelty · ${String(chapterNumber).padStart(2, "0")} of 08`,
        collectionId: "cruelty",
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

async function splitLongCurriculum() {
  const sourceFile = "the_long_curriculum.md";
  const source = await readFile(path.join(contentRoot, sourceFile), "utf8");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const chapters = [];
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
        slug: `curriculum-${String(chapterNumber).padStart(2, "0")}-${shortTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
        title: chapterMatch[1],
        shortTitle,
        eyebrow: `The Long Curriculum · ${String(chapterNumber).padStart(2, "0")} of 08`,
        collectionId: "curriculum",
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
    file: "seris_reactions_01_voluntary_applications.md",
    slug: "seris-01-voluntary-applications",
    collectionId: "archives",
    eyebrow: "Emily Vohl’s Catalogue · Volume I",
  },
  {
    file: "seris_reactions_02_forty_five_days.md",
    slug: "seris-02-forty-five-days",
    collectionId: "archives",
    eyebrow: "Emily Vohl’s Catalogue · Volume II",
  },
  {
    file: "seris_reactions_03_private_field_equipment.md",
    slug: "seris-03-private-field-equipment",
    collectionId: "archives",
    eyebrow: "Emily Vohl’s Catalogue · Volume III",
  },
  {
    file: "seris_reactions_04_black_rose_addendum.md",
    slug: "seris-04-the-black-rose-addendum",
    collectionId: "archives",
    eyebrow: "Emily Vohl’s Catalogue · Volume IV",
  },
  {
    file: "seris_a_nonzero_possibility.md",
    slug: "seris-a-nonzero-possibility",
    collectionId: "archives",
    eyebrow: "Fifteen years later · The Crystal Record",
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
const cruelty = await splitCrueltyNovel();
const curriculum = await splitLongCurriculum();
const aftermath = later.filter((entry) => entry.collectionId === "aftermath");
const archives = later.filter((entry) => entry.collectionId === "archives");
const entries = [...core, ...aftermath, ...grail, ...zephira, ...cruelty, ...curriculum, ...archives].map(finalize);

await mkdir(outputRoot, { recursive: true });
const generated = `// Generated by scripts/build-library.mjs. Do not edit by hand.\n` +
  `import type { Collection, LibraryEntry } from "./library-types";\n\n` +
  `export const collections: Collection[] = ${JSON.stringify(collections, null, 2)};\n\n` +
  `export const library: LibraryEntry[] = ${JSON.stringify(entries, null, 2)};\n`;

await writeFile(path.join(outputRoot, "library.generated.ts"), generated);
console.log(`Built ${entries.length} chronological entries from ${standalone.length + 7} source files.`);
