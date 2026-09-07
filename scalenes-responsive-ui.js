(function(){
  const D=window.NMT_DATA;
  if(!D)return;

  const TOPICS=[
    ['overview','Overview'],['attachments','Attachments'],['actions','Actions'],['nerves','Nerves'],['clinical','Clinical'],['related','Related'],['sources','Sources']
  ];

  function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function list(items){return `<ul>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`}
  function sourceList(muscle){
    return (muscle.sourceIds||[]).map(id=>D.SOURCES?.[id]).filter(Boolean).map(s=>`<div class="reference-source"><strong>${esc(s.title)}</strong><span>${esc(s.publisher)}</span></div>`).join('')||'<p>No source metadata is available for this topic yet.</p>';
  }
  function attachmentBlocks(muscle){
    const detail=muscle.attachmentDetail||{};
    return ['anterior','middle','posterior'].map(key=>{
      const d=detail[key]; if(!d)return '';
      return `<h4>${key.charAt(0).toUpperCase()+key.slice(1)} scalene</h4><p><strong>Origin:</strong> ${esc(d.origin)}</p><p><strong>Insertion:</strong> ${esc(d.insertion)}</p><p class="reference-note">${esc(d.keyRelationship)}</p>`;
    }).join('');
  }
  function nerveContent(muscle){
    const relationships=(muscle.visualRelationships||[]).filter(x=>/nerve|plexus|artery|vein/i.test(x.structure||''));
    return `<h3>Nerves & nearby passages</h3><p><strong>Innervation:</strong> ${esc(muscle.innervation)}</p>${relationships.map(x=>`<h4>${esc(x.structure)}</h4><p>${esc(x.reason)}</p>`).join('')}<p class="reference-note">Nearby anatomy is shown for spatial reasoning. Proximity does not establish compression, entrapment, injury, or causation.</p>`;
  }
  function relatedContent(record){
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    return `<h3>Related structures</h3><p>Use these as comparison structures rather than assuming a single source.</p><div class="reference-related">${related.map(m=>`<button type="button" data-scalene-open-muscle="${esc(m.id)}">${esc(m.name)}</button>`).join('')}</div>`;
  }
  function topicHtml(topic,muscle,record){
    switch(topic){
      case 'attachments': return `<h3>Attachments</h3>${attachmentBlocks(muscle)}`;
      case 'actions': return `<h3>Actions & function</h3>${list(muscle.action)}<p class="reference-note">Function changes with position and with unilateral versus bilateral activity. Treat these as useful actions to compare, not proof of symptom source.</p>`;
      case 'nerves': return nerveContent(muscle);
      case 'clinical': return `<h3>Clinical context</h3>${list(muscle.roles)}<p class="reference-note">This card supports anatomical comparison and clinical reasoning. It does not diagnose a scalene syndrome or attribute neurologic symptoms to the scalenes by default.</p>`;
      case 'related': return relatedContent(record);
      case 'sources': return `<h3>Sources</h3>${sourceList(muscle)}`;
      default: return `<h3>Overview</h3><p>The scalenes are a three-part cervical muscle group connecting the cervical transverse processes with the first and second ribs.</p><p>They contribute to cervical side-bending, position-dependent cervical flexion, and upper-rib elevation or stabilization during accessory inspiration.</p><p class="reference-note">Tier 2 keeps a principal anatomy view available while attachment and nearby neurovascular relationships remain accessible without forcing all detail into one phone image.</p>`;
    }
  }
  function enhance(section){
    if(section.dataset.scaleneResponsive==='ready')return;
    const muscle=D.MUSCLES.find(m=>m.id==='scalenes');
    const record=D.getAnatomyAtlasRecord?.('scalenes');
    if(!muscle||!record)return;

    const head=section.querySelector('.atlas-head');
    const workspace=document.createElement('div');
    workspace.className='atlas-responsive-workspace';
    const visual=document.createElement('div');
    visual.className='atlas-visual-column';
    [...section.children].filter(el=>el!==head).forEach(el=>visual.appendChild(el));

    const panel=document.createElement('aside');
    panel.className='scalene-reference-panel';
    panel.setAttribute('aria-label','Scalenes reference panel');
    panel.innerHTML=`<div class="scalene-reference-context"><strong>Scalenes</strong><span>Head & Neck · Tier 2</span></div><nav class="scalene-reference-toolbar" aria-label="Scalenes reference topics">${TOPICS.map(([id,label],i)=>`<button type="button" data-scalene-topic="${id}" class="${i===0?'active':''}" aria-pressed="${i===0?'true':'false'}">${label}</button>`).join('')}</nav><div class="scalene-reference-content" tabindex="0">${topicHtml('overview',muscle,record)}</div>`;

    workspace.append(visual,panel);
    section.appendChild(workspace);
    section.dataset.scaleneResponsive='ready';

    const content=panel.querySelector('.scalene-reference-content');
    panel.querySelectorAll('[data-scalene-topic]').forEach(btn=>btn.addEventListener('click',()=>{
      const topic=btn.dataset.scaleneTopic;
      panel.querySelectorAll('[data-scalene-topic]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false')});
      content.innerHTML=topicHtml(topic,muscle,record);
      content.scrollTop=0;
      bindRelated(content,section);
    }));
    bindRelated(content,section);
  }
  function bindRelated(root,section){
    root.querySelectorAll('[data-scalene-open-muscle]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.scaleneOpenMuscle;
      const existing=section.querySelector(`[data-open-muscle="${id}"]`);
      if(existing)existing.click();
    }));
  }
  function scan(){document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(enhance)}
  const app=document.getElementById('app');
  if(app)new MutationObserver(scan).observe(app,{childList:true,subtree:true});
  scan();
})();
