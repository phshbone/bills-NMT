(function(){
  const R=window.NMT_REASONING,D=window.NMT_DATA;
  if(!R?.extractComplaintFacts||!D)return;
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

  function addCapturedSummary(complaint,facts){
    const hero=[...document.querySelectorAll('#app .hero')].find(x=>/active reasoning map/i.test(x.textContent||''));
    if(!hero||hero.nextElementSibling?.classList?.contains('captured-intake'))return;
    const visible=facts.concepts.filter(x=>!x.key.startsWith('symptom-')||facts.concepts.length<7).slice(0,7);
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