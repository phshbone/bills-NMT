(function(){
const D=window.NMT_DATA;
D.VISUALS={
  planes:{title:'Planes of motion',alt:'Retro instructional line drawing showing sagittal, frontal, and transverse anatomical planes with example motions.'},
  movement:{
    'hip-extension':{title:'Hip flexion → extension',note:'A common real-world example is rising from sitting. The hip moves from flexion toward extension; iliopsoas lengthens as extension increases and is not the primary hip extensor.',frames:['Sitting / flexed','Rising','Upright / extension']},
    'squat':{title:'Squat sequence',note:'The squat moves through coordinated hip, knee, and ankle flexion on the way down and extension on the return. Trunk and frontal/transverse control help keep the movement organized.',frames:['Stand','Descend','Bottom','Return']},
    'cervical-rotation':{title:'Cervical rotation',note:'Compare comfortable head turning side to side while the shoulders and trunk stay relatively quiet. The goal is to observe available motion, not force end range.',frames:['Neutral','Turn right','Turn left']},
    'side-bending':{title:'Trunk side-bending',note:'Side-bending is mainly a frontal-plane trunk motion. Compare the two sides without adding a large twist or pelvic shift.',frames:['Neutral','Side-bend','Return']},
    'thoracic-rotation':{title:'Thoracic rotation',note:'Rotate through the upper trunk while trying to keep the pelvis relatively quiet. This helps distinguish thoracic motion from whole-body turning.',frames:['Neutral','Rotate','Return']},
    'wall-slide':{title:'Wall slide / upward rotation',note:'As the arms rise, the scapulae need coordinated upward rotation and control rather than an early shrug. The drawing is an orientation aid, not a diagnostic test.',frames:['Start','Mid-range','Overhead']}
  }
};

const STYLE=`
.paper{fill:#fbf7ed}.ink{fill:none;stroke:#1e2430;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.soft{fill:none;stroke:#7a827f;stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round}
.joint{fill:#fbf7ed;stroke:#1e2430;stroke-width:1.5}.plane{stroke:#68776e;stroke-width:1.6;fill:#dfe6df;fill-opacity:.62}
.plane.blue{fill:#e1eaec}.arrow{fill:none;stroke:#4f6f56;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round}
.arrowHead{fill:none;stroke:#4f6f56;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round}
.label{fill:#1e2430;font:700 15px ui-rounded,system-ui,sans-serif;letter-spacing:.02em}.smallLabel{fill:#5b625f;font:13px system-ui,sans-serif}
`;
function arrow(x1,y1,x2,y2){return `<path class="arrow" d="M ${x1} ${y1} L ${x2} ${y2}"/><path class="arrowHead" d="M ${x2-8} ${y2-6} L ${x2} ${y2} L ${x2-8} ${y2+6}"/>`}
function articulated(x,y=0,opts={}){
  const lean=opts.lean||0, crouch=opts.crouch||0, arm=opts.arm||'down', headTurn=opts.headTurn||0;
  const hx=x+lean, headY=38+y+crouch*.35, shoulderY=72+y+crouch*.2, chestY=100+y+crouch*.4, pelvisY=137+y+crouch, kneeY=180+y+crouch*.55, ankleY=222+y;
  const torsoCx=x+lean*.45;
  const shoulderL={x:hx-18,y:shoulderY}, shoulderR={x:hx+18,y:shoulderY};
  let elbowL={x:x-31,y:112+y}, elbowR={x:x+31,y:112+y}, handL={x:x-35,y:151+y}, handR={x:x+35,y:151+y};
  if(arm==='mid'){elbowL={x:x-40,y:88+y}; elbowR={x:x+40,y:88+y}; handL={x:x-52,y:57+y}; handR={x:x+52,y:57+y};}
  if(arm==='up'){elbowL={x:x-26,y:55+y}; elbowR={x:x+26,y:55+y}; handL={x:x-18,y:18+y}; handR={x:x+18,y:18+y};}
  if(opts.sit){
    return `<g>
      <ellipse class="ink" cx="${hx+headTurn}" cy="${headY+20}" rx="13" ry="17"/><path class="soft" d="M ${hx+headTurn-8} ${headY+20} L ${hx+headTurn+8} ${headY+20}"/>
      <ellipse class="ink" cx="${torsoCx}" cy="${chestY+12}" rx="18" ry="30"/><ellipse class="ink" cx="${x}" cy="${pelvisY}" rx="17" ry="13"/>
      <circle class="joint" cx="${shoulderL.x}" cy="${shoulderL.y}" r="4"/><circle class="joint" cx="${shoulderR.x}" cy="${shoulderR.y}" r="4"/>
      <path class="ink" d="M ${shoulderL.x} ${shoulderL.y} L ${elbowL.x} ${elbowL.y} L ${handL.x} ${handL.y}"/><path class="ink" d="M ${shoulderR.x} ${shoulderR.y} L ${elbowR.x} ${elbowR.y} L ${handR.x} ${handR.y}"/>
      <circle class="joint" cx="${elbowL.x}" cy="${elbowL.y}" r="3.4"/><circle class="joint" cx="${elbowR.x}" cy="${elbowR.y}" r="3.4"/>
      <circle class="joint" cx="${x}" cy="${pelvisY}" r="4.2"/>
      <path class="ink" d="M ${x} ${pelvisY} L ${x+38} ${pelvisY+10} L ${x+39} ${kneeY-4}"/><path class="ink" d="M ${x-3} ${pelvisY+2} L ${x+17} ${pelvisY+19} L ${x+13} ${kneeY+2}"/>
      <circle class="joint" cx="${x+39}" cy="${kneeY-4}" r="4"/><circle class="joint" cx="${x+13}" cy="${kneeY+2}" r="4"/>
      <path class="ink" d="M ${x+39} ${kneeY} L ${x+44} ${ankleY}"/><path class="ink" d="M ${x+13} ${kneeY+6} L ${x+9} ${ankleY}"/>
      <path class="soft" d="M ${x+5} ${pelvisY-11} L ${torsoCx-8} ${chestY+27}"/>
    </g>`;
  }
  const hipL={x:x-8,y:pelvisY}, hipR={x:x+8,y:pelvisY};
  const kneeL={x:x-12-(opts.kneeOut||0),y:kneeY}, kneeR={x:x+12+(opts.kneeOut||0),y:kneeY};
  const ankleL={x:x-14,y:ankleY}, ankleR={x:x+14,y:ankleY};
  return `<g>
    <ellipse class="ink" cx="${hx+headTurn}" cy="${headY}" rx="13" ry="17"/><path class="soft" d="M ${hx+headTurn-8} ${headY} L ${hx+headTurn+8} ${headY}"/>
    <ellipse class="ink" cx="${torsoCx}" cy="${chestY}" rx="18" ry="30"/><ellipse class="ink" cx="${x}" cy="${pelvisY}" rx="17" ry="13"/>
    <circle class="joint" cx="${shoulderL.x}" cy="${shoulderL.y}" r="4"/><circle class="joint" cx="${shoulderR.x}" cy="${shoulderR.y}" r="4"/>
    <path class="ink" d="M ${shoulderL.x} ${shoulderL.y} L ${elbowL.x} ${elbowL.y} L ${handL.x} ${handL.y}"/><path class="ink" d="M ${shoulderR.x} ${shoulderR.y} L ${elbowR.x} ${elbowR.y} L ${handR.x} ${handR.y}"/>
    <circle class="joint" cx="${elbowL.x}" cy="${elbowL.y}" r="3.4"/><circle class="joint" cx="${elbowR.x}" cy="${elbowR.y}" r="3.4"/>
    <path class="ink" d="M ${hipL.x} ${hipL.y} L ${kneeL.x} ${kneeL.y} L ${ankleL.x} ${ankleL.y}"/><path class="ink" d="M ${hipR.x} ${hipR.y} L ${kneeR.x} ${kneeR.y} L ${ankleR.x} ${ankleR.y}"/>
    <circle class="joint" cx="${hipL.x}" cy="${hipL.y}" r="4"/><circle class="joint" cx="${hipR.x}" cy="${hipR.y}" r="4"/><circle class="joint" cx="${kneeL.x}" cy="${kneeL.y}" r="4"/><circle class="joint" cx="${kneeR.x}" cy="${kneeR.y}" r="4"/>
    <path class="ink" d="M ${ankleL.x-5} ${ankleL.y} L ${ankleL.x+5} ${ankleL.y}"/><path class="ink" d="M ${ankleR.x-5} ${ankleR.y} L ${ankleR.x+5} ${ankleR.y}"/>
  </g>`;
}
function svg(inner,W=720,H=270,label='Movement sequence'){return `<svg class="movement-sequence-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><style>${STYLE}</style><rect class="paper" x="0" y="0" width="${W}" height="${H}" rx="14"/>${inner}</svg>`}
D.planesReferenceSvg=function(){
  return `<svg class="planes-reference-svg" viewBox="0 0 900 390" role="img" aria-label="${D.VISUALS.planes.alt}"><style>${STYLE}</style><rect class="paper" width="900" height="390" rx="16"/>
  <text class="label" x="150" y="28" text-anchor="middle">SAGITTAL PLANE</text><polygon class="plane blue" points="96,74 190,56 190,286 96,272"/>${articulated(143,14)}
  <text class="label" x="450" y="28" text-anchor="middle">FRONTAL PLANE</text><polygon class="plane" points="340,75 560,75 560,286 340,286"/>${articulated(450,14)}
  <text class="label" x="750" y="28" text-anchor="middle">TRANSVERSE PLANE</text><polygon class="plane blue" points="635,184 750,152 865,184 750,216"/>${articulated(750,14)}
  <text class="smallLabel" x="150" y="365" text-anchor="middle">flexion / extension</text><text class="smallLabel" x="450" y="365" text-anchor="middle">abduction / adduction / side-bending</text><text class="smallLabel" x="750" y="365" text-anchor="middle">rotation</text></svg>`;
};
function sequence(id,cfg){
  if(id==='hip-extension'){
    const xs=[110,350,590];
    return svg(`${articulated(xs[0],0,{sit:true,lean:12})}${articulated(xs[1],0,{lean:12,crouch:18})}${articulated(xs[2])}${arrow(190,130,270,130)}${arrow(430,130,510,130)}
      <text class="smallLabel" x="110" y="252" text-anchor="middle">${cfg.frames[0]}</text><text class="smallLabel" x="350" y="252" text-anchor="middle">${cfg.frames[1]}</text><text class="smallLabel" x="590" y="252" text-anchor="middle">${cfg.frames[2]}</text>`,720,270,cfg.title);
  }
  if(id==='squat'){
    const xs=[85,265,455,635];
    return svg(`${articulated(xs[0])}${articulated(xs[1],0,{crouch:14,lean:8,kneeOut:5})}${articulated(xs[2],0,{crouch:28,lean:10,kneeOut:10})}${articulated(xs[3])}${arrow(145,125,205,125)}${arrow(325,125,395,125)}${arrow(515,125,575,125)}${xs.map((x,i)=>`<text class="smallLabel" x="${x}" y="252" text-anchor="middle">${cfg.frames[i]}</text>`).join('')}`,720,270,cfg.title);
  }
  const xs=[120,360,600]; let people='';
  if(id==='wall-slide') people=articulated(xs[0],0,{arm:'down'})+articulated(xs[1],0,{arm:'mid'})+articulated(xs[2],0,{arm:'up'});
  else if(id==='side-bending') people=articulated(xs[0])+articulated(xs[1],0,{lean:22})+articulated(xs[2]);
  else if(id==='cervical-rotation') people=articulated(xs[0])+articulated(xs[1],0,{headTurn:9})+articulated(xs[2],0,{headTurn:-9});
  else if(id==='thoracic-rotation') people=articulated(xs[0])+articulated(xs[1],0,{lean:4})+articulated(xs[2]);
  const extras=id==='thoracic-rotation'?`<ellipse class="soft" cx="360" cy="102" rx="42" ry="15"/><path class="arrow" d="M 322 102 Q 360 76 398 102"/>`:id==='cervical-rotation'?`<path class="arrow" d="M 325 42 Q 360 20 395 42"/><path class="arrow" d="M 565 42 Q 600 64 635 42"/>`:'';
  return svg(`${people}${extras}${arrow(195,125,285,125)}${arrow(435,125,525,125)}${xs.map((x,i)=>`<text class="smallLabel" x="${x}" y="252" text-anchor="middle">${cfg.frames[i]}</text>`).join('')}`,720,270,cfg.title);
}
D.visualSequenceSvg=function(id){const cfg=D.VISUALS.movement[id];return cfg?sequence(id,cfg):''};
})();