(function(){
  const app=document.getElementById('app');
  if(!app)return;

  function polishMuscleCards(){
    document.querySelectorAll('#anatomyGrid .record-card').forEach(card=>{
      if(card.dataset.muscleCardPolished==='true')return;
      const title=card.querySelector('h3');
      const open=card.querySelector('[data-open-muscle]');
      if(!title||!open)return;
      open.textContent='View muscle →';
      open.setAttribute('aria-label',`View ${title.textContent.trim()} muscle card`);
      open.classList.add('muscle-card-open');
      if(!title.parentElement?.classList.contains('muscle-card-title-row')){
        const row=document.createElement('div');
        row.className='muscle-card-title-row';
        title.before(row);
        row.append(title,open);
      }
      card.dataset.muscleCardPolished='true';
    });
  }

  function polishHypothesisCards(){
    document.querySelectorAll('#app .hypothesis-card').forEach(card=>{
      if(card.dataset.hypothesisLinkPolished==='true')return;
      const title=card.querySelector('h3');
      const open=card.querySelector('[data-open-muscle]');
      if(!title||!open)return;
      open.textContent='View muscle →';
      open.setAttribute('aria-label',`View ${title.textContent.trim()} muscle card`);
      open.classList.add('muscle-card-open','hypothesis-muscle-open');
      let row=title.closest('.hypothesis-title-row');
      if(!row){
        row=document.createElement('div');
        row.className='hypothesis-title-row';
        title.before(row);
        row.append(title,open);
      }
      card.dataset.hypothesisLinkPolished='true';
    });
  }

  function collapseLibraryMenu(menu){
    if(!menu||menu.classList.contains('library-entry-collapsed'))return;
    const selected=menu.querySelector('[data-library-filter][aria-pressed="true"]');
    if(!selected||selected.dataset.libraryFilter==='all')return;
    const kind=selected.dataset.libraryKind;
    let compact=menu.querySelector('.library-entry-compact');
    if(!compact){
      compact=document.createElement('div');
      compact.className='library-entry-compact';
      menu.prepend(compact);
    }
    const changeLabel=kind==='movement'?'Change plane':'Change region';
    compact.innerHTML=`<strong>${selected.textContent.trim()}</strong><button type="button" class="library-change-filter">${changeLabel}</button>`;
    menu.classList.add('library-entry-collapsed');
    compact.querySelector('.library-change-filter').onclick=()=>{
      menu.classList.remove('library-entry-collapsed');
      menu.querySelector('.library-entry-head')?.scrollIntoView({block:'nearest'});
    };
  }

  function polishLibraryMenu(id,kind){
    const menu=document.getElementById(id);
    if(!menu)return;
    if(!menu.dataset.polishBound){
      menu.dataset.polishBound='true';
      menu.addEventListener('click',event=>{
        const filter=event.target.closest(`[data-library-kind="${kind}"][data-library-filter]`);
        if(!filter)return;
        setTimeout(()=>collapseLibraryMenu(menu),0);
      });
    }
    collapseLibraryMenu(menu);
  }

  function enhance(){
    polishMuscleCards();
    polishHypothesisCards();
    polishLibraryMenu('anatomyRegionMenu','anatomy');
    polishLibraryMenu('movementPlaneMenu','movement');
  }

  const style=document.createElement('style');
  style.textContent=`
    .notice,.captured-intake{background:#e8edf4!important;border-color:#c8d2df!important;color:#17233b}
    .captured-intake .pill{background:#f5f7fa;border:1px solid #d8dee7;color:#17233b}
    .muscle-card-title-row,.hypothesis-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:5px 0 4px;flex-wrap:wrap}
    .muscle-card-title-row h3,.hypothesis-title-row h3{margin:0;min-width:0;flex:1 1 150px}
    .hypothesis-card header{margin-bottom:10px}
    .hypothesis-card header>div{width:100%;min-width:0}
    .hypothesis-card .pill+ .hypothesis-title-row{margin-top:10px}
    .muscle-card-open{flex:0 0 auto;text-decoration:none!important;border:1px solid #9a6b73!important;border-radius:10px!important;padding:8px 10px!important;background:#fff8ed!important;color:#5f3940!important;font-size:.76rem!important;line-height:1!important;white-space:nowrap;max-width:100%}
    .muscle-card-open:hover,.muscle-card-open:focus-visible{background:#f5e8e2!important;outline:2px solid rgba(123,70,80,.16);outline-offset:2px}
    .hypothesis-muscle-open{margin-left:auto!important}
    .library-entry-compact{display:none;align-items:center;justify-content:space-between;gap:12px;min-height:48px}
    .library-entry-compact strong{font:700 1rem/1.2 Georgia,'Times New Roman',serif;color:#17233b}
    .library-change-filter{border:1px solid #8b5961;border-radius:10px;background:#fff8ed;color:#5f3940;padding:9px 12px;font-weight:800;cursor:pointer}
    .library-entry.library-entry-collapsed{padding:8px 12px;margin-bottom:0;border-radius:10px 10px 0 0}
    .library-entry.library-entry-collapsed .library-entry-compact{display:flex}
    .library-entry.library-entry-collapsed .library-entry-head,
    .library-entry.library-entry-collapsed .library-entry-buttons,
    .library-entry.library-entry-collapsed .library-entry-note{display:none}
    @media(max-width:520px){
      .muscle-card-title-row,.hypothesis-title-row{gap:8px}
      .muscle-card-open{padding:8px 9px!important;font-size:.72rem!important}
    }
    @media (orientation:landscape) and (min-width:600px) and (max-width:1099px){
      .hypothesis-title-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:8px}
      .hypothesis-title-row h3{overflow-wrap:anywhere}
      .hypothesis-muscle-open{align-self:start;margin-left:0!important}
      .library-entry.library-entry-collapsed{min-height:52px;padding:6px 12px}
      .library-entry-compact{min-height:40px}
    }
  `;
  document.head.appendChild(style);

  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();