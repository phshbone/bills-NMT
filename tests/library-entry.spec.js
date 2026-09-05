const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test.beforeEach(async({page})=>{await page.goto(base,{waitUntil:'domcontentloaded'});});

test('anatomy library uses a contained regional panel without duplicating records',async({page})=>{
  await page.locator('button[data-route="anatomy"]').click();
  const menu=page.locator('#anatomyRegionMenu');
  const panel=page.locator('#anatomyLibraryPanel');
  await expect(menu).toBeVisible();
  await expect(panel).toBeVisible();
  await expect(menu.getByRole('button',{name:'Head & Neck'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Shoulder & Upper Arm'})).toBeVisible();
  await menu.getByRole('button',{name:'Head & Neck'}).click();
  await expect(page.getByRole('heading',{name:'Scalenes'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Gluteus maximus'})).not.toBeVisible();
  await expect(panel.locator('[data-library-caption="anatomy"]')).toContainText('Head & Neck');
  await page.locator('#anatomySearch').fill('sternocleidomastoid');
  await expect(page.getByRole('heading',{name:'Sternocleidomastoid'})).toBeVisible();
});

test('anatomy region and search state survive a canonical muscle round trip',async({page})=>{
  await page.locator('button[data-route="anatomy"]').click();
  const menu=page.locator('#anatomyRegionMenu');
  await menu.getByRole('button',{name:'Back & Lumbar'}).click();
  await page.locator('#anatomySearch').fill('quadratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Quadratus lumborum',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/Back/i}).first().click();
  const restored=page.locator('#anatomyRegionMenu');
  await expect(restored.getByRole('button',{name:'Back & Lumbar'})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#anatomySearch')).toHaveValue('quadratus');
  await expect(page.getByRole('heading',{name:'Quadratus lumborum'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Scalenes'})).not.toBeVisible();
});

test('movement library opens through four plane families in a contained panel',async({page})=>{
  await page.locator('button[data-route="movement"]').click();
  const menu=page.locator('#movementPlaneMenu');
  const panel=page.locator('#movementLibraryPanel');
  await expect(menu).toBeVisible();
  await expect(panel).toBeVisible();
  await expect(menu.getByRole('button',{name:'Sagittal'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Frontal / scapular'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Transverse'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Multiplanar'})).toBeVisible();
  await menu.getByRole('button',{name:'Transverse'}).click();
  await expect(page.getByRole('heading',{name:'Basic thoracic rotation'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Push-up plus'})).not.toBeVisible();
  await expect(panel.locator('[data-library-caption="movement"]')).toContainText('Transverse');
  await menu.getByRole('button',{name:'Multiplanar'}).click();
  await expect(page.getByRole('heading',{name:'Bear crawl'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Side monkey'})).toBeVisible();
});

test('movement plane survives a movement-card round trip',async({page})=>{
  await page.locator('button[data-route="movement"]').click();
  const menu=page.locator('#movementPlaneMenu');
  await menu.getByRole('button',{name:'Transverse'}).click();
  await page.getByRole('button',{name:/Open movement analysis/i}).first().click();
  await page.getByRole('button',{name:/Back/i}).first().click();
  const restored=page.locator('#movementPlaneMenu');
  await expect(restored.getByRole('button',{name:'Transverse'})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('heading',{name:'Basic thoracic rotation'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Push-up plus'})).not.toBeVisible();
});
