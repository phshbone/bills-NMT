const { test, expect } = require('@playwright/test');

const TARGET = process.env.LIVE_SMOKE_URL || 'https://phshbone.github.io/bills-NMT/';

async function answer(page, value) {
  await page.getByRole('button', { name: value, exact: true }).first().click();
}
async function openRefinementIfNeeded(page){
  const refine=page.locator('[data-answer-id^="__refine_"][data-answer-value="refine"]');
  if(await refine.count())await refine.first().click();
}
async function ensureAnswer(page,id,value){
  let current=page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`);
  if(!(await current.count())){
    await openRefinementIfNeeded(page);
    current=page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`);
  }
  if(await current.count()){
    await current.first().click();
    return;
  }
  const stored=await page.evaluate(answerId=>JSON.parse(localStorage.getItem('nmt-clinical-reasoning-v0.1')||'{}').active?.answers?.[answerId],id);
  if(stored===value)return;
  const reset=page.locator(`[data-reset-answer="${id}"]`);
  if(await reset.count()){
    await reset.first().click();
    await page.locator(`[data-answer-id="${id}"][data-answer-value="${value}"]`).first().click();
    return;
  }
  throw new Error(`Question ${id} was neither available nor already answered as ${value}`);
}
async function openReferenceSection(page,label){
  const section=page.locator('.muscle-card-reference details').filter({has:page.locator('summary',{hasText:label})}).first();
  await expect(section).toBeVisible();
  if(!(await section.evaluate(el=>el.open)))await section.locator('summary').click();
  return section;
}

test.beforeEach(async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Clinical Reasoning Map/i);
  await expect(page.getByRole('heading', { name: 'Clinical Reasoning Map' })).toBeVisible();
  await page.evaluate(() => {localStorage.clear();sessionStorage.clear()});
  await page.reload({ waitUntil: 'domcontentloaded' });
  page.__pageErrors = pageErrors;
});

test.afterEach(async ({ page }) => {
  expect(page.__pageErrors || []).toEqual([]);
});

test('low-back reasoning path updates, reassesses, and preserves navigation state', async ({ page }) => {
  await page.getByRole('button', { name: 'Use low-back prototype' }).click();
  await expect(page.getByText('Why are you asking?')).toBeVisible();
  await page.getByText('Why are you asking?').first().click();
  await expect(page.getByText(/Progressive neurological loss/i)).toBeVisible();
  await ensureAnswer(page,'safety_neuro','no');
  await ensureAnswer(page,'safety_bladder','no');
  await ensureAnswer(page,'safety_trauma','no');
  await ensureAnswer(page,'safety_abdominal','no');
  await ensureAnswer(page,'lb_unilateral','one side');
  await ensureAnswer(page,'lb_extension','yes');
  await ensureAnswer(page,'lb_referral','stays local');
  await ensureAnswer(page,'lb_sitting','yes');
  await ensureAnswer(page,'lb_hip_extension','yes');
  const iliopsoasCard = page.locator('.hypothesis-card').filter({ hasText: 'Iliopsoas' });
  await expect(iliopsoasCard).toBeVisible();
  await expect(iliopsoasCard).toContainText(/hip-flexor|hip extension/i);
  await page.locator('[data-reset-answer="lb_hip_extension"]').click();
  await expect(page.getByRole('heading', { name: /extending the hip/i })).toBeVisible();
  await ensureAnswer(page,'lb_hip_extension','no');
  await expect(iliopsoasCard).toContainText(/weakens/i);
  await ensureAnswer(page,'lb_lumbar_extension','no');
  await ensureAnswer(page,'lb_sidebend','no');
  await ensureAnswer(page,'lb_walking','yes');
  await expect(page.getByRole('heading', { name: 'Reassess' })).toBeVisible();
  await page.locator('#reassessTarget').selectOption('iliopsoas');
  await page.locator('#reassessChange').selectOption({ label: 'improved' });
  await page.locator('#reassessRange').selectOption({ label: 'smoother / more range' });
  await page.locator('#reassessNotes').fill('Small hip-extension change improved the familiar restriction.');
  await page.getByRole('button', { name: 'Update reassessment' }).click();
  await expect(iliopsoasCard).toContainText(/improved after a conservative change/i);
  await iliopsoasCard.getByRole('button', { name: 'Related anatomy' }).click();
  await expect(page.getByRole('heading', { name: 'Iliopsoas' })).toBeVisible();
  await openReferenceSection(page,'Related movements');
  await page.getByRole('button', { name: 'Basic hip extension' }).click();
  await expect(page.getByRole('heading', { name: 'Basic hip extension' })).toBeVisible();
  await page.getByRole('button', { name: '← Back' }).click();
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/active reasoning map/i)).toBeVisible();
  await expect(page.locator('#reassessTarget')).toHaveValue('iliopsoas');
  await page.getByRole('button', { name: /Observe/i }).click();
  await expect(page.getByRole('heading', { name: /Notice the pattern first/i })).toBeVisible();
  await expect(page.getByText('Difficulty standing fully upright')).toBeVisible();
});

test('upper-quarter path strengthens serratus consideration and supports movement/source links', async ({ page }) => {
  await page.getByRole('button', { name: 'Use upper-quarter prototype' }).click();
  await ensureAnswer(page,'safety_neuro','no');
  await ensureAnswer(page,'safety_trauma','no');
  await ensureAnswer(page,'uq_cervical_rotation','yes');
  await ensureAnswer(page,'uq_sidebend','yes');
  await ensureAnswer(page,'uq_wing','yes');
  await openRefinementIfNeeded(page);
  await ensureAnswer(page,'uq_shrug','yes');
  await ensureAnswer(page,'uq_wallslide','yes');
  const serratusCard = page.locator('.hypothesis-card').filter({ hasText: 'Serratus anterior' });
  await expect(serratusCard).toBeVisible();
  await expect(serratusCard).toContainText(/winging|scapular/i);
  await serratusCard.getByRole('button', { name: 'Related anatomy' }).click();
  await expect(page.getByRole('heading', { name: 'Serratus anterior' })).toBeVisible();
  await expect(page.getByText(/Long thoracic nerve/i).first()).toBeVisible();
  await openReferenceSection(page,'Related movements');
  await page.getByRole('button', { name: 'Wall slide' }).click();
  await expect(page.getByRole('heading', { name: 'Wall slide' })).toBeVisible();
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('levator');
  await page.getByRole('button', { name: /Open functional record/i }).click();
  await expect(page.getByRole('heading', { name: 'Levator scapulae' })).toBeVisible();
  await openReferenceSection(page,'Sources');
  await expect(page.getByText(/StatPearls \/ NCBI Bookshelf/).first()).toBeVisible();
  await page.locator('button[data-route="anatomy"]').click();
  await page.locator('#anatomySearch').fill('scalenes');
  await page.getByRole('button', { name: /Open functional record/i }).click();
  await expect(page.getByRole('heading', { name: 'Scalenes' })).toBeVisible();
  await openReferenceSection(page,'Sources');
  await expect(page.getByText(/Anatomy, Head and Neck, Scalenus Muscle/i)).toBeVisible();
});

test('red-flag response exits ordinary muscle reasoning', async ({ page }) => {
  await page.getByRole('button', { name: 'Use low-back prototype' }).click();
  await ensureAnswer(page,'safety_neuro','yes');
  await expect(page.getByRole('heading', { name: /Professional medical evaluation is appropriate/i })).toBeVisible();
  await expect(page.getByText(/prompt medical evaluation/i)).toBeVisible();
  await expect(page.getByText(/familiar mild numbness or heaviness/i)).toBeVisible();
  await page.getByRole('button', { name: 'Review answers' }).click();
  const neuroRow=page.locator('#answerReview .list-row').filter({hasText:/new or progressive weakness/i});
  await expect(neuroRow).toBeVisible();
  await expect(neuroRow.getByText('yes',{exact:true})).toBeVisible();
});

test('JSON backup/import and offline app shell work', async ({ page, context }) => {
  await page.getByRole('button', { name: /Sessions/i }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('clinical-reasoning-backup.json');
  const backup = {
    schema: 'nmt-clinical-reasoning-v0.1',
    exportedAt: new Date().toISOString(),
    state: {
      route: 'sessions', draftComplaint: '', active: null, detail: null,
      history: [{
        id: 'imported-smoke', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        complaint: 'Imported smoke-test session', pathwayId: 'lower', answers: { safety_neuro: 'no' }, reassessment: {}, status: 'saved'
      }]
    }
  };
  await page.locator('#importJson').setInputFiles({
    name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup))
  });
  await expect(page.getByText('Imported smoke-test session')).toBeVisible();
  await expect(page.getByText('1 saved')).toBeVisible();
  await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Clinical Reasoning Map' })).toBeVisible();
  await expect(page.getByText('Imported smoke-test session')).toBeVisible();
  await context.setOffline(false);
});