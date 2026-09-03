(function(){
  const D=window.NMT_DATA;
  if(!D||!D.getInterventionProfile)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dialog=document.createElement('dialog');
  dialog.id='interventionExplorer';
  dialog.innerHTML='<div class="dialog-card" id="interventionExplorerCard"></div>';
  document.body.appendChild(dialog);
  const card=dialog.querySelector('#interventionExplorerCard');

  function muscle(id){return D.MUSCLES.find(x=>x.id===id)}
  function idForName(name){return D.MUSCLES.find(x=>x.name===name)?.id||null}
  function resourceLinks(ids){return (ids||[]).map(id=>D.INTERVENTION_RESOURCES[id]).filter(Boolean).map(r=>`<a class="relation-chip" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Learn: ${esc(r.publisher)}</a>`).join('')}
  function moveName(id){return D.MOVEMENTS.find(x=>x.id===id)?.name||id.replaceAll('-',' ')}

  function render(id){
    const m=muscle(id),p=D.getInterventionProfile(id);if(!m||!p)return;
    card.innerHTML=`
      <div class="button-row" style="justify-content:space-between"><span class="pill">conservative options</span><button class="dialog-close" type="button" data-int-close aria-label="Close">×</button></div>
      <p class="eyebrow">working hypothesis · not a diagnosis</p><h2>${esc(m.name)}</h2>
      <div class="fact"><strong>Why this may be relevant</strong><p>${esc(p.why)}</p></div>
      <div class="section-title"><h3>Options worth exploring</h3><p>Choose only comfortable, low-risk movement. The goal is to learn from the response, not to prove the hypothesis.</p></div>
      <div class="stack">${p.options.map((o,i)=>`<div class="fact intervention-option"><div class="button-row"><span class="pill">${esc(o.kind)}</span></div><h3>${esc(o.title)}</h3><p>${esc(o.detail)}</p><p class="small"><strong>Reassess:</strong> ${esc(o.reassess)}</p><div class="relation-list">${o.moveId?`<button class="relation-chip" type="button" data-int-move="${esc(o.moveId)}">Open in Move: ${esc(moveName(o.moveId))}</button>`:''}${resourceLinks(o.resources)}</div></div>`).join('')}</div>
      <div class="notice"><strong>Stop and reconsider</strong><p class="small">Stop an exercise or stretch if symptoms clearly worsen, if new numbness, tingling, weakness, dizziness, or other concerning symptoms appear, or if the movement feels unsafe. This finding falls outside the normal educational/self-care pathway and is worth professional medical evaluation when red-flag symptoms are present.</p></div>
      <p class="small muted">External links are educational references from established rehabilitation organizations. They are not endorsements of a diagnosis or individualized treatment plan.</p>`;
    card.querySelector('[data-int-close]').onclick=()=>dialog.close();
    card.querySelectorAll('[data-int-move]').forEach(b=>b.onclick=()=>openMovement(b.dataset.intMove));
  }

  function openMovement(id){
    dialog.close();
    const nav=document.querySelector('.nav-btn[data-route="movement"]');
    if(!nav)return;nav.click();
    setTimeout(()=>{
      const name=moveName(id);
      const cards=[...document.querySelectorAll('#app .record-card')];
      const target=cards.find(c=>c.querySelector('h3')?.textContent.trim()===name);
      target?.querySelector('[data-open-movement]')?.click();
    },0);
  }

  function addButton(container,id,label='Conservative options'){
    if(!container||container.querySelector('[data-open-intervention]'))return;
    if(!D.getInterventionProfile(id))return;
    const btn=document.createElement('button');btn.type='button';btn.className='small-btn';btn.dataset.openIntervention=id;btn.textContent=label;
    btn.onclick=()=>{render(id);dialog.showModal()};
    container.appendChild(btn);
  }

  function enhanceHypotheses(){
    document.querySelectorAll('#app .hypothesis-card').forEach(c=>{
      const id=idForName(c.querySelector('h3')?.textContent.trim());if(!id)return;
      addButton(c.querySelector('.button-row'),id,'Conservative options');
    });
  }
  function enhanceMuscleDetail(){
    const record=document.querySelector('#app .record-card');const h2=record?.querySelector('h2');if(!h2)return;
    const id=idForName(h2.textContent.trim());if(!id||!D.getInterventionProfile(id)||record.querySelector('[data-int-detail]'))return;
    const wrap=document.createElement('div');wrap.className='fact';wrap.dataset.intDetail='true';wrap.innerHTML='<strong>Conservative intervention</strong><p class="small muted">See options, the reasoning for considering them, what to reassess, and reputable teaching references.</p><div class="button-row"></div>';
    addButton(wrap.querySelector('.button-row'),id,'Explore conservative options');
    (record.querySelector('.facts')||record).appendChild(wrap);
  }
  function enhance(){enhanceHypotheses();enhanceMuscleDetail()}
  new MutationObserver(enhance).observe(document.getElementById('app'),{childList:true,subtree:true});
  enhance();
})();
