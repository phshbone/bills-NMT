const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openMuscle(page,name){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name})}).first();
  await card.getByRole('button',{name:/Open functional record/i}).click();
}

test('muscle card exposes Anatomy and Referred Pain as the two primary views',async({page})=>{
  await openMuscle(page,'Iliopsoas');
  const atlas=page.locator('[data-anatomy-atlas="iliopsoas"]');
  await expect(atlas).toBeVisible();
  await expect(atlas.getByRole('tab',{name:'Anatomy'})).toBeVisible();
  await expect(atlas.getByRole('tab',{name:'Referred Pain'})).toBeVisible();
  await expect(atlas.getByRole('tab')).toHaveCount(2);
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','anatomy');
  await expect(atlas.locator('img')).toHaveAttribute('src',/iliopsoas\.webp$/);
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','referral');
  await expect(atlas.locator('img')).toHaveCount(0);
  await expect(atlas.getByRole('heading',{name:/Described referred-pain pattern/i})).toBeVisible();
  await expect(atlas).toContainText(/Travell and Simons described/i);
  await expect(atlas).toContainText(/Approved referral artwork still required/i);
  await expect(atlas.getByText(/not diagnostic/i)).toBeVisible();
});

test('anatomy plate is shown complete rather than crop-zoomed on phone and desktop',async({page})=>{
  await openMuscle(page,'Scalenes');
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  const img=atlas.locator('img');
  await expect(img).toBeVisible();
  const fit=await img.evaluate(el=>getComputedStyle(el).objectFit);
  expect(fit).toBe('contain');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(1);

  await openMuscle(page,'Pectoralis minor');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(0);
  await expect(page.locator('.attachment-block')).toHaveCount(1);
});

test('all currently published atlas anatomy assets load',async({page})=>{
  for(const name of ['Iliopsoas','Quadratus lumborum','Scalenes','Serratus anterior']){
    await openMuscle(page,name);
    const atlas=page.locator('.anatomy-atlas');
    await expect(atlas).toBeVisible();
    const ok=await atlas.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0);
    expect(ok).toBeTruthy();
  }
});