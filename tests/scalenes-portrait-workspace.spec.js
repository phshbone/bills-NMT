const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

test('Scalenes portrait keeps a sticky compact topic strip and contained drawer while bottom nav stays fixed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.locator('[data-open-muscle="scalenes"]').click();

  const atlas = page.locator('.anatomy-atlas[data-anatomy-atlas="scalenes"]');
  const panel = atlas.locator('.scalene-reference-panel');
  const strip = atlas.locator('.scalene-phone-topic-strip');
  const nav = page.locator('.bottom-nav');
  await expect(atlas).toBeVisible();
  await expect(strip).toBeVisible();
  for (const label of ['Overview','Attachments','Actions','Nerves','Clinical','Related','Sources']) {
    await expect(strip.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  await strip.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(120);
  const sticky = await page.evaluate(() => {
    const header = document.querySelector('.app-header')?.getBoundingClientRect();
    const strip = document.querySelector('.scalene-phone-topic-strip')?.getBoundingClientRect();
    return header && strip ? { headerBottom: header.bottom, stripTop: strip.top } : null;
  });
  expect(sticky).toBeTruthy();
  expect(Math.abs(sticky.stripTop - sticky.headerBottom)).toBeLessThan(5);

  const navBefore = await nav.boundingBox();
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(120);
  const navAfter = await nav.boundingBox();
  expect(navBefore && navAfter).toBeTruthy();
  expect(Math.abs(navBefore.y - navAfter.y)).toBeLessThan(2);

  await strip.getByRole('button', { name: 'Attachments', exact: true }).click();
  await expect(panel).toHaveClass(/phone-topic-open/);
  const drawer = panel.locator('.scalene-reference-content');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('heading', { name: 'Attachments', exact: true })).toBeVisible();
  const drawerBox = await drawer.boundingBox();
  const viewport = page.viewportSize();
  expect(drawerBox.height).toBeLessThan(viewport.height * .46);
  await drawer.getByRole('button', { name: 'Close reference panel' }).click();
  await expect(drawer).toBeHidden();
});