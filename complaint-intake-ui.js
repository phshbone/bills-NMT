(function(){
  const R=window.NMT_REASONING,D=window.NMT_DATA;
  if(!R?.extractComplaintFacts||!D)return;
  const STORAGE='nmt-clinical-reasoning-v0.1';
  const SUPPRESS_KEY='nmt-intake-suppressed-v1';
  let busy=false;

  function activeComplaint(){
    const hero=[...document.querySelectorAll('#app .hero')].find(x=>/active reasoning map/i.test(x.textContent||''));
    return hero?.querySelector('h2')?.textContent?.trim()||'';
  }
  function pathwayFor(complaint){return R.detectPathway(complaint,D)?.id||null}
  function suppressionMap(){try{return JSON.parse(sessionStorage.getItem(SUPPRESS_KEY)||'{}')}catch{return {}}}
  function suppressed(complaint,id){return !!suppressionMap()[complaint]?.includes(id)}
  function suppress(complaint,id){const map=suppressionMap(),list=new Set(map[complaint]||[]);list.add(id);map[complaint]=[...list];sessionStorage.setItem(SUPPRESS_KEY,JSON.stringify(map))}
  function factsFor(complaint){const pathwayId=pathwayFor(complaint);return pathwayId?R.extractComplaintFacts(complaint,pathwayId):{answers:{},concepts:[]}}

  function seedSessionAnswers(complaint,facts){
    let stored;
    try{stored=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return false}
    const active=stored?.active;
    if(!active||active.complaint!==complaint)return false;
    active.answers=active.answers||{};
    let changed=false;
    Object.entries(facts.answers||{}).forEach(([id,value])=>{
      if(value==null||suppressed(complaint,id)||active.answers[id]!=null)return;
      active.answers[id]=value;
      changed=true;
    });
    if(!changed)return false;
    active.updatedAt=new Date().toISOString();
    localStorage.setItem(STORAGE,JSON.stringify(stored));
    location.reload();
    return true;
  }

  function visibleConcepts(concepts){
    const important=concepts.filter(x=>x.key.startsWith('symptom-'));
    const context=concepts.filter(x=>!x.key.startsWith('symptom-'));
    const picked=[];
    [...context.slice(0,4),...important].forEach(x=>{if(!picked.some(y=>y.key===x.key)&&picked.length<7)picked.push(x)});
    if(picked.length<7)context.slice(4).forEach(x=>{if(!picked.some(y=>y.key===x.key)&&picked.length<7)picked.push(x)});
    return picked;
  }

  function addCapturedSummary(complaint,facts){
    const hero=[...document.querySelectorAll('#app .hero')].find(x=>/active reasoning map/i.test(x.textContent||''));
    if(!hero||hero.nextElementSibling?.classList?.contains('captured-intake'))return;
    const visible=visibleConcepts(facts.concepts||[]);
    if(!visible.length)return;
    const box=document.createElement('section');
    box.className='notice captured-intake';
    box.setAttribute('data-captured-intake','true');
    box.innerHTML=`<strong>Already captured from your description</strong><div class="relation-list" style="margin-top:8px">${visible.map(x=>`<span class="pill">${String(x.label).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</span>`).join('')}</div><p class="small muted" style="margin:8px 0 0">Explicit wording can pre-fill matching questions. Ambiguous wording stays unknown, and any captured answer can still be changed below.</p>`;
    hero.insertAdjacentElement('afterend',box);
  }

  function skipAnsweredFromComplaint(complaint,facts){
    if(busy)return false;
    const question=document.querySelector('#app .question-card');
    if(!question)return false;
    const first=question.querySelector('[data-answer-id]');
    if(!first)return false;
    const id=first.dataset.answerId;
    const value=facts.answers[id];
    if(value==null||suppressed(complaint,id))return false;
    const target=[...question.querySelectorAll(`[data-answer-id="${CSS.escape(id)}"]`)].find(b=>b.dataset.answerValue===value);
    if(!target)return false;
    busy=true;
    requestAnimationFrame(()=>{target.click();busy=false});
    return true;
  }

  function enhance(){
    const complaint=activeComplaint();
    if(!complaint)return;
    const facts=factsFor(complaint);
    if(seedSessionAnswers(complaint,facts))return;
    addCapturedSummary(complaint,facts);
    skipAnsweredFromComplaint(complaint,facts);
  }

  document.addEventListener('click',event=>{
    const reset=event.target.closest?.('[data-reset-answer]');
    if(!reset)return;
    const complaint=activeComplaint();
    if(!complaint)return;
    const facts=factsFor(complaint);
    if(facts.answers[reset.dataset.resetAnswer]!=null)suppress(complaint,reset.dataset.resetAnswer);
  },true);

  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();