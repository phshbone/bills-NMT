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
  D.ANATOMY_ATLAS={
    'iliopsoas':{
      regionId:'lumbar-pelvis',asset:'assets/anatomy/iliopsoas.webp',
      views:{attachments:{label:'Attachments',position:'center 34%'},muscle:{label:'Muscle',position:'center 42%'},referral:{label:'Referral',position:'center 88%'}},
      related:['quadratus-lumborum','lumbar-erectors','rectus-femoris','gluteus-maximus']
    },
    'quadratus-lumborum':{
      regionId:'lumbar-pelvis',asset:'assets/anatomy/quadratus-lumborum.webp',
      views:{attachments:{label:'Attachments',position:'center 34%'},muscle:{label:'Muscle',position:'center 44%'},referral:{label:'Referral',position:'center 88%'}},
      related:['iliopsoas','lumbar-erectors','gluteus-medius']
    },
    'scalenes':{
      regionId:'upper-quarter',asset:'assets/anatomy/scalenes.webp',
      views:{attachments:{label:'Attachments',position:'center 33%'},muscle:{label:'Muscle',position:'center 43%'},referral:{label:'Referral',position:'center 88%'}},
      related:['sternocleidomastoid','levator-scapulae','upper-trapezius']
    },
    'serratus-anterior':{
      regionId:'upper-quarter',asset:'assets/anatomy/serratus-anterior.webp',
      views:{attachments:{label:'Attachments',position:'center 34%'},muscle:{label:'Muscle',position:'center 46%'},referral:{label:'Referral',position:'center 89%'}},
      related:['pectoralis-minor','upper-trapezius','lower-trapezius','rotator-cuff']
    }
  };
  D.getAnatomyAtlasRecord=id=>D.ANATOMY_ATLAS[id]||null;
})();