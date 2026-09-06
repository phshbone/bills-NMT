(function(){
  const app=document.getElementById('app');
  if(!app)return;

  const style=document.createElement('style');
  style.textContent=`
    .library-scroll-panel{
      overscroll-behavior-y:contain;
      overscroll-behavior-x:none;
      touch-action:pan-y;
      overflow-anchor:none;
    }
    .library-entry.library-workspace-anchored{
      box-shadow:0 8px 24px rgba(23,35,59,.12),inset 0 0 0 1px #fff7ea;
      overflow-anchor:none;
    }
    @media(max-width:700px){
      .library-entry.library-workspace-anchored{
        border-radius:0 0 6px 6px;
      }
      .library-scroll-panel.library-workspace-active{
        max-height:calc(100dvh - var(--library-sticky-top,112px) - var(--library-menu-height,58px) - 86px);
        min-height:220px;
        overflow-y:auto;
        contain:layout paint;
      }
    }
    @media (orientation:landscape) and (min-width:600px) and (max-width:1099px){
      .library-entry.library-workspace-anchored{
        border-radius:0 0 6px 6px;
      }
      .library-scroll-panel.library-workspace-active{
        max-height:calc(100dvh - var(--library-sticky-top,64px) - var(--library-menu-height,58px) - 58px);
        min-height:180px;
        overflow-y:auto;
        contain:layout paint;
      }
    }
  `;
  document.head.appendChild(style);

  let lockedWindowY=null;
  let restoringWindow=false;
  let snapToken=0;

  function headerHeight(){return Math.ceil(document.querySelector('.app-header')?.getBoundingClientRect().height||96)}
  function panelFor(menu){
    if(menu.id==='anatomyRegionMenu')return document.getElementById('anatomyLibraryPanel');
    if(menu.id==='movementPlaneMenu')return document.getElementById('movementLibraryPanel');
    return null;
  }
  function keepOuterPageLocked(){
    if(lockedWindowY===null||restoringWindow)return;
    if(Math.abs(window.scrollY-lockedWindowY)<2)return;
    restoringWindow=true;
    window.scrollTo({top:lockedWindowY,behavior:'auto'});
    requestAnimationFrame(()=>{restoringWindow=false});
  }
  function bindContainedScroll(panel){
    if(panel.dataset.outerScrollLockBound==='true')return;
    panel.dataset.outerScrollLockBound='true';
    panel.addEventListener('scroll',()=>{
      if(!panel.classList.contains('library-workspace-active'))return;
      requestAnimationFrame(keepOuterPageLocked);
    },{passive:true});
  }
  function snapWorkspace(menu,token){
    if(token!==snapToken)return;
    const panel=panelFor(menu);if(!panel)return;
    const stickyTop=headerHeight();
    document.documentElement.style.setProperty('--library-sticky-top',stickyTop+'px');
    const naturalTop=menu.getBoundingClientRect().top+window.scrollY;
    const target=Math.max(0,Math.round(naturalTop-stickyTop));
    window.scrollTo({top:target,behavior:'auto'});
    requestAnimationFrame(()=>{
      if(token!==snapToken)return;
      const corrected=menu.getBoundingClientRect().top;
      if(Math.abs(corrected-stickyTop)>2){
        window.scrollBy({top:Math.round(corrected-stickyTop),behavior:'auto'});
      }
      const menuHeight=Math.ceil(menu.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--library-menu-height',menuHeight+'px');
      menu.classList.add('library-workspace-anchored');
      panel.classList.add('library-workspace-active');
      panel.scrollTop=0;
      bindContainedScroll(panel);
      requestAnimationFrame(()=>{if(token===snapToken)lockedWindowY=window.scrollY});
    });
  }
  function releaseOther(current){
    document.querySelectorAll('.library-entry.library-workspace-anchored').forEach(el=>{if(el!==current)el.classList.remove('library-workspace-anchored')});
    document.querySelectorAll('.library-scroll-panel.library-workspace-active').forEach(el=>{if(el!==panelFor(current))el.classList.remove('library-workspace-active')});
  }
  function releaseWorkspace(){
    snapToken++;
    lockedWindowY=null;
    document.querySelectorAll('.library-entry.library-workspace-anchored').forEach(el=>el.classList.remove('library-workspace-anchored'));
    document.querySelectorAll('.library-scroll-panel.library-workspace-active').forEach(el=>el.classList.remove('library-workspace-active'));
  }

  app.addEventListener('click',e=>{
    const change=e.target.closest('.library-change-filter');
    if(change){releaseWorkspace();return;}

    const button=e.target.closest('.library-entry-button[data-library-filter]');
    if(!button)return;
    const menu=button.closest('.library-entry');if(!menu)return;

    // Before a choice, Browse by region remains part of the normal page flow.
    // Once a real region/plane is chosen, the compact selector becomes the
    // anchored workspace header and only the contained result list scrolls.
    if(button.dataset.libraryFilter==='all'){
      releaseWorkspace();
      return;
    }

    releaseOther(menu);
    lockedWindowY=null;
    const token=++snapToken;

    // ui-polish-v2 collapses the full selector after this click. Wait for that
    // compact state before measuring/snap-locking so the large matrix never
    // becomes the sticky element by accident.
    requestAnimationFrame(()=>setTimeout(()=>snapWorkspace(menu,token),24));
  },true);

  document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',releaseWorkspace,true));
})();