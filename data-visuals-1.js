(function(){
const D=window.NMT_DATA;
D.VISUALS={
  planes:{title:'Planes of motion',alt:'Line drawing reference showing sagittal, frontal, and transverse anatomical planes with example motions.'},
  movement:{
    'hip-extension':{title:'Hip flexion → extension',note:'A common real-world example is rising from sitting. The hip moves from flexion toward extension; iliopsoas lengthens as extension increases and is not the primary hip extensor.',frames:['Sitting / flexed','Rising','Upright / extension']},
    'squat':{title:'Squat sequence',note:'The squat moves through coordinated hip, knee, and ankle flexion on the way down and extension on the return. Trunk and frontal/transverse control help keep the movement organized.',frames:['Stand','Descend','Bottom','Return']},
    'cervical-rotation':{title:'Cervical rotation',note:'Compare comfortable head turning side to side while the shoulders and trunk stay relatively quiet. The goal is to observe available motion, not force end range.',frames:['Neutral','Turn right','Turn left']},
    'side-bending':{title:'Trunk side-bending',note:'Side-bending is mainly a frontal-plane trunk motion. Compare the two sides without adding a large twist or pelvic shift.',frames:['Neutral','Side-bend','Return']},
    'thoracic-rotation':{title:'Thoracic rotation',note:'Rotate through the upper trunk while trying to keep the pelvis relatively quiet. This helps distinguish thoracic motion from whole-body turning.',frames:['Neutral','Rotate','Return']},
    'wall-slide':{title:'Wall slide / upward rotation',note:'As the arms rise, the scapulae need coordinated upward rotation and control rather than an early shrug. The drawing is an orientation aid, not a diagnostic test.',frames:['Start','Mid-range','Overhead']}
  }
};
D.planesReferenceSvg=function(){
  const person=(x,y)=>`<g transform="translate(${x} ${y})" class="pfig"><circle cx="0" cy="-52" r="11"/><ellipse cx="0" cy="-18" rx="15" ry="25"/><ellipse cx="0" cy="20" rx="14" ry="18"/><path d="M -11 -31 L -22 3 M 11 -31 L 22 3 M -7 36 L -10 76 M 7 36 L 10 76"/><circle cx="-10" cy="76" r="3"/><circle cx="10" cy="76" r="3"/></g>`;
  return `<svg class="planes-reference-svg" viewBox="0 0 900 360" role="img" aria-label="${D.VISUALS.planes.alt}"><style>.pfig{fill:none;stroke:#17233b;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.plane{stroke:#526b61;stroke-width:2;fill:#dfe7df;fill-opacity:.55}.plane.blue{fill:#dfe7eb}.lbl{fill:#17233b;font:700 23px system-ui,sans-serif;letter-spacing:.04em}.sub{fill:#4f5d68;font:15px system-ui,sans-serif}.motion{fill:none;stroke:#4d7545;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}</style><g><text class="lbl" x="150" y="32" text-anchor="middle">SAGITTAL</text><text class="sub" x="150" y="55" text-anchor="middle">forward / backward</text><polygon class="plane blue" points="92,75 190,58 190,300 92,280"/>${person(142,180)}<path class="motion" d="M 58 290 Q 78 315 102 290 M 102 290 l -10 -3 M 102 290 l -5 10"/></g><g><text class="lbl" x="450" y="32" text-anchor="middle">FRONTAL</text><text class="sub" x="450" y="55" text-anchor="middle">side to side</text><polygon class="plane" points="335,78 565,78 565,292 335,292"/>${person(450,180)}<path class="motion" d="M 392 302 Q 450 326 508 302 M 392 302 l 8 -8 M 508 302 l -8 -8"/></g><g><text class="lbl" x="750" y="32" text-anchor="middle">TRANSVERSE</text><text class="sub" x="750" y="55" text-anchor="middle">rotation</text><polygon class="plane blue" points="630,190 750,158 870,190 750,222"/>${person(750,180)}<path class="motion" d="M 682 280 Q 750 318 818 280 M 682 280 l 10 -6 M 818 280 l -10 -6"/></g></svg>`;
};
function commonSvg(inner,W=700,H=230,label='Movement sequence'){
  return `<svg class="movement-sequence-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><style>.figure{fill:none;stroke:#17233b;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.figure text{fill:#17233b;stroke:none;font:15px system-ui,sans-serif}.guide{fill:none;stroke:#7d8994;stroke-width:1.6;stroke-dasharray:5 5}.arrow,.arrow-head{fill:none;stroke:#4d7545;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.soft{fill:none;stroke:#526b61;stroke-width:2}.chair{stroke:#596579}</style>${inner}</svg>`;
}
function basicPerson(x,lean=0,arms='down'){
  const hx=x+lean;
  let armPaths=`<path d="M ${hx-8} 92 L ${x-28} 130"/><path d="M ${hx+8} 92 L ${x+28} 130"/>`;
  if(arms==='mid')armPaths=`<path d="M ${hx-8} 92 L ${x-35} 82 L ${x-45} 56"/><path d="M ${hx+8} 92 L ${x+35} 82 L ${x+45} 56"/>`;
  if(arms==='up')armPaths=`<path d="M ${hx-8} 92 L ${x-20} 58 L ${x-14} 24"/><path d="M ${hx+8} 92 L ${x+20} 58 L ${x+14} 24"/>`;
  return `<g class="figure"><circle cx="${hx}" cy="55" r="15"/><path d="M ${hx} 70 L ${x} 130"/><ellipse cx="${x+lean/2}" cy="103" rx="22" ry="31"/>${armPaths}<path d="M ${x} 130 L ${x-10} 195"/><path d="M ${x} 130 L ${x+10} 195"/></g>`;
}
function hipSquatSvg(id,cfg){
  const hip=id==='hip-extension',W=hip?600:760,H=230,positions=hip?[115,300,485]:[95,285,475,665];
  function person(x,phase,label){
    let headY=55,bodyY=82,hipY=125,kneeY=165,footY=200;
    if(id==='squat'&&(phase===1||phase===2)){headY=phase===2?92:74;bodyY=phase===2?112:96;hipY=phase===2?145:135;kneeY=phase===2?164:160;}
    if(hip&&phase===0){headY=70;bodyY=96;hipY=132;kneeY=150;footY=188;} if(hip&&phase===1){headY=62;bodyY=88;hipY=130;kneeY=164;footY=198;}
    const lean=(hip&&phase===1)?18:((id==='squat'&&phase>0&&phase<3)?10:0),torsoX=x+lean;
    let legs='';
    if(hip&&phase===0){legs=`<path d="M ${x} ${hipY} L ${x+34} ${kneeY} L ${x+58} ${footY}"/><path d="M ${x} ${hipY} L ${x+6} ${kneeY} L ${x-4} ${footY}"/>`}
    else if(id==='squat'&&(phase===1||phase===2)){legs=`<path d="M ${x} ${hipY} L ${x+30} ${kneeY} L ${x+14} ${footY}"/><path d="M ${x} ${hipY} L ${x-28} ${kneeY} L ${x-10} ${footY}"/>`}
    else {legs=`<path d="M ${x} ${hipY} L ${x+8} ${kneeY} L ${x+12} ${footY}"/><path d="M ${x} ${hipY} L ${x-8} ${kneeY} L ${x-12} ${footY}"/>`}
    const chair=hip&&phase===0?`<path class="chair" d="M ${x-48} 125 L ${x-10} 125 L ${x-10} 190 M ${x-48} 125 L ${x-48} 190 M ${x-48} 125 L ${x-48} 72"/>`:'';
    return `<g class="figure">${chair}<circle cx="${torsoX}" cy="${headY}" r="15"/><path d="M ${torsoX} ${headY+15} L ${x} ${hipY}"/><ellipse cx="${x+lean/2}" cy="${bodyY+18}" rx="22" ry="31"/><circle cx="${x}" cy="${hipY}" r="7"/>${legs}<path d="M ${torsoX-7} ${bodyY} L ${x-28} ${bodyY+40}"/><path d="M ${torsoX+7} ${bodyY} L ${x+28} ${bodyY+38}"/><text x="${x}" y="220" text-anchor="middle">${label}</text></g>`;
  }
  const figs=positions.map((x,i)=>person(x,i,cfg.frames[i])).join('');
  const arrows=positions.slice(0,-1).map((x,i)=>`<path class="arrow" d="M ${x+72} 120 L ${positions[i+1]-72} 120"/><path class="arrow-head" d="M ${positions[i+1]-82} 112 L ${positions[i+1]-72} 120 L ${positions[i+1]-82} 128"/>`).join('');
  return commonSvg(arrows+figs,W,H,cfg.title);
}
function threeFrameSvg(id,cfg){
  const xs=[120,350,580];
  if(id==='wall-slide'){
    const inner=xs.map((x,i)=>`${basicPerson(x,0,i===0?'down':i===1?'mid':'up')}<text class="figure" x="${x}" y="220" text-anchor="middle">${cfg.frames[i]}</text>`).join('')+`<path class="guide" d="M 75 20 L 75 200 M 305 20 L 305 200 M 535 20 L 535 200"/><path class="arrow" d="M 170 118 L 265 118 M 400 118 L 495 118"/>`;
    return commonSvg(inner,700,230,cfg.title);
  }
  if(id==='side-bending'){
    const leans=[0,24,0];
    const inner=xs.map((x,i)=>`${basicPerson(x,leans[i])}<text class="figure" x="${x}" y="220" text-anchor="middle">${cfg.frames[i]}</text>`).join('')+`<path class="arrow" d="M 170 118 L 265 118 M 400 118 L 495 118"/>`;
    return commonSvg(inner,700,230,cfg.title);
  }
  if(id==='cervical-rotation'){
    const turns=[0,10,-10];
    const inner=xs.map((x,i)=>`${basicPerson(x)}<g class="soft"><path d="M ${x-24} 45 Q ${x} ${32+turns[i]/2} ${x+24} 45"/>${i?`<path class="arrow" d="M ${x-31} 40 Q ${x} 18 ${x+31} 40"/>`:''}</g><text class="figure" x="${x}" y="220" text-anchor="middle">${cfg.frames[i]}</text>`).join('')+`<path class="arrow" d="M 170 118 L 265 118 M 400 118 L 495 118"/>`;
    return commonSvg(inner,700,230,cfg.title);
  }
  if(id==='thoracic-rotation'){
    const inner=xs.map((x,i)=>`${basicPerson(x)}${i===1?`<ellipse class="soft" cx="${x}" cy="102" rx="42" ry="15"/><path class="arrow" d="M ${x-38} 102 Q ${x} 74 ${x+38} 102"/>`:''}<text class="figure" x="${x}" y="220" text-anchor="middle">${cfg.frames[i]}</text>`).join('')+`<path class="arrow" d="M 170 118 L 265 118 M 400 118 L 495 118"/>`;
    return commonSvg(inner,700,230,cfg.title);
  }
  return '';
}
D.visualSequenceSvg=function(id){
  const cfg=D.VISUALS.movement[id]; if(!cfg)return '';
  if(id==='hip-extension'||id==='squat')return hipSquatSvg(id,cfg);
  return threeFrameSvg(id,cfg);
};
})();
