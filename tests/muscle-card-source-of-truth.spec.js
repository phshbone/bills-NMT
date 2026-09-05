const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openSerratus(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name:'Serratus anterior'})}).first();
  await card.getByRole('button',{name:/Open functional record/i}).click();
}

test('locked muscle-card hierarchy keeps essential anatomy visible and deeper reference collapsible',async({page})=>{
  await openSerratus(page);
  await expect(page.locator('.muscle-detail-card')).toBeVisible();
  const essentials=page.locator('.muscle-card-essentials');
  for(const label of ['Origin','Insertion','Action / function','Innervation'])await expect(essentials.getByText(label,{exact:true})).toBeVisible();
  const reference=page.locator('.muscle-card-reference');
  await expect(reference.getByText('Deeper reference')).toBeVisible();
  for(const label of ['Functional roles','Related structures','Related movements','Conservative categories','Sources']){
    await expect(reference.locator('summary',{hasText:label})).toBeVisible();
  }
  await expect(reference.locator('details[open]')).toHaveCount(0);
});

test('responsive adaptation preserves the same two-state component on phone and desktop',async({page},testInfo)=>{
  await openSerratus(page);
  const toggle=page.locator('.muscle-card-toggle');
  await expect(toggle.getByRole('tab',{name:'Anatomy'})).toBeVisible();
  await expect(toggle.getByRole('tab',{name:'Referred Pain'})).toBeVisible();
  await expect(page.locator('.muscle-card-essentials')).toBeVisible();
  const columns=await page.locator('.muscle-card-essentials').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
  if(testInfo.project.name.includes('iphone'))expect(columns.trim().split(/\s+/)).toHaveLength(1);
  else expect(columns.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2);
});