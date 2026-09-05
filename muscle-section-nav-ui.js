(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  const style=document.createElement('style');
  style.textContent=`
    .muscle-section-nav{margin:14px 0 18px;padding:14px;border:1px solid #d8dce5;border-radius:18px;background:#f8f9fb}
    .muscle-section-nav-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
    .muscle-section-nav-head strong{color:#17233b}.muscle-section-nav-head span{color:#667085;font-size:.78rem}
    .muscle-section-group+.muscle-section-group{margin-top:12px;padding-top:12px;border-top:1px solid #e1e5eb}
    .muscle-section-group-label{display:block;margin:0 0 7px;color:#667085;font:800 .72rem/1.2 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em}
    .muscle-section-pills{display:flex;flex-wrap:wrap;gap:8px}
    .muscle-section-pill{border:1px solid #d7dce5;border-radius:999px;background:#fff;color:#17233b;padding:9px 12px;font:700 .82rem/1.1 system-ui,sans-serif;cursor:pointer}
    .muscle-section-pill.action{background:#17233b;color:#fff;border-color:#17233b}
    .muscle-section-return{display:inline-flex;margin-top:12px;border:0;background:transparent;color:#245f9e;font:800 .82rem/1.2 system-ui,sans-serif;cursor:pointer;padding:4px 0}
    .muscle-action-source{display:none!important}
    @media(max-width:600px){.muscle-section-nav{padding:12px}.muscle-section-pill{padding:9px 11px;font-size:.78rem}.muscle-section-nav-head{display:block}.muscle-section-nav-head span{display:block;margin-top:3px}}
  `;
  document.head.appendChild(style);

  const ACTIONS=[
    {key:'relationships',label:'Relationship Map'},
    {key:'conservative',label:'Conservative Options'}
  ];
  const REFERENCES=[
    {key:'related-structures',label:'Related Structures'},
    {key:'related-movements',label:'Related Movements'},
    {key:'functional-roles',label:'Functional Roles'},
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
  }
  function hideDuplicateActionRows(card){
    [relationshipTarget(card),conservativeTarget(card)].forEach(target=>{
      if(target?.classList)target.classList.add('muscle-action-source');
    });
  }
  function placeNav(card,nav){
    const atlas=card.querySelector('.muscle-card-primary');
    if(atlas){atlas.insertAdjacentElement('afterend',nav);return}
    const essentials=card.querySelector('.muscle-card-essentials');
    if(essentials){essentials.insertAdjacentElement('afterend',nav);return}
    const h2=card.querySelector('h2');h2?.insertAdjacentElement('afterend',nav);
  }
  function pillHtml(item,type){return `<button type="button" class="muscle-section-pill ${type==='action'?'action':''}" data-muscle-section="${item.key}">${item.label}</button>`}
  function enhance(){
    const card=currentCard();if(!card)return;
    hideDuplicateActionRows(card);
    const actions=ACTIONS.filter(item=>targetFor(card,item.key));
    const refs=REFERENCES.filter(item=>targetFor(card,item.key));
    if(!actions.length&&!refs.length)return;
    const signature='a:'+actions.map(x=>x.key).join('|')+';r:'+refs.map(x=>x.key).join('|');
    let nav=card.querySelector('.muscle-section-nav');
    if(!nav){nav=document.createElement('nav');nav.className='muscle-section-nav';nav.id='muscle-section-menu';nav.setAttribute('aria-label','Muscle reference sections');placeNav(card,nav)}
    if(nav.dataset.menuSignature!==signature){
      nav.dataset.menuSignature=signature;
      nav.innerHTML=`<div class="muscle-section-nav-head"><strong>Explore this muscle</strong><span>Open a tool or jump to a reference section.</span></div>${actions.length?`<div class="muscle-section-group"><span class="muscle-section-group-label">Open</span><div class="muscle-section-pills">${actions.map(x=>pillHtml(x,'action')).join('')}</div></div>`:''}${refs.length?`<div class="muscle-section-group"><span class="muscle-section-group-label">Jump to reference</span><div class="muscle-section-pills">${refs.map(x=>pillHtml(x,'reference')).join('')}</div></div>`:''}`;
      nav.querySelectorAll('[data-muscle-section]').forEach(btn=>btn.onclick=()=>navClick(card,btn.dataset.muscleSection));
    }
    addReturns(card);
  }

  document.addEventListener('click',e=>{
    const back=e.target.closest('[data-muscle-menu-return]');if(!back)return;
    e.preventDefault();scrollTo(app.querySelector('#muscle-section-menu'));
  });
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();