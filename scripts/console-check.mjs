import { chromium } from "playwright";

const BASE = "http://localhost:6161/iframe.html";
const res = await fetch("http://localhost:6161/index.json");
const index = await res.json();
const storyIds = Object.values(index.entries)
  .filter((e) => e.type === "story")
  .map((e) => e.id);

const browser = await chromium.launch();
const page = await browser.newPage();
let errorCount = 0;

page.on("pageerror", (err) => {
  errorCount++;
  console.log("PAGE ERROR:", err.message);
});
page.on("console", (msg) => {
  if (msg.type() === "error") {
    errorCount++;
    console.log("CONSOLE ERROR:", msg.text());
  }
});

await page.setViewportSize({ width: 1000, height: 800 });
for (const id of storyIds) {
  await page.goto(`${BASE}?id=${id}&viewMode=story`, { waitUntil: "load", timeout: 15000 });
  await page.waitForTimeout(150);
}

console.log(`Checked ${storyIds.length} stories, ${errorCount} console/page errors.`);
await browser.close();
process.exit(errorCount > 0 ? 1 : 0);
