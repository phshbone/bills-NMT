const fs=require('fs');
let index=fs.readFileSync('index.html','utf8');
const anchor='  <script src="data-provenance-1.js"></script>\n';
if(!index.includes('data-relationships-1.js')) index=index.replace(anchor,anchor+'  <script src="data-relationships-1.js"></script>\n');
fs.writeFileSync('index.html',index);

let sw=fs.readFileSync('service-worker.js','utf8');
sw=sw.replace(/const CACHE='nmt-reasoning-v0\.1\.\d+';/,"const CACHE='nmt-reasoning-v0.1.8';");
sw=sw.replace("'./data-provenance-1.js','./data-movements-1.js'","'./data-provenance-1.js','./data-relationships-1.js','./data-movements-1.js'");
fs.writeFileSync('service-worker.js',sw);

let app=fs.readFileSync('app.js','utf8');
if(!app.includes("state.detail?.type==='structure'")){
  app=app.replace("if(state.detail?.type==='movement')return movementDetail(state.detail.id,'reasoning');", "if(state.detail?.type==='movement')return movementDetail(state.detail.id,'reasoning');\n  if(state.detail?.type==='structure')return structureDetail(state.detail.id,'reasoning');");
  app=app.replace("function anatomyView(){if(state.detail?.type==='muscle')return muscleDetail(state.detail.id,'anatomy');", "function anatomyView(){if(state.detail?.type==='muscle')return muscleDetail(state.detail.id,'anatomy');if(state.detail?.type==='structure')return structureDetail(state.detail.id,'anatomy');");
}
const oldRel='<div class="fact"><strong>Related structures</strong><div class="relation-list">${[...(m.synergists||[]),...(m.compensators||[])].filter((x,i,a)=>a.indexOf(x)===i).map(r=>muscleRelation(r)).join(\'\')||\'<span class="muted small">Starter record</span>\'}</div></div>';
if(!app.includes('${relationshipSection(m.id)}')){
  if(!app.includes(oldRel)) throw new Error('Related structures anchor not found');
  app=app.replace(oldRel,oldRel+'${relationshipSection(m.id)}');
}
if(!app.includes('function relationshipSection(')){
  const helpers=String.raw`function relationshipSection(id){const rels=D.getRelations?D.getRelations(id):[];if(!rels.length)return '';return \`<div class="fact relationship-panel"><strong>Why this connects</strong><p class="small muted">Explore functional, anatomical, and comparison relationships without treating a connection as a diagnosis.</p><div class="stack">\${rels.map(r=>{const other=r.from===id?r.to:r.from;const muscle=D.MUSCLES.find(x=>x.id===other),structure=(D.STRUCTURES||[]).find(x=>x.id===other);const button=muscle?\`<button class="relation-chip" data-open-muscle="\${other}">\${esc(muscle.name)}</button>\`:structure?\`<button class="relation-chip" data-open-structure="\${other}">\${esc(structure.name)}</button>\`:\`<span class="relation-chip relation-static">\${esc(D.getEntityName?D.getEntityName(other):other)}</span>\`;return \`<div class="relationship-row"><div>\${button}<span class="pill">\${esc(r.kind)}</span></div><p class="small">\${esc(r.why)}</p></div>\`}).join('')}</div></div>\`}
function structureDetail(id,returnRoute){const s=(D.STRUCTURES||[]).find(x=>x.id===id);if(!s)return '<div class="empty">Structure not found.</div>';const sources=(s.sourceIds||[]).map(id=>D.SOURCES[id]).filter(Boolean),rels=D.getRelations?D.getRelations(id):[];return \`<button class="ghost-btn" data-back-detail="\${returnRoute}">← Back</button><section class="record-card" style="margin-top:12px"><p class="eyebrow">\${esc(s.region)} · \${esc(s.type)}</p><h2>\${esc(s.name)}</h2><p>\${esc(s.summary)}</p>\${rels.length?\`<div class="fact"><strong>Connected here</strong><div class="stack">\${rels.map(r=>{const other=r.from===id?r.to:r.from;const muscle=D.MUSCLES.find(x=>x.id===other);return \`<div class="relationship-row">\${muscle?\`<button class="relation-chip" data-open-muscle="\${other}">\${esc(muscle.name)}</button>\`:\`<span class="relation-chip relation-static">\${esc(D.getEntityName(other))}</span>\`}<p class="small">\${esc(r.why)}</p></div>\`}).join('')}</div></div>\`:''}\${sources.length?\`<div class="fact"><strong>Sources</strong>\${sources.map(src=>\`<p class="source">\${esc(src.publisher)} — \${esc(src.title)}<br>\${esc(src.url)}</p>\`).join('')}</div>\`:''}</section>\`}

`;
  app=app.replace('function movementView(){',helpers+'function movementView(){');
}
if(!app.includes("[data-open-structure]")) app=app.replace("document.querySelectorAll('[data-open-movement]').forEach(b=>b.onclick=()=>{state.detail={type:'movement',id:b.dataset.openMovement};save();render()});", "document.querySelectorAll('[data-open-movement]').forEach(b=>b.onclick=()=>{state.detail={type:'movement',id:b.dataset.openMovement};save();render()});\n  document.querySelectorAll('[data-open-structure]').forEach(b=>b.onclick=()=>{state.detail={type:'structure',id:b.dataset.openStructure};save();render()});");
fs.writeFileSync('app.js',app);

let test=fs.readFileSync('tests/live-smoke.spec.js','utf8');
if(!test.includes("name: 'Brachial plexus'")){
  const needle="  await expect(page.getByText(/StatPearls \\/ NCBI Bookshelf/).first()).toBeVisible();\n});";
  const replacement="  await expect(page.getByText(/StatPearls \\/ NCBI Bookshelf/).first()).toBeVisible();\n\n  await page.getByRole('button', { name: /Anatomy/i }).click();\n  await page.locator('#anatomySearch').fill('scalenes');\n  await page.getByRole('button', { name: /Open functional record/i }).click();\n  await expect(page.getByRole('heading', { name: 'Scalenes' })).toBeVisible();\n  await expect(page.getByText('Why this connects')).toBeVisible();\n  await expect(page.getByRole('button', { name: 'Brachial plexus' })).toBeVisible();\n  await page.getByRole('button', { name: 'Brachial plexus' }).click();\n  await expect(page.getByRole('heading', { name: 'Brachial plexus' })).toBeVisible();\n  await expect(page.getByText(/between the anterior and middle scalenes/i).first()).toBeVisible();\n});";
  if(!test.includes(needle)) throw new Error('Test insertion anchor not found');
  test=test.replace(needle,replacement);
}
fs.writeFileSync('tests/live-smoke.spec.js',test);
