(function(){
  const app=document.getElementById('app');
  if(!app)return;

  function headerBottom(){return Math.ceil(document.querySelector('.app-header')?.getBoundingClientRect().bottom||0)}

  function alignLibraryMenu(menu){
    if(!menu?.isConnected)return;
    const targetTop=headerBottom();
    const apply=()=>{
      if(!menu.isConnected)return;
      const rect=menu.getBoundingClientRect();
      const delta=rect.top-targetTop;
      if(Math.abs(delta)>2)window.scrollBy({top:delta,left:0,behavior:'auto'});
    };
    apply();
    requestAnimationFrame(()=>{apply();requestAnimationFrame(apply)});
  }

  function fitReferenceAboveSheet(){
    if(!window.matchMedia('(max-width:700px)').matches)return;
    const card=app.querySelector('.record-card.reference-mode');
    const sheet=document.querySelector('.muscle-reference-sheet.open');
    const atlas=card?.querySelector('.anatomy-atlas');
    if(!card||!sheet||!atlas)return;
    const apply=()=>{
      if(!sheet.classList.contains('open')||!card.classList.contains('reference-mode'))return;
      const a=atlas.getBoundingClientRect();
      const s=sheet.getBoundingClientRect();
      const h=headerBottom();
      if(a.bottom>s.top-6){
        window.scrollBy({top:a.bottom-(s.top-6),left:0,behavior:'auto'});
      }
      const after=atlas.getBoundingClientRect();
      if(after.top<h+2){
        window.scrollBy({top:after.top-(h+2),left:0,behavior:'auto'});
      }
    };
    requestAnimationFrame(()=>{apply();requestAnimationFrame(apply)});
  }

  document.addEventListener('click',event=>{
    const filter=event.target.closest('.library-entry-button[data-library-filter]');
    if(filter){
      const menu=filter.closest('.library-entry');
      setTimeout(()=>alignLibraryMenu(menu),0);
      return;
    }
    const reference=event.target.closest('[data-muscle-section]');
    if(reference&&window.matchMedia('(max-width:700px)').matches){
      setTimeout(fitReferenceAboveSheet,0);
    }
  },true);

  new MutationObserver(()=>{
    if(document.querySelector('.muscle-reference-sheet.open'))fitReferenceAboveSheet();
  }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
})();