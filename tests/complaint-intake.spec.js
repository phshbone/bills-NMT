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