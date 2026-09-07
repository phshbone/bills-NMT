(function(){
  function refine(section){
    if(!section||section.dataset.scaleneCardRefinement==='ready')return;
    if(section.dataset.anatomyAtlas!=='scalenes')return;

    section.querySelectorAll('[data-anatomy-subview]').forEach(btn=>{
      if(btn.dataset.anatomySubview==='main')btn.textContent='Main image';
      if(btn.dataset.anatomySubview==='attachment-detail')btn.textContent='Attachment view';
    });
    section.querySelectorAll('[data-scalene-topic="attachments"],[data-scalene-phone-topic="attachments"]').forEach(btn=>btn.textContent='Attachment facts');

    const phoneStrip=section.querySelector('.scalene-phone-topic-strip');
    if(phoneStrip&&!section.querySelector('.atlas-rotate-hint')){
      const hint=document.createElement('p');
      hint.className='atlas-rotate-hint';
      hint.textContent='Rotate for expanded atlas view.';
      phoneStrip.insertAdjacentElement('afterend',hint);
    }

    const installCompass=()=>{
      section.querySelectorAll('.atlas-image-window').forEach(win=>{
        if(win.querySelector('.atlas-plate-compass'))return;
        const compass=document.createElement('div');
        compass.className='atlas-plate-compass';
        compass.setAttribute('aria-label','Orientation: superior, inferior, anterior, posterior');
        compass.innerHTML='<span class="north">S</span><span class="south">I</span><span class="west">A</span><span class="east">P</span>';
        win.appendChild(compass);
      });
    };
    installCompass();
    new MutationObserver(installCompass).observe(section,{childList:true,subtree:true});
    section.dataset.scaleneCardRefinement='ready';
  }
  function scan(){document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(refine)}
  const app=document.getElementById('app');
  if(app)new MutationObserver(scan).observe(app,{childList:true,subtree:true});
  scan();
})();
