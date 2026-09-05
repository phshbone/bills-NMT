(function(){
  const D=window.NMT_DATA;
  if(!D)return;
  D.ANATOMY_REGIONS={
    'upper-quarter':{
      id:'upper-quarter',name:'Neck / shoulder / upper thorax',
      baseStructures:['cervical spine','clavicle','scapula','upper ribs','proximal humerus'],
      defaultView:'attachments'
    },
    'lumbar-pelvis':{
      id:'lumbar-pelvis',name:'Lumbar spine / pelvis / proximal femur',
      baseStructures:['lumbar spine','pelvis','12th rib','proximal femur'],
      defaultView:'attachments'
    }
  };
  const attachmentView=(asset)=>({label:'Attachments',asset,status:'ready'});
  const pendingAttachment=(reason)=>({label:'Attachments',status:'pending',reason});
  const pendingMuscle={label:'Muscle',status:'pending'};
  const pendingReferral={label:'Referral',status:'pending'};
  D.ANATOMY_ATLAS={
    'iliopsoas':{
      regionId:'lumbar-pelvis',
      views:{attachments:attachmentView('assets/anatomy/iliopsoas.webp'),muscle:{...pendingMuscle},referral:{...pendingReferral}},
      related:['quadratus-lumborum','lumbar-erectors','rectus-femoris','gluteus-maximus']
    },
    'quadratus-lumborum':{
      regionId:'lumbar-pelvis',
      views:{attachments:attachmentView('assets/anatomy/quadratus-lumborum.webp'),muscle:{...pendingMuscle},referral:{...pendingReferral}},
      related:['iliopsoas','lumbar-erectors','gluteus-medius']
    },
    'scalenes':{
      regionId:'upper-quarter',
      views:{attachments:attachmentView('assets/anatomy/scalenes.webp'),muscle:{...pendingMuscle},referral:{...pendingReferral}},
      related:['sternocleidomastoid','levator-scapulae','upper-trapezius']
    },
    'serratus-anterior':{
      regionId:'upper-quarter',
      views:{attachments:pendingAttachment('Current draft plate failed anatomical rib-count/label verification and is intentionally unpublished until corrected.'),muscle:{...pendingMuscle},referral:{...pendingReferral}},
      related:['pectoralis-minor','upper-trapezius','lower-trapezius','rotator-cuff']
    }
  };
  D.getAnatomyAtlasRecord=id=>D.ANATOMY_ATLAS[id]||null;
})();