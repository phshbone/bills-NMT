(function(){
  const D=window.NMT_DATA;
  if(!D?.ATTACHMENTS||!D.attachmentSketchSvg)return;
  const style=document.createElement('style');
  style.textContent=`
    .attachment-block{margin:12px 0 4px;border:1px solid #d8d9dc;border-radius:16px;background:#fbf7ef;overflow:hidden}
    .attachment-block summary{cursor:pointer;font-weight:850;padding:12px 14px}
    .attachment-body{padding:0 12px 12px}
    .attachment-sketch{width:100%;height:auto;display:block;max-height:300px}
    .attachment-note{font-size:.82rem;color:#667085;margin:8px 3px 0;line-height:1.4}
  `;
  document.head.appendChild(style);

  function enhance(){
    const card=document.querySelector('#app .record-card');
    if(!card||card.querySelector('.attachment-block'))return;
    const name=card.querySelector('h2')?.textContent?.trim();
    if(!name)return;
    const muscle=D.MUSCLES.find(m=>m.name===name);
    if(!muscle||!D.ATTACHMENTS[muscle.id])return;
    const block=document.createElement('details');
    block.className='attachment-block';
    block.innerHTML=`<summary>Attachment sketch — origin & insertion</summary><div class="attachment-body">${D.attachmentSketchSvg(muscle.id)}<p class="attachment-note"><strong>O</strong> marks the origin region and <strong>I</strong> marks the insertion region. This is a simplified orientation sketch; use the written anatomy and cited sources for exact attachment detail.</p></div>`;
    const facts=card.querySelector('.facts');
    if(facts)facts.insertAdjacentElement('beforebegin',block);else card.appendChild(block);
  }

  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();