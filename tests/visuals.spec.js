const { test, expect } = require('@playwright/test');
const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

test.beforeEach(async ({ page }) => {
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
});

test('movement library exposes planes reference without losing context', async ({ page }) => {
  await page.getByRole('button',{name:/Move/i}).click();
  await expect(page.getByRole('heading',{name:/Movement → muscles → observations/i})).toBeVisible();
  await page.getByRole('button',{name:'View planes diagram'}).click();
  const dialog=page.locator('#planesVisualDialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('SAGITTAL')).toBeVisible();
  await expect(dialog.getByText('FRONTAL')).toBeVisible();
  await expect(dialog.getByText('TRANSVERSE')).toBeVisible();
  await dialog.getByRole('button',{name:/Close planes visual/i}).click();
  await expect(page.getByRole('heading',{name:/Movement → muscles → observations/i})).toBeVisible();
});

test('hip extension and squat show lightweight movement sequences', async ({ page }) => {
  await page.getByRole('button',{name:/Move/i}).click();
  const hipCard=page.locator('.record-card').filter({hasText:'Basic hip extension'});
  await hipCard.getByRole('button',{name:/Open movement analysis/i}).click();
  await expect(page.getByRole('heading',{name:'Basic hip extension'})).toBeVisible();
  const hipVisual=page.locator('.movement-visual-card');
  await hipVisual.getByText(/See movement — Hip flexion → extension/i).click();
  await expect(hipVisual.getByText(/Sitting \/ flexed/i)).toBeVisible();
  await expect(hipVisual.getByText(/iliopsoas lengthens as extension increases/i)).toBeVisible();
  await page.getByRole('button',{name:'← Back'}).click();

  const squatCard=page.locator('.record-card').filter({hasText:'Squat'});
  await squatCard.getByRole('button',{name:/Open movement analysis/i}).click();
  const squatVisual=page.locator('.movement-visual-card');
  await squatVisual.getByText(/See movement — Squat sequence/i).click();
  await expect(squatVisual.getByText('Bottom')).toBeVisible();
  await expect(squatVisual.getByText(/frontal\/transverse control/i).first()).toBeVisible();
});
