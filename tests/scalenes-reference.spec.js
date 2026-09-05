const {test,expect}=require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

test('verified Scalene reference overlay loads canonical attachments, neural relationships, and Travell provenance',async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:15000});

  const data=await page.evaluate(()=>{
    const m=window.NMT_DATA?.MUSCLES?.find(x=>x.id==='scalenes');
    const r=window.NMT_DATA?.REFERRAL_PATTERNS?.scalenes;
    return {
      origin:m?.origin,
      insertion:m?.insertion,
      innervation:m?.innervation,
      anterior:m?.attachmentDetail?.anterior,
      middle:m?.attachmentDetail?.middle,
      posterior:m?.attachmentDetail?.posterior,
      visualRelationships:m?.visualRelationships,
      sourceIds:m?.sourceIds,
      anatomyValidationStatus:m?.anatomyValidationStatus,
      anatomyVisualStatus:m?.anatomyVisualStatus,
      referralSourceIds:r?.sourceIds,
      referralValidationStatus:r?.validationStatus,
      referralArtworkStatus:r?.artworkStatus
    };
  });

  expect(data.origin).toMatch(/anterior tubercles of C3–C6/i);
  expect(data.insertion).toMatch(/scalene tubercle/i);
  expect(data.insertion).toMatch(/2nd rib/i);
  expect(data.innervation).toMatch(/C3–C8/i);
  expect(data.anterior.keyRelationship).toMatch(/phrenic nerve/i);
  expect(data.middle.keyRelationship).toMatch(/brachial plexus/i);
  expect(data.posterior.keyRelationship).toMatch(/long thoracic nerve/i);
  expect(data.visualRelationships.some(x=>x.structure==='Brachial plexus'&&x.priority==='show')).toBeTruthy();
  expect(data.sourceIds).toEqual(expect.arrayContaining(['travell_context','travell_flipcharts','triggerpoints_scalene','scalene_statpearls']));
  expect(data.referralSourceIds).toEqual(expect.arrayContaining(['travell_context','travell_flipcharts','triggerpoints_scalene']));
  expect(data.anatomyValidationStatus).toBe('verified-structured-text');
  expect(data.anatomyVisualStatus).toBe('pending-verified-original-artwork');
  expect(data.referralValidationStatus).toBe('curated-travell-text');
  expect(data.referralArtworkStatus).toBe('approved-source-of-truth-asset-required');
});

test('Scalenes card exposes verified attachment text and structured deeper anatomy while unverified artwork remains gated',async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:15000});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('Scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Scalenes',exact:true})).toBeVisible();

  const essentials=page.locator('.muscle-card-essentials');
  await expect(essentials.getByText(/anterior tubercles of C3–C6/i)).toBeVisible();
  await expect(essentials.getByText(/scalene tubercle on the superior surface of the 1st rib/i)).toBeVisible();
  await expect(essentials.getByText(/C3–C8/i)).toBeVisible();

  const attachment=page.locator('details[data-detail-label="Attachment detail"]');
  await expect(attachment).toBeVisible();
  await attachment.locator('summary').click();
  await expect(attachment.getByText('Anterior',{exact:true})).toBeVisible();
  await expect(attachment.getByText('Middle',{exact:true})).toBeVisible();
  await expect(attachment.getByText('Posterior',{exact:true})).toBeVisible();
  await expect(attachment.getByText(/phrenic nerve courses on the surface of anterior scalene/i)).toBeVisible();
  await expect(attachment.getByText(/brachial plexus roots\/trunks pass between anterior and middle scalenes/i)).toBeVisible();

  const nearby=page.locator('details[data-detail-label="Nearby anatomy"]');
  await expect(nearby).toBeVisible();
  await nearby.locator('summary').click();
  await expect(nearby.getByText(/Brachial plexus:/i)).toBeVisible();
  await expect(nearby.getByText(/proximity does not establish a diagnosis/i)).toBeVisible();
});