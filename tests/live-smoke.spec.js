const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

async function answer(page, value) {
  await page.getByRole('button', { name: value, exact: true }).first().click();
}

test.beforeEach(async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Clinical Reasoning Map/i);
  await expect(page.getByRole('heading', { name: 'Clinical Reasoning Map' })).toBeVisible();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  page.__pageErrors = pageErrors;
});

test.afterEach(async ({ page }) => {
  expect(page.__pageErrors || []).toEqual([]);
});

test('low-back reasoning path updates, reassesses, and preserves navigation state', async ({ page }) => {
  await page.getByRole('button', { name: 'Use low-back prototype' }).click();

  await expect(page.getByText('Why are you asking?')).toBeVisible();
  await page.getByText('Why are you asking?').first().click();
  await expect(page.getByText(/Progressive neurological loss/i)).toBeVisible();

  await answer(page, 'no');
  await answer(page, 'no');
  await answer(page, 'no');
  await answer(page, 'no');
  await answer(page, 'one side');
  await answer(page, 'yes');
  await answer(page, 'yes');
  await answer(page, 'yes');

  const iliopsoasCard = page.locator('.hypothesis-card').filter({ hasText: 'Iliopsoas' });
  await expect(iliopsoasCard).toBeVisible();
  await expect(iliopsoasCard).toContainText(/hip-flexor|hip extension/i);

  await page.locator('[data-reset-answer="lb_hip_extension"]').click();
  await expect(page.getByRole('heading', { name: /extending the hip/i })).toBeVisible();
  await answer(page, 'no');
  await expect(iliopsoasCard).toContainText(/weakens/i);

  await answer(page, 'no');
  await answer(page, 'no');
  await answer(page, 'yes');
  await answer(page, 'stays local');
  await expect(page.getByRole('heading', { name: 'Reassess' })).toBeVisible();

  await page.locator('#reassessTarget').selectOption('iliopsoas');
  await page.locator('#reassessChange').selectOption({ label: 'improved' });
  await page.locator('#reassessRange').selectOption({ label: 'smoother / more range' });
  await page.locator('#reassessNotes').fill('Small hip-extension change improved the familiar restriction.');
  await page.getByRole('button', { name: 'Update reassessment' }).click();
  await expect(iliopsoasCard).toContainText(/improved after a conservative change/i);

  await iliopsoasCard.getByRole('button', { name: 'Related anatomy' }).click();
  await expect(page.getByRole('heading', { name: 'Iliopsoas' })).toBeVisible();
  await page.getByRole('button', { name: 'Basic hip extension' }).click();
  await expect(page.getByRole('heading', { name: 'Basic hip extension' })).toBeVisible();
  await page.getByRole('button', { name: '← Back' }).click();
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
  await expect(page.locator('#reassessTarget')).toHaveValue('iliopsoas');

  await page.getByRole('button', { name: /Observe/i }).click();
  await expect(page.getByRole('heading', { name: /Notice the pattern first/i })).toBeVisible();
  await expect(page.getByText('Difficulty standing fully upright')).toBeVisible();
});

test('upper-quarter path strengthens serratus consideration and supports movement links', async ({ page }) => {
  await page.getByRole('button', { name: 'Use upper-quarter prototype' }).click();
  await answer(page, 'no');
  await answer(page, 'no');
  await answer(page, 'yes');
  await answer(page, 'yes');
  await answer(page, 'yes');
  await answer(page, 'yes');

  const serratusCard = page.locator('.hypothesis-card').filter({ hasText: 'Serratus anterior' });
  await expect(serratusCard).toBeVisible();
  await expect(serratusCard).toContainText(/winging|scapular/i);

  await serratusCard.getByRole('button', { name: 'Related anatomy' }).click();
  await expect(page.getByRole('heading', { name: 'Serratus anterior' })).toBeVisible();
  await expect(page.getByText(/Long thoracic nerve/i)).toBeVisible();
  await page.getByRole('button', { name: 'Wall slide' }).click();
  await expect(page.getByRole('heading', { name: 'Wall slide' })).toBeVisible();

  await page.getByRole('button', { name: /Sessions/i }).click();
  await expect(page.getByRole('button', { name: 'Export JSON' })).toBeVisible();
  await expect(page.getByText(/Reasoning sessions stay on this device/i)).toBeVisible();
});
