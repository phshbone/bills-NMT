window.NMT_DATA.INTERVENTION_RESOURCES={
  hss_low_back:{name:'HSS — Stretches and Exercises for Lower Back Pain',publisher:'Hospital for Special Surgery',url:'https://www.hss.edu/health-library/move-better/exercises-for-lower-back-pain'},
  hss_hip_flexor:{name:'HSS — Hip Flexor Stretches',publisher:'Hospital for Special Surgery',url:'https://www.hss.edu/health-library/move-better/hip-flexor-stretch'},
  hss_hip_strength:{name:'HSS — Hip Strengthening Exercises',publisher:'Hospital for Special Surgery',url:'https://www.hss.edu/health-library/move-better/hip-strengthening-exercises'},
  hss_back_strength:{name:'HSS — Back Exercises to Strengthen and Stretch',publisher:'Hospital for Special Surgery',url:'https://www.hss.edu/health-library/move-better/best-back-exercises'},
  choosept_low_back:{name:'ChoosePT — Physical Therapy Guide to Low Back Pain',publisher:'American Physical Therapy Association / ChoosePT',url:'https://www.choosept.com/guide/physical-therapy-guide-low-back-pain'},
  choosept_shoulder:{name:'ChoosePT — Shoulder movement and strengthening guidance',publisher:'American Physical Therapy Association / ChoosePT',url:'https://www.choosept.com/guide/physical-therapy-guide-shoulder-impingement'}
};

window.NMT_DATA.INTERVENTIONS={
  'iliopsoas':{
    why:'Hip-flexor contribution is worth comparing when standing upright or hip extension is limited, especially when hip position changes the back complaint. This does not establish that the iliopsoas is the cause.',
    options:[
      {kind:'mobility',title:'Gentle hip-flexor mobility',detail:'Explore a comfortable hip-extension position without forcing the lumbar spine into more extension.',reassess:'Does standing upright or hip extension feel easier, smoother, or unchanged afterward?',moveId:'hip-extension',resources:['hss_hip_flexor','hss_low_back']},
      {kind:'activation / control',title:'Active hip extension with trunk control',detail:'Follow tolerable mobility with low-load hip-extension control rather than relying on stretching alone.',reassess:'Can the hip extend with less lumbar substitution?',moveId:'hip-extension',resources:['hss_hip_strength']},
      {kind:'integrated movement',title:'Easy walking or repeated position changes',detail:'If prolonged sitting aggravates the pattern, compare symptoms after gentle movement rather than staying in one position.',reassess:'Does walking or changing position alter the complaint?',resources:['choosept_low_back']}
    ]
  },
  'quadratus-lumborum':{
    why:'QL is worth comparing when rib-to-pelvis loading, side-bending, asymmetry, or lower-flank symptoms fit the current findings. Local tenderness alone is not enough.',
    options:[
      {kind:'movement comparison',title:'Gentle side-bending comparison',detail:'Compare small, comfortable side-bending ranges rather than aggressively stretching the sore side.',reassess:'Is one direction smoother or does the symptom location change?',moveId:'side-bending',resources:['hss_low_back']},
      {kind:'control',title:'Low-load trunk and pelvic control',detail:'Use supported movement that keeps the rib cage and pelvis controlled before adding resistance.',reassess:'Does upright posture or gait feel less guarded afterward?',resources:['hss_back_strength','choosept_low_back']}
    ]
  },
  'lumbar-erectors':{
    why:'Lumbar extensor involvement is worth comparing when extension, returning upright, or prolonged postural loading changes the complaint. Guarding can coexist with weakness or overload.',
    options:[
      {kind:'load modification',title:'Temporarily reduce provocative extension loading',detail:'Back off the specific movement or position that repeatedly increases symptoms while maintaining tolerable activity.',reassess:'Does baseline irritation settle when the provoking load is reduced?',resources:['choosept_low_back']},
      {kind:'mobility / control',title:'Comfortable lumbar movement',detail:'Explore small pain-tolerable flexion/extension and return-to-neutral rather than bracing continuously.',reassess:'Is the return to upright smoother or less guarded?',resources:['hss_low_back']},
      {kind:'endurance',title:'Progress trunk endurance only after tolerable motion returns',detail:'Build low-load control before heavier or prolonged extension work.',reassess:'Can you maintain posture with less fatigue or guarding?',resources:['hss_back_strength']}
    ]
  },
  'multifidus':{
    why:'Multifidus is considered as part of segmental control, not as an isolated diagnosis that can be confirmed from symptoms alone.',
    options:[
      {kind:'motor control',title:'Low-load trunk control',detail:'Use comfortable supported positions to practice controlled spinal movement without excessive bracing.',reassess:'Does movement become smoother or more symmetrical?',moveId:'quadruped-rocking',resources:['hss_back_strength','choosept_low_back']}
    ]
  },
  'gluteus-maximus':{
    why:'Gluteal contribution is worth comparing when hip extension is limited or lumbar extension appears to substitute for hip motion.',
    options:[
      {kind:'activation / strength',title:'Controlled hip extension',detail:'Practice hip extension in a range where the pelvis and lumbar spine can remain relatively controlled.',reassess:'Can you create hip extension with less back substitution?',moveId:'hip-extension',resources:['hss_hip_strength']}
    ]
  },
  'gluteus-medius':{
    why:'Gluteus medius is worth comparing when pelvic drop, trunk lean, single-leg control, or gait findings are present.',
    options:[
      {kind:'control / strength',title:'Supported lateral hip control',detail:'Begin with low-load supported control before progressing to harder single-leg or lateral movement.',reassess:'Does pelvic control improve without increased back or hip symptoms?',resources:['hss_hip_strength']}
    ]
  },
  'hamstrings':{
    why:'A feeling of hamstring tightness does not automatically mean the tissue needs stretching; hip, pelvic, neural, and active-control factors can overlap.',
    options:[
      {kind:'mobility comparison',title:'Gentle hamstring mobility only if the pattern supports it',detail:'Use a comfortable range and avoid forcing neural-type pulling, tingling, or numbness.',reassess:'Does hip movement improve without increasing distal symptoms?',resources:['hss_low_back']},
      {kind:'strength / control',title:'Controlled hip extension',detail:'Compare active hip-extension control rather than relying only on passive flexibility.',reassess:'Does the posterior chain feel more coordinated during standing or gait?',moveId:'hip-extension',resources:['hss_hip_strength']}
    ]
  },
  'serratus-anterior':{
    why:'Serratus is worth comparing when scapular winging, early shrugging, or overhead/pull-up mechanics fit the current findings. This does not by itself identify nerve injury or a single painful structure.',
    options:[
      {kind:'load modification',title:'Reduce irritating pull-up or hanging volume temporarily',detail:'Keep comfortable shoulder activity while reducing the movement that repeatedly provokes the region.',reassess:'Does baseline irritation or scapular control improve when provocative volume is reduced?',resources:['choosept_shoulder']},
      {kind:'motor control',title:'Pain-tolerable scapular protraction control',detail:'Use a wall or other easy closed-chain position before harder loading.',reassess:'Does winging or early shrugging change?',moveId:'push-up-plus',resources:['choosept_shoulder']},
      {kind:'integrated movement',title:'Wall-slide progression',detail:'Use a comfortable wall slide to compare serratus/trapezius coordination during elevation.',reassess:'Is arm elevation smoother with less shrugging?',moveId:'wall-slide',resources:['choosept_shoulder']}
    ]
  },
  'lower-trapezius':{
    why:'Lower trapezius is considered as part of scapular force-sharing with serratus rather than as an isolated muscle that must simply be strengthened.',
    options:[
      {kind:'motor control',title:'Low-load scapular upward-rotation control',detail:'Coordinate with serratus during comfortable arm elevation rather than chasing isolated activation.',reassess:'Does arm elevation become smoother with less early shrugging?',moveId:'wall-slide',resources:['choosept_shoulder']}
    ]
  },
  'upper-trapezius':{
    why:'Perceived upper-trapezius tightness may reflect load, guarding, compensation, or useful force production; it does not automatically mean stretching is the correct intervention.',
    options:[
      {kind:'movement comparison',title:'Compare shrug strategy during arm elevation',detail:'Slow the movement and compare what happens when scapular control changes rather than forcing a stretch.',reassess:'Does the shoulder elevate later or more smoothly?',moveId:'wall-slide',resources:['choosept_shoulder']}
    ]
  },
  'levator-scapulae':{
    why:'Levator is worth comparing when cervical motion and scapular elevation interact, but neck tightness alone does not establish that it is shortened or causal.',
    options:[
      {kind:'mobility / control',title:'Gentle cervical and scapular motion',detail:'Use comfortable active movement and reduce unnecessary shrugging rather than aggressive stretching.',reassess:'Does cervical rotation or side-bending change after the scapular position changes?',resources:['choosept_shoulder']}
    ]
  },
  'scalenes':{
    why:'Scalenes are worth comparing when cervical motion, upper-rib behavior, breathing strategy, and nearby neural symptoms overlap. Aggressive stretching is inappropriate when neurological symptoms are present.',
    options:[
      {kind:'mobility / breathing',title:'Gentle cervical motion and relaxed rib-cage breathing',detail:'Explore comfortable neck motion and breathing without forcing end range.',reassess:'Does cervical motion or upper-rib tension change?',resources:[]}
    ]
  },
  'rotator-cuff':{
    why:'Rotator-cuff contribution is worth comparing when shoulder rotation/control and scapular mechanics affect symptoms; pain location alone is not specific.',
    options:[
      {kind:'strength / control',title:'Pain-tolerable shoulder rotation control',detail:'Begin with low-load control and progress only if symptoms remain tolerable.',reassess:'Does shoulder control improve without increasing pain?',resources:['choosept_shoulder']}
    ]
  },
  'pectoralis-minor':{
    why:'Pectoralis minor is worth comparing when anterior scapular position and overhead mechanics fit the findings; a rounded shoulder posture alone does not establish tightness.',
    options:[
      {kind:'mobility + control',title:'Position-sensitive chest mobility paired with scapular control',detail:'Use comfortable mobility, then reassess active scapular motion instead of stretching in isolation.',reassess:'Does overhead motion or scapular position change?',moveId:'wall-slide',resources:['choosept_shoulder']}
    ]
  }
};

window.NMT_DATA.getInterventionProfile=function(id){return this.INTERVENTIONS[id]||null;};
