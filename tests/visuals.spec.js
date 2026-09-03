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
  const hipVisual=page.locator('details.visual-block').filter({hasText:'Hip flexion → extension'});
  await hipVisual.locator('summary').click();
  await expect(hipVisual.getByText(/Sitting \/ flexed/i)).toBeVisible();
  await expect(hipVisual.getByText(/iliopsoas lengthens as extension increases/i)).toBeVisible();
  await page.getByRole('button',{name:'← Back'}).click();

  const squatCard=page.locator('.record-card').filter({hasText:'Squat'});
  await squatCard.getByRole('button',{name:/Open movement analysis/i}).click();
  const squatVisual=page.locator('details.visual-block').filter({hasText:'Squat sequence'});
  await squatVisual.locator('summary').click();
  await expect(squatVisual.getByText('Bottom')).toBeVisible();
  await expect(squatVisual.getByText(/frontal\/transverse control/i)).toBeVisible();
});

test('upper and trunk movements expose compact visual examples', async ({ page }) => {
  await page.getByRole('button',{name:/Move/i}).click();
  const cases=[
    ['Basic cervical rotation','Cervical rotation','Turn right'],
    ['Basic trunk side-bending','Trunk side-bending','Side-bend'],
    ['Basic thoracic rotation','Thoracic rotation','Rotate'],
    ['Wall slide','Wall slide / upward rotation','Overhead']
  ];
  for(const [movement,title,frame] of cases){
    const card=page.locator('.record-card').filter({hasText:movement});
    await card.getByRole('button',{name:/Open movement analysis/i}).click();
    await expect(page.getByRole('heading',{name:movement})).toBeVisible();
    const visual=page.locator('details.visual-block').filter({hasText:title});
    await visual.locator('summary').click();
    await expect(visual.getByText(frame,{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'← Back'}).click();
  }
});
