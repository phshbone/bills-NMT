const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('observe keeps four high-yield records and adds non-diagnostic motion cues',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('button[data-route="observation"]').click();
  const cards=page.locator('.record-card');
  await expect(cards).toHaveCount(4);
  await expect(page.getByRole('heading',{name:'Scapular winging'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Early shoulder shrug'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Difficulty standing fully upright'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Pelvic drop during gait/single-leg stance'})).toBeVisible();
  await expect(page.locator('.observation-cue')).toHaveCount(4);
  await expect(page.getByText(/Visual comparison only · not a diagnostic test/i).first()).toBeVisible();
});
