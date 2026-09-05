(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  const style=document.createElement('style');
  style.textContent=`
    .muscle-section-nav{margin:14px 0 18px;padding:14px;border:1px solid #d8dce5;border-radius:18px;background:#f8f9fb}
    .muscle-section-nav-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
    .muscle-section-nav-head strong{color:#17233b}.muscle-section-nav-head span{color:#667085;font-size:.78rem}
    .muscle-section-pills{display:flex;flex-wrap:wrap;gap:8px}
    .muscle-section-pill{border:1px solid #d7dce5;border-radius:999px;background:#fff;color:#17233b;padding:9px 12px;font:700 .82rem/1.1 system-ui,sans-serif;cursor:pointer}
    .muscle-section-pill.primary{background:#17233b;color:#fff;border-color:#17233b}
    .muscle-section-return{display:inline-flex;margin-top:12px;border:0;background:transparent;color:#245f9e;font:800 .82rem/1.2 system-ui,sans-serif;cursor:pointer;padding:4px 0}
    @media(max-width:600px){.muscle-section-nav{padding:12px}.muscle-section-pill{padding:9px 11px;font-size:.78rem}.muscle-section-nav-head{display:block}.muscle-section-nav-head span{display:block;margin-top:3px}}
  `;
  document.head.appendChild(style);

  const LABELS=[
    {key:'relationships',label:'Relationship Map',primary:true},
    {key:'related-structures',label:'Related Structures'},
    {key:'related-movements',label:'Related Movements'},
    {key:'functional-roles',label:'Functional Roles'},
    {key:'conservative',label:'Conservative Options'},
    {key:'reference',label:'Deeper Reference'},
    {key:'sources',label:'Sources'}
  ];

  function currentCard(){
    const card=app.querySelector('.record-card');
    if(!card?.querySelector('h2'))return null;
    const name=card.querySelector('h2').textContent.trim();
    return D.MUSCLES.find(m=>m.name===name)?card:null;
  }
  function detailsByLabel(card,label){return [...card.querySelectorAll('.muscle-card-detail-section')].find(d=>(d.dataset.detailLabel||'').toLowerCase()===label.toLowerCase())||null}
  function relationshipTarget(card){return card.querySelector('[data-explore-rel]')?.closest('.muscle-card-detail-section,.fact')||null}
  function conservativeTarget(card){return card.querySelector('[data-int-detail]')?.closest('.muscle-card-detail-section,.fact')||card.querySelector('[data-open-intervention]')?.closest('.muscle-card-detail-section,.fact')||null}
  function targetFor(card,key){
    if(key==='relationships')return relationshipTarget(card);
    if(key==='related-structures')return detailsByLabel(card,'Related structures');
    if(key==='related-movements')return detailsByLabel(card,'Related movements');
    if(key==='functional-roles')return detailsByLabel(card,'Functional roles');
    if(key==='conservative')return conservativeTarget(card)||detailsByLabel(card,'Conservative intervention')||detailsByLabel(card,'Conservative categories');
    if(key==='reference')return card.querySelector('.muscle-card-reference');
    if(key==='sources')return detailsByLabel(card,'Sources');
    return null;
  }
  function scrollTo(el){el?.scrollIntoView({behavior:'smooth',block:'start'})}
  function openDetails(target){if(target?.tagName==='DETAILS')target.open=true}
  function navClick(card,key){
    if(key==='relationships'){
      const button=card.querySelector('[data-explore-rel]');
      if(button){button.click();return}
    }
    if(key==='conservative'){
      const button=card.querySelector('[data-open-intervention]');
      if(button){button.click();return}
    }
    const target=targetFor(card,key);if(!target)return;
    openDetails(target);scrollTo(target);
  }
  function addReturn(target){
    if(!target||target.querySelector(':scope > .muscle-section-return, :scope > .muscle-card-detail-body > .muscle-section-return'))return;
    const btn=document.createElement('button');btn.type='button';btn.className='muscle-section-return';btn.textContent='Back to muscle menu ↑';btn.dataset.muscleMenuReturn='true';
    const body=target.querySelector(':scope > .muscle-card-detail-body');
    (body||target).appendChild(btn);
  }
  function addReturns(card){
    ['related-structures','related-movements','functional-roles','sources'].forEach(key=>addReturn(targetFor(card,key)));
    const ref=targetFor(card,'reference');if(ref&&!ref.querySelector(':scope > .muscle-section-return'))addReturn(ref);
  }
  function placeNav(card,nav){
    const atlas=card.querySelector('.muscle-card-primary');
    if(atlas){atlas.insertAdjacentElement('afterend',nav);return}
    const essentials=card.querySelector('.muscle-card-essentials');
    if(essentials){essentials.insertAdjacentElement('afterend',nav);return}
    const h2=card.querySelector('h2');h2?.insertAdjacentElement('afterend',nav);
  }
  function enhance(){
    const card=currentCard();if(!card)return;
    const available=LABELS.filter(item=>targetFor(card,item.key));
    if(!available.length)return;
    const signature=available.map(item=>item.key).join('|');
    let nav=card.querySelector('.muscle-section-nav');
    if(!nav){
      nav=document.createElement('nav');nav.className='muscle-section-nav';nav.id='muscle-section-menu';nav.setAttribute('aria-label','Muscle reference sections');
      placeNav(card,nav);
    }
    if(nav.dataset.menuSignature!==signature){
      nav.dataset.menuSignature=signature;
      nav.innerHTML=`<div class="muscle-section-nav-head"><strong>Explore this muscle</strong><span>Jump directly to what you need.</span></div><div class="muscle-section-pills">${available.map(item=>`<button type="button" class="muscle-section-pill ${item.primary?'primary':''}" data-muscle-section="${item.key}">${item.label}</button>`).join('')}</div>`;
      nav.querySelectorAll('[data-muscle-section]').forEach(btn=>btn.onclick=()=>navClick(card,btn.dataset.muscleSection));
    }
    addReturns(card);
  }

  document.addEventListener('click',e=>{
    const back=e.target.closest('[data-muscle-menu-return]');if(!back)return;
    e.preventDefault();
    const nav=app.querySelector('#muscle-section-menu');scrollTo(nav);
  });
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
