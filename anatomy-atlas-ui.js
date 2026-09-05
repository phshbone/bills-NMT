(function(){
  const D=window.NMT_DATA;
  if(!D?.ANATOMY_ATLAS)return;
  const STORAGE='nmt-clinical-reasoning-v0.1';

  function muscleByName(name){return D.MUSCLES.find(m=>m.name===name)}
  function anatomyView(record){
    const preferred=['muscle','attachments'].map(id=>[id,record.views[id]]).find(([,v])=>v?.status==='ready'&&v.asset);
    if(preferred)return {sourceMode:preferred[0],...preferred[1],label:'Anatomy'};
    const fallback=Object.entries(record.views).find(([id,v])=>id!=='referral'&&v?.asset);
    return fallback?{sourceMode:fallback[0],...fallback[1],label:'Anatomy'}:{sourceMode:'anatomy',label:'Anatomy',status:'pending'};
  }
  function referralView(record,muscle){
    const pattern=D.getReferralPattern?.(muscle.id)||null;
    return {sourceMode:'referral',label:'Referred Pain',...(record.views.referral||{status:'pending'}),pattern};
  }
  function noteFor(mode,status){
    if(mode==='anatomy')return '<strong>Anatomy:</strong> use the labeled visual with the visible origin, insertion, action, and innervation facts below.';
    return status==='ready'?'<strong>Referred pain:</strong> source-curated educational trigger-point and referred-pain pattern.':'<strong>Referred pain:</strong> this first-class view is reserved for source-curated trigger-point and referred-pain artwork. It is intentionally not simulated from anatomy artwork and is not diagnostic.';
  }
  function referralText(pattern){
    if(!pattern||pattern.validationStatus==='pending-curation')return '';
    const areas=(pattern.referralAreas||[]).map(x=>`<li>${x.label}</li>`).join('');
    const sources=(pattern.sourceIds||[]).map(id=>D.SOURCES?.[id]).filter(Boolean).map(s=>`<p class="source">${s.publisher} — ${s.title}</p>`).join('');
    return `<div class="atlas-curated-referral"><span>text pattern curated · artwork pending</span><h4>Described referred-pain pattern</h4><p>${pattern.summary||''}</p>${areas?`<ul>${areas}</ul>`:''}${pattern.evidenceNote?`<p class="small muted">${pattern.evidenceNote}</p>`:''}${sources?`<div class="atlas-referral-sources"><strong>Sources</strong>${sources}</div>`:''}</div>`;
  }
  function stageContent(muscle,mode,view){
    if(view?.asset){
      const alt=mode==='referral'?`${muscle.name} referred pain pattern illustration`:`${muscle.name} anatomy illustration`;
      return `<div class="atlas-image-window"><img class="atlas-image" src="${view.asset}" alt="${alt}" loading="lazy" decoding="async"></div><div class="atlas-note">${noteFor(mode,view.status)}</div>`;
    }
    if(mode==='referral'&&view?.pattern&&view.pattern.validationStatus!=='pending-curation'){
      return `${referralText(view.pattern)}<div class="atlas-pending"><span>visual in development</span><h4>Approved referral artwork still required</h4><p>The literature-supported text is available now. The visual map will not be shown until the approved source-of-truth artwork is preserved and linked to this record.</p></div><div class="atlas-note">${noteFor(mode,view?.status)}</div>`;
    }
    const title=mode==='referral'?'Source-curated referred pain pattern':'Dedicated anatomy visual';
    const detail=mode==='referral'?'This will show trigger-point locations and typical referred-pain neighborhoods once the pattern has been independently curated from permissible source material.':'This muscle does not yet have a published dedicated anatomy visual. The written anatomy remains the reference until its approved visual is available.';
    return `<div class="atlas-pending"><span>visual in development</span><h4>${title}</h4><p>${detail}</p></div><div class="atlas-note">${noteFor(mode,view?.status)}</div>`;
  }
  function render(record,muscle){
    const region=D.ANATOMY_REGIONS[record.regionId];
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    const anatomy=anatomyView(record),referral=referralView(record,muscle);
    return `<section class="anatomy-atlas muscle-card-primary" data-anatomy-atlas="${muscle.id}">
      <div class="atlas-head"><p class="eyebrow">muscle card</p><strong>${region?.name||muscle.region}</strong></div>
      <div class="atlas-tabs muscle-card-toggle" role="tablist" aria-label="Muscle card view">
        <button type="button" class="atlas-tab active" data-card-mode="anatomy" role="tab" aria-selected="true">Anatomy</button>
        <button type="button" class="atlas-tab" data-card-mode="referral" role="tab" aria-selected="false">Referred Pain</button>
      </div>
      <div class="atlas-stage" data-mode="anatomy">${stageContent(muscle,'anatomy',anatomy)}</div>
      <div class="atlas-related"><strong>Compare nearby structures</strong><div class="atlas-chip-row">${related.map(m=>`<button type="button" class="atlas-chip" data-open-muscle="${m.id}">${m.name}</button>`).join('')||'<span class="small muted">More comparison records will be added as the regional atlas grows.</span>'}</div></div>
      <div class="atlas-region-note">Anatomy and Referred Pain are the primary card views. Regional bases and overlays remain reusable implementation assets behind this stable interface.</div>
    </section>`;
  }
  function openMuscleDirect(id){
    let state={};
    try{state=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    state.route=state.route||'anatomy';
    state.detail={type:'muscle',id};
    localStorage.setItem(STORAGE,JSON.stringify(state));
    location.reload();
  }
  function bind(section,record,muscle){
    const stage=section.querySelector('.atlas-stage');
    const views={anatomy:anatomyView(record),referral:referralView(record,muscle)};
    section.querySelectorAll('[data-card-mode]').forEach(btn=>btn.onclick=()=>{
      const mode=btn.dataset.cardMode,v=views[mode];
      section.querySelectorAll('[data-card-mode]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false')});
      stage.dataset.mode=mode;
      stage.innerHTML=stageContent(muscle,mode,v);
    });
    section.querySelectorAll('[data-open-muscle]').forEach(btn=>btn.onclick=()=>{
      const matches=[...document.querySelectorAll(`[data-open-muscle="${btn.dataset.openMuscle}"]`)];
      const target=matches.find(candidate=>candidate!==btn&&candidate.closest('.record-card'))||matches.find(candidate=>candidate!==btn);
      if(target){target.click();return}
      openMuscleDirect(btn.dataset.openMuscle);
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