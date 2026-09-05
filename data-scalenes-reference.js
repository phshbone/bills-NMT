(function(){
  const D=window.NMT_DATA;
  if(!D)return;

  Object.assign(D.SOURCES,{
    scalene_statpearls:{
      id:'scalene_statpearls',
      title:'Anatomy, Head and Neck, Scalenus Muscle',
      publisher:'StatPearls / NCBI Bookshelf',
      url:'https://www.ncbi.nlm.nih.gov/books/NBK519058/',
      type:'current anatomy reference used to verify attachments, innervation, and neural relationships'
    },
    travell_flipcharts:{
      id:'travell_flipcharts',
      title:'Travell and Simons’ Trigger Point Pain Patterns Flip Charts, Second Edition',
      publisher:'Travell / Simons clinical framework; Lippincott Williams & Wilkins',
      url:'https://anyflip.com/hjtlg/tlbh/mobile/index.html',
      type:'primary Travell-derived referral framework and figure cross-reference; protected artwork not reusable'
    },
    triggerpoints_scalene:{
      id:'triggerpoints_scalene',
      title:'Scalene Trigger Point Diagram',
      publisher:'Triggerpoints.net',
      url:'https://www.triggerpoints.net/muscle/scalene',
      type:'Travell-derived symptom/referral quick-reference; factual reference only, artwork not reusable'
    }
  });

  const scalene=D.MUSCLES.find(m=>m.id==='scalenes');
  if(scalene){
    Object.assign(scalene,{
      origin:'Anterior: anterior tubercles of C3–C6 transverse processes. Middle: cervical transverse processes across the lower six cervical levels, with attachment detail and level variation described in the literature. Posterior: posterior tubercles of the lower cervical transverse processes, typically spanning the lower 3–4 cervical vertebrae.',
      insertion:'Anterior: scalene tubercle on the superior surface of the 1st rib. Middle: superior surface of the 1st rib, posterior to the subclavian artery groove. Posterior: anterior/external surface of the 2nd rib.',
      action:[
        'Ipsilateral cervical side-bending',
        'Bilateral contribution to cervical flexion depending on position',
        'Elevation/stabilization of the upper ribs during accessory inspiration'
      ],
      innervation:'Anterior rami of cervical spinal nerves, commonly described across C3–C8.',
      roles:[
        'Cervical postural control and side-bending',
        'Accessory respiration through upper-rib elevation',
        'Forms the interscalene passage with the brachial plexus and subclavian artery between anterior and middle scalenes'
      ],
      nearby:[
        'cervical-region','first-rib','second-rib','clavicle','brachial-plexus','subclavian-artery','phrenic-nerve','long-thoracic-nerve'
      ],
      sourceIds:['travell_context','travell_flipcharts','triggerpoints_scalene','scalene_statpearls','scalene_case_report'],
      attachmentDetail:{
        anterior:{
          origin:'Anterior tubercles of the transverse processes of C3–C6.',
          insertion:'Scalene tubercle on the superior surface of the 1st rib.',
          keyRelationship:'The phrenic nerve courses on the surface of anterior scalene. The brachial plexus lies posterior to it in the interscalene space.'
        },
        middle:{
          origin:'Cervical transverse processes across the lower six cervical levels; detailed attachment pattern varies by source and individual anatomy.',
          insertion:'Superior surface of the 1st rib, posterior to the subclavian artery groove.',
          keyRelationship:'Forms the posterior wall of the interscalene passage; brachial plexus roots/trunks pass between anterior and middle scalenes.'
        },
        posterior:{
          origin:'Posterior tubercles of the lower cervical transverse processes, typically the lower 3–4 cervical vertebrae.',
          insertion:'Anterior/external surface of the 2nd rib.',
          keyRelationship:'The upper long thoracic nerve may pass between middle and posterior scalene, through middle scalene, or above it; variation is common enough to avoid depicting a single course as universal.'
        }
      },
      visualRelationships:[
        {structure:'Brachial plexus',priority:'show',reason:'High-yield spatial relationship between anterior and middle scalenes; useful for understanding why neural symptoms require comparison rather than a muscle-only assumption.'},
        {structure:'Subclavian artery',priority:'show-if-legible',reason:'Passes through the interscalene triangle with the brachial plexus and helps orient the first-rib relationship.'},
        {structure:'Phrenic nerve',priority:'optional-detail',reason:'Runs on the anterior scalene surface; useful in a deeper/reference view but may clutter the primary phone illustration.'},
        {structure:'Long thoracic nerve',priority:'optional-detail',reason:'Course near/through the middle-posterior scalene region is variable and should be shown only with explicit variability language.'}
      ],
      anatomyValidationStatus:'verified-structured-text',
      anatomyVisualStatus:'pending-verified-original-artwork'
    });
  }

  const referral=D.REFERRAL_PATTERNS&&D.REFERRAL_PATTERNS.scalenes;
  if(referral){
    Object.assign(referral,{
      summary:'Within the Travell/Simons framework, the scalenes are treated as a group with trigger-point locations in the anterior, middle, and posterior scalenes and a composite referred-pain pattern. Travell-derived symptom references place scalene referral across upper-back, shoulder, chest, arm, forearm, wrist/hand, and radial-hand neighborhoods. Exact essential-versus-spillover boundaries remain gated until independently redrawn from the curated source pattern.',
      sourceIds:['travell_context','travell_flipcharts','triggerpoints_scalene','scalene_case_report','upper_quarter_trp_workers'],
      validationStatus:'curated-travell-text',
      artworkStatus:'approved-source-of-truth-asset-required',
      evidenceNote:'Travell/Simons is the preferred trigger-point/referral framework for this app. TriggerPoints.net is used as a Travell-derived navigation/reference aid. Protected source artwork is not copied. Referral distribution does not diagnose a scalene source, particularly where symptoms overlap cervical or peripheral neural patterns.'
    });
  }
})();
