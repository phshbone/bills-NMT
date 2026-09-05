(function(){
  const D=window.NMT_DATA;
  if(!D)return;

  const pending=(muscleId,regionalBaseId)=>({
    muscleId,
    regionalBaseId,
    triggerZones:[],
    referralAreas:[],
    summary:null,
    sourceIds:[],
    validationStatus:'pending-curation',
    artworkStatus:'approved-source-of-truth-asset-required',
    affectsReasoning:false
  });

  D.REFERRAL_PATTERNS={
    'serratus-anterior':pending('serratus-anterior','upper-quarter'),
    'scalenes':pending('scalenes','upper-quarter'),
    'quadratus-lumborum':pending('quadratus-lumborum','lumbar-pelvis'),
    'iliopsoas':pending('iliopsoas','lumbar-pelvis')
  };

  D.getReferralPattern=id=>D.REFERRAL_PATTERNS[id]||null;
  D.isReferralPatternPublished=id=>{
    const record=D.getReferralPattern(id);
    return Boolean(record&&record.validationStatus==='curated'&&record.artworkStatus==='approved'&&record.sourceIds.length&&record.referralAreas.length);
  };
})();
