const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function inspect(page,text){
  await page.goto(base,{waitUntil:'networkidle'});
  return page.evaluate((input)=>{
    const R=window.NMT_REASONING,D=window.NMT_DATA;
    return {
      normalized:R.normalizeClinicalVocabulary?.(input)||null,
      concepts:R.extractRoutingConcepts(input),
      pathway:R.detectPathway(input,D)?.id||null
    };
  },text);
}

test('QL shorthand and T12/rib 12 landmarks normalize into one lower-quarter reasoning neighborhood',async({page})=>{
  const r=await inspect(page,'My right QL near T12 and rib 12 gets tight when I stand upright.');
  expect(r.normalized).not.toBeNull();
  expect(r.normalized.original).toContain('right QL near T12');
  expect(r.normalized.matches).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'structure',id:'quadratus-lumborum'}),
    expect.objectContaining({type:'landmark',id:'t12-level'}),
    expect.objectContaining({type:'landmark',id:'rib-12'})
  ]));
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'structure',value:'quadratus-lumborum'}),
    expect.objectContaining({type:'landmark',value:'t12-level'}),
    expect.objectContaining({type:'landmark',value:'rib-12'}),
    expect.objectContaining({type:'region',value:'low-back'})
  ]));
  expect(r.pathway).toBe('lower');
});

test('clinical upper-quarter shorthand routes through the same concepts as ordinary anatomical language',async({page})=>{
  const r=await inspect(page,'Right SCM and upper trap feel tight and turning my neck changes it.');
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'structure',value:'sternocleidomastoid'}),
    expect.objectContaining({type:'structure',value:'upper-trapezius'}),
    expect.objectContaining({type:'region',value:'neck'}),
    expect.objectContaining({type:'behavior',value:'neck-rotation'})
  ]));
  expect(r.pathway).toBe('upper');
});

test('landmark language is retained as landmark context rather than converted into a muscle diagnosis',async({page})=>{
  const r=await inspect(page,'Pain around C1 on the right side with some tightness near the upper neck.');
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'landmark',value:'upper-cervical'}),
    expect.objectContaining({type:'region',value:'neck'})
  ]));
  expect(r.concepts.filter(x=>x.type==='structure')).toHaveLength(0);
  expect(r.pathway).toBe('upper');
});

test('T12 alone remains a thoracolumbar landmark and does not manufacture a QL structure concept',async({page})=>{
  const r=await inspect(page,'The right side around T12 bothers me when standing.');
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'landmark',value:'t12-level'})
  ]));
  expect(r.concepts).not.toEqual(expect.arrayContaining([
    expect.objectContaining({type:'structure',value:'quadratus-lumborum'})
  ]));
  expect(r.pathway).toBe('lower');
});

test('lay wording continues to work without requiring shorthand',async({page})=>{
  const r=await inspect(page,'The right side of my lower back near the bottom rib hurts more when I stand upright.');
  expect(r.pathway).toBe('lower');
  expect(r.concepts).toEqual(expect.arrayContaining([
    expect.objectContaining({type:'region',value:'low-back'})
  ]));
});