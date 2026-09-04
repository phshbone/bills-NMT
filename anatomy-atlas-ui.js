(function(){
  const D=window.NMT_DATA;
  if(!D?.ANATOMY_ATLAS)return;

  function muscleByName(name){return D.MUSCLES.find(m=>m.name===name)}
  function noteFor(mode,status){
    if(mode==='attachments')return '<strong>Attachments:</strong> use the labeled anatomy and written record together for origin/insertion detail.';
    if(mode==='muscle')return status==='ready'?'<strong>Muscle context:</strong> target-muscle overlay within the regional skeletal frame.':'<strong>Muscle context layer:</strong> dedicated surrounding-muscle artwork has not been published for this record yet. The app will not fake this layer by zooming the attachment image.';
    return status==='ready'?'<strong>Referral:</strong> source-linked educational referred-pain pattern.':'<strong>Referral layer:</strong> reserved for source-curated trigger-point and referred-pain maps. It is intentionally not simulated from the attachment artwork and is not diagnostic.';
  }
  function stageContent(muscle,mode,view){
    if(view?.asset){
      return `<div class="atlas-image-window"><img class="atlas-image" src="${view.asset}" alt="${muscle.name} ${view.label.toLowerCase()} anatomy illustration" loading="lazy" decoding="async"></div><div class="atlas-note">${noteFor(mode,view.status)}</div>`;
    }
    const title=mode==='muscle'?'Dedicated muscle-context layer':'Source-curated referral layer';
    const detail=mode==='muscle'?'This will show the target muscle with nearby musculature on the same reusable regional base.':'This will show trigger-point locations and typical referred-pain neighborhoods once the pattern has been curated from source material. This educational layer is not diagnostic.';
    return `<div class="atlas-pending"><span>layer in development</span><h4>${title}</h4><p>${detail}</p></div><div class="atlas-note">${noteFor(mode,view?.status)}</div>`;
  }
  function render(record,muscle){
    const region=D.ANATOMY_REGIONS[record.regionId];
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    const entries=Object.entries(record.views);
    const initial=entries.find(([,v])=>v.status==='ready')||entries[0];
    const [initialMode,initialView]=initial;
    return `<section class="anatomy-atlas" data-anatomy-atlas="${muscle.id}">
      <div class="atlas-head"><p class="eyebrow">layered anatomy viewer</p><strong>${region?.name||muscle.region}</strong></div>
      <div class="atlas-tabs" role="tablist" aria-label="Anatomy layers">
        ${entries.map(([id,v])=>`<button type="button" class="atlas-tab ${id===initialMode?'active':''}" data-atlas-mode="${id}" role="tab" aria-selected="${id===initialMode?'true':'false'}">${v.label}</button>`).join('')}
      </div>
      <div class="atlas-stage" data-mode="${initialMode}">${stageContent(muscle,initialMode,initialView)}</div>
      <div class="atlas-related"><strong>Compare nearby structures</strong><div class="atlas-chip-row">${related.map(m=>`<button type="button" class="atlas-chip" data-open-muscle="${m.id}">${m.name}</button>`).join('')||'<span class="small muted">More comparison records will be added as the regional atlas grows.</span>'}</div></div>
      <div class="atlas-region-note">Regional bases are reusable. New muscle, nerve, vessel, landmark, and referral layers plug into this viewer as independent assets rather than crops of one image.</div>
    </section>`;
  }
  function bind(section,record,muscle){
    const stage=section.querySelector('.atlas-stage');
    section.querySelectorAll('[data-atlas-mode]').forEach(btn=>btn.onclick=()=>{
      const mode=btn.dataset.atlasMode,v=record.views[mode];
      section.querySelectorAll('[data-atlas-mode]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false')});
      stage.dataset.mode=mode;
      stage.innerHTML=stageContent(muscle,mode,v);
    });
    section.querySelectorAll('[data-open-muscle]').forEach(btn=>btn.onclick=()=>{
      const matches=[...document.querySelectorAll(`[data-open-muscle="${btn.dataset.openMuscle}"]`)];
      const target=matches.find(candidate=>candidate!==btn&&candidate.closest('.record-card'))||matches.find(candidate=>candidate!==btn);
      if(target){target.click();return}
      document.querySelector('button[data-route="anatomy"]')?.click();
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
    const wrap=document.createElement('div'); wrap.innerHTML=render(record,muscle);
    const section=wrap.firstElementChild;
    const facts=card.querySelector('.facts');
    if(facts)facts.insertAdjacentElement('beforebegin',section);else card.appendChild(section);
    bind(section,record,muscle);
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();