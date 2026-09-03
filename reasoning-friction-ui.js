(function(){
  const STORAGE='nmt-clinical-reasoning-v0.1';
  function state(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}}
  function active(){return state().active||null}

  function updatePrototypeCopy(){
    document.querySelectorAll('#app p').forEach(p=>{
      const t=p.textContent||'';
      if(t.includes('V0.1 currently knows two deliberately small reasoning neighborhoods')){
        p.textContent='V0.1 currently knows three deliberately small reasoning neighborhoods: neck/scapula/serratus/pull-up, low-back/hip-extension, and forearm/lateral-elbow/gripping.';
      }
      if(t.includes('Choose one of the two prototype pathways')){
        p.textContent=t.replace('Choose one of the two prototype pathways','Choose one of the validated prototype pathways');
      }
    });
  }

  function updateQuestionProgress(){
    const card=document.querySelector('#app .question-card');
    if(!card)return;
    const first=card.querySelector('[data-answer-id]');
    const pill=card.querySelector('.pill');
    if(!first||!pill)return;
    const id=first.dataset.answerId;
    const core=['safety_neuro','safety_trauma','fa_paresthesia','fa_lateral','fa_grip'];
    const deep=['fa_wrist_extension','fa_finger_extension','fa_supination','fa_neck_change'];
    if(id==='__refine_forearm')pill.textContent='first pass complete';
    else if(core.includes(id))pill.textContent=`key question ${core.indexOf(id)+1} of ${core.length}`;
    else if(deep.includes(id))pill.textContent=`refinement ${deep.indexOf(id)+1} of ${deep.length}`;
    card.querySelectorAll('[data-answer-id="__refine_forearm"]').forEach(b=>{
      if(b.dataset.answerValue==='refine')b.textContent='Refine reasoning';
      if(b.dataset.answerValue==='not now')b.textContent='Use first pass';
    });
  }

  function compactHypotheses(){
    document.querySelectorAll('#app .hypothesis-card').forEach(card=>{
      if(card.dataset.compactReasoning==='true')return;
      const strong=[...card.querySelectorAll('strong')].find(x=>/Why it is being considered/i.test(x.textContent||''));
      const parent=strong?.parentElement, list=parent?.querySelector('ul');
      if(!parent||!list)return;
      const details=document.createElement('details');
      details.className='why-box compact-reasoning';
      const summary=document.createElement('summary');
      summary.textContent='Why this moved up';
      details.append(summary,list);
      strong.remove();
      parent.append(details);
      card.dataset.compactReasoning='true';
    });
  }

  function clarifyCompletion(){
    const s=active();
    if(s?.pathwayId!=='forearm')return;
    const notice=[...document.querySelectorAll('#app .notice')].find(x=>/Question set complete/i.test(x.textContent||''));
    if(!notice)return;
    if(s.answers?.__refine_forearm==='not now')notice.innerHTML='<strong>First-pass questions complete.</strong> You can use the current comparison now. The optional movement/position refinement was skipped and can be revisited by changing that answer below.';
    if(s.answers?.__refine_forearm==='refine')notice.innerHTML='<strong>Refinement complete.</strong> Review the updated comparison, try only tolerable observations, then record reassessment.';
  }

  function enhance(){
    updatePrototypeCopy();
    updateQuestionProgress();
    compactHypotheses();
    clarifyCompletion();
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
