(function(){
const D=window.NMT_DATA;
Object.assign(D.SOURCES,{
  bone_markings_statpearls:{id:'bone_markings_statpearls',title:'Anatomy, Bone Markings',publisher:'StatPearls / NCBI Bookshelf',url:'https://www.ncbi.nlm.nih.gov/books/NBK513259/',type:'current anatomy reference'},
  pelvis_bones_statpearls:{id:'pelvis_bones_statpearls',title:'Anatomy, Bony Pelvis and Lower Limb: Pelvis Bones',publisher:'StatPearls / NCBI Bookshelf',url:'https://www.ncbi.nlm.nih.gov/books/NBK545204/',type:'current anatomy reference'},
  thorax_wall_statpearls:{id:'thorax_wall_statpearls',title:'Anatomy, Thorax, Wall Movements',publisher:'StatPearls / NCBI Bookshelf',url:'https://www.ncbi.nlm.nih.gov/books/NBK526023/',type:'current anatomy reference'},
  xiphoid_statpearls:{id:'xiphoid_statpearls',title:'Anatomy, Thorax, Xiphoid Process',publisher:'StatPearls / NCBI Bookshelf',url:'https://www.ncbi.nlm.nih.gov/books/NBK526082/',type:'current anatomy reference'}
});

D.STRUCTURES.push(
  {id:'coracoid-process',name:'Coracoid process',type:'skeletal-landmark',region:'shoulder / scapula',summary:'Hook-like anterior process of the scapula that serves as an attachment point for pectoralis minor and other soft tissues.',sourceIds:['scapula_statpearls','bone_markings_statpearls']},
  {id:'clavicle',name:'Clavicle',type:'bone',region:'shoulder girdle',summary:'Long bone linking the sternum and scapular region; provides attachment for several neck, shoulder, and chest muscles.',sourceIds:['shoulder_muscles_statpearls','scm_statpearls']},
  {id:'xiphoid-process',name:'Xiphoid process',type:'skeletal-landmark',region:'anterior thorax',summary:'Small distal part of the sternum and an attachment region for the diaphragm and rectus abdominis.',sourceIds:['xiphoid_statpearls','thorax_wall_statpearls']},
  {id:'twelfth-rib',name:'12th rib',type:'bone-landmark',region:'lower thorax / flank',summary:'Floating rib at the thoracolumbar junction; clinically useful as an upper attachment landmark for quadratus lumborum and nearby posterior abdominal wall structures.',sourceIds:['thorax_wall_statpearls','lumbar_statpearls']},
  {id:'ischial-tuberosity',name:'Ischial tuberosity',type:'skeletal-landmark',region:'pelvis',summary:'Posteroinferior bony prominence of the ischium and a major proximal attachment region for the hamstrings.',sourceIds:['pelvis_bones_statpearls']},
  {id:'ilium-iliac-crest',name:'Ilium / iliac crest',type:'bone-landmark',region:'pelvis / low back',summary:'Superior pelvic bone and crest serving as an attachment region for multiple trunk and hip muscles and an orientation landmark for the lumbopelvic region.',sourceIds:['pelvis_bones_statpearls','pelvic_joints_statpearls']}
);

D.RELATIONSHIPS.push(
  {from:'pectoralis-minor',to:'coracoid-process',kind:'insertion',why:'Pectoralis minor inserts on the coracoid process, linking anterior rib position with scapular positioning.',sourceIds:['pectoral_statpearls','bone_markings_statpearls']},
  {from:'sternocleidomastoid',to:'clavicle',kind:'attachment',why:'The sternocleidomastoid has a clavicular attachment, making the clavicle part of the mechanical context for neck orientation and load transfer.',sourceIds:['scm_statpearls']},
  {from:'upper-trapezius',to:'clavicle',kind:'attachment',why:'Upper trapezius inserts on the lateral clavicle as part of the shoulder-girdle linkage between neck and scapular mechanics.',sourceIds:['trapezius_statpearls']},
  {from:'quadratus-lumborum',to:'twelfth-rib',kind:'attachment / regional landmark',why:'Quadratus lumborum attaches to the 12th rib, which helps explain why a lower-rib-to-pelvis complaint can overlap with QL anatomy without proving QL is the cause.',sourceIds:['lumbar_statpearls','thorax_wall_statpearls']},
  {from:'quadratus-lumborum',to:'ilium-iliac-crest',kind:'attachment / regional landmark',why:'Quadratus lumborum spans between the pelvis and 12th-rib region, so iliac-crest position is part of its regional mechanical context.',sourceIds:['lumbar_statpearls','pelvis_bones_statpearls']},
  {from:'hamstrings',to:'ischial-tuberosity',kind:'origin',why:'The hamstring group has a major proximal attachment at the ischial tuberosity, making this landmark useful when comparing posterior-thigh and sitting-related mechanics.',sourceIds:['pelvis_bones_statpearls']},
  {from:'iliopsoas',to:'ilium-iliac-crest',kind:'regional skeletal context',why:'The iliacus component occupies the iliac fossa, so the ilium provides skeletal context for understanding iliopsoas position and hip-flexion mechanics.',sourceIds:['iliopsoas_statpearls','pelvis_bones_statpearls']},
  {from:'pectoralis-major',to:'clavicle',kind:'origin',why:'The clavicular portion of pectoralis major originates from the medial clavicle, linking this bone to anterior shoulder force production.',sourceIds:['pectoral_statpearls']},
  {from:'rectus-femoris',to:'ilium-iliac-crest',kind:'pelvic attachment context',why:'Rectus femoris originates from the anterior ilium near the hip joint; the ilium therefore provides useful skeletal context when comparing hip-flexor contributors.',sourceIds:['pelvic_joints_statpearls']}
);
})();
