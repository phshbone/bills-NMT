const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test.beforeEach(async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
});

test('complaint intake uses one short field hint and one complete guidance block',async({page})=>{
  const input=page.locator('#complaintInput');
  await expect(input).toHaveAttribute('placeholder','Describe it in your own words…');
  const note=page.locator('[data-intake-guidance]');
  await expect(note).toContainText(/Describe as much or as little as you know/i);
  await expect(note).toContainText(/ask only for useful details that are still missing/i);
});

test('forearm intake distinguishes heaviness from numbness and progressive neurological loss',async({page})=>{
  await page.locator('#complaintInput').fill('elbow sore');
  await page.getByRole('button',{name:/build reasoning map/i}).click();
  await expect(page.getByText(/sudden difficulty using the arm or leg normally/i)).toBeVisible();
  await page.getByRole('button',{name:'no',exact:true}).click();
  await page.getByRole('button',{name:'no',exact:true}).click();
  await expect(page.getByRole('button',{name:'heaviness without numbness/tingling',exact:true})).toBeVisible();
});

test('clinician report opens in an escapable in-app preview',async({page})=>{
  await page.locator('#complaintInput').fill('elbow sore');
  await page.getByRole('button',{name:/build reasoning map/i}).click();
  await page.getByRole('button',{name:/Clinician PDF \/ Print/i}).click();
  const preview=page.locator('.report-preview');
  await expect(preview).toBeVisible();
  await expect(preview.getByRole('button',{name:'Print / Save PDF'})).toBeVisible();
  await preview.getByRole('button',{name:'Back to app'}).click();
  await expect(preview).toHaveCount(0);
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
});

test('muscle menu separates promoted actions from reference controls and hides duplicate action rows',async({page})=>{
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  const menu=page.locator('#muscle-section-menu');
  await expect(menu.getByText('Open',{exact:true})).toBeVisible();
  await expect(menu.getByText('Reference',{exact:true})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Relationship Map'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Conservative Options'})).toBeVisible();
  await expect(page.locator('.muscle-card-detail-section[data-detail-label="Relationship map"]')).toBeHidden();
  await expect(page.locator('.muscle-card-detail-section[data-detail-label="Conservative intervention"]')).toBeHidden();
});