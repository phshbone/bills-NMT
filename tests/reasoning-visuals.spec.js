const { test, expect } = require('@playwright/test');
const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

async function answer(page,value){
  await page.getByRole('button',{name:value,exact:true}).first().click();
}

test.beforeEach(async ({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
});

test('low-back hypothesis exposes hip-extension visual in place', async ({page})=>{
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
  const visual=card.locator('.reasoning-inline-visual');
  await expect(visual.getByText(/See movement — Hip flexion → extension/i)).toBeVisible();
  await visual.getByText(/See movement — Hip flexion → extension/i).click();
  await expect(visual.getByText(/Sitting \/ flexed/i)).toBeVisible();
  await expect(visual.getByText(/does not prove that this structure/i)).toBeVisible();
});

test('upper-quarter hypothesis exposes wall-slide visual in place', async ({page})=>{
  await page.getByRole('button',{name:'Use upper-quarter prototype'}).click();
  await answer(page,'no');
  await answer(page,'no');
  await answer(page,'yes');
  await answer(page,'yes');
  await answer(page,'yes');
  await answer(page,'yes');

  const card=page.locator('.hypothesis-card').filter({hasText:'Serratus anterior'});
  await expect(card).toBeVisible();
  const visual=card.locator('.reasoning-inline-visual');
  await expect(visual.getByText(/See movement — Wall slide \/ upward rotation/i)).toBeVisible();
  await visual.getByText(/See movement — Wall slide \/ upward rotation/i).click();
  await expect(visual.getByText(/As the arms rise/i)).toBeVisible();
  await expect(visual.getByText(/does not prove that this structure/i)).toBeVisible();
});