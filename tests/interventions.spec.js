const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';
async function answer(page,value){await page.getByRole('button',{name:value,exact:true}).first().click()}

test.beforeEach(async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
});

test('lower-back reasoning offers non-diagnostic conservative options and Move handoff',async({page})=>{
  await page.getByRole('button',{name:'Use low-back prototype'}).click();
  await answer(page,'no');
  await answer(page,'no');
  await answer(page,'no');
  await answer(page,'no');
  await answer(page,'one side');
  await answer(page,'yes');
  await answer(page,'yes');
  await answer(page,'yes');

  const card=page.locator('.hypothesis-card').filter({hasText:'Iliopsoas'});
  await expect(card).toBeVisible();
  await card.getByRole('button',{name:'Conservative options'}).click();

  const dialog=page.locator('#interventionExplorer');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Iliopsoas'})).toBeVisible();
  await expect(dialog.getByText(/does not establish that the iliopsoas is the cause/i)).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Gentle hip-flexor mobility'})).toBeVisible();
  await expect(dialog.getByText(/Reassess:/).first()).toBeVisible();
  const hss=dialog.getByRole('link',{name:/Hospital for Special Surgery/}).first();
  await expect(hss).toHaveAttribute('href',/hss\.edu/);

  await dialog.getByRole('button',{name:/Open in Move: Basic hip extension/i}).first().click();
  await expect(page.getByRole('heading',{name:'Basic hip extension'})).toBeVisible();
});

test('upper-quarter intervention options preserve conservative wording',async({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await answer(page,'no');
  await answer(page,'no');
  await answer(page,'yes');
  await answer(page,'yes');
  await answer(page,'yes');
  await answer(page,'yes');

  const card=page.locator('.hypothesis-card').filter({hasText:'Serratus anterior'});
  await card.getByRole('button',{name:'Conservative options'}).click();
  const dialog=page.locator('#interventionExplorer');
  await expect(dialog.getByText(/does not by itself identify nerve injury/i)).toBeVisible();
  await expect(dialog.getByRole('heading',{name:/Pain-tolerable scapular protraction control/i})).toBeVisible();
  await expect(dialog.getByText(/Stop and reconsider/i)).toBeVisible();
  await expect(dialog.getByText(/outside the normal educational\/self-care pathway/i)).toBeVisible();
});
