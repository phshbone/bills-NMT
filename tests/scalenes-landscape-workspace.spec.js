const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

test('Scalenes landscape uses fixed anatomy plus topic reference workspace', async ({ page }) => {
  await page.setViewportSize({ width: 896, height: 414 });
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.locator('[data-open-muscle="scalenes"]').click();

  const atlas = page.locator('.anatomy-atlas[data-anatomy-atlas="scalenes"]');
  const visual = atlas.locator('.atlas-visual-column');
  const panel = atlas.locator('.scalene-reference-panel');
  await expect(atlas).toBeVisible();
  await expect(visual).toBeVisible();
  await expect(panel).toBeVisible();
  await expect.poll(() => atlas.evaluate(el => getComputedStyle(el).position)).toBe('fixed');
  await expect.poll(() => visual.evaluate(el => getComputedStyle(el).overflowY)).not.toBe('auto');
  await expect.poll(() => panel.locator('.scalene-reference-content').evaluate(el => getComputedStyle(el).overflowY)).toBe('auto');

  const back = atlas.locator('[data-back-detail].scalene-context-back');
  await expect(back).toBeVisible();
  await expect(back).toHaveText('← Back');

  const topics = [
    ['Attachments', 'Attachments'],
    ['Actions', 'Actions & function'],
    ['Nerves', 'Nerves & nearby anatomy'],
    ['Clinical', 'Clinical context'],
    ['Related', 'Related'],
    ['Sources', 'Sources & deeper reference']
  ];
  for (const [button, heading] of topics) {
    await panel.getByRole('button', { name: button, exact: true }).click();
    await expect(panel.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }

  await panel.getByRole('button', { name: 'Clinical', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Conservative Options', exact: true })).toBeVisible();
  await panel.getByRole('button', { name: 'Related', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Relationship Map', exact: true })).toBeVisible();
});
