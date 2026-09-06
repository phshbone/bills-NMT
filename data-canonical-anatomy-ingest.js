(function(){
  const D=window.NMT_DATA;
  const C=window.NMT_CANONICAL_ANATOMY;
  if(!D||!C||!Array.isArray(C.records))return;

  const normalize=value=>String(value||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const canonicalIds=new Set();
  const duplicateCanonicalIds=[];
  C.records.forEach(record=>{if(canonicalIds.has(record.c))duplicateCanonicalIds.push(record.c);canonicalIds.add(record.c);});

  const movementIds=new Set((D.MOVEMENTS||[]).map(m=>m.id));
  const invalidCanonicalMovementIds=[];
  const byName=new Map((D.MUSCLES||[]).map(m=>[normalize(m.name),m]));
  const runtimeIds=new Set((D.MUSCLES||[]).map(m=>m.id));
  let added=0,enriched=0;

  function movementLinks(record){
    const canonical=[],candidates=[];
    (record.m||[]).forEach(link=>{
      if(link.startsWith('canonical:')){const id=link.slice(10);if(movementIds.has(id))canonical.push(id);else invalidCanonicalMovementIds.push({canonicalId:record.c,movementId:id});}
      else if(link.startsWith('candidate:'))candidates.push(link.slice(10));
    });
    return {canonical:[...new Set(canonical)],candidates:[...new Set(candidates)]};
  }
  function runtimeIdFor(record){
    const simple=normalize(record.n);if(!runtimeIds.has(simple))return simple;
    const prefixed=normalize(record.c.replace('.', '-'));if(!runtimeIds.has(prefixed))return prefixed;
    let n=2;while(runtimeIds.has(`${prefixed}-${n}`))n++;return `${prefixed}-${n}`;
  }

  C.records.forEach(record=>{
    const key=normalize(record.n);
    let muscle=byName.get(key);
    const links=movementLinks(record);
    const existed=!!muscle;

    if(!muscle){
      const id=runtimeIdFor(record);runtimeIds.add(id);
      muscle={id,name:record.n,region:record.r,group:record.g,origin:'',insertion:'',action:[],innervation:'',roles:[],synergists:[],antagonists:[],compensators:[],nearby:[],movements:[],observations:[],interventions:[],sourceIds:[]};
      D.MUSCLES.push(muscle);byName.set(key,muscle);added++;
    }else enriched++;

    const canonicalAnatomy={
      region:record.r||'',group:record.g||'',origin:[...(record.o||[])],insertion:[...(record.i||[])],actions:[...(record.x||[])],innervation:record.v||'',roles:[...(record.q||[])]
    };
    muscle.canonicalId=record.c;
    muscle.canonicalName=record.n;
    muscle.canonicalAlternateNames=[...(record.a||[])];
    muscle.canonicalLibraryVersion=C.v||'v0.3';
    muscle.canonicalSchemaVersion=C.s||'1.0.2';
    muscle.canonicalAnatomy=canonicalAnatomy;
    muscle.canonicalRegion=record.r||null;
    muscle.canonicalGroup=record.g||null;

    if(!existed||!muscle.region)muscle.region=record.r||muscle.region;
    if(!existed||!muscle.group)muscle.group=record.g||muscle.group;
    if(!existed||!muscle.origin)muscle.origin=canonicalAnatomy.origin.join(' ');
    if(!existed||!muscle.insertion)muscle.insertion=canonicalAnatomy.insertion.join(' ');
    if(!existed||!(muscle.action||[]).length)muscle.action=[...canonicalAnatomy.actions];
    if(!existed||!muscle.innervation)muscle.innervation=canonicalAnatomy.innervation;
    if(!existed||!(muscle.roles||[]).length)muscle.roles=[...canonicalAnatomy.roles];

    muscle.movements=[...new Set([...(muscle.movements||[]),...links.canonical])];
    muscle.candidateMovements=links.candidates;
    muscle.factualStatus=record.fs;
    muscle.visualStatus=record.vs;
    muscle.visualTier=record.vt;
    muscle.canonicalStructuralSources=[...(record.ss||[])];
    muscle.canonicalReferral={availability:record.ra,description:[...(record.rd||[])],targetedReviewRequired:!!record.tr,triggerpointsUrl:record.tp||null,travellReference:record.tf||null};
  });

  const canonicalRuntimeRecords=D.MUSCLES.filter(m=>m.canonicalId);
  const runtimeCanonicalIds=new Set(canonicalRuntimeRecords.map(m=>m.canonicalId));
  const missingRuntimeCanonicalIds=[...canonicalIds].filter(id=>!runtimeCanonicalIds.has(id));
  D.CANONICAL_ANATOMY={version:C.v||'v0.3',schemaVersion:C.s||'1.0.2',expectedCount:C.count||155,actualCount:C.records.length,records:C.records,byId:Object.fromEntries(C.records.map(record=>[record.c,record])),ingestion:{added,enriched,runtimeCanonicalCount:canonicalRuntimeRecords.length,duplicateCanonicalIds,missingRuntimeCanonicalIds,invalidCanonicalMovementIds}};
})();