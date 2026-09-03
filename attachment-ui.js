(function(){
  const D=window.NMT_DATA;
  if(!D?.ATTACHMENTS||!D.attachmentSketchSvg)return;

  const RICH={
    'iliopsoas':'assets/anatomy/iliopsoas.webp',
    'quadratus-lumborum':'assets/anatomy/quadratus-lumborum.webp',
    'scalenes':'assets/anatomy/scalenes.webp',
    'serratus-anterior':'assets/anatomy/serratus-anterior.webp'
  };

  const style=document.createElement('style');
  style.textContent=`
    .attachment-block{margin:12px 0 4px;border:1px solid #d8d9dc;border-radius:18px;background:#fbf7ef;overflow:hidden}
    .attachment-block>summary{cursor:pointer;font-weight:850;padding:13px 14px}
    .attachment-body{padding:0 12px 12px}
    .attachment-sketch{width:100%;height:auto;display:block;max-height:300px}
    .attachment-note{font-size:.82rem;color:#667085;margin:8px 3px 0;line-height:1.4}
    .rich-anatomy{margin:12px 0 4px;border:1px solid #d7d9dd;border-radius:20px;background:#fbf7ef;padding:12px;overflow:hidden}
    .rich-anatomy-title{font-weight:900;margin:0 0 10px;font-size:1rem}
    .rich-anatomy-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;border:1px solid #d9d6cf;border-radius:15px;padding:5px;background:#fffaf2;margin-bottom:10px}
    .rich-anatomy-tab{border:0;border-radius:11px;background:transparent;color:#17233b;padding:10px 7px;font-weight:800;cursor:pointer}
    .rich-anatomy-tab[aria-selected="true"]{background:#17233b;color:#fff}
    .rich-anatomy-stage{border:1px solid #ddd5c7;border-radius:17px;background:#fffaf2;overflow:hidden;min-height:220px;display:flex;align-items:center;justify-content:center}
    .rich-anatomy-image{display:block;width:100%;height:auto;max-height:520px;object-fit:contain;transition:transform .18s ease}
    .rich-anatomy-image.is-muscle-focus{transform:scale(1.12)}
    .rich-anatomy-caption{font-size:.82rem;color:#667085;line-height:1.45;margin:9px 3px 0}
    .referral-prototype{padding:20px 16px;text-align:left;max-width:560px}
    .referral-prototype h4{margin:0 0 8px;font-size:1rem}
    .referral-prototype p{margin:7px 0;color:#596579;line-height:1.5}
    .referral-prototype .prototype-pill{display:inline-block;border-radius:999px;padding:5px 9px;background:#efe7d8;color:#7a552d;font-size:.72rem;font-weight:850;text-transform:uppercase;letter-spacing:.05em}
    @media(max-width:560px){.rich-anatomy{padding:10px}.rich-anatomy-tab{font-size:.84rem;padding:9px 4px}.rich-anatomy-image{max-height:420px}}
  `;
  document.head.appendChild(style);

  function richBlock(muscle){
    const src=RICH[muscle.id];
    const wrap=document.createElement('section');
    wrap.className='rich-anatomy';
    wrap.dataset.richAnatomy=muscle.id;
    wrap.innerHTML=`
      <h3 class="rich-anatomy-title">Anatomy layers — origin &amp; insertion</h3>
      <div class="rich-anatomy-tabs" role="tablist" aria-label="Anatomy view layers">
        <button class="rich-anatomy-tab" type="button" role="tab" aria-selected="true" data-anatomy-layer="skeletal">Skeletal</button>
        <button class="rich-anatomy-tab" type="button" role="tab" aria-selected="false" data-anatomy-layer="muscle">Muscle</button>
        <button class="rich-anatomy-tab" type="button" role="tab" aria-selected="false" data-anatomy-layer="referral">Referral</button>
      </div>
      <div class="rich-anatomy-stage" data-anatomy-stage>
        <img class="rich-anatomy-image" src="${src}" alt="Detailed anatomical reference for ${muscle.name}, showing skeletal landmarks, highlighted target muscle, and attachment labels." loading="lazy" decoding="async">
      </div>
      <p class="rich-anatomy-caption" data-anatomy-caption><strong>Skeletal + target muscle.</strong> Use the written anatomy and cited sources below for exact attachment detail.</p>`;

    const img=wrap.querySelector('.rich-anatomy-image');
    const stage=wrap.querySelector('[data-anatomy-stage]');
    const caption=wrap.querySelector('[data-anatomy-caption]');
    wrap.querySelectorAll('[data-anatomy-layer]').forEach(btn=>btn.onclick=()=>{
      wrap.querySelectorAll('[data-anatomy-layer]').forEach(x=>x.setAttribute('aria-selected',String(x===btn)));
      const layer=btn.dataset.anatomyLayer;
      if(layer==='referral'){
        stage.innerHTML=`<div class="referral-prototype"><span class="prototype-pill">curation in progress</span><h4>Trigger-point and referred-pain pattern layer</h4><p>This layer is reserved for source-linked referral maps. Generated prototype shading is not being used as clinical evidence.</p><p>When curated, the pattern will show typical referral neighborhoods and trigger-point locations as an educational comparison—not a diagnosis.</p></div>`;
        caption.innerHTML='<strong>Referral patterns are not yet used in the reasoning score.</strong> They will be added only after source curation.';
      }else{
        if(!stage.contains(img))stage.replaceChildren(img);
        img.classList.toggle('is-muscle-focus',layer==='muscle');
        caption.innerHTML=layer==='muscle'?'<strong>Muscle focus.</strong> The target muscle is highlighted in anatomical context; surrounding structures remain visible for orientation.':'<strong>Skeletal + target muscle.</strong> Use the written anatomy and cited sources below for exact attachment detail.';
      }
    });
    return wrap;
  }

  function fallbackBlock(muscle){
    const block=document.createElement('details');
    block.className='attachment-block';
    block.innerHTML=`<summary>Attachment sketch — origin &amp; insertion</summary><div class="attachment-body">${D.attachmentSketchSvg(muscle.id)}<p class="attachment-note"><strong>O</strong> marks the origin region and <strong>I</strong> marks the insertion region. This is a simplified orientation sketch; use the written anatomy and cited sources for exact attachment detail.</p></div>`;
    return block;
  }

  function enhance(){
    const card=document.querySelector('#app .record-card');
    if(!card||card.querySelector('.attachment-block,.rich-anatomy'))return;
    const name=card.querySelector('h2')?.textContent?.trim();
    if(!name)return;
    const muscle=D.MUSCLES.find(m=>m.name===name);
    if(!muscle||!D.ATTACHMENTS[muscle.id])return;
    const block=RICH[muscle.id]?richBlock(muscle):fallbackBlock(muscle);
    const facts=card.querySelector('.facts');
    if(facts)facts.insertAdjacentElement('beforebegin',block);else card.appendChild(block);
  }

  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();