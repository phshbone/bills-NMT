(function(){
  const STORAGE='nmt-clinical-reasoning-v0.1';
  const SEARCH_ALIASES={
    'Serratus anterior':'shoulder shoulder blade scapula scapular underarm armpit axilla ribs rib cage side chest upper quarter',
    'Scalenes':'neck cervical first rib second rib upper chest shoulder collarbone breathing',
    'Sternocleidomastoid':'neck cervical front neck mastoid collarbone clavicle chest',
    'Levator scapulae':'neck shoulder shoulder blade scapula scapular upper back cervical',
    'Upper trapezius':'neck shoulder shoulder blade scapula upper back',
    'Middle trapezius':'shoulder shoulder blade scapula upper back thoracic',
    'Lower trapezius':'shoulder shoulder blade scapula upper back thoracic',
    'Pectoralis major':'chest pec shoulder anterior shoulder armpit axilla upper arm',
    'Pectoralis minor':'chest pec shoulder anterior shoulder coracoid ribs armpit axilla',
    'Latissimus dorsi':'back shoulder armpit underarm axilla side ribs upper arm',
    'Rotator cuff group':'shoulder rotator cuff scapula upper arm glenohumeral',
    'Iliopsoas':'hip groin low back lower back psoas iliacus pelvis',
    'Quadratus lumborum':'low back lower back flank side ribs iliac crest pelvis ql',
    'Lumbar erectors':'low back lower back lumbar spine back',
    'Multifidus':'low back lower back lumbar spine deep back',
    'Gluteus maximus':'hip buttock glute pelvis',
    'Gluteus medius':'hip outer hip buttock glute pelvis',
    'Hamstrings':'posterior thigh back thigh hip knee',
    'Rectus femoris':'front thigh hip knee quadriceps quad'
  };

  function resetReasoning(){
    if(!confirm('Reset the current reasoning map and start a new complaint? Saved sessions will be kept.'))return;
    let saved={};
    try{saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    saved.active=null;
    saved.detail=null;
    saved.route='reasoning';
    saved.draftComplaint='';
    localStorage.setItem(STORAGE,JSON.stringify(saved));
    location.reload();
  }

  function enhanceReset(){
    const hero=[...document.querySelectorAll('#app .hero')].find(x=>/active reasoning map|safety boundary/i.test(x.textContent||''));
    if(!hero||hero.querySelector('[data-ux-reset-reasoning]'))return;
    const row=document.createElement('div');
    row.className='button-row';
    row.style.marginTop='2px';
    row.innerHTML='<button type="button" class="ghost-btn" data-ux-reset-reasoning>Reset reasoning</button>';
    row.querySelector('button').addEventListener('click',resetReasoning);
    hero.appendChild(row);
  }

  function enhanceSearch(){
    document.querySelectorAll('#anatomyGrid .record-card').forEach(card=>{
      const name=card.querySelector('h3')?.textContent?.trim();
      if(!name)return;
      const aliases=SEARCH_ALIASES[name]||'';
      if(aliases&&!card.dataset.searchText.includes(aliases))card.dataset.searchText=(card.dataset.searchText+' '+aliases).toLowerCase();
    });
  }

  function enhance(){enhanceReset();enhanceSearch()}
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();