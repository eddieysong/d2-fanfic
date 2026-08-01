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
  assert.match(html, /The Beneficent Archives/);
  assert.match(html, /<strong>36<\/strong>\s*entries/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("renders a complete reader route", async () => {
  const response = await render("/read/01-a-very-small-cave");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Chapter One — A Very Small Cave/);
  assert.match(html, /The Rogue Encampment looked less like/);
  assert.match(html, /Increase text size/);
  assert.match(html, /Chronological reading navigation/);
});

test("publishes only the selected source stories", async () => {
  const generated = await readFile(new URL("../lib/library.generated.ts", import.meta.url), "utf8");
  assert.match(generated, /The Whore-Maker/);
  assert.match(generated, /Commission and Command/);
  assert.doesNotMatch(generated, /Cordelia — Act I/);
  assert.doesNotMatch(generated, /Chapter One: Den of Evil/);
});
