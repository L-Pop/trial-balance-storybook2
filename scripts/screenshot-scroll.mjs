import { chromium } from "playwright";

const BASE = "http://localhost:6161/iframe.html";
const OUT = "/home/claude/qa-screenshots";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 744, height: 700 });
await page.goto(`${BASE}?id=trial-balance-grid-mock-reference-app-screen--tablet-viewport&viewMode=story`, {
  waitUntil: "load",
  timeout: 15000,
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/grid-tablet-744-notes-visible.png` });

// scroll the horizontal container to the right to reveal Ref # and confirm
// Account Name + trailing action stay frozen
const scrolled = await page.evaluate(() => {
  const el = document.querySelector('[class*="hvScroll"]');
  if (!el) return { found: false };
  el.scrollLeft = 260;
  return { found: true, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollLeft: el.scrollLeft };
});
console.log("scrollLeft applied:", scrolled);
await page.waitForTimeout(150);
await page.screenshot({ path: `${OUT}/grid-tablet-744-scrolled.png` });

// narrower tablet width where Notes collapses
await page.setViewportSize({ width: 660, height: 700 });
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/grid-tablet-660-notes-hidden.png` });

await browser.close();
