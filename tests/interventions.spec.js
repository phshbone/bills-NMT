const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';
async function choose(page,id,value){await page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`).click()}

test.beforeEach(async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
});

test('lower-back reasoning offers non-diagnostic conservative options and Move handoff',async({page})=>{
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
  await card.getByRole('button',{name:'Conservative options'}).click();

  const dialog=page.locator('#interventionExplorer');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Iliopsoas'})).toBeVisible();
  await expect(dialog.getByText(/does not establish that the iliopsoas is the cause/i)).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Gentle hip-flexor mobility'})).toBeVisible();
  await expect(dialog.getByText(/Reassess:/).first()).toBeVisible();
  const hss=dialog.getByRole('link',{name:/Hospital for Special Surgery/}).first();
  await expect(hss).toHaveAttribute('href',/hss\.edu/);

  await dialog.getByRole('button',{name:/Open in Move: Basic hip extension/i}).first().click();
  await expect(page.getByRole('heading',{name:'Basic hip extension'})).toBeVisible();
});

test('upper-quarter intervention options preserve conservative wording',async({page})=>{
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
  await card.getByRole('button',{name:'Conservative options'}).click();
  const dialog=page.locator('#interventionExplorer');
  await expect(dialog.getByText(/does not by itself identify nerve injury/i)).toBeVisible();
  await expect(dialog.getByRole('heading',{name:/Pain-tolerable scapular protraction control/i})).toBeVisible();
  await expect(dialog.getByText(/Stop and reconsider/i)).toBeVisible();
  await expect(dialog.getByText(/outside the normal educational\/self-care pathway/i)).toBeVisible();
});