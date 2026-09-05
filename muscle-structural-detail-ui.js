(function(){
  const app=document.getElementById('app');
  const D=window.NMT_DATA;
  if(!app||!D)return;

  function currentMuscle(card){
    const name=card?.querySelector('h2')?.textContent?.trim();
    return name?D.MUSCLES.find(m=>m.name===name)||null:null;
  }

  function makeDetail(label){
    const details=document.createElement('details');
    details.className='muscle-card-detail-section structural-detail-section';
    details.dataset.detailLabel=label;
    const summary=document.createElement('summary');
    summary.textContent=label;
    details.appendChild(summary);
    const body=document.createElement('div');
    body.className='muscle-card-detail-body';
    details.appendChild(body);
    return {details,body};
  }

  function addAttachments(reference,m){
    if(!m.attachmentDetail||reference.querySelector('[data-detail-label="Attachment detail"]'))return;
    const {details,body}=makeDetail('Attachment detail');
    Object.entries(m.attachmentDetail).forEach(([key,value])=>{
      const section=document.createElement('section');
      section.className='fact structural-fact';
      const h=document.createElement('strong');
      h.textContent=key.charAt(0).toUpperCase()+key.slice(1);
      section.appendChild(h);
      const origin=document.createElement('p');
      origin.innerHTML='<b>Origin:</b> ';
      origin.append(document.createTextNode(value.origin||''));
      section.appendChild(origin);
      const insertion=document.createElement('p');
      insertion.innerHTML='<b>Insertion:</b> ';
      insertion.append(document.createTextNode(value.insertion||''));
      section.appendChild(insertion);
      if(value.keyRelationship){
        const relation=document.createElement('p');
        relation.innerHTML='<b>Nearby anatomy:</b> ';
        relation.append(document.createTextNode(value.keyRelationship));
        section.appendChild(relation);
      }
      body.appendChild(section);
    });
    const firstExisting=reference.querySelector('.muscle-card-detail-section');
    if(firstExisting)reference.insertBefore(details,firstExisting);else reference.appendChild(details);
  }

  function addNearby(reference,m){
    if(!Array.isArray(m.visualRelationships)||!m.visualRelationships.length||reference.querySelector('[data-detail-label="Nearby anatomy"]'))return;
    const {details,body}=makeDetail('Nearby anatomy');
    const intro=document.createElement('p');
    intro.className='small muted';
    intro.textContent='Structures shown or considered in the illustration only when they improve spatial understanding. Their proximity does not establish a diagnosis.';
    body.appendChild(intro);
    const list=document.createElement('ul');
    list.className='clean';
    m.visualRelationships.forEach(item=>{
      const li=document.createElement('li');
      const strong=document.createElement('strong');
      strong.textContent=item.structure+': ';
      li.appendChild(strong);
      li.append(document.createTextNode(item.reason||''));
      list.appendChild(li);
    });
    body.appendChild(list);
    const attachment=reference.querySelector('[data-detail-label="Attachment detail"]');
    if(attachment&&attachment.nextSibling)reference.insertBefore(details,attachment.nextSibling);
    else if(attachment)reference.appendChild(details);
    else reference.appendChild(details);
  }

  function enhance(){
    const card=app.querySelector('.muscle-detail-card');
    const reference=card?.querySelector('.muscle-card-reference');
    const m=currentMuscle(card);
    if(!card||!reference||!m)return;
    addAttachments(reference,m);
    addNearby(reference,m);
  }

  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
