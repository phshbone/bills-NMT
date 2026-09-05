const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('prototype referral records are present but unpublished content cannot affect reasoning',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>{
    const D=window.NMT_DATA;
    const ids=['serratus-anterior','scalenes','quadratus-lumborum','iliopsoas'];
    return ids.map(id=>{
      const r=D.getReferralPattern(id);
      return {
        id,
        exists:Boolean(r),
        validationStatus:r?.validationStatus,
        artworkStatus:r?.artworkStatus,
        affectsReasoning:r?.affectsReasoning,
        sourceCount:r?.sourceIds?.length||0,
        triggerCount:r?.triggerZones?.length||0,
        areaCount:r?.referralAreas?.length||0,
        published:D.isReferralPatternPublished(id)
      };
    });
  });
  for(const r of result){
    expect(r.exists).toBe(true);
    expect(r.validationStatus).toBe('pending-curation');
    expect(r.artworkStatus).toBe('approved-source-of-truth-asset-required');
    expect(r.affectsReasoning).toBe(false);
    expect(r.sourceCount).toBe(0);
    expect(r.triggerCount).toBe(0);
    expect(r.areaCount).toBe(0);
    expect(r.published).toBe(false);
  }
});

test('referred pain card remains visibly source-gated while referral record is pending',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const atlas=page.locator('[data-anatomy-atlas="serratus-anterior"]');
  await atlas.getByRole('tab',{name:'Referred Pain'}).click();
  await expect(atlas).toContainText(/visual in development/i);
  await expect(atlas).toContainText(/source-curated referred pain pattern/i);
  await expect(atlas).toContainText(/not diagnostic/i);
  await expect(atlas.locator('img')).toHaveCount(0);
});
