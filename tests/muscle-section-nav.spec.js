const {test,expect}=require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

async function openSerratus(page){
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).first().click();
  await expect(page.getByRole('heading',{name:'Serratus anterior'})).toBeVisible();
}

test('muscle card places local reference navigation directly below the primary anatomy card',async({page})=>{
  await openSerratus(page);
  const atlas=page.locator('.muscle-card-primary');
  const menu=page.locator('#muscle-section-menu');
  await expect(atlas).toBeVisible();
  await expect(menu).toBeVisible();
  const follows=await page.evaluate(()=>{
    const atlas=document.querySelector('.muscle-card-primary');
    return atlas?.nextElementSibling?.id==='muscle-section-menu';
  });
  expect(follows).toBe(true);
  await expect(menu.getByRole('button',{name:'Relationship Map'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Related Structures'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Related Movements'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Functional Roles'})).toBeVisible();
  await expect(menu.getByRole('button',{name:'Sources'})).toBeVisible();
});

test('relationship map is promoted to a one-tap muscle menu action',async({page})=>{
  await openSerratus(page);
  await page.locator('#muscle-section-menu').getByRole('button',{name:'Relationship Map'}).click();
  const dialog=page.locator('#relationshipExplorer');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Serratus anterior'})).toBeVisible();
  await expect(dialog.getByText(/Why this connects/i)).toBeVisible();
});

test('reference control uses bottom sheet on phone and full section on desktop',async({page})=>{
  await openSerratus(page);
  await page.locator('#muscle-section-menu').getByRole('button',{name:'Related Movements'}).click();
  const section=page.locator('.muscle-card-detail-section[data-detail-label="Related movements"]');
  if(page.viewportSize().width<=700){
    const sheet=page.locator('.muscle-reference-sheet.open');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('heading',{name:'Related Movements'})).toBeVisible();
    await expect(section).not.toHaveJSProperty('open',true);
  }else{
    await expect(section).toHaveJSProperty('open',true);
    const back=section.getByRole('button',{name:/Back to muscle menu/i});
    await expect(back).toBeVisible();
    await back.click();
    await expect(page.locator('#muscle-section-menu')).toBeVisible();
  }
});