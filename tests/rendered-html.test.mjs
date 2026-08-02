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
  assert.match(html, /The Fifth Discipline/);
  assert.match(html, /The Beneficent Archives/);
  assert.match(html, /View the gallery/);
  assert.match(html, /<strong>49<\/strong>\s*entries/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("renders the complete story and fan-service illustration gallery", async () => {
  const response = await render("/gallery");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The visual archive/);
  assert.match(html, /All illustrations/);
  assert.match(html, /<strong>58<\/strong>/);
  assert.match(html, /Fan service/);
  assert.match(html, />Animated<\/button>/);
  assert.match(html, /01_Stage1_Classic_Outfit\.jpg/);
  assert.match(html, /Setting_Out_Holy_Grail_Stage6\.jpg/);
  assert.match(html, /Fanservice_Morning_Grail_Run\.jpg/);
  assert.match(html, /Intimate_Feet_Closeup_with_Face\.jpg/);
  assert.match(html, /Fanservice_Lut_Gholein_Bathhouse_Animated\.mp4/);
  assert.match(html, /Beneficent_Attire_Stage6_Animated\.mp4/);
  assert.match(html, /Return_To_Harrogath_Animated\.mp4/);
  assert.equal((html.match(/data-animated-scene/g) ?? []).length, 3);
  assert.equal((html.match(/data-gallery-item/g) ?? []).length, 58);
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
  assert.match(generated, /Commission and Command/);
  assert.doesNotMatch(generated, /Cordelia — Act I/);
  assert.doesNotMatch(generated, /Chapter One: Den of Evil/);
});
