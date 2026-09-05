const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function referralSnapshot(page,id){
  return page.evaluate(id=>{
    const D=window.NMT_DATA,r=D.getReferralPattern(id);
    return {validationStatus:r?.validationStatus,artworkStatus:r?.artworkStatus,affectsReasoning:r?.affectsReasoning,sourceCount:r?.sourceIds?.length||0,areaCount:r?.referralAreas?.length||0,triggerCount:r?.triggerZones?.length||0,published:D.isReferralPatternPublished(id),sourcesResolve:(r?.sourceIds||[]).every(sourceId=>Boolean(D.SOURCES?.[sourceId]))};
  },id);
}

test('serratus and scalenes can have curated text while artwork remains unpublished and reasoning-neutral',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  for(const id of ['serratus-anterior','scalenes']){
    const result=await referralSnapshot(page,id);
    expect(result.validationStatus).toBe('curated-text');
    expect(result.artworkStatus).toBe('approved-source-of-truth-asset-required');
    expect(result.affectsReasoning).toBe(false);
    expect(result.sourceCount).toBeGreaterThanOrEqual(2);
    expect(result.areaCount).toBeGreaterThanOrEqual(3);
    expect(result.triggerCount).toBe(0);
    expect(result.sourcesResolve).toBe(true);
    expect(result.published).toBe(false);
  }
});

test('QL and iliopsoas have Travell-style text references but no copied or published referral artwork',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  for(const id of ['quadratus-lumborum','iliopsoas']){
    const r=await referralSnapshot(page,id);
    expect(r.validationStatus).toBe('curated-travell-text');
    expect(r.artworkStatus).toBe('approved-source-of-truth-asset-required');
    expect(r.affectsReasoning).toBe(false);
    expect(r.sourceCount).toBeGreaterThanOrEqual(2);
    expect(r.areaCount).toBeGreaterThanOrEqual(4);
    expect(r.triggerCount).toBe(0);
    expect(r.sourcesResolve).toBe(true);
    expect(r.published).toBe(false);
  }
});

test('serratus card shows sourced text but keeps visual map gated',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const atlas=page.locator('[data-anatomy-atlas="serratus-anterior"]');
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas).toContainText(/text pattern curated/i);
  await expect(atlas).toContainText(/5th–7th rib region/i);
  await expect(atlas).toContainText(/posterior chest wall/i);
  await expect(atlas).toContainText(/palmar 4th–5th fingers/i);
  await expect(atlas).toContainText(/approved referral artwork still required/i);
  await expect(atlas).toContainText(/not diagnostic/i);
  await expect(atlas.locator('img')).toHaveCount(0);
});

test('scalenes card shows broad sourced referral text without claiming a precise trigger map',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas).toContainText(/text pattern curated/i);
  await expect(atlas).toContainText(/same-side neck and shoulder region/i);
  await expect(atlas).toContainText(/radial-side distribution/i);
  await expect(atlas).toContainText(/ulnar-side arm/i);
  await expect(atlas).toContainText(/compare local, plexus, and cervical findings/i);
  await expect(atlas).toContainText(/approved referral artwork still required/i);
  await expect(atlas.locator('img')).toHaveCount(0);
});

test('QL card exposes broad Travell symptom neighborhoods without pretending they are a precise map',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('quadratus lumborum');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const atlas=page.locator('[data-anatomy-atlas="quadratus-lumborum"]');
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas).toContainText(/low-back region/i);
  await expect(atlas).toContainText(/buttock region/i);
  await expect(atlas).toContainText(/iliosacral region/i);
  await expect(atlas).toContainText(/lateral hip/i);
  await expect(atlas).toContainText(/exact point-by-point overlay remains gated/i);
  await expect(atlas).toContainText(/Triggerpoints.net/i);
  await expect(atlas.locator('img')).toHaveCount(0);
});

test('iliopsoas card preserves direct Travell lumbosacral description plus symptom neighborhoods',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('iliopsoas');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const atlas=page.locator('[data-anatomy-atlas="iliopsoas"]');
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas).toContainText(/vertical region parallel to the lumbosacral spine/i);
  await expect(atlas).toContainText(/groin region/i);
  await expect(atlas).toContainText(/anterior thigh region/i);
  await expect(atlas).toContainText(/iliosacral region/i);
  await expect(atlas).toContainText(/source artwork will not be copied/i);
  await expect(atlas.locator('img')).toHaveCount(0);
});
