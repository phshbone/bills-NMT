(function(){
  const D=window.NMT_DATA;
  if(!D?.VISUALS||!D.visualSequenceSvg)return;

  const MAP={
    'Serratus anterior':'wall-slide',
    'Lower trapezius':'wall-slide',
    'Upper trapezius':'wall-slide',
    'Levator scapulae':'cervical-rotation',
    'Scalenes':'cervical-rotation',
    'Sternocleidomastoid':'cervical-rotation',
    'Iliopsoas':'hip-extension',
    'Quadratus lumborum':'side-bending'
  };

  const style=document.createElement('style');
  style.textContent=`
    .reasoning-inline-visual{margin-top:10px}
    .reasoning-inline-visual .visual-body{padding-top:4px}
    .reasoning-inline-visual .movement-sequence-svg{max-height:230px}
    .reasoning-inline-visual .visual-context-note{margin-top:8px;font-size:.86rem;color:#53606b}
  `;
  document.head.appendChild(style);

  function enhance(){
    document.querySelectorAll('.hypothesis-card').forEach(card=>{
      if(card.dataset.reasoningVisualReady==='1')return;
      const name=card.querySelector('h3')?.textContent?.trim();
      const id=MAP[name];
      const cfg=id&&D.VISUALS.movement[id];
      if(!cfg)return;
      const details=document.createElement('details');
      details.className='visual-block reasoning-inline-visual';
      details.innerHTML=`<summary>See movement — ${cfg.title}</summary><div class="visual-body"><div class="visual-kicker">quick movement reference</div>${D.visualSequenceSvg(id)}<p class="visual-note">${cfg.note}</p><p class="visual-context-note">This picture is here to clarify the motion being discussed. It does not prove that this structure is the source of the complaint.</p></div>`;
      const row=card.querySelector('.button-row');
      if(row)row.insertAdjacentElement('beforebegin',details); else card.appendChild(details);
      card.dataset.reasoningVisualReady='1';
    });
  }

  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();