import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the FutBots experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>FutBots — AI football predictions<\/title>/i);
  assert.match(html, /aria-label="FutBots"/);
  assert.match(html, /\/assets\/brand-ring\.svg/);
  assert.match(html, /\/assets\/brand-wordmark\.svg/);
  assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
});

test("keeps the Figma assets local and the starter preview removed", async () => {
  const [app, css, packageJson, standaloneHtml, standaloneJs] = await Promise.all([
    readFile(new URL("../app/FutBotsApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../standalone.js", import.meta.url), "utf8"),
  ]);

  for (const asset of [
    "brand-ball.svg",
    "brand-wordmark.svg",
    "google.svg",
    "telegram.svg",
    "menu.svg",
    "pitch.svg",
  ]) {
    await access(new URL(`../public/assets/${asset}`, import.meta.url));
  }

  assert.match(app, /type Screen =/);
  assert.match(app, /"dashboard"/);
  assert.match(app, /"details"/);
  assert.match(css, /@media \(min-width: 900px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(standaloneHtml, /data-screen="dashboard"/);
  assert.match(standaloneHtml, /\.\/public\/assets\/brand-ball\.svg/);
  assert.match(standaloneJs, /function showScreen/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
