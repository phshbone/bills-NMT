const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openScalenes(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name:'Scalenes'})}).first();
  await card.getByRole('button',{name:/View .* muscle card|View muscle/i}).click();
  return page.locator('[data-anatomy-atlas="scalenes"]');
}

test('Scalenes anatomy keeps referral context and orientation visible without changing Tier 2',async({page})=>{
  const atlas=await openScalenes(page);
  await expect(atlas).toHaveAttribute('data-visual-tier','2');
  await expect(atlas.locator('.scalene-referral-inset')).toBeVisible();
  await expect(atlas.locator('.scalene-referral-inset')).toContainText('Referred pain preview');
  await expect(atlas.locator('.scalene-referral-inset')).toContainText(/original schematic/i);
  await expect(atlas.locator('.scalene-soft-compass')).toBeVisible();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','anatomy');
  await atlas.locator('.scalene-referral-inset').click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','referral');
});

test('Scalenes referral inset and compass remain inside the fixed landscape anatomy pane',async({page})=>{
  await page.setViewportSize({width:844,height:390});
  const atlas=await openScalenes(page);
  const visual=atlas.locator('.atlas-visual-column');
  const inset=atlas.locator('.scalene-referral-inset');
  const compass=atlas.locator('.scalene-soft-compass');
  await expect(inset).toBeVisible();
  await expect(compass).toBeVisible();
  const [visualBox,insetBox,compassBox]=await Promise.all([visual.boundingBox(),inset.boundingBox(),compass.boundingBox()]);
  expect(visualBox&&insetBox&&compassBox).toBeTruthy();
  expect(insetBox.x).toBeGreaterThanOrEqual(visualBox.x);
  expect(insetBox.x+insetBox.width).toBeLessThanOrEqual(visualBox.x+visualBox.width+1);
  expect(compassBox.x).toBeGreaterThanOrEqual(visualBox.x);
  expect(compassBox.x+compassBox.width).toBeLessThanOrEqual(visualBox.x+visualBox.width+1);
});
