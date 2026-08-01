import type { Metadata } from "next";
import { IllustrationGallery, type GalleryItem } from "../../components/IllustrationGallery";
import { library } from "../../lib/library";

export const metadata: Metadata = {
  title: "Illustration Gallery",
  description: "The complete chronological illustration gallery for Cordelia and the Beneficent Misfortune.",
};

const fanservice: GalleryItem[] = [
  {
    src: "/illustrations/Intimate_Feet_Closeup_with_Face.jpg",
    alt: "An intimate portrait of Cordelia with her bare feet in the foreground",
    caption: "A quiet close-up with Cordelia.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Non-canonical portrait",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Lut_Gholein_Bathhouse.jpg",
    alt: "Cordelia relaxing in a tiled Lut Gholein bathhouse",
    caption: "An afternoon in the Lut Gholein bathhouse.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Non-canonical interlude",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Baal_Run_10000.jpg",
    alt: "Cordelia lounging after another Baal run",
    caption: "Baal Run 10,000.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Holy Grail pin-up",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Potion_Commercial.jpg",
    alt: "Cordelia presenting a glowing rejuvenation potion",
    caption: "A full rejuvenation, attractively presented.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Sanctuary advertisement",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Charsi_Fitting_Room.jpg",
    alt: "Charsi adjusts Cordelia's enchanted footwear in her fitting room",
    caption: "Charsi investigates the latest footwear transformation.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Non-canonical interlude",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Coil_Discovery.jpg",
    alt: "The enchanted Coil explores the sensitivity of Cordelia's feet",
    caption: "The Coil discovers another sensitive response.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Lost Horadrim study",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Enigma_Advertisement.jpg",
    alt: "Cordelia teleporting in a glamorous Enigma advertisement",
    caption: "Enigma: arrive anywhere improperly dressed.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Sanctuary advertisement",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Cute_Daily_Life_Sleepwear_Polishing_Staff.jpg",
    alt: "Cordelia in sleepwear polishing her sorceress staff",
    caption: "A quiet morning with sleepwear and staff maintenance.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Daily life",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Luxurious_Wet_Feet_Lut_Gholein.jpg",
    alt: "Cordelia's wet bare feet beside a Lut Gholein bath",
    caption: "Warm water, mosaic tile and a little indulgence.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Lut Gholein close-up",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Morning_Grail_Run.jpg",
    alt: "Cordelia asleep after a Grail run with her bare feet beneath the blankets",
    caption: "The morning after one more Grail run.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Holy Grail interlude",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Toe_Casting_Practice.jpg",
    alt: "Cordelia practicing a spell with her toes",
    caption: "An advanced exercise in toe-casting.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Sorceress study",
    collectionId: "fanservice",
  },
  {
    src: "/illustrations/Fanservice_Anya_Enchantment_Test.jpg",
    alt: "Anya testing an enchantment on Cordelia",
    caption: "Anya tests another enchantment.",
    placement: 0,
    entryTitle: "Sanctuary After Dark",
    entryEyebrow: "Non-canonical interlude",
    collectionId: "fanservice",
  },
];

const items: GalleryItem[] = [
  ...library.flatMap((entry) =>
    entry.illustrations.map((illustration) => ({
      ...illustration,
      entrySlug: entry.slug,
      entryTitle: entry.title,
      entryEyebrow: entry.eyebrow,
      collectionId: entry.collectionId,
    })),
  ),
  ...fanservice,
];

export default function GalleryPage() {
  return <IllustrationGallery items={items} />;
}
