(function(){
  const app=document.getElementById('app');
  if(!app)return;
  const ESSENTIAL=new Set(['Origin','Insertion','Action / function','Innervation']);
  function enhance(){
    const card=app.querySelector('.record-card');
    if(!card||!card.querySelector('h2')||card.dataset.muscleCardEnhanced==='1')return;
    const facts=card.querySelector('.facts');
    if(!facts)return;
    card.dataset.muscleCardEnhanced='1';
    card.classList.add('muscle-detail-card');
    const essentials=document.createElement('section');
    essentials.className='muscle-card-essentials';
    const reference=document.createElement('section');
    reference.className='muscle-card-reference';
    reference.innerHTML='<div class="section-title"><h3>Deeper reference</h3><p>Open only what you need.</p></div>';
    [...facts.children].forEach(fact=>{
      const strong=fact.querySelector(':scope > strong');
      const label=strong?.textContent?.trim()||'More detail';
      if(ESSENTIAL.has(label)){
        essentials.appendChild(fact);
        return;
      }
      const details=document.createElement('details');
      details.className='muscle-card-detail-section';
      const summary=document.createElement('summary');
      summary.textContent=label;
      details.appendChild(summary);
      const body=document.createElement('div');
      body.className='muscle-card-detail-body';
      [...fact.childNodes].forEach(node=>{if(node!==strong)body.appendChild(node)});
      details.appendChild(body);
      reference.appendChild(details);
      fact.remove();
    });
    facts.replaceWith(essentials);
    essentials.insertAdjacentElement('afterend',reference);
  }
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();