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

  function collapseRegionMenu(menu){
    if(!menu||menu.classList.contains('library-entry-collapsed'))return;
    const selected=menu.querySelector('[data-library-filter][aria-pressed="true"]');
    if(!selected||selected.dataset.libraryFilter==='all')return;
    let compact=menu.querySelector('.library-entry-compact');
    if(!compact){
      compact=document.createElement('div');
      compact.className='library-entry-compact';
      menu.prepend(compact);
    }
    compact.innerHTML=`<strong>${selected.textContent.trim()}</strong><button type="button" class="library-change-filter">Change region</button>`;
    menu.classList.add('library-entry-collapsed');
    compact.querySelector('.library-change-filter').onclick=()=>{
      menu.classList.remove('library-entry-collapsed');
      menu.querySelector('.library-entry-head')?.scrollIntoView({block:'nearest'});
    };
  }

  function polishRegionMenu(){
    const menu=document.getElementById('anatomyRegionMenu');
    if(!menu)return;
    if(!menu.dataset.polishBound){
      menu.dataset.polishBound='true';
      menu.addEventListener('click',event=>{
        const filter=event.target.closest('[data-library-kind="anatomy"][data-library-filter]');
        if(!filter)return;
        setTimeout(()=>collapseRegionMenu(menu),0);
      });
    }
    collapseRegionMenu(menu);
  }

  function enhance(){
    polishMuscleCards();
    polishRegionMenu();
  }

  const style=document.createElement('style');
  style.textContent=`
    .notice,.captured-intake{background:#e8edf4!important;border-color:#c8d2df!important;color:#17233b}
    .captured-intake .pill{background:#f5f7fa;border:1px solid #d8dee7;color:#17233b}
    .muscle-card-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:5px 0 4px}
    .muscle-card-title-row h3{margin:0;min-width:0}
    .muscle-card-open{flex:0 0 auto;text-decoration:none!important;border:1px solid #9a6b73!important;border-radius:10px!important;padding:8px 10px!important;background:#fff8ed!important;color:#5f3940!important;font-size:.76rem!important;line-height:1!important;white-space:nowrap}
    .muscle-card-open:hover,.muscle-card-open:focus-visible{background:#f5e8e2!important;outline:2px solid rgba(123,70,80,.16);outline-offset:2px}
    .library-entry-compact{display:none;align-items:center;justify-content:space-between;gap:12px;min-height:48px}
    .library-entry-compact strong{font:700 1rem/1.2 Georgia,'Times New Roman',serif;color:#17233b}
    .library-change-filter{border:1px solid #8b5961;border-radius:10px;background:#fff8ed;color:#5f3940;padding:9px 12px;font-weight:800;cursor:pointer}
    #anatomyRegionMenu.library-entry-collapsed{padding:8px 12px;margin-bottom:0;border-radius:10px 10px 0 0}
    #anatomyRegionMenu.library-entry-collapsed .library-entry-compact{display:flex}
    #anatomyRegionMenu.library-entry-collapsed .library-entry-head,
    #anatomyRegionMenu.library-entry-collapsed .library-entry-buttons,
    #anatomyRegionMenu.library-entry-collapsed .library-entry-note{display:none}
    @media(max-width:520px){
      .muscle-card-title-row{align-items:flex-start}
      .muscle-card-open{padding:8px 9px!important;font-size:.72rem!important}
    }
  `;
  document.head.appendChild(style);

  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();