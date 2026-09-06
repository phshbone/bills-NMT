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
  await expect(atlas).toContainText(/Original referral artwork still required/i);
  await expect(atlas.getByText(/not diagnostic/i)).toBeVisible();
});

test('Scalenes is assembled as the first Tier-2 card without promoting unverified artwork to fact',async({page})=>{
  await openMuscle(page,'Scalenes');
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  await expect(atlas).toBeVisible();
  await expect(atlas).toHaveAttribute('data-visual-tier','2');
  await expect(atlas.getByRole('tab',{name:'Main'})).toBeVisible();
  await expect(atlas.getByRole('tab',{name:'Attachment detail'})).toBeVisible();
  await expect(atlas.locator('.atlas-orientation')).toContainText('PROXIMAL');
  await expect(atlas.locator('.atlas-orientation')).toContainText('DISTAL');
  await expect(atlas.locator('.atlas-reciprocal')).toContainText(/Travell-derived composite pattern/i);
  await expect(atlas.locator('.atlas-note')).toContainText(/reference asset until final visual verification/i);

  await atlas.getByRole('tab',{name:'Attachment detail'}).click();
  await expect(atlas.locator('.atlas-stage')).toContainText(/Anterior scalene/i);
  await expect(atlas.locator('.atlas-stage')).toContainText(/C3–C6/i);
  await expect(atlas.locator('.atlas-stage')).toContainText(/1st rib/i);
  await expect(atlas.locator('.atlas-stage')).toContainText(/2nd rib/i);
  await expect(atlas.locator('.atlas-stage')).toContainText(/brachial plexus/i);
  await expect(atlas.locator('.atlas-stage')).toContainText(/visual pending/i);

  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas.locator('.atlas-stage')).toHaveAttribute('data-mode','referral');
  await expect(atlas.locator('.atlas-subtabs')).toBeHidden();
  await expect(atlas.locator('.atlas-orientation')).toBeHidden();
  await expect(atlas.locator('.atlas-curated-referral')).toContainText(/Travell-derived pattern/i);
  await expect(atlas.locator('.atlas-curated-referral')).toContainText(/Trigger Point Pain Patterns Flip Charts/i);
  await expect(atlas.locator('.atlas-reciprocal')).toHaveAttribute('data-reciprocal-mode','anatomy');

  await atlas.getByRole('tab',{name:'Anatomy'}).click();
  await expect(atlas.locator('.atlas-subtabs')).toBeVisible();
  await expect(atlas.locator('.atlas-orientation')).toBeVisible();
});

test('anatomy plate is shown complete rather than crop-zoomed on phone and desktop',async({page})=>{
  await openMuscle(page,'Scalenes');
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  const img=atlas.locator('.atlas-stage img');
  await expect(img).toBeVisible();
  const fit=await img.evaluate(el=>getComputedStyle(el).objectFit);
  expect(fit).toBe('contain');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(1);

  await openMuscle(page,'Pectoralis minor');
  await expect(page.locator('.anatomy-atlas')).toHaveCount(0);
  await expect(page.locator('.attachment-block')).toHaveCount(1);
});

test('verified anatomy stays distinct from gated or reference-stage visuals',async({page})=>{
  for(const name of ['Iliopsoas','Quadratus lumborum']){
    await openMuscle(page,name);
    const atlas=page.locator('.anatomy-atlas');
    await expect(atlas).toBeVisible();
    const ok=await atlas.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0);
    expect(ok).toBeTruthy();
  }
  await openMuscle(page,'Scalenes');
  const scalenes=page.locator('[data-anatomy-atlas="scalenes"]');
  await expect(scalenes.locator('.atlas-note')).toContainText(/final visual verification/i);

  await openMuscle(page,'Serratus anterior');
  const serratus=page.locator('[data-anatomy-atlas="serratus-anterior"]');
  await expect(serratus).toBeVisible();
  await expect(serratus.locator('img')).toHaveCount(0);
  await expect(serratus).toContainText(/visual in development|does not yet have a published dedicated anatomy visual/i);
});