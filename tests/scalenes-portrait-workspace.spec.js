const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

test('Scalenes portrait exposes topic controls in a contained drawer while bottom nav stays fixed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.locator('[data-open-muscle="scalenes"]').click();

  const atlas = page.locator('.anatomy-atlas[data-anatomy-atlas="scalenes"]');
  const panel = atlas.locator('.scalene-reference-panel');
  const nav = page.locator('.bottom-nav');
  await expect(atlas).toBeVisible();
  await expect(panel).toBeVisible();
  for (const label of ['Overview','Attachments','Actions','Nerves','Clinical','Related','Sources']) {
    await expect(panel.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  const navBefore = await nav.boundingBox();
  await page.evaluate(() => window.scrollTo(0, Math.min(document.body.scrollHeight, 900)));
  await page.waitForTimeout(120);
  const navAfter = await nav.boundingBox();
  expect(navBefore && navAfter).toBeTruthy();
  expect(Math.abs(navBefore.y - navAfter.y)).toBeLessThan(2);

  await panel.getByRole('button', { name: 'Attachments', exact: true }).click();
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