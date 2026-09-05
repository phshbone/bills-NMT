(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  const style=document.createElement('style');
  style.textContent=`
    .muscle-section-nav{margin:14px 0 18px;padding:14px;border:1px solid #cfc5b6;border-radius:6px;background:#f7f0e4;box-shadow:inset 0 0 0 1px #fffaf2}
    .muscle-section-nav-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
    .muscle-section-nav-head strong{color:#17233b;font-family:Georgia,'Times New Roman',serif;letter-spacing:.01em}.muscle-section-nav-head span{color:#6f665b;font-size:.78rem}
    .muscle-section-group+.muscle-section-group{margin-top:12px;padding-top:12px;border-top:1px solid #d7ccbd}
    .muscle-section-group-label{display:block;margin:0 0 7px;color:#766b5f;font:800 .7rem/1.2 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.1em}
    .muscle-section-pills{display:flex;flex-wrap:wrap;gap:7px}
    .muscle-section-pill{border:1px solid #9f9383;border-radius:3px;background:#fffaf0;color:#17233b;padding:9px 11px;font:700 .8rem/1.1 Georgia,'Times New Roman',serif;cursor:pointer;box-shadow:inset 0 0 0 1px #eee2d0,0 1px 0 rgba(23,35,59,.06)}
    .muscle-section-pill:hover,.muscle-section-pill:focus-visible{background:#f4eadb;outline:2px solid rgba(115,38,48,.22);outline-offset:2px}
    .muscle-section-pill.action{background:#17233b;color:#fff8ed;border-color:#17233b;box-shadow:inset 0 0 0 1px #9e8e79}
    .muscle-section-pill.action:hover,.muscle-section-pill.action:focus-visible{background:#243553}
    .muscle-section-return{display:inline-flex;margin-top:12px;border:0;background:transparent;color:#6f2733;font:800 .82rem/1.2 system-ui,sans-serif;cursor:pointer;padding:4px 0}
    .muscle-action-source{display:none!important}
    .muscle-reference-sheet{position:fixed;left:0;right:0;bottom:0;z-index:80;max-height:min(46vh,470px);background:#fbf4e7;border:1px solid #a99b88;border-bottom:0;border-radius:7px 7px 0 0;box-shadow:0 -14px 34px rgba(23,35,59,.24),inset 0 1px 0 #fffaf2;transform:translateY(108%);transition:transform .2s ease;display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom)}
    .muscle-reference-sheet.open{transform:translateY(0)}
    .muscle-reference-sheet-head{position:sticky;top:0;background:#fbf4e7;border-bottom:1px solid #cfc2b0;padding:8px 13px 9px;z-index:2}
    .muscle-reference-sheet-handle{width:46px;height:2px;background:#7f7468;margin:0 auto 8px}
    .muscle-reference-sheet-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .muscle-reference-sheet-title{margin:0;color:#17233b;font:700 1.02rem/1.2 Georgia,'Times New Roman',serif}
    .muscle-reference-sheet-close{border:1px solid #9f9383;background:#fffaf0;color:#17233b;border-radius:2px;width:34px;height:34px;font-size:1.1rem;line-height:1;cursor:pointer;box-shadow:inset 0 0 0 1px #eee2d0}
    .muscle-reference-sheet-body{overflow:auto;padding:13px 15px 16px;color:#26344b;-webkit-overflow-scrolling:touch}
    .muscle-reference-sheet-body .structural-fact{margin:0 0 12px;padding:11px;border:1px solid #cfc2b0;border-radius:3px;background:#fffaf0;box-shadow:inset 0 0 0 1px #f0e5d5}
    .muscle-reference-sheet-body p:first-child{margin-top:0}
    .muscle-reference-sheet-full{margin-top:13px;border:1px solid #17233b;border-radius:3px;background:#17233b;color:#fff8ed;padding:9px 12px;font:700 .8rem/1.1 Georgia,'Times New Roman',serif;cursor:pointer;box-shadow:inset 0 0 0 1px #9e8e79}
    @media(max-width:700px){.muscle-section-nav{padding:11px}.muscle-section-pill{padding:9px 10px;font-size:.77rem}.muscle-section-nav-head{display:block}.muscle-section-nav-head span{display:block;margin-top:3px}.muscle-card-reference{scroll-margin-top:12px}}
    @media(min-width:701px){.muscle-reference-sheet{display:none!important}}
  `;
  document.head.appendChild(style);

  const ACTIONS=[
    {key:'relationships',label:'Relationship Map'},
    {key:'conservative',label:'Conservative Options'}
  ];
  const REFERENCES=[
    {key:'attachment-detail',label:'Attachment Detail'},
    {key:'nearby-anatomy',label:'Nearby Anatomy'},
    {key:'related-structures',label:'Related Structures'},
    {key:'related-movements',label:'Related Movements'},
    {key:'functional-roles',label:'Functional Roles'},
    {key:'reference',label:'Deeper Reference'},
    {key:'sources',label:'Sources'}
  ];

  let sheet=null;
  let sheetTarget=null;

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
    if(key==='attachment-detail')return detailsByLabel(card,'Attachment detail');
    if(key==='nearby-anatomy')return detailsByLabel(card,'Nearby anatomy');
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
  function isPhone(){return window.matchMedia('(max-width:700px)').matches}
  function ensureSheet(){
    if(sheet?.isConnected)return sheet;
    sheet=document.createElement('section');
    sheet.className='muscle-reference-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','false');
    sheet.setAttribute('aria-label','Muscle reference detail');
    sheet.innerHTML='<div class="muscle-reference-sheet-head"><div class="muscle-reference-sheet-handle" aria-hidden="true"></div><div class="muscle-reference-sheet-title-row"><h3 class="muscle-reference-sheet-title">Reference</h3><button type="button" class="muscle-reference-sheet-close" aria-label="Close reference">×</button></div></div><div class="muscle-reference-sheet-body"></div>';
    document.body.appendChild(sheet);
    sheet.querySelector('.muscle-reference-sheet-close').onclick=closeSheet;
    return sheet;
  }
  function closeSheet(){if(sheet)sheet.classList.remove('open');sheetTarget=null}
  function cloneReferenceContent(target){
    if(!target)return null;
    const body=target.querySelector(':scope > .muscle-card-detail-body');
    if(body)return body.cloneNode(true);
    if(target.classList?.contains('muscle-card-reference')){
      const wrap=document.createElement('div');
      [...target.querySelectorAll(':scope > .muscle-card-detail-section')].forEach(item=>{
        const block=document.createElement('section');
        block.className='structural-fact';
        const title=document.createElement('strong');title.textContent=item.dataset.detailLabel||item.querySelector('summary')?.textContent||'Reference';block.appendChild(title);
        const content=item.querySelector(':scope > .muscle-card-detail-body');if(content)block.appendChild(content.cloneNode(true));wrap.appendChild(block);
      });
      return wrap;
    }
    return target.cloneNode(true);
  }
  function revealAnatomyContext(card){
    const primary=card.querySelector('.muscle-card-primary')||card.querySelector('.muscle-card-essentials')||card.querySelector('h2');
    if(!primary)return;
    const rect=primary.getBoundingClientRect();
    const leaveForSheet=Math.round(window.innerHeight*.48);
    if(rect.bottom<90||rect.top>leaveForSheet){primary.scrollIntoView({behavior:'auto',block:'start'})}
  }
  function openSheet(card,key,label){
    const target=targetFor(card,key);if(!target)return;
    sheetTarget=target;
    revealAnatomyContext(card);
    const panel=ensureSheet();
    panel.querySelector('.muscle-reference-sheet-title').textContent=label;
    const body=panel.querySelector('.muscle-reference-sheet-body');body.innerHTML='';
    const cloned=cloneReferenceContent(target);if(cloned)body.appendChild(cloned);
    body.querySelectorAll('.muscle-section-return').forEach(x=>x.remove());
    const full=document.createElement('button');full.type='button';full.className='muscle-reference-sheet-full';full.textContent='Open full reference ↓';
    full.onclick=()=>{closeSheet();openDetails(target);setTimeout(()=>scrollTo(target),30)};
    body.appendChild(full);
    panel.classList.add('open');
    panel.querySelector('.muscle-reference-sheet-close').focus({preventScroll:true});
  }
  function navClick(card,key,label){
    if(key==='relationships'){
      const button=card.querySelector('[data-explore-rel]');
      if(button){button.click();return}
    }
    if(key==='conservative'){
      const button=card.querySelector('[data-open-intervention]');
      if(button){button.click();return}
    }
    const target=targetFor(card,key);if(!target)return;
    if(isPhone()&&key!=='reference'){openSheet(card,key,label);return}
    openDetails(target);scrollTo(target);
  }
  function addReturn(target){
    if(!target||target.querySelector(':scope > .muscle-section-return, :scope > .muscle-card-detail-body > .muscle-section-return'))return;
    const btn=document.createElement('button');btn.type='button';btn.className='muscle-section-return';btn.textContent='Back to muscle menu ↑';btn.dataset.muscleMenuReturn='true';
    const body=target.querySelector(':scope > .muscle-card-detail-body');
    (body||target).appendChild(btn);
  }
  function addReturns(card){
    ['attachment-detail','nearby-anatomy','related-structures','related-movements','functional-roles','sources'].forEach(key=>addReturn(targetFor(card,key)));
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
  function pillHtml(item,type){return `<button type="button" class="muscle-section-pill ${type==='action'?'action':''}" data-muscle-section="${item.key}" data-muscle-label="${item.label}">${item.label}</button>`}
  function enhance(){
    const card=currentCard();if(!card){closeSheet();return}
    hideDuplicateActionRows(card);
    const actions=ACTIONS.filter(item=>targetFor(card,item.key));
    const refs=REFERENCES.filter(item=>targetFor(card,item.key));
    if(!actions.length&&!refs.length)return;
    const signature='a:'+actions.map(x=>x.key).join('|')+';r:'+refs.map(x=>x.key).join('|');
    let nav=card.querySelector('.muscle-section-nav');
    if(!nav){nav=document.createElement('nav');nav.className='muscle-section-nav';nav.id='muscle-section-menu';nav.setAttribute('aria-label','Muscle reference sections');placeNav(card,nav)}
    if(nav.dataset.menuSignature!==signature){
      nav.dataset.menuSignature=signature;
      nav.innerHTML=`<div class="muscle-section-nav-head"><strong>Explore this muscle</strong><span>Open a tool or bring reference detail into view.</span></div>${actions.length?`<div class="muscle-section-group"><span class="muscle-section-group-label">Open</span><div class="muscle-section-pills">${actions.map(x=>pillHtml(x,'action')).join('')}</div></div>`:''}${refs.length?`<div class="muscle-section-group"><span class="muscle-section-group-label">Reference</span><div class="muscle-section-pills">${refs.map(x=>pillHtml(x,'reference')).join('')}</div></div>`:''}`;
      nav.querySelectorAll('[data-muscle-section]').forEach(btn=>btn.onclick=()=>navClick(card,btn.dataset.muscleSection,btn.dataset.muscleLabel));
    }
    addReturns(card);
  }

  document.addEventListener('click',e=>{
    const back=e.target.closest('[data-muscle-menu-return]');if(!back)return;
    e.preventDefault();closeSheet();scrollTo(app.querySelector('#muscle-section-menu'));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet?.classList.contains('open'))closeSheet()});
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();