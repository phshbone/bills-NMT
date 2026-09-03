const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openMuscle(page,name){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Anatomy'}).click();
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name})}).first();
  await card.getByRole('button',{name:/Open functional record/i}).click();
}

test('rich anatomy atlas uses one reusable layered viewer for prototype muscles',async({page})=>{
  await openMuscle(page,'Iliopsoas');
  const atlas=page.locator('[data-anatomy-atlas="iliopsoas"]');
  await expect(atlas).toBeVisible();
  await expect(atlas.getByText(/Lumbar spine \/ pelvis \/ proximal femur/i)).toBeVisible();
  await expect(atlas.locator('img')).toHaveAttribute('src',/iliopsoas\.webp$/);
  await atlas.getByRole('tab',{name:'Muscle'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','muscle');
  await atlas.getByRole('tab',{name:'Referral'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','referral');
  await expect(atlas.getByText(/not diagnostic/i)).toBeVisible();
});

test('upper-quarter atlas reuses regional architecture and preserves old fallback elsewhere',async({page})=>{
  await openMuscle(page,'Scalenes');
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  await expect(atlas).toBeVisible();
  await expect(atlas.getByText(/Neck \/ shoulder \/ upper thorax/i)).toBeVisible();
  await expect(atlas.locator('img')).toHaveAttribute('src',/scalenes\.webp$/);
  await expect(page.locator('.attachment-block.atlas-replaced')).toHaveCount(1);
});

test('all currently rich prototype assets load through the atlas registry',async({page})=>{
  for(const name of ['Iliopsoas','Quadratus lumborum','Scalenes','Serratus anterior']){
    await openMuscle(page,name);
    const atlas=page.locator('.anatomy-atlas');
    await expect(atlas).toBeVisible();
    const ok=await atlas.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0);
    expect(ok).toBeTruthy();
  }
});