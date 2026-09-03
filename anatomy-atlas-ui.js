(function(){
  const D=window.NMT_DATA;
  if(!D?.ANATOMY_ATLAS)return;

  function muscleByName(name){return D.MUSCLES.find(m=>m.name===name)}
  function noteFor(mode){
    if(mode==='attachments')return '<strong>Attachments:</strong> use the labeled anatomy and written record together for origin/insertion detail.';
    if(mode==='muscle')return '<strong>Muscle context:</strong> this zoom emphasizes the target muscle within its regional skeletal frame.';
    return '<strong>Referral:</strong> educational pattern preview only. Referred-pain maps are being curated against source material and are not diagnostic.';
  }
  function render(record,muscle){
    const region=D.ANATOMY_REGIONS[record.regionId];
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    return `<section class="anatomy-atlas" data-anatomy-atlas="${muscle.id}">
      <div class="atlas-head"><p class="eyebrow">layered anatomy viewer</p><strong>${region?.name||muscle.region}</strong></div>
      <div class="atlas-tabs" role="tablist" aria-label="Anatomy layers">
        ${Object.entries(record.views).map(([id,v],i)=>`<button type="button" class="atlas-tab ${i===0?'active':''}" data-atlas-mode="${id}" role="tab" aria-selected="${i===0?'true':'false'}">${v.label}</button>`).join('')}
      </div>
      <div class="atlas-stage" data-mode="attachments">
        <div class="atlas-image-window"><img class="atlas-image" src="${record.asset}" alt="${muscle.name} regional anatomy illustration" style="object-position:${record.views.attachments.position}"></div>
        <div class="atlas-note">${noteFor('attachments')}</div>
      </div>
      <div class="atlas-related"><strong>Compare nearby structures</strong><div class="atlas-chip-row">${related.map(m=>`<button type="button" class="atlas-chip" data-open-muscle="${m.id}">${m.name}</button>`).join('')||'<span class="small muted">More comparison records will be added as the regional atlas grows.</span>'}</div></div>
      <div class="atlas-region-note">Regional bases are reusable. Future muscle, nerve, vessel, landmark, and referral overlays can plug into this same viewer without creating a new page layout.</div>
    </section>`;
  }
  function bind(section,record){
    const image=section.querySelector('.atlas-image'),stage=section.querySelector('.atlas-stage'),note=section.querySelector('.atlas-note');
    section.querySelectorAll('[data-atlas-mode]').forEach(btn=>btn.onclick=()=>{
      const mode=btn.dataset.atlasMode,v=record.views[mode];
      section.querySelectorAll('[data-atlas-mode]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false')});
      stage.dataset.mode=mode; image.style.objectPosition=v.position; note.innerHTML=noteFor(mode);
    });
    section.querySelectorAll('[data-open-muscle]').forEach(btn=>btn.onclick=()=>{
      const target=document.querySelector(`[data-open-muscle="${btn.dataset.openMuscle}"]`);
      if(target&&target!==btn){target.click();return}
      document.querySelector(`button[data-route="anatomy"]`)?.click();
      setTimeout(()=>document.querySelector(`[data-open-muscle="${btn.dataset.openMuscle}"]`)?.click(),0);
    });
  }
  function enhance(){
    const card=document.querySelector('#app .record-card');
    if(!card)return;
    const name=card.querySelector('h2')?.textContent?.trim(); if(!name)return;
    const muscle=muscleByName(name); if(!muscle)return;
    const record=D.getAnatomyAtlasRecord?.(muscle.id); if(!record)return;
    if(card.querySelector('.anatomy-atlas'))return;
    const old=card.querySelector('.attachment-block'); if(old)old.classList.add('atlas-replaced');
    const wrap=document.createElement('div'); wrap.innerHTML=render(record,muscle);
    const section=wrap.firstElementChild;
    const facts=card.querySelector('.facts');
    if(facts)facts.insertAdjacentElement('beforebegin',section);else card.appendChild(section);
    bind(section,record);
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();