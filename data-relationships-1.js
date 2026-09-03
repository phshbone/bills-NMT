window.NMT_DATA.STRUCTURES = [
  {id:'long-thoracic-nerve',name:'Long thoracic nerve',type:'nerve',region:'upper quarter',summary:'Motor nerve to serratus anterior; commonly receives C5-C7 contributions and courses along the chest wall.',sourceIds:['long_thoracic_statpearls']},
  {id:'brachial-plexus',name:'Brachial plexus',type:'nerve-network',region:'neck / upper quarter',summary:'C5-T1 nerve network supplying the upper limb and scapular region; roots pass between the anterior and middle scalenes.',sourceIds:['brachial_plexus_statpearls']},
  {id:'first-rib',name:'First rib',type:'bone-region',region:'upper thorax',summary:'Upper rib attachment and passage region relevant to scalene mechanics and neurovascular structures crossing toward the upper limb.',sourceIds:['brachial_plexus_statpearls','scalenus_statpearls']},
  {id:'scapulothoracic-interface',name:'Scapulothoracic interface',type:'functional-region',region:'upper quarter',summary:'Functional relationship between the scapula and thoracic wall; serratus and trapezius contribute to controlled scapular motion here.',sourceIds:['scapula_statpearls','serratus_statpearls']},
  {id:'cervical-region',name:'Cervical region',type:'joint-region',region:'neck',summary:'Neck region whose position and motion interact with cervical muscles, cervicoscapular tissues, and neural structures.',sourceIds:['neck_movements_statpearls']}
];

window.NMT_DATA.RELATIONSHIPS = [
  {from:'scalenes',to:'brachial-plexus',kind:'anatomical-neighbor',why:'The brachial plexus roots pass through the scalene region, classically between anterior and middle scalenes.',sourceIds:['brachial_plexus_statpearls']},
  {from:'scalenes',to:'first-rib',kind:'attachment / movement relationship',why:'Anterior and middle scalenes attach to the first rib, linking cervical activity with upper-rib mechanics.',sourceIds:['scalenus_statpearls']},
  {from:'scalenes',to:'sternocleidomastoid',kind:'functional-overlap',why:'Both can contribute to cervical motion and accessory respiratory strategies, so one should not be inferred from neck tightness alone.',sourceIds:['scalenus_statpearls','scm_statpearls']},
  {from:'scalenes',to:'levator-scapulae',kind:'clinical-comparison',why:'Both participate in cervical side-bending patterns, but levator also directly links the cervical spine to the scapula.',sourceIds:['scalenus_statpearls','levator_statpearls']},
  {from:'serratus-anterior',to:'long-thoracic-nerve',kind:'innervation',why:'The long thoracic nerve supplies serratus anterior; altered serratus function can therefore justify considering nerve-related mechanics without assuming neuropathy.',sourceIds:['long_thoracic_statpearls','serratus_statpearls']},
  {from:'serratus-anterior',to:'scapulothoracic-interface',kind:'functional-region',why:'Serratus helps hold the scapula against the thoracic wall and contributes to protraction and upward rotation.',sourceIds:['serratus_statpearls','scapula_statpearls']},
  {from:'upper-trapezius',to:'serratus-anterior',kind:'force-sharing',why:'Upper trapezius and serratus participate in the force-sharing needed for upward rotation during arm elevation.',sourceIds:['trapezius_statpearls','serratus_statpearls']},
  {from:'lower-trapezius',to:'serratus-anterior',kind:'force-sharing',why:'Lower trapezius and serratus contribute to coordinated scapular upward rotation and control rather than functioning as isolated substitutes.',sourceIds:['trapezius_statpearls','serratus_statpearls']},
  {from:'levator-scapulae',to:'cervical-region',kind:'cervicoscapular-link',why:'Levator scapulae spans cervical transverse processes to the scapula, directly linking neck and scapular mechanics.',sourceIds:['levator_statpearls']}
];
window.NMT_DATA.getRelations = function(id){ return this.RELATIONSHIPS.filter(r=>r.from===id||r.to===id); };
window.NMT_DATA.getEntityName = function(id){ return this.MUSCLES.find(x=>x.id===id)?.name || this.STRUCTURES.find(x=>x.id===id)?.name || id.replaceAll('-',' '); };
