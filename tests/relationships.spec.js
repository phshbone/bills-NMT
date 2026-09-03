const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

test('manual upper-quarter relationship traversal preserves context', async ({ page }) => {
  const pageErrors=[];
  page.on('pageerror',err=>pageErrors.push(err.message));
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});

  await page.getByRole('button',{name:/Anatomy/i}).click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await expect(page.getByRole('heading',{name:'Scalenes'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Explore connections/})).toBeVisible();

  await page.getByRole('button',{name:/Explore connections/}).click();
  const dialog=page.locator('#relationshipExplorer');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Scalenes'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Brachial plexus'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'First rib'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Sternocleidomastoid'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Levator scapulae'})).toBeVisible();

  await dialog.getByRole('button',{name:'Brachial plexus'}).click();
  await expect(dialog.getByRole('heading',{name:'Brachial plexus'})).toBeVisible();
  await expect(dialog.getByText(/between the anterior and middle scalenes/i).first()).toBeVisible();
  await dialog.getByRole('button',{name:'← Back'}).click();
  await expect(dialog.getByRole('heading',{name:'Scalenes'})).toBeVisible();

  await dialog.getByRole('button',{name:'Sternocleidomastoid'}).click();
  await expect(dialog.getByRole('heading',{name:'Sternocleidomastoid'})).toBeVisible();
  await dialog.getByRole('button',{name:'← Back'}).click();
  await expect(dialog.getByRole('heading',{name:'Scalenes'})).toBeVisible();

  await dialog.getByRole('button',{name:'Close'}).click();
  await expect(page.getByRole('heading',{name:'Scalenes'})).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('serratus relationship traversal exposes long thoracic and scapulothoracic links', async ({ page }) => {
  await page.goto(TARGET,{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:/Anatomy/i}).click();
  await page.locator('#anatomySearch').fill('serratus');
  await page.getByRole('button',{name:/Open functional record/i}).click();
  await page.getByRole('button',{name:/Explore connections/}).click();
  const dialog=page.locator('#relationshipExplorer');
  await expect(dialog.getByRole('button',{name:'Long thoracic nerve'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Scapulothoracic interface'})).toBeVisible();
  await dialog.getByRole('button',{name:'Long thoracic nerve'}).click();
  await expect(dialog.getByRole('heading',{name:'Long thoracic nerve'})).toBeVisible();
  await expect(dialog.getByText(/Motor nerve to serratus anterior/i)).toBeVisible();
});
