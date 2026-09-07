const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function assertStableTop(page){
  const pos1=await page.evaluate(()=>({y:window.scrollY,header:document.querySelector('.app-header')?.getBoundingClientRect().bottom||0,card:document.querySelector('.record-card')?.getBoundingClientRect().top||0}));
  await page.waitForTimeout(260);
  const pos2=await page.evaluate(()=>({y:window.scrollY,header:document.querySelector('.app-header')?.getBoundingClientRect().bottom||0,card:document.querySelector('.record-card')?.getBoundingClientRect().top||0}));
  expect(Math.abs(pos2.y-pos1.y)).toBeLessThan(3);
  expect(pos2.card).toBeGreaterThanOrEqual(pos2.header-4);
  expect(pos2.card).toBeLessThan(pos2.header+90);
}

test('opening a muscle card snaps firmly to the card start',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/View .* muscle card|View muscle/i}).click();
  await expect(page.getByRole('heading',{name:'Scalenes',exact:true})).toBeVisible();
  await assertStableTop(page);
});

test('opening a movement card snaps firmly to the card start',async({page})=>{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('button[data-route="movement"]').click();
  await page.getByRole('button',{name:/Open movement analysis/i}).first().click();
  await expect(page.locator('[data-back-detail="movement"]')).toBeVisible();
  await assertStableTop(page);
});