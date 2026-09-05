(function(){
  const D=window.NMT_DATA;if(!D)return;
  const CTX='nmt-muscle-return-context';
  const STORAGE='nmt-clinical-reasoning-v0.1';

  const style=document.createElement('style');
  style.textContent=`
    #app [data-back-detail].muscle-context-back{position:fixed;left:10px;bottom:96px;z-index:30;max-width:210px;box-shadow:0 4px 16px rgba(23,35,59,.12);background:#fff}
    @media(min-width:850px){#app [data-back-detail].muscle-context-back{left:auto;right:112px;bottom:24px}}
  `;
  document.head.appendChild(style);

  function readContext(){try{return JSON.parse(sessionStorage.getItem(CTX)||'null')}catch{return null}}
  function parentDetailFromTarget(target){
    const record=target.closest('.record-card');
    const h=record?.querySelector('h2');
    if(!h)return {id:null,name:null};
    const m=D.MUSCLES.find(x=>x.name===h.textContent.trim());
    return m?{id:m.id,name:m.name}:{id:null,name:null};
  }
  function saveContext(target){
    const nav=document.querySelector('.nav-btn.active');
    const route=nav?.dataset.route||'reasoning';
    const card=target.closest('.hypothesis-card,.record-card,.card');
    const parent=parentDetailFromTarget(target);
    const prior=readContext();
    if(!parent.id&&prior?.detailId&&prior.route===route)return;
    sessionStorage.setItem(CTX,JSON.stringify({route,detailId:parent.id,parentName:parent.name,scrollY:window.scrollY,anchorText:card?.querySelector('h2,h3')?.textContent?.trim()||''}));
  }
  function restoreScroll(ctx){const restore=()=>window.scrollTo({top:ctx?.scrollY||0,behavior:'auto'});setTimeout(restore,40);setTimeout(restore,160);setTimeout(restore,320)}
  function restoreDetailContext(ctx){
    if(!ctx?.detailId)return false;
    let state={};try{state=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    state.route=ctx.route||'anatomy';state.detail={type:'muscle',id:ctx.detailId};
    localStorage.setItem(STORAGE,JSON.stringify(state));sessionStorage.removeItem(CTX);location.reload();return true;
  }
  function decorateBack(){
    const back=document.querySelector('#app [data-back-detail]');if(!back)return;
    const ctx=readContext();if(!ctx?.route)return;
    const label=ctx.parentName||(ctx.detailId?D.MUSCLES.find(x=>x.id===ctx.detailId)?.name:null)||(ctx.route==='reasoning'?'reasoning':ctx.route);
    const desired='← Back to '+(label||ctx.route);
    if(back.textContent!==desired)back.textContent=desired;
    back.classList.add('muscle-context-back');
  }
  function enhance(){
    const card=document.querySelector('#app .record-card');
    if(!card||!card.querySelector('h2'))return;
    const m=D.MUSCLES.find(x=>x.name===card.querySelector('h2').textContent.trim());
    if(!m)return;
    decorateBack();
    card.querySelectorAll('.regional-visual-slot').forEach(x=>x.remove());
  }

  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-muscle]');
    if(open){saveContext(open);requestAnimationFrame(decorateBack);setTimeout(decorateBack,40)}
    const back=e.target.closest('[data-back-detail]');
    if(back){const ctx=readContext();if(ctx?.detailId){e.preventDefault();e.stopImmediatePropagation();restoreDetailContext(ctx);return}restoreScroll(ctx);sessionStorage.removeItem(CTX)}
  },true);
  const app=document.getElementById('app');if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();