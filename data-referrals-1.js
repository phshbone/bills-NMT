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
    'serratus-anterior':{
      muscleId:'serratus-anterior',
      regionalBaseId:'upper-quarter',
      triggerZones:[],
      referralAreas:[
        {id:'midaxillary-ribs-5-7',label:'5th–7th rib region along the midaxillary line',kind:'primary-described-area'},
        {id:'posterior-chest-wall',label:'posterior chest wall',kind:'described-referred-area'},
        {id:'ipsilateral-upper-extremity-ulnar-hand',label:'same-side upper extremity toward the palmar 4th–5th fingers',kind:'described-radiation'}
      ],
      summary:'Serratus anterior myofascial pain has been described around the 5th–7th ribs at the midaxillary line, with possible referral to the posterior chest wall and radiation down the same-side upper extremity toward the palmar 4th–5th fingers.',
      sourceIds:['serratus_statpearls','serratus_samps_case_series'],
      validationStatus:'curated-text',
      artworkStatus:'approved-source-of-truth-asset-required',
      affectsReasoning:false,
      evidenceNote:'Educational description from published clinical references. This is not a diagnostic map and does not establish that serratus anterior is the source of a person’s pain.'
    },
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
