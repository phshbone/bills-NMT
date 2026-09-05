(function(){
  const R=window.NMT_REASONING;
  if(!R?.extractComplaintFacts)return;
  const baseExtract=R.extractComplaintFacts.bind(R);

  function addConcept(concepts,key,label){
    if(!concepts.some(x=>x.key===key))concepts.push({key,label});
  }
  function explicitYes(raw,subject,positive){
    return new RegExp(`(?:${subject})[^.!?;]{0,48}(?:${positive})|(?:${positive})[^.!?;]{0,48}(?:${subject})`,'i').test(raw);
  }
  function explicitNo(raw,subject,negative){
    return new RegExp(`(?:${subject})[^.!?;]{0,48}(?:${negative})|(?:${negative})[^.!?;]{0,48}(?:${subject})`,'i').test(raw);
  }

  function upperFacts(raw,answers,concepts){
    const rotation='(?:turn(?:ing)? (?:my |the )?(?:head|neck)|neck rotation|cervical rotation)';
    if(explicitYes(raw,rotation,'(?:limited|restricted|stiff|painful|hurts?|worse|reproduces?|brings on)')){
      answers.uq_cervical_rotation='yes';addConcept(concepts,'movement-neck-rotation','neck rotation restricted or symptom-producing');
    }else if(explicitNo(raw,rotation,'(?:full|normal|fine|painless|does not change|doesn.t change|no problem)')){
      answers.uq_cervical_rotation='no';addConcept(concepts,'movement-neck-rotation-no','neck rotation not restricted');
    }

    const sidebend='(?:side[- ]?bend(?:ing)?|tilt(?:ing)? (?:my |the )?head)';
    if(explicitYes(raw,sidebend,'(?:limited|restricted|stiff|painful|hurts?|worse|reproduces?|brings on)')){
      answers.uq_sidebend='yes';addConcept(concepts,'movement-neck-sidebend','neck side-bending restricted or symptom-producing');
    }else if(explicitNo(raw,sidebend,'(?:full|normal|fine|painless|does not change|doesn.t change|no problem)')){
      answers.uq_sidebend='no';addConcept(concepts,'movement-neck-sidebend-no','neck side-bending not restricted');
    }

    if(explicitYes(raw,'(?:wall slide|wall slides)','(?:pain|hurts?|worse|reproduces?|brings on|familiar symptom)')){
      answers.uq_wallslide='yes';addConcept(concepts,'movement-wallslide','wall slide reproduces symptoms');
    }
    if(explicitYes(raw,'(?:hang|hanging|assisted hang)','(?:pain|hurts?|worse|reproduces?|brings on|familiar symptom)')){
      answers.uq_hang='yes';addConcept(concepts,'movement-hang','hanging reproduces symptoms');
    }
    if(explicitYes(raw,'(?:thoracic rotation|rotate (?:my |the )?(?:torso|trunk|upper back))','(?:changes?|better|worse|reproduces?|brings on)')){
      answers.uq_thoracic='yes';addConcept(concepts,'movement-thoracic-rotation','thoracic rotation changes symptoms');
    }
  }

  function lowerFacts(raw,answers,concepts){
    const lowerRegion='(?:low(?:er)? back|lumbar|flank|iliac crest|lower rib)';
    if(new RegExp(`\\b(?:right|left)\\b[^.!?;]{0,35}${lowerRegion}|${lowerRegion}[^.!?;]{0,35}\\b(?:right|left)\\b`,'i').test(raw)){
      answers.lb_unilateral='one side';addConcept(concepts,'location-unilateral-lowback','mainly one-sided low-back/flank complaint');
    }else if(new RegExp(`(?:central|midline|both sides|bilateral)[^.!?;]{0,35}${lowerRegion}|${lowerRegion}[^.!?;]{0,35}(?:central|midline|both sides|bilateral)`,'i').test(raw)){
      answers.lb_unilateral='central/both';addConcept(concepts,'location-central-lowback','central or bilateral low-back complaint');
    }

    const upright='(?:standing (?:fully )?upright|stand(?:ing)? straight|extend(?:ing)? (?:my |the )?(?:back|spine)|backward bend(?:ing)?)';
    if(explicitYes(raw,upright,'(?:harder|difficult|limited|restricted|painful|hurts?|worse|reproduces?)') && /bend(?:ing)? forward|flex(?:ion|ing)?|lean(?:ing)? forward/i.test(raw)){
      answers.lb_extension='yes';addConcept(concepts,'behavior-extension-sensitive','upright/extension harder than bending forward');
    }

    if(/(?:worse|hurts?|painful|stiff(?:er)?|tight(?:er)?)[^.!?;]{0,40}(?:after|with|from) (?:prolonged )?sitting|(?:after|with|from) (?:prolonged )?sitting[^.!?;]{0,40}(?:worse|hurts?|painful|stiff(?:er)?|tight(?:er)?)/i.test(raw)){
      answers.lb_sitting='yes';addConcept(concepts,'behavior-sitting-worse','worse after sitting');
    }else if(/(?:sitting|after sitting)[^.!?;]{0,35}(?:does not change|doesn.t change|fine|no worse|not worse)/i.test(raw)){
      answers.lb_sitting='no';addConcept(concepts,'behavior-sitting-nochange','sitting does not worsen symptoms');
    }

    if(explicitYes(raw,'(?:hip extension|step(?:ping)? backward|leg backward)','(?:pain|hurts?|worse|restricted|limited|reproduces?|brings on)')){
      answers.lb_hip_extension='yes';addConcept(concepts,'movement-hip-extension','hip extension reproduces restriction or symptoms');
    }
    if(explicitYes(raw,'(?:lumbar extension|extend(?:ing)? (?:my |the )?(?:low |lower )?back|backward bend(?:ing)?)','(?:pain|hurts?|worse|reproduces?|brings on)')){
      answers.lb_lumbar_extension='yes';addConcept(concepts,'movement-lumbar-extension','lumbar extension reproduces symptoms');
    }
    if(explicitYes(raw,'(?:side[- ]?bend(?:ing)?|lean(?:ing)? sideways)','(?:pain|hurts?|worse|reproduces?|brings on)')){
      answers.lb_sidebend='yes';addConcept(concepts,'movement-lowback-sidebend','side-bending reproduces symptoms');
    }
    if(/(?:walking|easy walking)[^.!?;]{0,35}(?:helps?|improves?|loosens?|better)|(?:helps?|improves?|loosens?|better)[^.!?;]{0,35}(?:walking|easy walking)/i.test(raw)){
      answers.lb_walking='yes';addConcept(concepts,'behavior-walking-improves','easy walking improves stiffness');
    }

    if(/(?:travel|radiat|spread|shoot|run)[a-z]*[^.!?;]{0,55}\b(?:leg|calf|foot)\b|\b(?:leg|calf|foot)\b[^.!?;]{0,55}(?:travel|radiat|spread|shoot|run)[a-z]*/i.test(raw)){
      answers.lb_referral='down leg';addConcept(concepts,'referral-down-leg','symptoms travel down the leg');
    }else if(/(?:travel|radiat|spread|refer|run)[a-z]*[^.!?;]{0,55}\b(?:buttock|butt|groin)\b|\b(?:buttock|butt|groin)\b[^.!?;]{0,55}(?:travel|radiat|spread|refer|run)[a-z]*/i.test(raw)){
      answers.lb_referral='buttock/groin';addConcept(concepts,'referral-buttock-groin','symptoms travel toward buttock or groin');
    }else if(/(?:stays?|remain(?:s)?) (?:local|in (?:my |the )?(?:low|lower) back)|does not (?:travel|radiate|spread)|doesn.t (?:travel|radiate|spread)/i.test(raw)){
      answers.lb_referral='stays local';addConcept(concepts,'referral-local','symptoms stay local');
    }
  }

  function extractComplaintFacts(text,pathwayId){
    const result=baseExtract(text,pathwayId)||{answers:{},concepts:[]};
    result.answers=result.answers||{};result.concepts=result.concepts||[];
    const raw=String(text||'');
    if(pathwayId==='upper')upperFacts(raw,result.answers,result.concepts);
    if(pathwayId==='lower')lowerFacts(raw,result.answers,result.concepts);
    return result;
  }

  function intakeProfile(text,pathwayId,data=window.NMT_DATA){
    const facts=extractComplaintFacts(text,pathwayId);
    const path=data?.PATHWAYS?.[pathwayId];
    const answered=(path?.questions||[]).filter(id=>facts.answers[id]!=null);
    const missing=(path?.questions||[]).filter(id=>facts.answers[id]==null);
    return {pathwayId,answered,missing,extractedCount:answered.length,nextQuestionId:R.nextUnanswered(pathwayId,facts.answers,data)?.id||null,facts};
  }

  R.extractComplaintFacts=extractComplaintFacts;
  R.intakeProfile=intakeProfile;
})();