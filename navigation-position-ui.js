(function(){
  const app=document.getElementById('app');
  if(!app)return;

  let transitionToken=0;

  function headerBottom(){
    const header=document.querySelector('.app-header');
    return header?Math.ceil(header.getBoundingClientRect().bottom):0;
  }

  function snapWindowTop(){
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }

  function snapDetailTop(){
    // The floating Back control is position:fixed and must never be used as a
    // document-scroll anchor. Anchor the canonical record card itself.
    const card=app.querySelector('.record-card');
    const target=card||app;
    const top=Math.max(0,window.scrollY+target.getBoundingClientRect().top-headerBottom()-8);
    window.scrollTo({top,left:0,behavior:'auto'});
  }

  function settle(kind){
    const token=++transitionToken;
    const apply=()=>{
      if(token!==transitionToken)return;
      if(kind==='detail')snapDetailTop();
      else snapWindowTop();
    };
    requestAnimationFrame(()=>{
      apply();
      requestAnimationFrame(apply);
      setTimeout(apply,80);
      setTimeout(apply,220);
      setTimeout(apply,420);
    });
  }

  document.addEventListener('click',event=>{
    // A library region/plane selection establishes its own anchored workspace.
    // Invalidate any delayed route-settle callbacks started by the preceding
    // primary-nav click so they cannot pull the outer page away afterward.
    if(event.target.closest('.library-entry-button[data-library-filter]')){
      transitionToken++;
      return;
    }

    const open=event.target.closest('[data-open-muscle],[data-open-movement]');
    if(open){settle('detail');return;}

    const back=event.target.closest('[data-back-detail]');
    if(back){
      settle('route');
      return;
    }

    const nav=event.target.closest('.nav-btn');
    if(nav)settle('route');
  },true);

  window.addEventListener('pageshow',()=>{
    if(app.querySelector('[data-back-detail]'))settle('detail');
  });
})();