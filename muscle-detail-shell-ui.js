(function(){
  const D=window.NMT_DATA;if(!D)return;
  const CTX='nmt-muscle-return-context';
  const STORAGE='nmt-clinical-reasoning-v0.1';

  const style=document.createElement('style');
  style.textContent=`
    .regional-visual-slot{margin:14px 0 18px;border:1px solid #d8d9dc;border-radius:20px;background:#fbf7ef;overflow:hidden}
    .regional-visual-head{padding:14px 16px 8px}.regional-visual-head .eyebrow{margin:0 0 4px}.regional-visual-stage{margin:0 12px 12px;border:1px solid #ddd5c7;border-radius:16px;background:#fffaf2;overflow:hidden}
    .regional-visual-svg{display:block;width:100%;height:auto;max-height:360px}.regional-visual-note{padding:11px 13px 14px;color:#667085;font-size:.84rem;line-height:1.45}.regional-visual-note strong{color:#17233b}
  `;
  document.head.appendChild(style);

  function regionKind(m){const r=(m.region+' '+m.group).toLowerCase();if(/forearm|elbow|wrist/.test(r))return 'forearm';if(/lumbar|low back|lower back|hip|pelvis|flank/.test(r))return 'lower';if(/neck|shoulder|scap|thorax|chest|rib/.test(r))return 'upper';return 'generic'}
  function regionName(kind,m){if(kind==='forearm')return 'Forearm / elbow regional atlas';if(kind==='lower')return 'Lumbar / pelvis regional atlas';if(kind==='upper')return 'Neck / shoulder / upper thorax atlas';return m.region+' regional atlas'}
  function svg(kind,name){
    const shared=`<style>.b{fill:none;stroke:#c8bda8;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}.h{fill:#a64f4b;opacity:.16}.t{font:800 17px system-ui,sans-serif;fill:#17233b}.s{font:700 13px system-ui,sans-serif;fill:#667085}</style><rect width="420" height="240" rx="20" fill="#fffaf2"/>`;
    if(kind==='forearm')return `<svg class="regional-visual-svg" viewBox="0 0 420 240" role="img" aria-label="Forearm and elbow regional visual placeholder for ${name}">${shared}<path class="b" d="M118 45 L160 106 M160 106 L220 195 M166 108 L257 184"/><circle class="b" cx="160" cy="106" r="13"/><path class="b" d="M220 195 Q250 210 286 196"/><path class="h" d="M151 91 Q184 120 225 188 L244 181 Q211 133 169 92 Z"/><text class="t" x="28" y="42">Lateral elbow / posterior forearm</text><text class="s" x="28" y="66">Regional visual slot — target overlay pending</text><text class="s" x="285" y="116">elbow</text><text class="s" x="278" y="190">forearm</text></svg>`;
    if(kind==='lower')return `<svg class="regional-visual-svg" viewBox="0 0 420 240" role="img" aria-label="Lumbar and pelvis regional visual placeholder for ${name}">${shared}<path class="b" d="M210 45 L210 145 M185 62 L235 62 M182 82 L238 82 M180 102 L240 102 M178 122 L242 122"/><path class="b" d="M140 158 Q210 124 280 158 L265 205 Q210 220 155 205 Z"/><path class="h" d="M198 70 L218 70 L236 190 L204 190 Z"/><text class="t" x="28" y="42">Lumbar / pelvis region</text><text class="s" x="28" y="66">Regional visual slot — target overlay pending</text></svg>`;
    if(kind==='upper')return `<svg class="regional-visual-svg" viewBox="0 0 420 240" role="img" aria-label="Neck shoulder and upper thorax regional visual placeholder for ${name}">${shared}<path class="b" d="M210 38 L210 120 M195 55 L225 55 M193 74 L227 74 M190 94 L230 94"/><path class="b" d="M115 135 Q210 98 305 135 M140 150 Q210 125 280 150 M145 172 Q210 147 275 172"/><path class="b" d="M278 116 L325 145 L300 205 L257 162 Z"/><path class="h" d="M198 65 Q175 110 145 165 L165 174 Q198 118 216 72 Z"/><text class="t" x="28" y="42">Neck / shoulder / upper thorax</text><text class="s" x="28" y="66">Regional visual slot — target overlay pending</text></svg>`;
    return `<svg class="regional-visual-svg" viewBox="0 0 420 240" role="img" aria-label="Regional visual placeholder for ${name}">${shared}<circle class="b" cx="210" cy="72" r="28"/><path class="b" d="M210 100 L210 190 M155 125 L265 125 M210 190 L170 225 M210 190 L250 225"/><text class="t" x="28" y="42">Regional anatomy</text><text class="s" x="28" y="66">Visual overlay pending for this structure</text></svg>`;
  }

  function currentDetailId(){
    try{
      const stored=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      return stored?.detail?.type==='muscle'?stored.detail.id:null;
    }catch{return null}
  }
  function saveContext(target){
    const nav=document.querySelector('.nav-btn.active');
    const card=target.closest('.hypothesis-card,.record-card,.card');
    const ctx={route:nav?.dataset.route||'reasoning',detailId:currentDetailId(),scrollY:window.scrollY,anchorText:card?.querySelector('h2,h3')?.textContent?.trim()||''};
    sessionStorage.setItem(CTX,JSON.stringify(ctx));
  }
  function readContext(){try{return JSON.parse(sessionStorage.getItem(CTX)||'null')}catch{return null}}
  function restoreScroll(ctx){const restore=()=>window.scrollTo({top:ctx?.scrollY||0,behavior:'auto'});setTimeout(restore,40);setTimeout(restore,160);setTimeout(restore,320)}
  function restoreDetailContext(ctx){
    if(!ctx?.detailId)return false;
    let state={};try{state=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    state.route=ctx.route||'anatomy';
    state.detail={type:'muscle',id:ctx.detailId};
    localStorage.setItem(STORAGE,JSON.stringify(state));
    sessionStorage.removeItem(CTX);
    location.reload();
    return true;
  }
  function decorateBack(){
    const back=document.querySelector('#app [data-back-detail]');
    if(!back)return;
    const ctx=readContext();
    if(!ctx?.route)return;
    const label=ctx.detailId?D.MUSCLES.find(x=>x.id===ctx.detailId)?.name:(ctx.route==='reasoning'?'reasoning':ctx.route);
    const desired='← Back to '+(label||ctx.route);
    if(back.textContent!==desired)back.textContent=desired;
    if(back.dataset.contextLabel!=='1')back.dataset.contextLabel='1';
  }
  function enhance(){
    const card=document.querySelector('#app .record-card');if(!card)return;
    const h=card.querySelector('h2');if(!h)return;
    const m=D.MUSCLES.find(x=>x.name===h.textContent.trim());if(!m)return;
    decorateBack();
    if(D.getAnatomyAtlasRecord?.(m.id)||D.ATTACHMENTS?.[m.id]||card.querySelector('.regional-visual-slot'))return;
    const kind=regionKind(m),section=document.createElement('section');section.className='regional-visual-slot';section.dataset.regionalVisual=m.id;
    section.innerHTML=`<div class="regional-visual-head"><p class="eyebrow">regional anatomy placeholder</p><strong>${regionName(kind,m)}</strong></div><div class="regional-visual-stage">${svg(kind,m.name)}<div class="regional-visual-note"><strong>${m.name}</strong> is linked to this regional visual framework. Its dedicated muscle, attachment, and referral overlays have not been published yet. The written anatomy below remains the exact reference until those assets are curated.</div></div>`;
    const facts=card.querySelector('.facts');if(facts)facts.insertAdjacentElement('beforebegin',section);else card.appendChild(section);
  }

  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-muscle]');
    if(open){
      saveContext(open);
      requestAnimationFrame(decorateBack);
      setTimeout(decorateBack,0);
      setTimeout(decorateBack,40);
    }
    const back=e.target.closest('[data-back-detail]');if(back){const ctx=readContext();if(ctx?.detailId){e.preventDefault();e.stopImmediatePropagation();restoreDetailContext(ctx);return}restoreScroll(ctx);sessionStorage.removeItem(CTX)}
  },true);
  const app=document.getElementById('app');if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();