const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('serratus referral text can be curated while artwork remains unpublished and reasoning-neutral',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>{
    const D=window.NMT_DATA;
    const r=D.getReferralPattern('serratus-anterior');
    return {
      validationStatus:r?.validationStatus,
      artworkStatus:r?.artworkStatus,
      affectsReasoning:r?.affectsReasoning,
      sourceCount:r?.sourceIds?.length||0,
      areaCount:r?.referralAreas?.length||0,
      triggerCount:r?.triggerZones?.length||0,
      published:D.isReferralPatternPublished('serratus-anterior')
    };
  });
  expect(result.validationStatus).toBe('curated-text');
  expect(result.artworkStatus).toBe('approved-source-of-truth-asset-required');
  expect(result.affectsReasoning).toBe(false);
  expect(result.sourceCount).toBeGreaterThanOrEqual(2);
  expect(result.areaCount).toBeGreaterThanOrEqual(3);
  expect(result.triggerCount).toBe(0);
  expect(result.published).toBe(false);
});

test('other prototype referral records remain pending and cannot affect reasoning',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>{
    const D=window.NMT_DATA;
    return ['scalenes','quadratus-lumborum','iliopsoas'].map(id=>{
      const r=D.getReferralPattern(id);
      return {id,validationStatus:r?.validationStatus,artworkStatus:r?.artworkStatus,affectsReasoning:r?.affectsReasoning,sourceCount:r?.sourceIds?.length||0,areaCount:r?.referralAreas?.length||0,published:D.isReferralPatternPublished(id)};
    });
  });
  for(const r of result){
    expect(r.validationStatus).toBe('pending-curation');
    expect(r.artworkStatus).toBe('approved-source-of-truth-asset-required');
    expect(r.affectsReasoning).toBe(false);
    expect(r.sourceCount).toBe(0);
    expect(r.areaCount).toBe(0);
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
