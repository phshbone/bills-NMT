Object.assign(window.NMT_DATA.SOURCES,{
  "levator_statpearls":{"id":"levator_statpearls","title":"Anatomy, Head and Neck, Levator Scapulae Muscles","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK553120/","type":"current anatomy reference"},
  "scm_statpearls":{"id":"scm_statpearls","title":"Anatomy, Head and Neck: Sternocleidomastoid Muscle","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK532881/","type":"current anatomy reference"},
  "trapezius_statpearls":{"id":"trapezius_statpearls","title":"Anatomy, Back, Trapezius","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK518994/","type":"current anatomy reference"},
  "latissimus_statpearls":{"id":"latissimus_statpearls","title":"Anatomy, Back, Latissimus Dorsi","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK448120/","type":"current anatomy reference"},
  "shoulder_muscles_statpearls":{"id":"shoulder_muscles_statpearls","title":"Anatomy, Shoulder and Upper Limb, Shoulder Muscles","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK534836/","type":"current anatomy reference"},
  "neck_movements_statpearls":{"id":"neck_movements_statpearls","title":"Anatomy, Head and Neck, Neck Movements","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK557555/","type":"current anatomy reference"},
  "pelvic_joints_statpearls":{"id":"pelvic_joints_statpearls","title":"Anatomy, Bony Pelvis and Lower Limb: Pelvic Joints","publisher":"StatPearls / NCBI Bookshelf","url":"https://www.ncbi.nlm.nih.gov/books/NBK538523/","type":"current anatomy reference"}
});

const provenance={
  "scalenes":["neck_movements_statpearls"],
  "sternocleidomastoid":["scm_statpearls"],
  "levator-scapulae":["levator_statpearls"],
  "upper-trapezius":["trapezius_statpearls"],
  "middle-trapezius":["trapezius_statpearls"],
  "lower-trapezius":["trapezius_statpearls"],
  "pectoralis-minor":["pectoral_statpearls","shoulder_muscles_statpearls"],
  "latissimus-dorsi":["latissimus_statpearls"],
  "rotator-cuff":["shoulder_muscles_statpearls"],
  "quadratus-lumborum":["lumbar_statpearls"],
  "lumbar-erectors":["lumbar_statpearls","pelvic_joints_statpearls"],
  "multifidus":["lumbar_statpearls","pelvic_joints_statpearls"],
  "gluteus-maximus":["pelvic_joints_statpearls"],
  "gluteus-medius":["pelvic_joints_statpearls"],
  "hamstrings":["pelvic_joints_statpearls"],
  "rectus-femoris":["pelvic_joints_statpearls"]
};
Object.entries(provenance).forEach(([id,sourceIds])=>{
  const muscle=window.NMT_DATA.MUSCLES.find(item=>item.id===id);
  if(muscle) muscle.sourceIds=[...new Set([...(muscle.sourceIds||[]),...sourceIds])];
});
