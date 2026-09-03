(function(){
  const R=window.NMT_REASONING;
  if(!R||R.__neutralUnknownsPatched)return;
  const originalScore=R.scoreHypotheses.bind(R);
  const originalSafety=R.safetyEscalation.bind(R);
  const originalNext=R.nextUnanswered.bind(R);

  function scoreHypotheses(pathwayId,answers,data,reassessment={}){
    const ranked=originalScore(pathwayId,answers,data,reassessment);
    const seen=new Set(ranked.map(x=>x.id));
    const pending=new Map();

    data.RULES.filter(r=>r.pathway===pathwayId&&r.when&&r.delta>0).forEach(rule=>{
      if(answers[rule.when.q]!=='unsure')return;
      if(seen.has(rule.target))return;
      const q=data.QUESTIONS[rule.when.q];
      if(!pending.has(rule.target))pending.set(rule.target,{question:q?.text||'A relevant comparison has not been tested yet.'});
    });

    pending.forEach((meta,id)=>{
      const muscle=data.MUSCLES.find(m=>m.id===id);
      if(!muscle)return;
      ranked.push({
        id,
        score:0,
        rawScore:0,
        pending:true,
        name:muscle.name,
        muscle,
        support:[`Not yet tested: ${meta.question} An unsure answer is treated as missing evidence, not evidence against this structure.`],
        weaken:[]
      });
    });
    return ranked;
  }

  R.scoreHypotheses=scoreHypotheses;
  R.buildSummary=function(pathwayId,answers,data,reassessment={}){
    return {
      safety:originalSafety(answers),
      hypotheses:scoreHypotheses(pathwayId,answers,data,reassessment),
      nextQuestion:originalNext(pathwayId,answers,data)
    };
  };
  R.__neutralUnknownsPatched=true;
})();