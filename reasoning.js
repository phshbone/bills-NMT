(function(global){
function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim()}
function extractRoutingConcepts(text){
  const raw=String(text||''),t=normalize(raw),concepts=[];
  const add=(type,value,weight=1)=>{if(!concepts.some(x=>x.type===type&&x.value===value))concepts.push({type,value,weight})};
  if(/\bright\b/.test(t))add('side','right');
  if(/\bleft\b/.test(t))add('side','left');
  if(/\bboth\b|\bbilateral\b/.test(t))add('side','bilateral');

  if(/\bforearm\b/.test(t))add('region','forearm',4);
  if(/\belbow\b/.test(t))add('region','elbow',4);
  if(/\bwrist\b/.test(t))add('region','wrist',3);
  if(/\bhand\b|\bfingers?\b|\bthumb\b/.test(t))add('region','hand',2);
  if(/\bneck\b|\bcervical\b/.test(t))add('region','neck',4);
  if(/\bshoulder blade\b|\bscapul\w*\b/.test(t))add('region','scapula',4);
  if(/\bshoulder\b/.test(t))add('region','shoulder',4);
  if(/\bunderarm\b|\bunder arm\b|\barmpit\b|\baxilla\w*\b/.test(t))add('region','underarm',4);
  if(/\bupper chest\b|\bchest\b/.test(t))add('region','chest',3);
  if(/\blower back\b|\blow back\b|\blumbar\b/.test(t))add('region','low-back',4);
  if(/\bhip\b|\bhips\b/.test(t))add('region','hip',4);
  if(/\bflank\b/.test(t))add('region','flank',3);
  if(/\bgroin\b/.test(t))add('region','groin',3);

  if(/\b(?:outside|outer|lateral)\b[^.!?;]{0,24}\b(?:elbow|forearm)\b|\b(?:elbow|forearm)\b[^.!?;]{0,24}\b(?:outside|outer|lateral)\b/i.test(raw))add('subregion','lateral-elbow',3);
  if(/\b(?:inside|inner|medial)\b[^.!?;]{0,24}\b(?:elbow|forearm)\b|\b(?:elbow|forearm)\b[^.!?;]{0,24}\b(?:inside|inner|medial)\b/i.test(raw))add('subregion','medial-elbow',2);

  if(/\bgrip\w*\b|\bgrab\w*\b|\bsqueez\w*\b|\bcarry\w*\b/.test(t))add('behavior','gripping',3);
  if(/\bpull[ -]?ups?\b|\bpullup\b|\bpulling\b/.test(t))add('behavior','pulling',3);
  if(/\boverhead\b|\brais(?:e|ing) (?:my |the )?arm\b/.test(t))add('behavior','overhead',2);
  if(/\bturn(?:ing)? (?:my |the )?neck\b|\bneck rotation\b|\bcervical rotation\b/.test(t))add('behavior','neck-rotation',3);
  if(/\bstraighten\w*\b|\bstand(?:ing)? (?:fully )?upright\b/.test(t))add('behavior','straighten',3);
  if(/\bsit\w*\b|\bafter sitting\b/.test(t))add('behavior','sitting',2);
  if(/\bbend\w*\b|\bflex\w*\b/.test(t))add('behavior','bending',2);

  if(/\bpain\b|\bhurts?\b|\bache\b|\baching\b/.test(t))add('symptom','pain');
  if(/\btight\w*\b|\bstiff\w*\b/.test(t))add('symptom','tightness');
  if(/\bnumb\w*\b|\btingl\w*\b|\bpins and needles\b/.test(t))add('symptom','sensory');
  if(/\bweak\w*\b/.test(t))add('symptom','weakness');
  if(/\bheavy\b|\bheaviness\b/.test(t))add('symptom','heaviness');
  return concepts;
}
function pathwayConceptScore(pathwayId,concepts){
  const has=(type,value)=>concepts.some(x=>x.type===type&&x.value===value);
  let score=0,reasons=[];
  const hit=(points,why)=>{score+=points;reasons.push(why)};
  if(pathwayId==='forearm'){
    if(has('region','forearm'))hit(5,'forearm region');
    if(has('region','elbow'))hit(5,'elbow region');
    if(has('subregion','lateral-elbow'))hit(4,'lateral elbow location');
    if(has('behavior','gripping'))hit(3,'gripping/load behavior');
    if(has('region','wrist'))hit(2,'wrist region');
    if(has('region','hand')&&has('behavior','gripping'))hit(2,'hand symptoms with gripping');
  }
  if(pathwayId==='upper'){
    if(has('region','neck'))hit(5,'neck region');
    if(has('region','scapula'))hit(5,'scapular region');
    if(has('region','shoulder'))hit(4,'shoulder region');
    if(has('region','underarm'))hit(4,'underarm/axillary region');
    if(has('region','chest'))hit(2,'upper chest region');
    if(has('behavior','pulling'))hit(3,'pulling behavior');
    if(has('behavior','overhead'))hit(2,'overhead behavior');
    if(has('behavior','neck-rotation'))hit(3,'cervical movement behavior');
  }
  if(pathwayId==='lower'){
    if(has('region','low-back'))hit(6,'low-back region');
    if(has('region','hip'))hit(4,'hip region');
    if(has('region','flank'))hit(3,'flank region');
    if(has('region','groin'))hit(2,'groin region');
    if(has('behavior','straighten'))hit(3,'difficulty straightening/upright');
    if(has('behavior','sitting'))hit(2,'sitting-related behavior');
    if(has('behavior','bending'))hit(1,'bending behavior');
  }
  return {score,reasons};
}
function rankPathways(text,data){
  const t=normalize(text),concepts=extractRoutingConcepts(text);
  return Object.values(data.PATHWAYS).map(p=>{
    const semantic=pathwayConceptScore(p.id,concepts);
    const legacy=(p.match||[]).reduce((n,k)=>n+(t.includes(k)?0.35:0),0);
    return {pathway:p,score:semantic.score+legacy,semanticScore:semantic.score,reasons:semantic.reasons,concepts};
  }).sort((a,b)=>b.score-a.score);
}
function detectPathway(text,data){
  const ranked=rankPathways(text,data),best=ranked[0],second=ranked[1];
  if(!best||best.score<2.5)return null;
  if(second&&best.score-second.score<1.5&&best.semanticScore<5)return null;
  return best.pathway;
}
function extractComplaintFacts(text,pathwayId){
  const raw=String(text||'');
  const t=normalize(raw);
  const answers={},concepts=[];
  const addConcept=(key,label)=>{if(!concepts.some(x=>x.key===key))concepts.push({key,label})};
  if(/\bright\b/.test(t))addConcept('side-right','right side');
  if(/\bleft\b/.test(t))addConcept('side-left','left side');
  const regions=[
    ['forearm',/\bforearm\b/],['elbow',/\belbow\b/],['wrist',/\bwrist\b/],['hand',/\bhand\b/],
    ['neck',/\bneck\b|\bcervical\b/],['shoulder',/\bshoulder\b|\bscapul/],['low back',/\blow back\b|\blower back\b|\blumbar\b/]
  ];
  regions.forEach(([label,re])=>{if(re.test(t))addConcept('region-'+label,label)});
  if(/\bpain\b|\bhurts?\b|\bache\b|\baching\b/.test(t))addConcept('symptom-pain','pain');
  if(/\btight\b|\btightness\b|\bstiff\b|\bstiffness\b/.test(t))addConcept('symptom-tight','tightness/stiffness');
  if(/\bheavy\b|\bheaviness\b/.test(t))addConcept('symptom-heavy','heaviness');

  const paresthesiaTerms=/\b(?:numb|numbness|tingle|tingling|pins and needles)\b/i;
  const paresthesiaNegative=/\b(?:no|without|denies?|not experiencing|do not have|don't have|does not have|doesn't have)\b[^.!?;]{0,45}\b(?:numb|numbness|tingle|tingling|pins and needles)\b/i;
  const hasParesthesia=paresthesiaTerms.test(raw);
  const negParesthesia=paresthesiaNegative.test(raw);
  if(negParesthesia){addConcept('paresthesia-no','no numbness/tingling');if(pathwayId==='forearm')answers.fa_paresthesia='no'}
  else if(hasParesthesia){addConcept('paresthesia-yes','numbness/tingling reported');if(pathwayId==='forearm')answers.fa_paresthesia='yes'}

  const gripAggravation=/(?:pain|hurt|ache|tight|stiff|worse|irritat|bother|symptom)[^.!?;]{0,35}\b(?:grip|gripping|grab|grabbing|squeeze|squeezing|carry|carrying)\b|\b(?:grip|gripping|grab|grabbing|squeeze|squeezing|carry|carrying)\b[^.!?;]{0,35}(?:pain|hurt|ache|tight|stiff|worse|irritat|bother|symptom)/i;
  if(pathwayId==='forearm'&&gripAggravation.test(raw)){answers.fa_grip='yes';addConcept('behavior-grip','gripping aggravates')}

  const lateralElbow=/\b(?:outside|outer|lateral)\b[^.!?;]{0,20}\b(?:elbow|forearm)\b|\b(?:elbow|forearm)\b[^.!?;]{0,20}\b(?:outside|outer|lateral)\b/i;
  if(pathwayId==='forearm'&&lateralElbow.test(raw)){answers.fa_lateral='yes';addConcept('location-lateral-elbow','outside/lateral elbow region')}

  const fullNeuroNegative=/\b(?:no|without|denies?)\b[^.!?;]{0,70}\bweak(?:ness)?\b[^.!?;]{0,70}\b(?:major\s+)?numb(?:ness)?\b[^.!?;]{0,70}\b(?:loss of (?:arm|hand|limb )?function|loss of function)\b/i;
  if(fullNeuroNegative.test(raw)){answers.safety_neuro='no';addConcept('safety-neuro-no','no weakness, major numbness, or loss of function')}

  return {answers,concepts};
}
function safetyEscalation(answers){
  const red=['safety_neuro','safety_bladder','safety_trauma','safety_abdominal'].filter(id=>answers[id]==='yes');
  return red.length?{escalate:true,flags:red,message:'This finding falls outside the normal educational/self-care pathway and is worth professional medical evaluation.'}:{escalate:false,flags:[]};
}
function scoreHypotheses(pathwayId,answers,data,reassessment={}){
  const scores={},reasons={},weakens={};
  data.RULES.filter(r=>r.pathway===pathwayId).forEach(rule=>{
    let applies=!!rule.baseline;
    if(rule.when) applies=answers[rule.when.q]===rule.when.is;
    if(!applies)return;
    scores[rule.target]=(scores[rule.target]||0)+rule.delta;
    const bucket=rule.delta<0?weakens:reasons;
    (bucket[rule.target]||(bucket[rule.target]=[])).push(rule.why);
  });
  if(reassessment && reassessment.target && reassessment.change){
    const id=reassessment.target;
    const response={
      improved:{delta:2,bucket:reasons,why:'Symptoms or movement improved after a conservative change aimed at this structure/movement relationship. That response increases consideration, but does not prove causation.'},
      unchanged:{delta:-1,bucket:weakens,why:'A tolerable conservative trial produced no meaningful change, which slightly weakens this working hypothesis.'},
      worse:{delta:-1,bucket:weakens,why:'Symptoms worsened after this trial. That does not identify the cause, but it weakens the case for continuing this intervention without revising the hypothesis.'},
      'different location':{delta:0,bucket:reasons,why:'The symptom changed location after the trial. Treat that as new information to reassess rather than proof for or against one structure.'}
    }[reassessment.change];
    if(response){
      scores[id]=(scores[id]||0)+response.delta;
      (response.bucket[id]||(response.bucket[id]=[])).unshift(response.why);
    }
  }
  return Object.entries(scores).map(([id,score])=>{
    const muscle=data.MUSCLES.find(m=>m.id===id);
    return {id,score:Math.max(0,score),rawScore:score,name:muscle?muscle.name:id,support:reasons[id]||[],weaken:weakens[id]||[],muscle};
  }).filter(x=>x.rawScore>0).sort((a,b)=>b.score-a.score);
}
function nextUnanswered(pathwayId,answers,data){
  const path=data.PATHWAYS[pathwayId]; if(!path)return null;
  if(pathwayId==='forearm'){
    const core=['safety_neuro','safety_trauma','fa_paresthesia','fa_lateral','fa_grip'];
    const deep=['fa_wrist_extension','fa_finger_extension','fa_supination','fa_neck_change'];
    const coreId=core.find(q=>answers[q]==null);
    if(coreId)return data.QUESTIONS[coreId]||null;
    const deepId=deep.find(q=>answers[q]==null);
    if(!deepId)return null;
    if(answers.__refine_forearm==='refine')return data.QUESTIONS[deepId]||null;
    if(answers.__refine_forearm==='not now')return null;
    return {id:'__refine_forearm',text:'You have enough for a useful first-pass comparison. Refine the reasoning with four more movement and position checks?',why:'The first-pass questions establish safety, sensory behavior, location, and gripping response. The optional refinement compares wrist/finger loading, forearm rotation, and neck-position effects without making every user complete the full test sequence.',options:['refine','not now'],stage:'refine'};
  }
  const id=path.questions.find(q=>answers[q]==null); return id?data.QUESTIONS[id]:null;
}
function buildSummary(pathwayId,answers,data,reassessment={}){
  const safety=safetyEscalation(answers); const hypotheses=scoreHypotheses(pathwayId,answers,data,reassessment);
  return {safety,hypotheses,nextQuestion:nextUnanswered(pathwayId,answers,data)};
}
const api={normalize,extractRoutingConcepts,rankPathways,detectPathway,extractComplaintFacts,safetyEscalation,scoreHypotheses,nextUnanswered,buildSummary};
global.NMT_REASONING=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
