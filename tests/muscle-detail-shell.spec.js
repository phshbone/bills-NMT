const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('forearm reasoning muscle opens the canonical functional record and returns to reasoning',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('textarea').first().fill('Pain in right outer forearm near elbow. Gripping irritates it.');
  await page.getByRole('button',{name:/build reasoning map/i}).click();
  const ecrb=page.locator('.hypothesis-card').filter({has:page.getByRole('heading',{name:'Extensor carpi radialis brevis'})});
  await expect(ecrb).toBeVisible();
  await ecrb.getByRole('button',{name:/related anatomy/i}).click();
  await expect(page.getByRole('heading',{name:'Extensor carpi radialis brevis',exact:true})).toBeVisible();
  await expect(page.getByText(/Lateral epicondyle via the common extensor tendon/i)).toBeVisible();
  await expect(page.locator('.regional-visual-slot')).toHaveCount(0);
  const back=page.getByRole('button',{name:/back to reasoning/i});
  await expect(back).toBeVisible();
  await back.click();
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
  await expect(page.getByText(/Pain in right outer forearm near elbow/i)).toBeVisible();
});

test('anatomy drill-down returns to the previous functional record instead of the anatomy index',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('serratus anterior');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Serratus anterior',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Rotator cuff group',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Rotator cuff group',exact:true})).toBeVisible();
  const back=page.getByRole('button',{name:/Back to Serratus anterior/i});
  await expect(back).toBeVisible();
  await back.click();
  await expect(page.getByRole('heading',{name:'Serratus anterior',exact:true})).toBeVisible();
  await expect(page.locator('#anatomySearch')).toHaveCount(0);
});

test('verified atlas and compact attachment records remain canonical without generic regional placeholders',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.locator('[data-anatomy-atlas="scalenes"]')).toBeVisible();
  await expect(page.locator('.regional-visual-slot')).toHaveCount(0);

  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('levator');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.locator('.attachment-block')).toBeVisible();
  await expect(page.locator('.regional-visual-slot')).toHaveCount(0);
});