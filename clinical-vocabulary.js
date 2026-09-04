(function(){
  const R=window.NMT_REASONING;
  if(!R||R.__clinicalVocabularyPatched)return;

  const originalExtract=R.extractRoutingConcepts.bind(R);
  const originalRank=R.rankPathways.bind(R);
  const originalFacts=R.extractComplaintFacts.bind(R);

  const TERMS=[
    {id:'quadratus-lumborum',type:'structure',label:'quadratus lumborum (QL)',aliases:[/\bql\b/i,/\bquadratus\s+lumborum\b/i],augment:' lower back flank lumbar quadratus lumborum '},
    {id:'sternocleidomastoid',type:'structure',label:'sternocleidomastoid (SCM)',aliases:[/\bscm\b/i,/\bsternocleidomastoid\b/i],augment:' neck cervical sternocleidomastoid '},
    {id:'upper-trapezius',type:'structure',label:'upper trapezius',aliases:[/\bupper\s+trap(?:s|ezius)?\b/i,/\bupper\s+trapezius\b/i],augment:' neck shoulder upper trapezius '},
    {id:'serratus-anterior',type:'structure',label:'serratus anterior',aliases:[/\bserratus(?:\s+anterior)?\b/i],augment:' shoulder blade scapula serratus anterior '},
    {id:'scalenes',type:'structure',label:'scalenes',aliases:[/\bscalenes?\b/i],augment:' neck cervical scalenes '},
    {id:'pectoralis-minor',type:'structure',label:'pectoralis minor (pec minor)',aliases:[/\bpec\s+minor\b/i,/\bpectoralis\s+minor\b/i],augment:' shoulder upper chest pectoralis minor '},
    {id:'pectoralis-major',type:'structure',label:'pectoralis major (pec major)',aliases:[/\bpec\s+major\b/i,/\bpectoralis\s+major\b/i],augment:' shoulder chest pectoralis major '},
    {id:'levator-scapulae',type:'structure',label:'levator scapulae',aliases:[/\blevator(?:\s+scapulae)?\b/i],augment:' neck shoulder blade scapula levator scapulae '},
    {id:'iliopsoas',type:'structure',label:'iliopsoas',aliases:[/\biliopsoas\b/i,/\bpsoas\b/i],augment:' low back hip groin iliopsoas '},

    {id:'t12-level',type:'landmark',label:'T12 / thoracolumbar level',aliases:[/\bt\s*-?\s*12\b/i,/\btwelfth\s+thoracic\b/i],augment:' lower back lumbar flank thoracolumbar '},
    {id:'rib-12',type:'landmark',label:'12th rib',aliases:[/\b12(?:th)?\s+rib\b/i,/\brib\s+12\b/i,/\btwelfth\s+rib\b/i],augment:' flank lower back rib '},
    {id:'upper-cervical',type:'landmark',label:'upper cervical (C1/C2)',aliases:[/\bc\s*-?\s*[12]\b/i,/\bupper\s+cervical\b/i],augment:' neck cervical upper cervical '},
    {id:'iliac-crest',type:'landmark',label:'iliac crest',aliases:[/\biliac\s+crest\b/i],augment:' hip pelvis lower back iliac crest '},
    {id:'asis',type:'landmark',label:'ASIS',aliases:[/\basis\b/i,/\banterior\s+superior\s+iliac\s+spine\b/i],augment:' hip pelvis groin '},
    {id:'psis',type:'landmark',label:'PSIS',aliases:[/\bpsis\b/i,/\bposterior\s+superior\s+iliac\s+spine\b/i],augment:' hip pelvis lower back '},
    {id:'inferior-angle-scapula',type:'landmark',label:'inferior angle of scapula',aliases:[/\binferior\s+angle(?:\s+of\s+(?:the\s+)?scapula)?\b/i],augment:' shoulder blade scapula '},
    {id:'medial-border-scapula',type:'landmark',label:'medial border of scapula',aliases:[/\bmedial\s+(?:border|edge)(?:\s+of\s+(?:the\s+)?scapula)?\b/i],augment:' shoulder blade scapula '},
    {id:'greater-trochanter',type:'landmark',label:'greater trochanter',aliases:[/\bgreater\s+trochanter\b/i],augment:' hip '},
    {id:'fibular-head',type:'landmark',label:'fibular head',aliases:[/\bfibular\s+head\b/i,/\bhead\s+of\s+(?:the\s+)?fibula\b/i],augment:' leg knee '}
  ];

  function matches(text){
    const raw=String(text||'');
    return TERMS.filter(term=>term.aliases.some(re=>re.test(raw))).map(term=>({id:term.id,type:term.type,label:term.label}));
  }

  function augment(text){
    const raw=String(text||'');
    const additions=TERMS.filter(term=>term.aliases.some(re=>re.test(raw))).map(term=>term.augment).join(' ');
    return additions?raw+' '+additions:raw;
  }

  function mergeConcepts(base,vocab){
    const out=[...(base||[])];
    vocab.forEach(v=>{
      if(!out.some(x=>x.type===v.type&&x.value===v.id))out.push({type:v.type,value:v.id,weight:v.type==='structure'?2:1,label:v.label});
    });
    return out;
  }

  R.normalizeClinicalVocabulary=function(text){
    return {original:String(text||''),augmented:augment(text),matches:matches(text)};
  };

  R.extractRoutingConcepts=function(text){
    const vocab=matches(text);
    return mergeConcepts(originalExtract(augment(text)),vocab);
  };

  R.rankPathways=function(text,data){
    const vocab=matches(text);
    const ranked=originalRank(augment(text),data);
    const concepts=mergeConcepts(originalExtract(augment(text)),vocab);
    return ranked.map(item=>({...item,concepts}));
  };

  R.detectPathway=function(text,data){
    const ranked=R.rankPathways(text,data),best=ranked[0],second=ranked[1];
    if(!best||best.score<2.5)return null;
    if(second&&best.score-second.score<1.5&&best.semanticScore<5)return null;
    return best.pathway;
  };

  R.extractComplaintFacts=function(text,pathwayId){
    const vocab=matches(text);
    const result=originalFacts(augment(text),pathwayId)||{answers:{},concepts:[]};
    const concepts=[...(result.concepts||[])];
    vocab.forEach(v=>{
      const key=`${v.type}-${v.id}`;
      if(!concepts.some(x=>x.key===key))concepts.push({key,label:v.label});
    });
    return {...result,concepts};
  };

  R.__clinicalVocabularyPatched=true;
})();