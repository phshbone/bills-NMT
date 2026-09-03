(function(){
  const D=window.NMT_DATA; if(!D?.VISUALS)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent=`.visual-block{margin-top:14px;border:1px solid #d9ddda;border-radius:14px;background:#fbfaf6;overflow:hidden}.visual-block summary{cursor:pointer;padding:13px 15px;font-weight:700;color:#233348}.visual-body{padding:0 14px 14px}.movement-sequence-svg,.planes-reference-svg{width:100%;height:auto;display:block;background:#f8f5ed;border-radius:10px;border:1px solid #e2ded3}.visual-note{margin:10px 2px 2px;color:#53606b;line-height:1.45}.visual-kicker{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#4d7545;font-weight:800}.planes-launch{margin-top:10px}.visual-dialog{max-width:940px;width:min(94vw,940px);border:0;border-radius:18px;padding:0;box-shadow:0 24px 80px #0005}.visual-dialog::backdrop{background:#07101fcc}.visual-dialog-card{padding:18px;background:#fff}.visual-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.visual-dialog-close{border:0;background:transparent;font-size:1.65rem;cursor:pointer}.movement-library-visual{margin-bottom:16px}.visual-inline-title{margin:4px 0 8px;font-size:1.05rem}@media(max-width:650px){.visual-body{padding:0 10px 10px}.movement-sequence-svg text{font-size:13px}.visual-dialog-card{padding:12px}}`;
  document.head.appendChild(style);

  const dialog=document.createElement('dialog'); dialog.className='visual-dialog'; dialog.id='planesVisualDialog';
  dialog.innerHTML=`<div class="visual-dialog-card"><div class="visual-dialog-head"><div><div class="visual-kicker">quick visual reference</div><h2 style="margin:4px 0 12px">Planes of motion</h2></div><button class="visual-dialog-close" type="button" aria-label="Close planes visual">×</button></div><div data-planes-slot></div><p class="visual-note">Use the diagram as orientation. A movement can occur mainly in one plane while still requiring control in the other planes.</p></div>`;
  document.body.appendChild(dialog); dialog.querySelector('[data-planes-slot]').innerHTML=D.planesReferenceSvg(); dialog.querySelector('.visual-dialog-close').onclick=()=>dialog.close();

  function movementIdFromPage(){
    const h=document.querySelector('#app .record-card h2'); if(!h)return null;
    return D.MOVEMENTS.find(m=>m.name===h.textContent.trim())?.id||null;
  }
  function enhanceMovementDetail(){
    const record=document.querySelector('#app .record-card'); const id=movementIdFromPage(); if(!record||!id||record.querySelector('[data-movement-visuals]'))return;
    const cfg=D.VISUALS.movement[id];
    const wrap=document.createElement('div'); wrap.dataset.movementVisuals='1'; wrap.className='fact';
    wrap.innerHTML=`<strong>Visual reference</strong><p class="small muted">Open only when a picture would make the movement easier to understand.</p>${cfg?`<details class="visual-block"><summary>See movement — ${esc(cfg.title)}</summary><div class="visual-body"><div class="visual-kicker">movement example</div>${D.visualSequenceSvg(id)}<p class="visual-note">${esc(cfg.note)}</p></div></details>`:''}<details class="visual-block"><summary>View planes used in this movement</summary><div class="visual-body">${D.planesReferenceSvg()}<p class="visual-note"><strong>This record:</strong> ${esc((D.MOVEMENTS.find(m=>m.id===id)?.planes||[]).join(', '))}.</p></div></details><button class="secondary-btn planes-launch" type="button" data-open-planes>Open planes reference larger</button>`;
    const facts=record.querySelector('.facts'); if(facts)facts.insertBefore(wrap,facts.firstChild); else record.appendChild(wrap);
    wrap.querySelector('[data-open-planes]').onclick=()=>dialog.showModal();
  }
  function enhanceMovementLibrary(){
    const app=document.getElementById('app'); if(!app||!app.querySelector('.hero .eyebrow')?.textContent.toLowerCase().includes('movement library')||app.querySelector('[data-library-planes]'))return;
    const hero=app.querySelector('.hero'); const block=document.createElement('section'); block.className='card movement-library-visual'; block.dataset.libraryPlanes='1';
    block.innerHTML=`<div class="visual-kicker">visual reference</div><h3 class="visual-inline-title">Sagittal · frontal · transverse</h3><p class="small muted">Need a picture before reading a movement analysis?</p><button class="secondary-btn" type="button" data-open-planes>View planes diagram</button>`;
    hero.insertAdjacentElement('afterend',block); block.querySelector('[data-open-planes]').onclick=()=>dialog.showModal();
  }
  function enhance(){enhanceMovementDetail();enhanceMovementLibrary();}
  const app=document.getElementById('app'); if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true}); enhance();
})();
