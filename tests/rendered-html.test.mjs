import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the chronological archive index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Cordelia and the/);
  assert.match(html, /Beneficent Misfortune/);
  assert.match(html, /The complete reading order/);
  assert.match(html, /The Core Journey/);
  assert.match(html, /After the Worldstone/);
  assert.match(html, /The Fourth Discipline/);
  assert.match(html, /Knots of Her Own/);
  assert.match(html, /href="#zephira">Zephira<\/a>/);
  assert.match(html, /Strictly Optional Cruelty/);
  assert.match(html, /href="#cruelty">Black Rose<\/a>/);
  assert.match(html, /The Long Curriculum/);
  assert.match(html, /href="#curriculum">Long Curriculum<\/a>/);
  assert.match(html, /The Beneficent Archives/);
  assert.match(html, /View the gallery/);
  assert.match(html, /<strong>83<\/strong>\s*entries/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("renders the complete story and fan-service illustration gallery", async () => {
  const response = await render("/gallery");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The visual archive/);
  assert.match(html, /All illustrations/);
  assert.match(html, /<strong>96<\/strong>/);
  assert.match(html, />The Fourth Discipline<\/button>/);
  assert.match(html, />Knots of Her Own<\/button>/);
  assert.match(html, />Black Rose<\/button>/);
  assert.match(html, /Fan service/);
  assert.match(html, />Animated<\/button>/);
  assert.match(html, /01_Stage1_Classic_Outfit\.jpg/);
  assert.match(html, /Setting_Out_Holy_Grail_Stage6\.jpg/);
  assert.match(html, /Fanservice_Morning_Grail_Run\.jpg/);
  assert.match(html, /Intimate_Feet_Closeup_with_Face\.jpg/);
  assert.match(html, /Grail_01_The_Fifth_Branch\.jpg/);
  assert.match(html, /Zephira_01_The_First_Lock\.jpg/);
  assert.match(html, /Zephira_12_Maximum_Occupancy\.jpg/);
  assert.match(html, /Cruelty_08_The_Complete_Curriculum\.jpg/);
  assert.match(html, /Archives_05_A_Nonzero_Possibility\.jpg/);
  assert.match(html, /Fanservice_Lut_Gholein_Bathhouse_Animated\.mp4/);
  assert.match(html, /Beneficent_Attire_Stage6_Animated\.mp4/);
  assert.match(html, /Return_To_Harrogath_Animated\.mp4/);
  assert.equal((html.match(/data-animated-scene/g) ?? []).length, 3);
  assert.equal((html.match(/data-gallery-item/g) ?? []).length, 96);
});

test("renders a complete reader route", async () => {
  const response = await render("/read/01-a-very-small-cave");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter One — A Very Small Cave/);
  assert.match(html, /The Rogue Encampment looked less like/);
  assert.match(html, /Increase text size/);
  assert.match(html, /Chronological reading navigation/);
  assert.match(html, /\/illustrations\/01_Stage1_Classic_Outfit\.jpg/);
  assert.match(html, /Cordelia at the beginning of her journey/);
});

test("renders the Grail adventures in chronological order", async () => {
  const response = await render("/read/grail-11-the-rose-of-tristram");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter Eleven: The Rose of Tristram/);
  assert.match(html, /Uber Tristram/);
  assert.match(html, /Three additional levels/);
  assert.match(html, /The only Amazon-trained fighter you know/);
  assert.match(html, /already counting the Terror, Hate and Destruction keys/);
  assert.doesNotMatch(html, /less advanced bladder/);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const firstGrail = generated.indexOf("grail-01-the-fifth-branch");
  const lastGrail = generated.indexOf("grail-13-the-mercenary-experiment");
  const archives = generated.indexOf("35-the-intended-effects");
  assert.ok(firstGrail > -1);
  assert.ok(lastGrail > firstGrail);
  assert.ok(archives > lastGrail);
});

test("renders Zephira's complete arc after the Grail adventures", async () => {
  const response = await render("/read/zephira-01-the-first-lock");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter One: The First Lock/);
  assert.match(html, /Knots of Her Own/);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const lastGrail = generated.indexOf("grail-13-the-mercenary-experiment");
  const firstZephira = generated.indexOf("zephira-01-the-first-lock");
  const lastZephira = generated.indexOf("zephira-14-the-next-discovery");
  const firstCruelty = generated.indexOf("cruelty-01-the-whore-has-returned");
  const archives = generated.indexOf("35-the-intended-effects");
  assert.ok(firstZephira > lastGrail);
  assert.ok(lastZephira > firstZephira);
  assert.ok(firstCruelty > lastZephira);
  assert.ok(archives > firstCruelty);
  assert.doesNotMatch(generated, /The Unreachable Key/);
});

test("renders the complete Black Rose arc before the later archives", async () => {
  const response = await render("/read/cruelty-01-the-whore-has-returned");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter One: The Whore Has Returned/);
  assert.match(html, /Strictly Optional Cruelty/);
  assert.match(html, /BLACK ROSE/);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const firstCruelty = generated.indexOf("cruelty-01-the-whore-has-returned");
  const lastCruelty = generated.indexOf("cruelty-08-the-complete-curriculum");
  const curriculum = generated.indexOf("curriculum-01-enrollment-and-the-eligible-list");
  const archives = generated.indexOf("35-the-intended-effects");
  assert.ok(firstCruelty > -1);
  assert.ok(lastCruelty > firstCruelty);
  assert.ok(curriculum > lastCruelty);
  assert.ok(archives > curriculum);
});

test("renders the Long Curriculum after the Black Rose arc", async () => {
  const response = await render("/read/curriculum-01-enrollment-and-the-eligible-list");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter One: Enrollment and the Eligible List/);
  assert.match(html, /The Long Curriculum/);
  assert.match(html, /ELEVEN THOUSAND|11,315|Eleven thousand/i);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const lastCruelty = generated.indexOf("cruelty-08-the-complete-curriculum");
  const firstCurriculum = generated.indexOf("curriculum-01-enrollment-and-the-eligible-list");
  const lastCurriculum = generated.indexOf("curriculum-08-no-assignment-pending");
  const archives = generated.indexOf("35-the-intended-effects");
  assert.ok(firstCurriculum > lastCruelty);
  assert.ok(lastCurriculum > firstCurriculum);
  assert.ok(archives > lastCurriculum);

  const finalResponse = await render("/read/curriculum-08-no-assignment-pending");
  assert.equal(finalResponse.status, 200);
  const finalHtml = await finalResponse.text();
  assert.match(finalHtml, /Chapter Eight: No Assignment Pending/);
  assert.match(finalHtml, /She thought about all the times when losing was not an option/);
  assert.match(finalHtml, /Uber Tristram had lasted forty-five days/);
  assert.match(finalHtml, /She did not decide/);
});

test("renders Emily's four-volume catalogue after Cain's monograph", async () => {
  const response = await render("/read/seris-01-voluntary-applications");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Volume I — Voluntary Applications/);
  assert.match(html, /Emily Vohl/);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const cain = generated.indexOf("35-the-intended-effects");
  const volumeOne = generated.indexOf("seris-01-voluntary-applications");
  const volumeTwo = generated.indexOf("seris-02-forty-five-days");
  const volumeThree = generated.indexOf("seris-03-private-field-equipment");
  const volumeFour = generated.indexOf("seris-04-the-black-rose-addendum");
  assert.ok(volumeOne > cain);
  assert.ok(volumeTwo > volumeOne);
  assert.ok(volumeThree > volumeTwo);
  assert.ok(volumeFour > volumeThree);
  assert.doesNotMatch(generated, /Commission and Command/);
});

test("renders Kashya's authorized crystal record after Emily's catalogue", async () => {
  const response = await render("/read/seris-a-nonzero-possibility");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A Nonzero Possibility/);
  assert.match(html, /SUBJECT AUTHORIZATION: CONFIRMED/);
  assert.match(html, /SIMULATION OF THE IDENTICAL SCENARIO AVAILABLE FOR THE CURRENT OWNER/);

  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  const volumeFour = generated.indexOf("seris-04-the-black-rose-addendum");
  const crystalRecord = generated.indexOf("seris-a-nonzero-possibility");
  assert.ok(crystalRecord > volumeFour);
});

test("keeps multi-image scenes in narrative order", async () => {
  const response = await render("/read/28-the-holy-grail");
  assert.equal(response.status, 200);
  const html = await response.text();
  const worldstone = html.indexOf("Spent_Beneath_Worldstone_Stage6.jpg");
  const harrogath = html.indexOf("Harrogath_Anya_Runed_Bindings.jpg");
  const departure = html.indexOf("Setting_Out_Holy_Grail_Stage6.jpg");
  assert.ok(worldstone > -1);
  assert.ok(harrogath > worldstone);
  assert.ok(departure > harrogath);
});

test("publishes only the selected source stories", async () => {
  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  assert.match(generated, /The Whore-Maker/);
  assert.doesNotMatch(generated, /Commission and Command/);
  assert.doesNotMatch(generated, /Cordelia — Act I/);
  assert.doesNotMatch(generated, /Chapter One: Den of Evil/);
});
