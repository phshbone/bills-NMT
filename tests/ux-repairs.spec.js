const { test, expect } = require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

async function resetStorage(page){
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
}

test.beforeEach(async ({page})=>{await resetStorage(page)});

test('active reasoning can be reset from the top without deleting saved sessions',async({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await expect(page.getByRole('button',{name:'Reset reasoning'})).toBeVisible();
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:'Reset reasoning'}).click();
  await expect(page.getByRole('heading',{name:'Start with ordinary language.'})).toBeVisible();
});

test('regional anatomy search recognizes shoulder chest and underarm vocabulary',async({page})=>{
  await page.getByRole('button',{name:/Anatomy/i}).click();
  const search=page.locator('#anatomySearch');
  await search.fill('shoulder');
  await expect(page.locator('.record-card:visible').filter({hasText:'Rotator cuff group'})).toBeVisible();
  await expect(page.locator('.record-card:visible').filter({hasText:'Serratus anterior'})).toBeVisible();
  await search.fill('chest');
  await expect(page.locator('.record-card:visible').filter({hasText:'Pectoralis major'})).toBeVisible();
  await expect(page.locator('.record-card:visible').filter({hasText:'Pectoralis minor'})).toBeVisible();
  await search.fill('underarm');
  await expect(page.locator('.record-card:visible').filter({hasText:'Serratus anterior'})).toBeVisible();
  await expect(page.locator('.record-card:visible').filter({hasText:'Latissimus dorsi'})).toBeVisible();
});

test('unsure movement answers keep relevant structures pending instead of treating them as negative',async({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await page.getByRole('button',{name:'no',exact:true}).first().click();
  await page.getByRole('button',{name:'no',exact:true}).first().click();
  await page.getByRole('button',{name:'unsure',exact:true}).first().click();
  const scalenes=page.locator('.hypothesis-card').filter({has:page.getByRole('heading',{name:'Scalenes'})});
  await expect(scalenes).toBeVisible();
  await expect(scalenes).toContainText(/Not yet tested|missing evidence/i);
});