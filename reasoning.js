(function(global){
function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim()}
function detectPathway(text,data){
  const t=normalize(text); let best=null,bestScore=0;
  Object.values(data.PATHWAYS).forEach(p=>{const score=p.match.reduce((n,k)=>n+(t.includes(k)?1:0),0);if(score>bestScore){best=p;bestScore=score}});
  return best||null;
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
  const id=path.questions.find(q=>answers[q]==null); return id?data.QUESTIONS[id]:null;
}
function buildSummary(pathwayId,answers,data,reassessment={}){
  const safety=safetyEscalation(answers); const hypotheses=scoreHypotheses(pathwayId,answers,data,reassessment);
  return {safety,hypotheses,nextQuestion:nextUnanswered(pathwayId,answers,data)};
}
const api={normalize,detectPathway,extractComplaintFacts,safetyEscalation,scoreHypotheses,nextUnanswered,buildSummary};
global.NMT_REASONING=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
