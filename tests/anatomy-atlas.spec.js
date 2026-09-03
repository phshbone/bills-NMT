const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openMuscle(page,name){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name})}).first();
  await card.getByRole('button',{name:/Open functional record/i}).click();
}

test('rich anatomy atlas uses one reusable viewer and does not fake missing layers with crops',async({page})=>{
  await openMuscle(page,'Iliopsoas');
  const atlas=page.locator('[data-anatomy-atlas="iliopsoas"]');
  await expect(atlas).toBeVisible();
  await expect(atlas.getByText(/Lumbar spine \/ pelvis \/ proximal femur/i)).toBeVisible();
  await expect(atlas.locator('img')).toHaveAttribute('src',/iliopsoas\.webp$/);
  await atlas.getByRole('tab',{name:'Muscle'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','muscle');
  await expect(atlas.locator('img')).toHaveCount(0);
  await expect(atlas.getByText(/will not fake this layer/i)).toBeVisible();
  await atlas.getByRole('tab',{name:'Referral'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','referral');
  await expect(atlas.locator('img')).toHaveCount(0);
  await expect(atlas.getByRole('heading',{name:/Source-curated referral layer/i})).toBeVisible();
});

test('attachment plate is shown complete rather than crop-zoomed on phone and desktop',async({page})=>{
  await openMuscle(page,'Scalenes');
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  const img=atlas.locator('img');
  await expect(img).toBeVisible();
  const fit=await img.evaluate(el=>getComputedStyle(el).objectFit);
  expect(fit).toBe('contain');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(1);
  await expect(page.locator('.rich-anatomy')).toHaveCount(0);
  await expect(page.locator('.attachment-block')).toHaveCount(0);

  await openMuscle(page,'Pectoralis minor');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(0);
  await expect(page.locator('.attachment-block')).toHaveCount(1);
});

test('all currently published atlas attachment assets load',async({page})=>{
  for(const name of ['Iliopsoas','Quadratus lumborum','Scalenes','Serratus anterior']){
    await openMuscle(page,name);
    const atlas=page.locator('.anatomy-atlas');
    await expect(atlas).toBeVisible();
    const ok=await atlas.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0);
    expect(ok).toBeTruthy();
  }
});