const {test,expect}=require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

test('startup remains interactive: complaint input accepts typing and primary navigation responds',async({page})=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:15000});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded',timeout:15000});

  const input=page.locator('#complaintInput');
  await expect(input).toBeVisible({timeout:5000});
  await input.click();
  await input.fill('My right forearm feels tight when I grip.');
  await expect(input).toHaveValue(/right forearm feels tight/i);

  await page.locator('button[data-route="anatomy"]').click();
  await expect(page.locator('#anatomySearch')).toBeVisible({timeout:5000});
  await page.locator('button[data-route="reasoning"]').click();
  await expect(page.locator('#complaintInput')).toBeVisible({timeout:5000});
});
