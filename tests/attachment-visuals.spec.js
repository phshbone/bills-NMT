const { test, expect } = require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

test.beforeEach(async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
});

test('planes diagram visibly intersects the figure in all three planes',async({page})=>{
  await page.getByRole('button',{name:/Move/i}).click();
  await page.getByRole('button',{name:'View planes diagram'}).click();
  const dialog=page.locator('#planesVisualDialog');
  await expect(dialog.locator('[data-plane-intersection="sagittal"]')).toBeVisible();
  await expect(dialog.locator('[data-plane-intersection="frontal"]')).toBeVisible();
  await expect(dialog.locator('[data-plane-intersection="transverse"]')).toBeVisible();
});

test('core muscle records expose compact origin insertion sketches',async({page})=>{
  await page.getByRole('button',{name:/Anatomy/i}).click();
  const search=page.locator('#anatomySearch');
  await search.fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const serratus=page.locator('.attachment-block');
  await expect(serratus.getByText(/Attachment sketch/i)).toBeVisible();
  await serratus.locator('summary').click();
  await expect(serratus.locator('[data-attachment-sketch="serratus-anterior"]')).toBeVisible();
  await expect(serratus).toContainText(/origin region/i);

  await page.getByRole('button',{name:/Anatomy/i}).click();
  await search.fill('iliopsoas');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const hip=page.locator('.attachment-block');
  await hip.locator('summary').click();
  await expect(hip.locator('[data-attachment-sketch="iliopsoas"]')).toBeVisible();
});