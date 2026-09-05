const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function openScalenes(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Scalenes',exact:true})).toBeVisible();
}

test('phone reference control opens a partial-height sheet and restores anatomy context',async({page})=>{
  test.skip(page.viewportSize().width>700,'phone-only behavior');
  await openScalenes(page);
  const atlas=page.locator('[data-anatomy-atlas="scalenes"]');
  await expect(atlas).toBeVisible();
  await page.getByRole('button',{name:'Attachment Detail',exact:true}).click();
  const sheet=page.locator('.muscle-reference-sheet.open');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('heading',{name:'Attachment Detail'})).toBeVisible();
  await expect(sheet).toContainText(/Anterior tubercles of the transverse processes of C3–C6/i);
  const viewport=page.viewportSize();
  const sheetBox=await sheet.boundingBox();
  expect(sheetBox.height).toBeLessThan(viewport.height*.5);
  const contextVisible=await page.evaluate(()=>{
    const el=document.querySelector('[data-anatomy-atlas="scalenes"]');
    if(!el)return false;
    const r=el.getBoundingClientRect();
    const sheet=document.querySelector('.muscle-reference-sheet.open');
    const s=sheet?.getBoundingClientRect();
    return r.bottom>0&&r.top<(s?.top||innerHeight);
  });
  expect(contextVisible).toBe(true);
  await sheet.getByRole('button',{name:'Close reference'}).click();
  await expect(sheet).not.toHaveClass(/open/);
});

test('desktop reference control retains full-section behavior',async({page})=>{
  test.skip(page.viewportSize().width<=700,'desktop-only behavior');
  await openScalenes(page);
  await page.getByRole('button',{name:'Attachment Detail',exact:true}).click();
  await expect(page.locator('.muscle-reference-sheet.open')).toHaveCount(0);
  await expect(page.locator('details[data-detail-label="Attachment detail"]')).toHaveAttribute('open','');
});
