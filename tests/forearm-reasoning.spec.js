const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

test('plain-language lateral forearm complaint routes locally instead of defaulting to serratus',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const input=page.locator('textarea').first();
  await input.fill('Pain in right forearm. Outside part of elbow. Gripping irritates it.');
  await page.getByRole('button',{name:/start reasoning/i}).click();
  await expect(page.getByText(/Forearm \/ lateral elbow \/ gripping/i)).toBeVisible();
  const body=page.locator('body');
  await expect(body).toContainText('Extensor carpi radialis brevis');
  await expect(body).not.toContainText('The prototype complaint directly involves serratus-region discomfort');
});

test('forearm pathway keeps cervical contribution conditional rather than baseline',async({page})=>{
  await page.goto(base,{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{
    const D=window.NMT_DATA;
    const p=window.NMT_REASONING.detectPathway('forearm outside elbow gripping pain',D);
    const before=window.NMT_REASONING.scoreHypotheses(p.id,{},D);
    const after=window.NMT_REASONING.scoreHypotheses(p.id,{fa_neck_change:'yes'},D);
    return {path:p.id,before:before.map(x=>x.id),after:after.map(x=>x.id)};
  });
  expect(result.path).toBe('forearm');
  expect(result.before).toContain('extensor-carpi-radialis-brevis');
  expect(result.before).not.toContain('serratus-anterior');
  expect(result.after).toContain('scalenes');
});