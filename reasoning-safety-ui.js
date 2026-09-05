(function(){
  const D=window.NMT_DATA,R=window.NMT_REASONING;
  if(!D||!R)return;

  if(D.QUESTIONS?.safety_neuro){
    D.QUESTIONS.safety_neuro.text='Any new or progressive weakness, marked loss of sensation, or sudden difficulty using the arm or leg normally?';
    D.QUESTIONS.safety_neuro.why='Progressive neurological loss or sudden loss of normal limb function falls outside ordinary educational self-care reasoning and needs medical evaluation. Mild or familiar sensory symptoms are handled separately.';
  }
  if(D.QUESTIONS?.safety_trauma){
    D.QUESTIONS.safety_trauma.text='Was there major trauma, a significant unexplained fever/systemic illness, or a major unexplained decline?';
    D.QUESTIONS.safety_trauma.why='These findings can indicate problems that need medical evaluation rather than deeper muscle speculation. A yes answer does not automatically mean an emergency-room visit; urgency depends on severity and the full clinical picture.';
  }
  if(D.QUESTIONS?.fa_paresthesia){
    D.QUESTIONS.fa_paresthesia.text='Any numbness, tingling, or unusual heaviness in the forearm, wrist, or hand with this complaint?';
    D.QUESTIONS.fa_paresthesia.why='A yes answer means numbness or tingling and can increase attention to a nerve pathway. Choose the heaviness option when heaviness is present without numbness or tingling; heaviness is not treated as weakness or sensory loss.';
    D.QUESTIONS.fa_paresthesia.options=['yes','heaviness without numbness/tingling','no','unsure'];
  }

  const originalBuild=R.buildSummary.bind(R);
  R.buildSummary=function(pathwayId,answers,data,reassessment={}){
    const out=originalBuild(pathwayId,answers,data,reassessment);
    const flags=out.safety?.flags||[];
    if(!out.safety?.escalate)return out;
    let message='This finding falls outside the normal educational/self-care pathway and is worth professional medical evaluation.';
    if(flags.includes('safety_bladder'))message='New bowel/bladder control changes or saddle-area numbness require urgent medical evaluation rather than continued muscle self-assessment.';
    else if(flags.includes('safety_neuro'))message='New or progressive weakness, marked sensory loss, or sudden loss of normal limb function needs prompt medical evaluation. Sudden severe loss of function is more urgent than familiar mild numbness or heaviness.';
    else if(flags.includes('safety_trauma'))message='Major trauma or significant unexplained systemic illness needs medical evaluation before continuing a muscle-focused pathway. The appropriate urgency depends on severity and accompanying symptoms.';
    else if(flags.includes('safety_abdominal'))message='Serious or unexplained abdominal or urinary symptoms need medical evaluation before continuing a musculoskeletal self-care pathway.';
    out.safety={...out.safety,message};
    return out;
  };
})();