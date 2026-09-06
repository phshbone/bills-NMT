const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test.beforeEach(async({page})=>{await page.goto(base,{waitUntil:'domcontentloaded'});});

test('canonical anatomy v0.3 ingests all 155 records without inventing movement IDs',async({page})=>{
  const audit=await page.evaluate(()=>{
    const D=window.NMT_DATA;
    const C=window.NMT_CANONICAL_ANATOMY;
    return {
      sourceCount:C?.records?.length,
      expected:D?.CANONICAL_ANATOMY?.expectedCount,
      actual:D?.CANONICAL_ANATOMY?.actualCount,
      runtimeCanonical:D?.CANONICAL_ANATOMY?.ingestion?.runtimeCanonicalCount,
      duplicates:D?.CANONICAL_ANATOMY?.ingestion?.duplicateCanonicalIds?.length,
      missing:D?.CANONICAL_ANATOMY?.ingestion?.missingRuntimeCanonicalIds?.length,
      invalidMoves:D?.CANONICAL_ANATOMY?.ingestion?.invalidCanonicalMovementIds?.length,
      uniqueIds:new Set(C?.records?.map(r=>r.c)||[]).size
    };
  });
  expect(audit.sourceCount).toBe(155);
  expect(audit.expected).toBe(155);
  expect(audit.actual).toBe(155);
  expect(audit.runtimeCanonical).toBe(155);
  expect(audit.uniqueIds).toBe(155);
  expect(audit.duplicates).toBe(0);
  expect(audit.missing).toBe(0);
  expect(audit.invalidMoves).toBe(0);
});

test('Scalenes remains one runtime record with canonical facts and richer overlay available',async({page})=>{
  const data=await page.evaluate(()=>{
    const matches=window.NMT_DATA.MUSCLES.filter(m=>m.name==='Scalenes');
    const m=matches[0];
    return {
      count:matches.length,
      canonicalId:m?.canonicalId,
      factualStatus:m?.factualStatus,
      visualStatus:m?.visualStatus,
      triggerpointsUrl:m?.canonicalReferral?.triggerpointsUrl,
      travellReference:m?.canonicalReferral?.travellReference,
      structuralSources:m?.canonicalStructuralSources?.length,
      overlay:!!window.NMT_DATA.SCALENES_REFERENCE
    };
  });
  expect(data.count).toBe(1);
  expect(data.canonicalId).toBe('hn.scalenes');
  expect(data.factualStatus).toBe('Ready');
  expect(data.visualStatus).toBe('Artwork_pending');
  expect(data.triggerpointsUrl).toContain('triggerpoints.net');
  expect(data.travellReference).toContain('20.1');
  expect(data.structuralSources).toBeGreaterThanOrEqual(2);
  expect(data.overlay).toBe(true);
});

test('canonical records are visible through existing Anatomy library while app-only composites remain available',async({page})=>{
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('pronator quadratus');
  await expect(page.getByRole('heading',{name:'Pronator quadratus'})).toBeVisible();
  await page.locator('#anatomySearch').fill('rotator cuff');
  await expect(page.getByRole('heading',{name:'Rotator cuff group'})).toBeVisible();
});
