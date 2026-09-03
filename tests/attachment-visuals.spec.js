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

test('prototype muscles expose atlas anatomy and source-safe referral placeholder',async({page})=>{
  await page.getByRole('button',{name:/Anatomy/i}).click();
  const search=page.locator('#anatomySearch');
  await search.fill('iliopsoas');
  await page.getByRole('button',{name:/Open functional record/i}).click();

  const atlas=page.locator('[data-anatomy-atlas="iliopsoas"]');
  await expect(atlas).toBeVisible();
  await expect(atlas.locator('img')).toHaveAttribute('src','assets/anatomy/iliopsoas.webp');
  await expect(atlas.getByRole('tab',{name:'Attachments'})).toHaveAttribute('aria-selected','true');

  await atlas.getByRole('tab',{name:'Muscle'}).click();
  await expect(atlas.locator('img')).toHaveCount(0);
  await expect(atlas).toContainText(/will not fake this layer/i);

  await atlas.getByRole('tab',{name:'Referral'}).click();
  await expect(atlas.locator('img')).toHaveCount(0);
  await expect(atlas).toContainText(/referral layer/i);
  await expect(atlas).toContainText(/not diagnostic/i);
});

test('atlas covers rich upper prototype while non-atlas muscles retain compact sketch fallback',async({page})=>{
  await page.getByRole('button',{name:/Anatomy/i}).click();
  const search=page.locator('#anatomySearch');
  await search.fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const serratus=page.locator('[data-anatomy-atlas="serratus-anterior"]');
  await expect(serratus.locator('img')).toHaveAttribute('src','assets/anatomy/serratus-anterior.webp');

  await page.getByRole('button',{name:/Anatomy/i}).click();
  await search.fill('levator');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const fallback=page.locator('.attachment-block');
  await expect(fallback.getByText(/Attachment sketch/i)).toBeVisible();
  await fallback.locator('summary').click();
  await expect(fallback.locator('[data-attachment-sketch="levator-scapulae"]')).toBeVisible();
});