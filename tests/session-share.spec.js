const {test,expect}=require('@playwright/test');
const base=process.env.LIVE_SMOKE_URL||'http://127.0.0.1:4173/';

async function fresh(page){
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload({waitUntil:'domcontentloaded'});
}

test('active reasoning exposes portable session and clinician handoff actions',async({page})=>{
  await fresh(page);
  await page.locator('textarea').first().fill('Pain in right outer forearm near elbow. Gripping irritates it.');
  await page.getByRole('button',{name:/build reasoning map/i}).click();
  await expect(page.getByRole('button',{name:'Export this session'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Clinician PDF \/ Print/i})).toBeVisible();
});

test('clinician report is patient-generated, non-diagnostic, and includes structured reasoning',async({page})=>{
  await fresh(page);
  const result=await page.evaluate(()=>{
    const session={id:'test',createdAt:new Date().toISOString(),complaint:'Pain in right outer forearm near elbow. Gripping irritates it.',pathwayId:'forearm',answers:{safety_neuro:'no',safety_trauma:'no',fa_lateral:'yes',fa_grip:'yes',fa_paresthesia:'no'},reassessment:{},status:'active'};
    const html=window.NMT_SESSION_SHARE.clinicianHtml(session);
    const exported=window.NMT_SESSION_SHARE.sessionExport(session);
    return {html,exported,disclaimer:window.NMT_SESSION_SHARE.DISCLAIMER};
  });
  expect(result.exported.schema).toBe('nmt-clinical-session-v1');
  expect(result.html).toContain('PATIENT-GENERATED / EDUCATIONAL');
  expect(result.html).toContain('Clinical Reasoning Session Summary');
  expect(result.html).toContain('Extensor carpi radialis brevis');
  expect(result.html).toContain('not a diagnosis or treatment recommendation');
  expect(result.disclaimer).toContain('A qualified clinician should independently evaluate all findings');
});

test('shared session import adds a saved copy instead of replacing local history',async({page})=>{
  await fresh(page);
  const result=await page.evaluate(()=>{
    localStorage.setItem('nmt-clinical-reasoning-v0.1',JSON.stringify({route:'sessions',active:null,history:[{id:'existing',complaint:'Existing session',pathwayId:'lower',answers:{},reassessment:{},status:'saved'}]}));
    const imported=window.NMT_SESSION_SHARE.importObject({schema:'nmt-clinical-session-v1',session:{id:'remote',complaint:'Shared forearm session',pathwayId:'forearm',answers:{fa_grip:'yes'},reassessment:{},status:'saved'}});
    const state=JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1'));
    return {imported,state};
  });
  expect(result.state.history).toHaveLength(2);
  expect(result.state.history[0].complaint).toBe('Shared forearm session');
  expect(result.state.history[1].complaint).toBe('Existing session');
  expect(result.imported.originalSessionId).toBe('remote');
});