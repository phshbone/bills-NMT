const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('forearm reasoning muscle opens a regional visual placeholder and returns to reasoning',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('textarea').first().fill('Pain in right outer forearm near elbow. Gripping irritates it.');
  await page.getByRole('button',{name:/build reasoning map/i}).click();
  const ecrb=page.locator('.hypothesis-card').filter({has:page.getByRole('heading',{name:'Extensor carpi radialis brevis'})});
  await expect(ecrb).toBeVisible();
  await ecrb.getByRole('button',{name:/related anatomy/i}).click();
  const slot=page.locator('[data-regional-visual="extensor-carpi-radialis-brevis"]');
  await expect(slot).toBeVisible();
  await expect(slot).toContainText(/Forearm \/ elbow regional atlas/i);
  await expect(slot).toContainText(/dedicated muscle, attachment, and referral overlays have not been published yet/i);
  await expect(page.getByRole('button',{name:/back to reasoning/i})).toBeVisible();
  await page.getByRole('button',{name:/back to reasoning/i}).click();
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
  await expect(page.getByText(/Pain in right outer forearm near elbow/i)).toBeVisible();
});

test('published atlas and compact attachment records are not replaced by generic placeholder',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.locator('[data-anatomy-atlas="scalenes"]')).toBeVisible();
  await expect(page.locator('.regional-visual-slot')).toHaveCount(0);

  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('levator');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.locator('.attachment-block')).toBeVisible();
  await expect(page.locator('.regional-visual-slot')).toHaveCount(0);
});