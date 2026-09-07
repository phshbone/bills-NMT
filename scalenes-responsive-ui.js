(function(){
  const D=window.NMT_DATA;
  if(!D)return;

  const TOPICS=[
    ['overview','Overview'],['attachments','Attachments'],['actions','Actions'],['nerves','Nerves'],['clinical','Clinical'],['related','Related'],['sources','Sources']
  ];

  function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function list(items){return `<ul>${(items||[]).filter(Boolean).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`}
  function sourceList(muscle){
    return (muscle.sourceIds||[]).map(id=>D.SOURCES?.[id]).filter(Boolean).map(s=>`<div class="reference-source"><strong>${esc(s.title)}</strong><span>${esc(s.publisher)}</span>${s.type?`<p>${esc(s.type)}</p>`:''}${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">Open source ↗</a>`:''}</div>`).join('')||'<p>No source metadata is available for this topic yet.</p>';
  }
  function attachmentBlocks(muscle){
    const detail=muscle.attachmentDetail||{};
    const specific=['anterior','middle','posterior'].map(key=>{
      const d=detail[key]; if(!d)return '';
      return `<section class="reference-subsection"><h4>${key.charAt(0).toUpperCase()+key.slice(1)} scalene</h4><p><strong>Origin:</strong> ${esc(d.origin)}</p><p><strong>Insertion:</strong> ${esc(d.insertion)}</p><p class="reference-note">${esc(d.keyRelationship)}</p></section>`;
    }).join('');
    return `<div class="reference-facts"><p><strong>Group origin:</strong> ${esc(muscle.origin)}</p><p><strong>Group insertion:</strong> ${esc(muscle.insertion)}</p></div>${specific}`;
  }
  function nerveContent(muscle){
    const relationships=(muscle.visualRelationships||[]).filter(x=>/nerve|plexus|artery|vein/i.test(x.structure||''));
    return `<h3>Nerves & nearby anatomy</h3><p><strong>Innervation:</strong> ${esc(muscle.innervation)}</p>${relationships.map(x=>`<section class="reference-subsection"><h4>${esc(x.structure)}</h4><p>${esc(x.reason)}</p></section>`).join('')}<p class="reference-note">Nearby anatomy is shown for spatial reasoning. Proximity does not establish compression, entrapment, injury, or causation.</p>`;
  }
  function movementItems(muscle){
    const raw=muscle.relatedMovements||muscle.related_movements||muscle.canonicalAnatomy?.related_movements||[];
    return [...new Set((raw||[]).map(x=>String(x).replace(/^candidate:/,'')))];
  }
  function movementLabel(id){
    const m=(D.MOVEMENTS||[]).find(x=>x.id===id);
    return m?.name||m?.label||id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  }
  function relatedContent(record,muscle){
    const related=(record.related||[]).map(id=>D.MUSCLES.find(m=>m.id===id)).filter(Boolean);
    const movements=movementItems(muscle);
    return `<h3>Related</h3><div class="reference-actions"><button type="button" data-scalene-action="relationships">Relationship Map</button></div><h4>Related structures</h4><p>Use these as comparison structures rather than assuming a single source.</p><div class="reference-related">${related.map(m=>`<button type="button" data-scalene-open-muscle="${esc(m.id)}">${esc(m.name)}</button>`).join('')||'<span>No related structures are linked yet.</span>'}</div><h4>Related movements</h4>${movements.length?`<div class="reference-related">${movements.map(id=>`<button type="button" data-scalene-open-movement="${esc(id)}">${esc(movementLabel(id))}</button>`).join('')}</div>`:'<p>No related movement records are linked yet.</p>'}<p class="reference-note">Relationship links are comparison tools. They do not imply a linear cause-and-effect chain.</p>`;
  }
  function clinicalContent(muscle){
    return `<h3>Clinical context</h3><h4>Functional roles</h4>${list(muscle.roles)}<div class="reference-actions"><button type="button" data-scalene-action="conservative">Conservative Options</button></div><p class="reference-note">This card supports anatomical comparison and clinical reasoning. It does not diagnose a scalene syndrome or attribute neurologic symptoms to the scalenes by default.</p>`;
  }
  function sourcesContent(muscle){
    return `<h3>Sources & deeper reference</h3>${sourceList(muscle)}<section class="reference-subsection"><h4>Reference status</h4><p><strong>Anatomy text:</strong> ${esc(muscle.anatomyValidationStatus||'not stated')}</p><p><strong>Artwork:</strong> ${esc(muscle.anatomyVisualStatus||'not stated')}</p><p class="reference-note">The current Scalenes plate remains a reference-stage asset until final original artwork passes visual verification.</p></section>`;
  }
  function topicHtml(topic,muscle,record){
    switch(topic){
      case 'attachments': return `<h3>Attachments</h3>${attachmentBlocks(muscle)}`;
      case 'actions': return `<h3>Actions & function</h3>${list(muscle.action)}<h4>Functional roles</h4>${list(muscle.roles)}<p class="reference-note">Function changes with position and with unilateral versus bilateral activity. Treat these as useful actions to compare, not proof of symptom source.</p>`;
      case 'nerves': return nerveContent(muscle);
      case 'clinical': return clinicalContent(muscle);
      case 'related': return relatedContent(record,muscle);
      case 'sources': return sourcesContent(muscle);
      default: return `<h3>Overview</h3><p>The scalenes are a three-part cervical muscle group connecting the cervical transverse processes with the first and second ribs.</p><p>They contribute to cervical side-bending, position-dependent cervical flexion, and upper-rib elevation or stabilization during accessory inspiration.</p><h4>What this workspace contains</h4><p>Attachments, actions, innervation, nearby anatomy, functional roles, conservative options, relationship mapping, related structures, related movements, sources, and deeper reference are all available from the topic controls above.</p><p class="reference-note">Tier 2 keeps a principal anatomy view available while attachment and nearby neurovascular relationships remain accessible without forcing all detail into one phone image.</p>`;
    }
  }
  function isPhonePortrait(){return window.matchMedia('(orientation:portrait) and (max-width:759px)').matches}
  function contentHtml(topic,muscle,record){return `<button type="button" class="scalene-phone-close" aria-label="Close reference panel">×</button>${topicHtml(topic,muscle,record)}`}
  function bindPanelActions(root,section,panel){
    root.querySelector('.scalene-phone-close')?.addEventListener('click',()=>panel.classList.remove('phone-topic-open'));
    root.querySelectorAll('[data-scalene-open-muscle]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.scaleneOpenMuscle;
      const card=section.closest('.record-card');
      const existing=card?.querySelector(`[data-open-muscle="${id}"]`)||document.querySelector(`[data-open-muscle="${id}"]`);
      if(existing)existing.click();
    }));
    root.querySelectorAll('[data-scalene-open-movement]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.scaleneOpenMovement;
      const direct=document.querySelector(`[data-open-movement="${id}"],[data-movement-id="${id}"]`);
      if(direct){direct.click();return}
      const nav=[...document.querySelectorAll('.nav-btn')].find(x=>x.dataset.route==='move'||/move/i.test(x.textContent||''));
      nav?.click();
    }));
    root.querySelectorAll('[data-scalene-action]').forEach(btn=>btn.addEventListener('click',()=>{
      const card=section.closest('.record-card');
      if(btn.dataset.scaleneAction==='relationships'){
        const target=card?.querySelector('[data-explore-rel]');
        if(target){target.click();return}
      }
      if(btn.dataset.scaleneAction==='conservative'){
        const target=card?.querySelector('[data-open-intervention],[data-int-detail]');
        if(target){target.click();return}
      }
    }));
  }
  function setStickyTop(section){
    const header=document.querySelector('.app-header');
    const height=header?Math.ceil(header.getBoundingClientRect().height):0;
    section.style.setProperty('--scalene-phone-sticky-top',`${height}px`);
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
    panel.innerHTML=`<div class="scalene-reference-context"><strong>Scalenes</strong><span>Head & Neck · Tier 2</span></div><nav class="scalene-reference-toolbar" aria-label="Scalenes reference topics">${TOPICS.map(([id,label],i)=>`<button type="button" data-scalene-topic="${id}" class="${i===0?'active':''}" aria-pressed="${i===0?'true':'false'}">${label}</button>`).join('')}</nav><div class="scalene-reference-content" tabindex="0">${contentHtml('overview',muscle,record)}</div>`;

    const phoneStrip=document.createElement('nav');
    phoneStrip.className='scalene-phone-topic-strip';
    phoneStrip.setAttribute('aria-label','Scalenes quick reference topics');
    phoneStrip.innerHTML=TOPICS.map(([id,label],i)=>`<button type="button" data-scalene-phone-topic="${id}" class="${i===0?'active':''}" aria-pressed="${i===0?'true':'false'}">${label}</button>`).join('');
    const orientation=visual.querySelector('.atlas-orientation');
    if(orientation)orientation.after(phoneStrip); else visual.prepend(phoneStrip);

    const card=section.closest('.record-card');
    const originalBack=card?.querySelector('[data-back-detail]');
    if(originalBack){
      const landscapeBack=document.createElement('button');
      landscapeBack.type='button';
      landscapeBack.className='scalene-landscape-back';
      landscapeBack.textContent='← Anatomy';
      landscapeBack.setAttribute('aria-label','Back to anatomy');
      landscapeBack.addEventListener('click',()=>originalBack.click());
      visual.prepend(landscapeBack);
      originalBack.classList.add('scalene-original-back');
    }

    workspace.append(visual,panel);
    section.appendChild(workspace);
    section.dataset.scaleneResponsive='ready';
    setStickyTop(section);

    const content=panel.querySelector('.scalene-reference-content');
    const allTopicButtons=()=>[...panel.querySelectorAll('[data-scalene-topic]'),...phoneStrip.querySelectorAll('[data-scalene-phone-topic]')];
    const selectTopic=topic=>{
      allTopicButtons().forEach(b=>{
        const id=b.dataset.scaleneTopic||b.dataset.scalenePhoneTopic;
        const active=id===topic;
        b.classList.toggle('active',active);
        b.setAttribute('aria-pressed',active?'true':'false');
      });
      content.innerHTML=contentHtml(topic,muscle,record);
      content.scrollTop=0;
      if(isPhonePortrait())panel.classList.add('phone-topic-open');
      bindPanelActions(content,section,panel);
    };
    panel.querySelectorAll('[data-scalene-topic]').forEach(btn=>btn.addEventListener('click',()=>selectTopic(btn.dataset.scaleneTopic)));
    phoneStrip.querySelectorAll('[data-scalene-phone-topic]').forEach(btn=>btn.addEventListener('click',()=>selectTopic(btn.dataset.scalenePhoneTopic)));
    bindPanelActions(content,section,panel);
  }
  function scan(){document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(enhance)}
  const app=document.getElementById('app');
  if(app)new MutationObserver(scan).observe(app,{childList:true,subtree:true});
  window.addEventListener('resize',()=>document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(setStickyTop),{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(()=>document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(setStickyTop),120),{passive:true});
  scan();
})();