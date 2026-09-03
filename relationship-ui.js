(function(){
  const D=window.NMT_DATA;
  if(!D) return;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dialog=document.createElement('dialog');
  dialog.id='relationshipExplorer';
  dialog.innerHTML='<div class="dialog-card" id="relationshipExplorerCard"></div>';
  document.body.appendChild(dialog);
  const card=dialog.querySelector('#relationshipExplorerCard');
  let stack=[];
  let originId=null;

  function entity(id){
    const muscle=D.MUSCLES.find(x=>x.id===id);
    if(muscle) return {id,name:muscle.name,type:'muscle',region:muscle.region,summary:(muscle.roles||muscle.action||[]).slice(0,2).join(' · '),sourceIds:muscle.sourceIds||[]};
    return (D.STRUCTURES||[]).find(x=>x.id===id)||null;
  }

  function relationRows(id){
    const rels=D.getRelations?D.getRelations(id):[];
    if(!rels.length) return '<p class="small muted">No curated relationship links yet.</p>';
    return rels.map(r=>{
      const other=r.from===id?r.to:r.from;
      const e=entity(other);
      const label=e?.name||D.getEntityName?.(other)||other;
      return `<div class="fact relationship-row"><div class="button-row"><button class="relation-chip" type="button" data-rel-open="${esc(other)}">${esc(label)}</button><span class="pill">${esc(r.kind)}</span></div><p class="small">${esc(r.why)}</p></div>`;
    }).join('');
  }

  function pathLabel(){return stack.map(id=>entity(id)?.name||D.getEntityName?.(id)||id).join(' › ')}

  function render(id,push=true){
    const e=entity(id); if(!e)return;
    if(push && stack[stack.length-1]!==id) stack.push(id);
    const sources=(e.sourceIds||[]).map(x=>D.SOURCES[x]).filter(Boolean);
    const origin=entity(originId);
    card.innerHTML=`<div class="button-row" style="justify-content:space-between"><button class="ghost-btn" type="button" data-rel-back ${stack.length<2?'disabled':''}>← Back</button><button class="dialog-close" type="button" data-rel-close aria-label="Close">×</button></div><p class="small muted" data-rel-path>Path: ${esc(pathLabel())}</p><p class="eyebrow">${esc(e.region||'upper quarter')} · ${esc(e.type||'structure')}</p><h2>${esc(e.name)}</h2><p>${esc(e.summary||'Curated relationship node.')}</p><div class="section-title"><h3>Why this connects</h3><p>Connections guide comparison and exploration; they do not establish a diagnosis.</p></div>${relationRows(id)}${sources.length?`<div class="fact"><strong>Sources</strong>${sources.map(s=>`<p class="source">${esc(s.publisher)} — ${esc(s.title)}</p>`).join('')}</div>`:''}<div class="button-row" style="margin-top:16px"><button class="secondary-btn" type="button" data-rel-return>Return to ${esc(origin?.name||'starting record')}</button></div>`;
    card.querySelectorAll('[data-rel-open]').forEach(b=>b.onclick=()=>render(b.dataset.relOpen,true));
    card.querySelector('[data-rel-close]').onclick=()=>dialog.close();
    card.querySelector('[data-rel-return]').onclick=()=>dialog.close();
    const back=card.querySelector('[data-rel-back]');
    back.onclick=()=>{if(stack.length>1){stack.pop();render(stack[stack.length-1],false)}};
  }

  function currentMuscleId(){
    const main=document.getElementById('app');
    const h2=main?.querySelector('.record-card h2');
    if(!h2)return null;
    return D.MUSCLES.find(m=>m.name===h2.textContent.trim())?.id||null;
  }

  function enhance(){
    const main=document.getElementById('app'); if(!main)return;
    const id=currentMuscleId();
    const record=main.querySelector('.record-card');
    if(!id||!record||record.querySelector('[data-explore-rel]')||!(D.getRelations?.(id)||[]).length)return;
    const relations=D.getRelations(id);
    if(!relations.length)return;
    const wrap=document.createElement('div');
    wrap.className='fact';
    wrap.innerHTML=`<strong>Relationship map</strong><p class="small muted">Follow curated anatomy, force-sharing, innervation, and comparison links without leaving this record.</p><button class="secondary-btn" type="button" data-explore-rel>Explore connections (${relations.length})</button>`;
    const facts=record.querySelector('.facts');
    if(facts) facts.appendChild(wrap); else record.appendChild(wrap);
    wrap.querySelector('[data-explore-rel]').onclick=()=>{originId=id;stack=[];render(id,true);dialog.showModal()};
  }

  const observer=new MutationObserver(()=>enhance());
  observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  enhance();
})();
