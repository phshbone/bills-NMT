const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function route(page,text){
  await page.goto(base,{waitUntil:'networkidle'});
  return page.evaluate((input)=>{
    const R=window.NMT_REASONING,D=window.NMT_DATA;
    const ranked=R.rankPathways(input,D).map(x=>({id:x.pathway.id,score:x.score,semanticScore:x.semanticScore,reasons:x.reasons}));
    return {id:R.detectPathway(input,D)?.id||null,concepts:R.extractRoutingConcepts(input),ranked};
  },text);
}

test('forearm and gripping concepts outrank generic upper-quarter language',async({page})=>{
  const r=await route(page,'My right forearm near the outside of the elbow hurts and gripping a coffee cup makes it worse.');
  expect(r.id).toBe('forearm');
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'region',value:'forearm'}),
    expect.objectContaining({type:'region',value:'elbow'}),
    expect.objectContaining({type:'subregion',value:'lateral-elbow'}),
    expect.objectContaining({type:'behavior',value:'gripping'})
  ]));
  expect(r.ranked[0].id).toBe('forearm');
});

test('ordinary neck and scapular wording routes upper-quarter',async({page})=>{
  const r=await route(page,'My neck is tight and turning it makes the area by my shoulder blade hurt, especially with pull-ups.');
  expect(r.id).toBe('upper');
  expect(r.ranked[0].semanticScore).toBeGreaterThanOrEqual(5);
});

test('low-back function wording routes lower pathway',async({page})=>{
  const r=await route(page,'My lower back hurts after sitting and I have trouble standing fully upright.');
  expect(r.id).toBe('lower');
  expect(r.ranked[0].id).toBe('lower');
});

test('vague unsupported complaints are not forced into a pathway',async({page})=>{
  const r=await route(page,'Something feels strange today and I cannot really tell where it is coming from.');
  expect(r.id).toBeNull();
});

test('hand wording alone does not overclaim a validated forearm pathway',async({page})=>{
  const r=await route(page,'My hand feels odd sometimes.');
  expect(r.id).toBeNull();
});
