const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openScalenes(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Scalenes',exact:true})).toBeVisible();
}

test('phone reference control compacts card and keeps anatomy above the sheet',async({page})=>{
  test.skip(page.viewportSize().width>700,'phone-only behavior');
  await openScalenes(page);
  const card=page.locator('.record-card').filter({has:page.getByRole('heading',{name:'Scalenes',exact:true})});
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  const essentials=page.locator('.muscle-card-essentials');
  await expect(atlas).toBeVisible();
  await expect(essentials).toBeVisible();
  await page.getByRole('button',{name:'Attachment Detail',exact:true}).click();
  const sheet=page.locator('.muscle-reference-sheet.open');
  await expect(sheet).toBeVisible();
  await expect(card).toHaveClass(/reference-mode/);
  await expect(essentials).toBeHidden();
  await expect(sheet.getByRole('heading',{name:'Attachment Detail'})).toBeVisible();
  await expect(sheet).toContainText(/Anterior tubercles of the transverse processes of C3–C6/i);
  const viewport=page.viewportSize();
  const sheetBox=await sheet.boundingBox();
  expect(sheetBox.height).toBeLessThan(viewport.height*.46);
  const separated=await page.evaluate(()=>{
    const atlas=document.querySelector('[data-anatomy-atlas="scalenes"]');
    const sheet=document.querySelector('.muscle-reference-sheet.open');
    if(!atlas||!sheet)return false;
    const a=atlas.getBoundingClientRect();
    const s=sheet.getBoundingClientRect();
    return a.bottom>0&&a.top<s.top&&a.bottom<=s.top+3;
  });
  expect(separated).toBe(true);
  await sheet.getByRole('button',{name:'Close reference'}).click();
  await expect(sheet).not.toHaveClass(/open/);
  await expect(card).not.toHaveClass(/reference-mode/);
  await expect(essentials).toBeVisible();
});

test('desktop reference control retains full-section behavior',async({page})=>{
  test.skip(page.viewportSize().width<=700,'desktop-only behavior');
  await openScalenes(page);
  await page.getByRole('button',{name:'Attachment Detail',exact:true}).click();
  await expect(page.locator('.muscle-reference-sheet.open')).toHaveCount(0);
  await expect(page.locator('.record-card.reference-mode')).toHaveCount(0);
  await expect(page.locator('details[data-detail-label="Attachment detail"]')).toHaveAttribute('open','');
});
