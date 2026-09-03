const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function start(page,text){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'networkidle'});
  await page.locator('textarea').first().fill(text);
  await page.getByRole('button',{name:/build reasoning map/i}).click();
}
async function answerCurrent(page,value){
  const card=page.locator('.question-card');
  await card.getByRole('button',{name:value,exact:true}).click();
}

test('heaviness is captured as a symptom concept without being treated as weakness',async({page})=>{
  await start(page,'Pain and tightness in my right forearm and elbow. My hand feels heavy.');
  const captured=page.locator('[data-captured-intake="true"]');
  await expect(captured).toContainText(/heaviness/i);
  const facts=await page.evaluate(()=>window.NMT_REASONING.extractComplaintFacts('My right hand feels heavy and my forearm is tight.','forearm'));
  expect(facts.concepts.map(x=>x.label)).toContain('heaviness');
  expect(facts.answers.safety_neuro).toBeUndefined();
});

test('forearm interview stops after key questions unless the user chooses refinement',async({page})=>{
  await start(page,'Pain in forearm and elbow. Hand feels heavy.');
  await answerCurrent(page,'no'); // safety neuro
  await answerCurrent(page,'no'); // trauma/systemic
  await answerCurrent(page,'no'); // numbness/tingling
  await answerCurrent(page,'yes'); // lateral location
  await answerCurrent(page,'yes'); // gripping
  await expect(page.getByText(/first pass complete/i)).toBeVisible();
  await expect(page.getByRole('button',{name:/Refine reasoning/i})).toBeVisible();
  await page.getByRole('button',{name:/Use first pass/i}).click();
  await expect(page.getByText(/First-pass questions complete/i)).toBeVisible();
  await expect(page.getByText(/extending the wrist against light resistance/i)).toHaveCount(0);
});

test('optional refinement exposes deeper comparisons with progress and compact rationale',async({page})=>{
  await start(page,'Pain in forearm and elbow. Hand feels heavy.');
  await answerCurrent(page,'no');
  await answerCurrent(page,'no');
  await answerCurrent(page,'no');
  await answerCurrent(page,'yes');
  await answerCurrent(page,'yes');
  await page.getByRole('button',{name:/Refine reasoning/i}).click();
  await expect(page.locator('.question-card .pill')).toContainText(/refinement 1 of 4/i);
  await expect(page.getByText(/extending the wrist against light resistance/i)).toBeVisible();
  const card=page.locator('.hypothesis-card').first();
  await expect(card.locator('details.compact-reasoning')).toBeVisible();
  await expect(card.locator('details.compact-reasoning')).not.toHaveAttribute('open','');
  await expect(card.getByText(/Why this moved up/i)).toBeVisible();
});

test('start copy reflects all three validated reasoning neighborhoods',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await expect(page.getByText(/currently knows three deliberately small reasoning neighborhoods/i)).toBeVisible();
  await expect(page.getByText(/forearm\/lateral-elbow\/gripping/i)).toBeVisible();
});
