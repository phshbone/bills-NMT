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
  function noteFor(mode,status,muscle){
    if(mode==='anatomy'){
      if(muscle?.id==='scalenes')return '<strong>Anatomy:</strong> verified structured facts drive this Tier-2 card. The current anatomy plate remains a reference asset until final visual verification is complete.';
      return '<strong>Anatomy:</strong> use the labeled visual with the visible origin, insertion, action, and innervation facts below.';
    }
    return status==='ready'?'<strong>Referred pain:</strong> source-curated educational trigger-point and referred-pain pattern.':'<strong>Referred pain:</strong> this first-class view is reserved for source-curated trigger-point and referred-pain artwork. It is intentionally not simulated from anatomy artwork and is not diagnostic.';
  }
  function referralText(pattern){
    if(!pattern||pattern.validationStatus==='pending-curation')return '';
    const areas=(pattern.referralAreas||[]).map(x=>`<li>${x.label}</li>`).join('');
    const sources=(pattern.sourceIds||[]).map(id=>D.SOURCES?.[id]).filter(Boolean).map(s=>`<p class="source">${s.publisher} — ${s.title}</p>`).join('');
    return `<div class="atlas-curated-referral"><span>${pattern.validationStatus==='curated-travell-text'?'Travell-derived pattern · original artwork pending':'text pattern curated · artwork pending'}</span><h4>Described referred-pain pattern</h4><p>${pattern.summary||''}</p>${areas?`<ul>${areas}</ul>`:''}${pattern.evidenceNote?`<p class="small muted">${pattern.evidenceNote}</p>`:''}${sources?`<div class="atlas-referral-sources"><strong>Sources</strong>${sources}</div>`:''}</div>`;
  }
  function attachmentDetailContent(muscle){
    const detail=muscle.attachmentDetail||{};
    const blocks=['anterior','middle','posterior'].map(key=>{
      const item=detail[key];if(!item)return '';
      const title=key.charAt(0).toUpperCase()+key.slice(1)+' scalene';
      return `<section class="atlas-attachment-block"><h4>${title}</h4><dl><div><dt>Origin</dt><dd>${item.origin}</dd></div><div><dt>Insertion</dt><dd>${item.insertion}</dd></div><div><dt>Key relationship</dt><dd>${item.keyRelationship}</dd></div></dl></section>`;
    }).join('');
    return `<div class="atlas-attachment-detail"><div class="atlas-attachment-status"><span>verified structured anatomy</span><strong>Attachment detail</strong><p>This second Tier-2 view exposes the attachment and nearby-structure facts now, while the dedicated close-up illustration remains gated for verification.</p></div>${blocks}</div>`;
  }
  function tier2ViewContent(muscle,record,viewDef){
    if(!viewDef)return stageContent(muscle,'anatomy',anatomyView(record));
    if(viewDef.kind==='structured-attachment')return `${attachmentDetailContent(muscle)}<div class="atlas-note"><strong>Visual status:</strong> attachment-detail illustration pending. No anatomy has been inferred from an unverified image.</div>`;
    if(viewDef.asset)return `<div class="atlas-image-window"><img class="atlas-image" src="${viewDef.asset}" alt="${muscle.name} anatomy reference illustration" loading="lazy" decoding="async"></div><div class="atlas-note">${noteFor('anatomy',viewDef.status,muscle)}</div>`;
    return stageContent(muscle,'anatomy',anatomyView(record));
  }
  function stageContent(muscle,mode,view){
    if(view?.asset){
      const alt=mode==='referral'?`${muscle.name} referred pain pattern illustration`:`${muscle.name} anatomy illustration`;
      return `<div class="atlas-image-window"><img class="atlas-image" src="${view.asset}" alt="${alt}" loading="lazy" decoding="async"></div><div class="atlas-note">${noteFor(mode,view.status,muscle)}</div>`;
    }
    if(mode==='referral'&&view?.pattern&&view.pattern.validationStatus!=='pending-curation'){
      return `${referralText(view.pattern)}<div class="atlas-pending"><span>visual in development</span><h4>Original referral artwork still required</h4><p>The source-curated pattern is available now. The essential-versus-spillover overlay will not be published until it has been independently redrawn and verified.</p></div><div class="atlas-note">${noteFor(mode,view?.status,muscle)}</div>`;
    }
    const title=mode==='referral'?'Source-curated referred pain pattern':'Dedicated anatomy visual';
    const detail=mode==='referral'?'This will show trigger-point locations and typical referred-pain neighborhoods once the pattern has been independently curated from permissible source material.':'This muscle does not yet have a published dedicated anatomy visual. The written anatomy remains the reference until its approved visual is available.';
    return `<div class="atlas-pending"><span>visual in development</span><h4>${title}</h4><p>${detail}</p></div><div class="atlas-note">${noteFor(mode,view?.status,muscle)}</div>`;
  }
  function tier2Nav(record){
    if(record.visualTier!==2||!record.additionalAnatomyViews?.length)return '';
    return `<div class="atlas-subtabs" role="tablist" aria-label="Anatomy views">${record.additionalAnatomyViews.map((v,i)=>`<button type="button" class="atlas-subtab ${i===0?'active':''}" data-anatomy-subview="${v.id}" role="tab" aria-selected="${i===0?'true':'false'}">${v.label}</button>`).join('')}</div>`;
  }
  function orientationDevice(record){
    if(record.visualTier!==2)return '';
    return `<div class="atlas-orientation" aria-label="Anatomical orientation"><span>PROXIMAL</span><b aria-hidden="true">↑</b><i>orientation</i><b aria-hidden="true">↓</b><span>DISTAL</span></div>`;
  }
  function reciprocalInset(record,muscle,mode){
    const referral=referralView(record,muscle);
    if(mode==='anatomy'){
      const p=referral.pattern;
      return `<aside class="atlas-reciprocal" data-reciprocal-mode="referral"><span>Referred-pain preview</span><strong>${p?.validationStatus==='curated-travell-text'?'Travell-derived composite pattern':'Source-curated pattern'}</strong><p>${p?.referralAreas?.length?`${p.referralAreas.length} described symptom neighborhoods · `:''}original overlay pending verification.</p></aside>`;
    }
    const main=record.additionalAnatomyViews?.find(v=>v.id===record.primaryAnatomyView)||record.additionalAnatomyViews?.find(v=>v.asset);
    if(main?.asset)return `<aside class="atlas-reciprocal atlas-reciprocal-image" data-reciprocal-mode="anatomy"><span>Anatomy location</span><img src="${main.asset}" alt="${muscle.name} anatomy location preview" loading="lazy" decoding="async"></aside>`;
    return `<aside class="atlas-reciprocal" data-reciprocal-mode="anatomy"><span>Anatomy location</span><strong>${muscle.name}</strong><p>Verified written anatomy remains available while the final plate is pending.</p></aside>`;
  }
  function render(record,muscle){
    const region=D.ANATOMY_REGIONS[record.regionId];
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    const anatomy=anatomyView(record);
    const initialDef=record.visualTier===2?(record.additionalAnatomyViews?.find(v=>v.id===record.primaryAnatomyView)||record.additionalAnatomyViews?.[0]):null;
    const initialStage=initialDef?tier2ViewContent(muscle,record,initialDef):stageContent(muscle,'anatomy',anatomy);
    return `<section class="anatomy-atlas muscle-card-primary" data-anatomy-atlas="${muscle.id}" data-visual-tier="${record.visualTier||1}">
      <div class="atlas-head"><p class="eyebrow">muscle card${record.visualTier===2?' · Tier 2':''}</p><strong>${region?.name||muscle.region}</strong></div>
      <div class="atlas-tabs muscle-card-toggle" role="tablist" aria-label="Muscle card view">
        <button type="button" class="atlas-tab active" data-card-mode="anatomy" role="tab" aria-selected="true">Anatomy</button>
        <button type="button" class="atlas-tab" data-card-mode="referral" role="tab" aria-selected="false">Referred Pain</button>
      </div>
      ${tier2Nav(record)}
      ${orientationDevice(record)}
      <div class="atlas-stage" data-mode="anatomy">${initialStage}</div>
      <div class="atlas-reciprocal-slot">${reciprocalInset(record,muscle,'anatomy')}</div>
      <div class="atlas-related"><strong>Compare nearby structures</strong><div class="atlas-chip-row">${related.map(m=>`<button type="button" class="atlas-chip" data-open-muscle="${m.id}">${m.name}</button>`).join('')||'<span class="small muted">More comparison records will be added as the regional atlas grows.</span>'}</div></div>
      <div class="atlas-region-note">Anatomy and Referred Pain are the primary card views. Tier-2 anatomy uses one principal view at a time; unverified visual detail remains explicitly gated.</div>
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
    const subtabs=section.querySelector('.atlas-subtabs');
    const orientation=section.querySelector('.atlas-orientation');
    const reciprocal=section.querySelector('.atlas-reciprocal-slot');
    const views={anatomy:anatomyView(record),referral:referralView(record,muscle)};
    let anatomySubview=record.primaryAnatomyView||record.additionalAnatomyViews?.[0]?.id||null;
    function renderAnatomy(){
      const def=record.additionalAnatomyViews?.find(v=>v.id===anatomySubview);
      stage.dataset.mode='anatomy';
      stage.innerHTML=record.visualTier===2&&def?tier2ViewContent(muscle,record,def):stageContent(muscle,'anatomy',views.anatomy);
      if(reciprocal)reciprocal.innerHTML=reciprocalInset(record,muscle,'anatomy');
    }
    section.querySelectorAll('[data-anatomy-subview]').forEach(btn=>btn.onclick=()=>{
      anatomySubview=btn.dataset.anatomySubview;
      section.querySelectorAll('[data-anatomy-subview]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false')});
      renderAnatomy();
    });
    section.querySelectorAll('[data-card-mode]').forEach(btn=>btn.onclick=()=>{
      const mode=btn.dataset.cardMode;
      section.querySelectorAll('[data-card-mode]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false')});
      if(mode==='anatomy'){
        if(subtabs)subtabs.hidden=false;
        if(orientation)orientation.hidden=false;
        renderAnatomy();
      }else{
        if(subtabs)subtabs.hidden=true;
        if(orientation)orientation.hidden=true;
        stage.dataset.mode='referral';
        stage.innerHTML=stageContent(muscle,'referral',views.referral);
        if(reciprocal)reciprocal.innerHTML=reciprocalInset(record,muscle,'referral');
      }
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