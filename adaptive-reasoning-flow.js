(function(){
  const R=window.NMT_REASONING;
  if(!R?.buildSummary||!R?.scoreHypotheses||!R?.safetyEscalation)return;

  const FLOW={
    upper:{
      core:['safety_neuro','safety_trauma','uq_cervical_rotation','uq_sidebend','uq_wing'],
      deep:['uq_shrug','uq_wallslide','uq_hang','uq_thoracic'],
      gate:'__refine_upper',
      text:'You have enough for a useful first-pass comparison. Refine it with a few more shoulder-blade, overhead, and thoracic checks?',
      why:'The first pass already covers major safety concerns plus cervical movement and scapular behavior. The optional refinement adds more loading and regional-mechanics information without making every user complete the full sequence.'
    },
    lower:{
      core:['safety_neuro','safety_bladder','safety_trauma','safety_abdominal','lb_unilateral','lb_extension','lb_referral'],
      deep:['lb_sitting','lb_hip_extension','lb_lumbar_extension','lb_sidebend','lb_walking'],
      gate:'__refine_lower',
      text:'You have enough for a useful first-pass comparison. Refine it with a few more sitting, hip, lumbar, side-bending, and walking checks?',
      why:'The first pass covers the important safety screen, location/distribution, extension behavior, and whether symptoms travel. The optional refinement compares hip, lumbar, and movement behavior in more detail.'
    }
  };

  const baseNext=R.nextUnanswered.bind(R);

  function adaptiveNext(pathwayId,answers,data=window.NMT_DATA){
    const flow=FLOW[pathwayId];
    if(!flow)return baseNext(pathwayId,answers,data);

    const coreId=flow.core.find(id=>answers[id]==null);
    if(coreId)return data?.QUESTIONS?.[coreId]||null;

    const deepId=flow.deep.find(id=>answers[id]==null);
    if(!deepId)return null;

    if(answers[flow.gate]==='refine')return data?.QUESTIONS?.[deepId]||null;
    if(answers[flow.gate]==='not now')return null;

    return {
      id:flow.gate,
      text:flow.text,
      why:flow.why,
      options:['refine','not now'],
      stage:'refine'
    };
  }

  function adaptiveSummary(pathwayId,answers,data=window.NMT_DATA,reassessment={}){
    return {
      safety:R.safetyEscalation(answers),
      hypotheses:R.scoreHypotheses(pathwayId,answers,data,reassessment),
      nextQuestion:adaptiveNext(pathwayId,answers,data)
    };
  }

  R.nextUnanswered=adaptiveNext;
  R.buildSummary=adaptiveSummary;
})();