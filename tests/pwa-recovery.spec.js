const {test,expect}=require('@playwright/test');
const TARGET=process.env.LIVE_SMOKE_URL||'https://phshbone.github.io/bills-NMT/';

test('deployed PWA registers its worker and recovers through the cached shell offline',async({page,context},testInfo)=>{
  await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:15000});
  await expect(page.locator('#complaintInput')).toBeVisible({timeout:7000});

  const sw=await page.evaluate(async()=>{
    if(!('serviceWorker' in navigator))return {supported:false};
    const reg=await navigator.serviceWorker.ready;
    return {supported:true,active:!!reg.active,scope:reg.scope,controller:!!navigator.serviceWorker.controller};
  });
  expect(sw.supported).toBeTruthy();
  expect(sw.active).toBeTruthy();

  await page.reload({waitUntil:'domcontentloaded',timeout:15000});
  await expect(page.locator('#complaintInput')).toBeVisible({timeout:7000});
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller),{timeout:7000}).toBeTruthy();

  await testInfo.attach('pwa-online-rendered',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});

  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded',timeout:15000});
  await expect(page.locator('#complaintInput')).toBeVisible({timeout:7000});
  await page.locator('#complaintInput').fill('Offline shell remains interactive.');
  await expect(page.locator('#complaintInput')).toHaveValue(/offline shell remains interactive/i);
  await testInfo.attach('pwa-offline-rendered',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});

  await context.setOffline(false);
  await page.reload({waitUntil:'domcontentloaded',timeout:15000});
  await expect(page.locator('#complaintInput')).toBeVisible({timeout:7000});
});
