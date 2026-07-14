import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.click('.envelope-gate');

const frames = [200, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3300];
let elapsed = 0;
for (const t of frames) {
  await page.waitForTimeout(t - elapsed);
  elapsed = t;
  await page.screenshot({ path: `/tmp/m-${String(t).padStart(4, '0')}.png` });
}

console.log('ERRORS:', JSON.stringify(errors));
await browser.close();
