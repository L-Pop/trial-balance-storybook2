import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:6161/iframe.html";
const OUT = "/home/claude/qa-screenshots";
mkdirSync(OUT, { recursive: true });

const shots = [
  { id: "trial-balance-grid-mock-reference-app-screen--desktop-viewport", width: 1280, height: 900, name: "grid-desktop-1280.png" },
  { id: "trial-balance-grid-mock-reference-app-screen--tablet-viewport", width: 744, height: 760, name: "grid-tablet-744.png" },
  { id: "trial-balance-grid-mock-reference-app-screen--mobile-viewport", width: 390, height: 1000, name: "grid-mobile-390.png" },
  { id: "trial-balance-grid-row--default", width: 700, height: 140, name: "row-default.png" },
  { id: "trial-balance-grid-row--hover", width: 700, height: 140, name: "row-hover.png" },
  { id: "trial-balance-grid-row--selected", width: 700, height: 140, name: "row-selected.png" },
  { id: "trial-balance-grid-row--disabled-read-only", width: 700, height: 140, name: "row-disabled.png" },
  { id: "trial-balance-grid-row--error-state", width: 700, height: 140, name: "row-error.png" },
  { id: "trial-balance-grid-header-cell--sorted-ascending", width: 300, height: 120, name: "header-sorted-asc.png" },
  { id: "trial-balance-grid-header-cell--filter-active", width: 300, height: 120, name: "header-filter-active.png" },
  { id: "trial-balance-grid-cell--editing", width: 300, height: 120, name: "cell-editing.png" },
  { id: "trial-balance-grid-cell--error-state", width: 300, height: 120, name: "cell-error.png" },
  { id: "trial-balance-grid-toolbar--filters-applied", width: 700, height: 200, name: "toolbar-filters-applied.png" },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`${BASE}?id=${shot.id}&viewMode=story`, { waitUntil: "load", timeout: 15000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${shot.name}` });
  console.log("captured", shot.name);
}

await browser.close();
