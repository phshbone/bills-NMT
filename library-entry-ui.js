(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  const style=document.createElement('style');
  style.textContent=`
    .library-entry{margin:12px 0 14px;padding:12px;border:1px solid #cfc5b6;border-radius:6px;background:#f7f0e4;box-shadow:inset 0 0 0 1px #fffaf2}
    .library-entry-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:9px}
    .library-entry-head strong{font:700 .95rem/1.2 Georgia,'Times New Roman',serif;color:#17233b}.library-entry-head span{font-size:.76rem;color:#74695d}
    .library-entry-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .library-entry-button{min-height:48px;padding:8px 7px;border:1px solid #9f9383;border-radius:3px;background:#fffaf0;color:#17233b;font:700 .78rem/1.15 Georgia,'Times New Roman',serif;box-shadow:inset 0 0 0 1px #eee2d0;cursor:pointer}
    .library-entry-button[aria-pressed="true"]{background:#17233b;color:#fff8ed;border-color:#17233b;box-shadow:inset 0 0 0 1px #9e8e79}
    .library-entry-note{margin:8px 0 0;color:#74695d;font-size:.74rem}
    @media(max-width:700px){.library-entry{padding:10px}.library-entry-head{display:block}.library-entry-head span{display:block;margin-top:3px}.library-entry-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}.library-entry-button{min-height:50px;font-size:.8rem}}
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
  function applyAnatomy(){
    const grid=document.getElementById('anatomyGrid');if(!grid)return;
    const q=(document.getElementById('anatomySearch')?.value||'').trim().toLowerCase();
    [...grid.children].forEach(card=>{
      const m=muscleForCard(card);if(!m)return;
      const group=anatomyGroups.find(g=>g.id===anatomySelected);
      const categoryOk=anatomySelected==='all'||!!group?.match(m);
      const searchOk=!q||(card.dataset.searchText||'').includes(q);
      card.style.display=categoryOk&&searchOk?'':'none';
    });
  }
  function enhanceAnatomy(){
    const grid=document.getElementById('anatomyGrid');if(!grid||document.getElementById('anatomyRegionMenu'))return;
    const available=anatomyGroups.filter(g=>D.MUSCLES.some(g.match));
    const menu=document.createElement('section');menu.id='anatomyRegionMenu';menu.className='library-entry';menu.innerHTML=`<div class="library-entry-head"><strong>Browse by region</strong><span>One anatomy library, smaller entrances.</span></div><div class="library-entry-buttons">${button('all','All regions',anatomySelected,'anatomy')}${available.map(g=>button(g.id,g.label,anatomySelected,'anatomy')).join('')}</div><p class="library-entry-note">Search still works across the complete library.</p>`;
    grid.before(menu);
    menu.querySelectorAll('[data-library-filter]').forEach(b=>b.onclick=()=>{anatomySelected=b.dataset.libraryFilter;menu.querySelectorAll('[data-library-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyAnatomy()});
    document.getElementById('anatomySearch')?.addEventListener('input',applyAnatomy);
    applyAnatomy();
  }
  function applyMovement(){
    const menu=document.getElementById('movementPlaneMenu');if(!menu)return;
    const grid=menu.nextElementSibling;if(!grid)return;
    [...grid.children].forEach(card=>{
      const m=movementForCard(card);if(!m)return;
      const ok=movementSelected==='all'||planeCats(m).includes(movementSelected);
      card.style.display=ok?'':'none';
    });
  }
  function enhanceMovement(){
    if(currentRoute()!=='movement'||document.getElementById('movementPlaneMenu'))return;
    const cards=[...app.querySelectorAll('.record-card')].filter(c=>c.querySelector('[data-open-movement]'));
    if(!cards.length)return;
    const grid=cards[0].parentElement;if(!grid)return;
    const menu=document.createElement('section');menu.id='movementPlaneMenu';menu.className='library-entry';menu.innerHTML=`<div class="library-entry-head"><strong>Choose a movement plane</strong><span>Then open the movement that matters.</span></div><div class="library-entry-buttons">${button('sagittal','Sagittal',movementSelected,'movement')}${button('frontal','Frontal / scapular',movementSelected,'movement')}${button('transverse','Transverse',movementSelected,'movement')}${button('multiplanar','Multiplanar',movementSelected,'movement')}${button('all','All movements',movementSelected,'movement')}</div><p class="library-entry-note">Movements can appear in more than one plane when the record is genuinely multiplanar.</p>`;
    grid.before(menu);
    menu.querySelectorAll('[data-library-filter]').forEach(b=>b.onclick=()=>{movementSelected=b.dataset.libraryFilter;menu.querySelectorAll('[data-library-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyMovement()});
    applyMovement();
  }
  function enhance(){
    if(currentRoute()==='anatomy')enhanceAnatomy();
    if(currentRoute()==='movement')enhanceMovement();
  }
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();