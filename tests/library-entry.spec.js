const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test.beforeEach(async({page})=>{await page.goto(base,{waitUntil:'domcontentloaded'});});

test('anatomy library can be narrowed by regional entrance without duplicating records',async({page})=>{
  await page.locator('button[data-route="anatomy"]').click();
  const menu=page.locator('#anatomyRegionMenu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button',{name:'Head & Neck'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Shoulder & Upper Arm'})).toBeVisible();
  await menu.getByRole('button',{name:'Head & Neck'}).click();
  await expect(page.getByRole('heading',{name:'Scalenes'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Gluteus maximus'})).not.toBeVisible();
  await page.locator('#anatomySearch').fill('sternocleidomastoid');
  await expect(page.getByRole('heading',{name:'Sternocleidomastoid'})).toBeVisible();
});

test('movement library opens through four plane families and permits legitimate overlap',async({page})=>{
  await page.locator('button[data-route="movement"]').click();
  const menu=page.locator('#movementPlaneMenu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button',{name:'Sagittal'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Frontal / scapular'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Transverse'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Multiplanar'})).toBeVisible();
  await menu.getByRole('button',{name:'Transverse'}).click();
  await expect(page.getByRole('heading',{name:'Basic thoracic rotation'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Push-up plus'})).not.toBeVisible();
  await menu.getByRole('button',{name:'Multiplanar'}).click();
  await expect(page.getByRole('heading',{name:'Bear crawl'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Side monkey'})).toBeVisible();
});
