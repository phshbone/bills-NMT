(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  const style=document.createElement('style');
  style.textContent=`
    .library-entry{margin:12px 0 0;padding:12px;border:1px solid #8d7468;border-radius:6px;background:#eee2d1;box-shadow:inset 0 0 0 1px #fff7ea;position:sticky;top:var(--library-sticky-top,112px);z-index:6}
    .library-entry-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:9px}
    .library-entry-head strong{font:700 .98rem/1.2 Georgia,'Times New Roman',serif;color:#17233b}.library-entry-head span{font-size:.76rem;color:#6f6258}
    .library-entry-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .library-entry-button{min-height:48px;padding:8px 7px;border:1px solid #55272d;border-radius:3px;background:#6f3038;color:#fff4e7;font:700 .78rem/1.15 Georgia,'Times New Roman',serif;box-shadow:inset 0 0 0 1px rgba(255,240,218,.28),0 1px 0 rgba(23,35,59,.08);cursor:pointer}
    .library-entry-button:hover,.library-entry-button:focus-visible{background:#7d3942;outline:2px solid rgba(23,35,59,.24);outline-offset:2px}
    .library-entry-button[aria-pressed="true"]{background:#17233b;color:#fff8ed;border-color:#17233b;box-shadow:inset 0 0 0 1px #9e8e79}
    .library-entry-note{margin:8px 0 0;color:#6f6258;font-size:.74rem}
    .library-scroll-panel{margin:0 0 14px;border:1px solid #c4b7a7;border-top:0;border-radius:0 0 8px 8px;background:#f8f1e6;padding:12px;max-height:min(54dvh,560px);overflow:auto;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable;box-shadow:inset 0 10px 22px rgba(70,48,34,.045)}
    .library-scroll-panel>.grid{margin:0!important}
    .library-scroll-panel .record-card{background:#fffdf8}
    .library-panel-caption{position:sticky;top:-12px;z-index:2;margin:-12px -12px 12px;padding:8px 12px;background:rgba(248,241,230,.96);border-bottom:1px solid #d7ccbd;color:#6f6258;font:700 .74rem/1.2 system-ui,sans-serif;backdrop-filter:blur(6px)}
    @media(max-width:700px){.library-entry{padding:10px}.library-entry-head{display:block}.library-entry-head span{display:block;margin-top:3px}.library-entry-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}.library-entry-button{min-height:50px;font-size:.8rem}.library-scroll-panel{max-height:52dvh;padding:10px}.library-panel-caption{top:-10px;margin:-10px -10px 10px;padding:7px 10px}}
  `;
  document.head.appendChild(style);

  const anatomyGroups=[
    {id:'head-neck',label:'Head & Neck',match:m=>/neck|head|cervical/i.test(m.region+' '+m.group)},
    {id:'shoulder-arm',label:'Shoulder & Upper Arm',match:m=>/upper quarter|shoulder|scapular|trapezius/i.test(m.region+' '+m.group)},
    {id:'forearm-hand',label:'Forearm & Hand',match:m=>/forearm|hand|wrist/i.test(m.region+' '+m.group)},
    {id:'chest-torso',label:'Chest & Torso',match:m=>/chest|thorax|torso|respiratory|pectoral/i.test(m.region+' '+m.group)},
    {id:'back-lumbar',label:'Back & Lumbar',match:m=>/lower back|lumbar|posterior abdominal|spinal/i.test(m.region+' '+m.group)},
    {id:'pelvis-hip',label:'Pelvis & Hip',match:m=>/hip|pelvis|gluteal/i.test(m.region+' '+m.group)},
    {id:'thigh-knee',label:'Thigh & Knee',match:m=>/thigh|knee|hamstring|quadriceps/i.test(m.region+' '+m.group)},
    {id:'leg-foot',label:'Lower Leg & Foot',match:m=>/lower leg|ankle|foot|calf/i.test(m.region+' '+m.group)}
  ];
  let anatomySelected='all';
  let movementSelected='all';
  let anatomySearchValue='';
  let anatomyPanelScroll=0;
  let movementPanelScroll=0;

  function setStickyTop(){
    const header=document.querySelector('.app-header');
    const h=Math.ceil(header?.getBoundingClientRect().height||96);
    document.documentElement.style.setProperty('--library-sticky-top',h+'px');
  }
  function currentRoute(){return document.querySelector('.nav-btn.active')?.dataset.route||''}
  function muscleForCard(card){const name=card.querySelector('h3')?.textContent.trim();return D.MUSCLES.find(m=>m.name===name)||null}
  function movementForCard(card){const name=card.querySelector('h3')?.textContent.trim();return D.MOVEMENTS.find(m=>m.name===name)||null}
  function planeCats(m){
    const text=(m.planes||[]).join(' ').toLowerCase();
    const out=[];
    if(text.includes('sagittal'))out.push('sagittal');
    if(text.includes('frontal')||text.includes('scapular'))out.push('frontal');
    if(text.includes('transverse')||text.includes('rotation'))out.push('transverse');
    if(text.includes('multiplanar')||(out.length>1))out.push('multiplanar');
    return [...new Set(out)];
  }
  function button(id,label,selected,kind){return `<button type="button" class="library-entry-button" data-library-kind="${kind}" data-library-filter="${id}" aria-pressed="${selected===id}">${label}</button>`}
  function selectedLabel(kind){
    if(kind==='anatomy')return anatomySelected==='all'?'All regions':anatomyGroups.find(g=>g.id===anatomySelected)?.label||'Region';
    return movementSelected==='all'?'All movements':({sagittal:'Sagittal',frontal:'Frontal / scapular',transverse:'Transverse',multiplanar:'Multiplanar'}[movementSelected]||'Movement plane');
  }
  function ensurePanel(grid,id,kind){
    if(grid.parentElement?.id===id)return grid.parentElement;
    const panel=document.createElement('section');panel.id=id;panel.className='library-scroll-panel';panel.dataset.libraryPanel=kind;
    const caption=document.createElement('div');caption.className='library-panel-caption';caption.dataset.libraryCaption=kind;panel.appendChild(caption);
    grid.before(panel);panel.appendChild(grid);
    panel.addEventListener('scroll',()=>{if(kind==='anatomy')anatomyPanelScroll=panel.scrollTop;else movementPanelScroll=panel.scrollTop},{passive:true});
    panel.addEventListener('click',e=>{
      if(kind==='anatomy'&&e.target.closest('[data-open-muscle]'))anatomyPanelScroll=panel.scrollTop;
      if(kind==='movement'&&e.target.closest('[data-open-movement]'))movementPanelScroll=panel.scrollTop;
    },true);
    return panel;
  }
  function updateCaption(kind){
    const caption=document.querySelector(`[data-library-caption="${kind}"]`);if(!caption)return;
    const visible=caption.parentElement.querySelectorAll('.record-card:not([style*="display: none"])').length;
    caption.textContent=`${selectedLabel(kind)} · ${visible} ${kind==='anatomy'?(visible===1?'record':'records'):(visible===1?'movement':'movements')}`;
  }
  function applyAnatomy(resetScroll=false){
    const grid=document.getElementById('anatomyGrid');if(!grid)return;
    const q=(document.getElementById('anatomySearch')?.value||'').trim().toLowerCase();
    [...grid.children].forEach(card=>{
      const m=muscleForCard(card);if(!m)return;
      const group=anatomyGroups.find(g=>g.id===anatomySelected);
      const categoryOk=anatomySelected==='all'||!!group?.match(m);
      const searchOk=!q||(card.dataset.searchText||'').includes(q);
      card.style.display=categoryOk&&searchOk?'':'none';
    });
    updateCaption('anatomy');
    const panel=document.getElementById('anatomyLibraryPanel');if(panel){if(resetScroll){anatomyPanelScroll=0;panel.scrollTop=0}else requestAnimationFrame(()=>panel.scrollTop=anatomyPanelScroll)}
  }
  function enhanceAnatomy(){
    const grid=document.getElementById('anatomyGrid');if(!grid||document.getElementById('anatomyRegionMenu'))return;
    setStickyTop();
    const search=document.getElementById('anatomySearch');if(search){search.value=anatomySearchValue;search.addEventListener('input',()=>{anatomySearchValue=search.value;applyAnatomy(true)})}
    const available=anatomyGroups.filter(g=>D.MUSCLES.some(g.match));
    const menu=document.createElement('section');menu.id='anatomyRegionMenu';menu.className='library-entry';menu.innerHTML=`<div class="library-entry-head"><strong>Browse by region</strong><span>Choose a region; the library stays contained below.</span></div><div class="library-entry-buttons">${button('all','All regions',anatomySelected,'anatomy')}${available.map(g=>button(g.id,g.label,anatomySelected,'anatomy')).join('')}</div><p class="library-entry-note">Search still works across the complete library.</p>`;
    grid.before(menu);
    const panel=ensurePanel(grid,'anatomyLibraryPanel','anatomy');
    menu.querySelectorAll('[data-library-filter]').forEach(b=>b.onclick=()=>{anatomySelected=b.dataset.libraryFilter;menu.querySelectorAll('[data-library-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyAnatomy(true)});
    applyAnatomy(false);
    requestAnimationFrame(()=>panel.scrollTop=anatomyPanelScroll);
  }
  function applyMovement(resetScroll=false){
    const panel=document.getElementById('movementLibraryPanel');if(!panel)return;
    const grid=panel.querySelector('.grid');if(!grid)return;
    [...grid.children].forEach(card=>{
      const m=movementForCard(card);if(!m)return;
      const ok=movementSelected==='all'||planeCats(m).includes(movementSelected);
      card.style.display=ok?'':'none';
    });
    updateCaption('movement');
    if(resetScroll){movementPanelScroll=0;panel.scrollTop=0}else requestAnimationFrame(()=>panel.scrollTop=movementPanelScroll);
  }
  function enhanceMovement(){
    if(currentRoute()!=='movement'||document.getElementById('movementPlaneMenu'))return;
    const cards=[...app.querySelectorAll('.record-card')].filter(c=>c.querySelector('[data-open-movement]'));
    if(!cards.length)return;
    setStickyTop();
    const grid=cards[0].parentElement;if(!grid)return;
    const menu=document.createElement('section');menu.id='movementPlaneMenu';menu.className='library-entry';menu.innerHTML=`<div class="library-entry-head"><strong>Choose a movement plane</strong><span>Then open the movement that matters.</span></div><div class="library-entry-buttons">${button('sagittal','Sagittal',movementSelected,'movement')}${button('frontal','Frontal / scapular',movementSelected,'movement')}${button('transverse','Transverse',movementSelected,'movement')}${button('multiplanar','Multiplanar',movementSelected,'movement')}${button('all','All movements',movementSelected,'movement')}</div><p class="library-entry-note">Movements can appear in more than one plane when the record is genuinely multiplanar.</p>`;
    grid.before(menu);
    const panel=ensurePanel(grid,'movementLibraryPanel','movement');
    menu.querySelectorAll('[data-library-filter]').forEach(b=>b.onclick=()=>{movementSelected=b.dataset.libraryFilter;menu.querySelectorAll('[data-library-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyMovement(true)});
    applyMovement(false);
    requestAnimationFrame(()=>panel.scrollTop=movementPanelScroll);
  }
  function enhance(){
    if(currentRoute()==='anatomy')enhanceAnatomy();
    if(currentRoute()==='movement')enhanceMovement();
  }
  window.addEventListener('resize',setStickyTop,{passive:true});
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();