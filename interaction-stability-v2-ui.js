(function(){
  const app=document.getElementById('app');
  if(!app)return;

  const style=document.createElement('style');
  style.textContent=`
    .atlas-subtabs[hidden],.atlas-orientation[hidden]{display:none!important}
    @media(max-width:700px){
      .record-card.reference-mode .atlas-head,
      .record-card.reference-mode .atlas-subtabs,
      .record-card.reference-mode .atlas-reciprocal-slot,
      .record-card.reference-mode .atlas-related,
      .record-card.reference-mode .atlas-region-note{display:none!important}
      .record-card.reference-mode .anatomy-atlas{margin-top:4px!important;overflow:hidden!important;box-sizing:border-box}
      .record-card.reference-mode .atlas-tabs{padding-top:7px!important;padding-bottom:6px!important}
      .record-card.reference-mode .atlas-orientation{margin-bottom:6px!important;padding-top:5px!important;padding-bottom:5px!important}
      .record-card.reference-mode .atlas-stage{margin-bottom:6px!important}
      .record-card.reference-mode .atlas-image{max-height:20vh!important;object-fit:contain!important}
    }
  `;
  document.head.appendChild(style);

  function isPhone(){return window.matchMedia('(max-width:700px)').matches}
  function headerBottom(){return Math.ceil(document.querySelector('.app-header')?.getBoundingClientRect().bottom||0)}

  function alignLibraryMenuById(id){
    if(!isPhone()||!id)return;
    const apply=()=>{
      const menu=document.getElementById(id);
      if(!menu?.isConnected||!menu.classList.contains('library-workspace-anchored'))return;
      const target=headerBottom();
      const rect=menu.getBoundingClientRect();
      if(Math.abs(rect.top-target)>2){
        window.scrollTo({top:Math.max(0,Math.round(window.scrollY+rect.top-target)),left:0,behavior:'auto'});
      }
    };
    apply();
    requestAnimationFrame(()=>{apply();requestAnimationFrame(apply)});
    setTimeout(apply,80);
    setTimeout(apply,220);
    setTimeout(apply,420);
  }

  function normalizeReferralReciprocal(){
    document.querySelectorAll('.anatomy-atlas').forEach(atlas=>{
      const stage=atlas.querySelector('.atlas-stage');
      if(stage?.dataset.mode!=='referral')return;
      const reciprocal=atlas.querySelector('.atlas-reciprocal[data-reciprocal-mode="anatomy"]');
      if(!reciprocal)return;
      const img=reciprocal.querySelector('img');
      if(!img)return;
      const card=atlas.closest('.record-card');
      const name=card?.querySelector('h2')?.textContent?.trim()||'Anatomy';
      img.remove();
      reciprocal.classList.remove('atlas-reciprocal-image');
      if(!reciprocal.querySelector('strong')){
        const strong=document.createElement('strong');strong.textContent=name;reciprocal.appendChild(strong);
      }
      if(!reciprocal.querySelector('p')){
        const p=document.createElement('p');p.textContent='Verified anatomy remains available in the Anatomy view.';reciprocal.appendChild(p);
      }
    });
  }

  function clearReferenceSizing(){
    document.querySelectorAll('.anatomy-atlas[data-compact-fit="true"]').forEach(atlas=>{
      atlas.style.removeProperty('max-height');
      atlas.style.removeProperty('overflow');
      atlas.removeAttribute('data-compact-fit');
    });
  }

  function fitReferenceAboveSheet(){
    if(!isPhone())return;
    const card=app.querySelector('.record-card.reference-mode');
    const sheet=document.querySelector('.muscle-reference-sheet.open');
    const atlas=card?.querySelector('.anatomy-atlas');
    if(!card||!sheet||!atlas){clearReferenceSizing();return}
    const apply=()=>{
      if(!sheet.classList.contains('open')||!card.classList.contains('reference-mode'))return;
      const top=headerBottom()+3;
      const sheetTop=sheet.getBoundingClientRect().top;
      const available=Math.max(190,Math.floor(sheetTop-top-6));
      atlas.style.maxHeight=available+'px';
      atlas.style.overflow='hidden';
      atlas.dataset.compactFit='true';
      const rect=atlas.getBoundingClientRect();
      if(Math.abs(rect.top-top)>2){
        window.scrollTo({top:Math.max(0,Math.round(window.scrollY+rect.top-top)),left:0,behavior:'auto'});
      }
    };
    apply();
    requestAnimationFrame(()=>{apply();requestAnimationFrame(apply)});
    setTimeout(apply,100);
    setTimeout(apply,260);
    setTimeout(apply,420);
  }

  document.addEventListener('click',event=>{
    const filter=event.target.closest('.library-entry-button[data-library-filter]');
    if(filter){
      const id=filter.closest('.library-entry')?.id;
      setTimeout(()=>alignLibraryMenuById(id),0);
    }
    if(event.target.closest('[data-card-mode]')){
      setTimeout(normalizeReferralReciprocal,0);
    }
    if(event.target.closest('[data-muscle-section]')&&isPhone()){
      setTimeout(fitReferenceAboveSheet,0);
    }
    if(event.target.closest('.muscle-reference-sheet-close')){
      setTimeout(clearReferenceSizing,0);
    }
  },true);

  new MutationObserver(()=>{
    if(isPhone()){
      const anchored=document.querySelector('.library-entry.library-workspace-anchored');
      if(anchored?.id)alignLibraryMenuById(anchored.id);
      if(document.querySelector('.muscle-reference-sheet.open'))fitReferenceAboveSheet();
      else clearReferenceSizing();
    }
    normalizeReferralReciprocal();
  }).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','data-mode']});

  normalizeReferralReciprocal();
})();