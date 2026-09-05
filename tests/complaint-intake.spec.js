const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function start(page,text){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'networkidle'});
  await page.locator('textarea').first().fill(text);
  await page.getByRole('button',{name:/build reasoning map/i}).click();
}

test('explicit complaint facts are extracted conservatively',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{
    const text='Pain in my right forearm, tightness when I grip, but no numbness or tingling.';
    const p=window.NMT_REASONING.detectPathway(text,window.NMT_DATA);
    return {path:p?.id,facts:window.NMT_REASONING.extractComplaintFacts(text,p?.id)};
  });
  expect(result.path).toBe('forearm');
  expect(result.facts.answers.fa_grip).toBe('yes');
  expect(result.facts.answers.fa_paresthesia).toBe('no');
  expect(result.facts.answers.safety_neuro).toBeUndefined();
  expect(result.facts.concepts.map(x=>x.label)).toEqual(expect.arrayContaining(['right side','forearm','gripping aggravates','no numbness/tingling']));
});

test('complaint wording pre-fills matching forearm questions instead of asking them again',async({page})=>{
  await start(page,'Pain in my right forearm, tightness when I grip, but no numbness or tingling.');
  const captured=page.locator('[data-captured-intake="true"]');
  await expect(captured).toBeVisible();
  await expect(captured).toContainText(/right side/i);
  await expect(captured).toContainText(/gripping aggravates/i);
  await expect(captured).toContainText(/no numbness\/tingling/i);

  await page.getByRole('button',{name:'no',exact:true}).first().click();
  await page.getByRole('button',{name:'no',exact:true}).first().click();

  await expect(page.getByRole('heading',{name:/Any numbness or tingling/i})).toHaveCount(0);
  await expect.poll(async()=>{
    return page.evaluate(()=>JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1')||'{}').active?.answers?.fa_paresthesia);
  }).toBe('no');
  await expect.poll(async()=>{
    return page.evaluate(()=>JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1')||'{}').active?.answers?.fa_grip);
  }).toBe('yes');
});

test('ambiguous sensory wording remains unknown',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const facts=await page.evaluate(()=>window.NMT_REASONING.extractComplaintFacts('My forearm feels weird when I use it.','forearm'));
  expect(facts.answers.fa_paresthesia).toBeUndefined();
});

test('detailed lower-back description removes redundant follow-up questions',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{
    const minimal='My lower back hurts.';
    const detailed='Pain in my right lower back. Standing fully upright is harder and painful than bending forward. It is worse after prolonged sitting. Side-bending to the right reproduces it. Easy walking improves the stiffness. It stays local.';
    const R=window.NMT_REASONING,D=window.NMT_DATA;
    return {minimal:R.intakeProfile(minimal,'lower',D),detailed:R.intakeProfile(detailed,'lower',D)};
  });
  expect(result.minimal.extractedCount).toBeLessThan(result.detailed.extractedCount);
  expect(result.detailed.extractedCount).toBeGreaterThanOrEqual(5);
  expect(result.detailed.answered).toEqual(expect.arrayContaining(['lb_unilateral','lb_extension','lb_sitting','lb_sidebend','lb_walking','lb_referral']));
  expect(result.detailed.facts.answers.lb_unilateral).toBe('one side');
  expect(result.detailed.facts.answers.lb_referral).toBe('stays local');
});

test('upper-quarter movement details are reused rather than asked twice',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const facts=await page.evaluate(()=>window.NMT_REASONING.extractComplaintFacts('Pain on the right side of my neck. Turning my neck left is restricted and painful. Side-bending right reproduces the familiar pain.','upper'));
  expect(facts.answers.uq_cervical_rotation).toBe('yes');
  expect(facts.answers.uq_sidebend).toBe('yes');
  expect(facts.concepts.map(x=>x.label)).toEqual(expect.arrayContaining(['neck rotation restricted or symptom-producing','neck side-bending restricted or symptom-producing']));
});

test('intake copy supports short or detailed descriptions without separate user modes',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await expect(page.locator('.field-label')).toContainText(/Where are you feeling the problem/i);
  await expect(page.locator('[data-intake-guidance="true"]')).toContainText(/ask only for useful details that are still missing/i);
  await expect(page.locator('#complaintInput')).toHaveAttribute('placeholder',/as much or as little as you know/i);
});

test('unsupported complaint guidance remains single even after repeated analyze taps',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#complaintInput').fill('Pain under the inside ankle bone near my heel.');
  const build=page.getByRole('button',{name:/build reasoning map/i});
  await build.click();
  await build.click();
  const notices=page.locator('label .notice.small').filter({hasText:/does not yet have a validated reasoning neighborhood/i});
  await expect(notices).toHaveCount(1);
  await expect(notices).toContainText(/validated prototype pathways/i);
});