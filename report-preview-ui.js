(function(){
  const STORAGE='nmt-clinical-reasoning-v0.1';
  const share=window.NMT_SESSION_SHARE;
  if(!share)return;

  const style=document.createElement('style');
  style.textContent=`
    .report-preview{position:fixed;inset:0;z-index:90;background:rgba(23,35,59,.42);display:flex;align-items:stretch;justify-content:center;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
    .report-preview-panel{width:min(920px,100%);background:#f8f5ee;display:flex;flex-direction:column;min-height:100%;box-shadow:0 0 28px rgba(0,0,0,.18)}
    .report-preview-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid #d7dbe3;background:#fff;position:sticky;top:0;z-index:2}
    .report-preview-bar strong{color:#17233b}.report-preview-actions{display:flex;gap:8px;flex-wrap:wrap}
    .report-preview-frame{border:0;width:100%;flex:1;background:#fff}
  `;
  document.head.appendChild(style);

  function state(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}}
  function sessionFor(button){
    const s=state();
    if(button.closest('.hero'))return s.active||null;
    const card=button.closest('.session-card');
    if(card){const cards=[...document.querySelectorAll('#app .session-card')],i=cards.indexOf(card);return (s.history||[])[i]||null}
    return s.active||null;
  }
  function close(){document.querySelector('.report-preview')?.remove()}
  function open(session){
    if(!session)return;
    close();
    const wrap=document.createElement('div');wrap.className='report-preview';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','Clinician report preview');
    wrap.innerHTML='<section class="report-preview-panel"><div class="report-preview-bar"><strong>Clinician report preview</strong><div class="report-preview-actions"><button type="button" class="secondary-btn" data-report-close>Back to app</button><button type="button" class="primary-btn" data-report-print>Print / Save PDF</button></div></div><iframe class="report-preview-frame" title="Clinical Reasoning Session Summary"></iframe></section>';
    document.body.appendChild(wrap);
    const frame=wrap.querySelector('iframe');frame.srcdoc=share.clinicianHtml(session);
    wrap.querySelector('[data-report-close]').onclick=close;
    wrap.querySelector('[data-report-print]').onclick=()=>{try{frame.contentWindow?.focus();frame.contentWindow?.print()}catch{window.print()}};
    wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;
    if(!/Clinician PDF \/ Print/i.test(btn.textContent||''))return;
    e.preventDefault();e.stopImmediatePropagation();open(sessionFor(btn));
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();