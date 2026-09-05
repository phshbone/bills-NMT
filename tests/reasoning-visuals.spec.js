const { test, expect } = require('@playwright/test');
const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

async function choose(page,id,value){
  await page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`).click();
}

test.beforeEach(async ({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
});

test('low-back hypothesis exposes hip-extension visual in place', async ({page})=>{
  await page.getByRole('button',{name:'Use low-back prototype'}).click();
  await choose(page,'safety_neuro','no');
  await choose(page,'safety_bladder','no');
  await choose(page,'safety_trauma','no');
  await choose(page,'safety_abdominal','no');
  await choose(page,'lb_unilateral','one side');
  await choose(page,'lb_extension','yes');
  await choose(page,'lb_referral','stays local');
  await choose(page,'__refine_lower','refine');
  if(await page.locator('[data-answer-id="lb_sitting"]').count())await choose(page,'lb_sitting','yes');
  await choose(page,'lb_hip_extension','yes');

  const card=page.locator('.hypothesis-card').filter({hasText:'Iliopsoas'});
  await expect(card).toBeVisible();
  const visual=card.locator('.reasoning-inline-visual');
  await expect(visual.getByText(/See movement — Hip flexion → extension/i)).toBeVisible();
  await visual.getByText(/See movement — Hip flexion → extension/i).click();
  await expect(visual.getByText(/Sitting \/ flexed/i)).toBeVisible();
  await expect(visual.getByText(/does not prove that this structure/i)).toBeVisible();
});

test('upper-quarter hypothesis exposes wall-slide visual in place', async ({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await choose(page,'safety_neuro','no');
  await choose(page,'safety_trauma','no');
  await choose(page,'uq_cervical_rotation','yes');
  await choose(page,'uq_sidebend','yes');
  await choose(page,'uq_wing','yes');
  await choose(page,'__refine_upper','refine');
  await choose(page,'uq_shrug','yes');
  await choose(page,'uq_wallslide','yes');

  const card=page.locator('.hypothesis-card').filter({hasText:'Serratus anterior'});
  await expect(card).toBeVisible();
  const visual=card.locator('.reasoning-inline-visual');
  await expect(visual.getByText(/See movement — Wall slide \/ upward rotation/i)).toBeVisible();
  await visual.getByText(/See movement — Wall slide \/ upward rotation/i).click();
  await expect(visual.getByText(/As the arms rise/i)).toBeVisible();
  await expect(visual.getByText(/does not prove that this structure/i)).toBeVisible();
});