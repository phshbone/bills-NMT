const {test,expect}=require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

async function clear(page){
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
}
async function choose(page,id,value){
  await page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`).click();
}
async function storedAnswer(page,id){
  return page.evaluate(answerId=>JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1')||'{}').active?.answers?.[answerId],id);
}

test.beforeEach(async({page})=>clear(page));

test('upper pathway stops at a useful first pass before optional deeper checks',async({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await choose(page,'safety_neuro','no');
  await choose(page,'safety_trauma','no');
  await choose(page,'uq_cervical_rotation','yes');
  await choose(page,'uq_sidebend','yes');
  await choose(page,'uq_wing','yes');
  await expect(page.locator('[data-answer-id="__refine_upper"]')).toHaveCount(2);
  await expect(page.getByText(/enough for a useful first-pass comparison/i)).toBeVisible();
  await choose(page,'__refine_upper','not now');
  await expect(page.locator('[data-answer-id="uq_shrug"]')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Reassess'})).toBeVisible();
});

test('lower pathway stops after safety, location, extension behavior, and distribution unless refinement is chosen',async({page})=>{
  await page.getByRole('button',{name:'Use low-back prototype'}).click();
  await choose(page,'safety_neuro','no');
  await choose(page,'safety_bladder','no');
  await choose(page,'safety_trauma','no');
  await choose(page,'safety_abdominal','no');
  await choose(page,'lb_unilateral','one side');
  await choose(page,'lb_extension','yes');
  await choose(page,'lb_referral','stays local');
  await expect(page.locator('[data-answer-id="__refine_lower"]')).toHaveCount(2);
  await choose(page,'__refine_lower','refine');

  const sitting=await storedAnswer(page,'lb_sitting');
  if(sitting==null){
    await expect(page.locator('[data-answer-id="lb_sitting"]').first()).toBeVisible();
  }else{
    expect(sitting).toBe('yes');
    await expect(page.locator('[data-answer-id="lb_hip_extension"]').first()).toBeVisible();
  }
});

test('a detailed opening description removes matching upper movement questions before first-pass refinement',async({page})=>{
  const box=page.locator('#complaintInput');
  await box.fill('Right neck and shoulder blade ache. Turning my neck is restricted and side-bending hurts. No weakness, major numbness, or loss of arm function.');
  await page.getByRole('button',{name:/Build reasoning map/i}).click();
  await expect.poll(()=>storedAnswer(page,'safety_neuro')).toBe('no');
  await expect(page.locator('[data-answer-id="safety_neuro"]')).toHaveCount(0);
  const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1')||'{}').active);
  expect(active.answers.uq_cervical_rotation).toBe('yes');
  expect(active.answers.uq_sidebend).toBe('yes');
});