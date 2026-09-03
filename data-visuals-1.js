(function(){
const D=window.NMT_DATA;
D.VISUALS={
  planes:{
    title:'Planes of motion',
    alt:'Line drawing reference showing sagittal, frontal, and transverse anatomical planes with example motions.',
    src:'data:image/webp;base64,UklGRiCeAABXRUJQVlA4IBSeAAAQRwKdASqEA6MCPpVGnkulo6MipBSqaLASiWlu8kb3P/P8wLO/UvJY'
  },
  movement:{
    'hip-extension':{
      title:'Hip flexion → extension',
      note:'A common real-world example is rising from sitting. The hip moves from flexion toward extension; iliopsoas lengthens as extension increases and is not the primary hip extensor.',
      frames:['Sitting / flexed','Rising','Upright / extension']
    },
    'squat':{
      title:'Squat sequence',
      note:'The squat moves through coordinated hip, knee, and ankle flexion on the way down and extension on the return. Trunk and frontal/transverse control help keep the movement organized.',
      frames:['Stand','Descend','Bottom','Return']
    }
  }
};

D.visualSequenceSvg=function(id){
  const cfg=D.VISUALS.movement[id]; if(!cfg)return '';
  const hip=id==='hip-extension';
  const W=hip?600:760,H=230;
  const positions=hip?[115,300,485]:[95,285,475,665];
  function person(x,phase,label){
    let headY=55,bodyY=82,hipY=125,kneeY=165,footY=200;
    if(id==='squat'&&(phase===1||phase===2)){headY=phase===2?92:74;bodyY=phase===2?112:96;hipY=phase===2?145:135;kneeY=phase===2?164:160;}
    if(hip&&phase===0){headY=70;bodyY=96;hipY=132;kneeY=150;footY=188;}
    if(hip&&phase===1){headY=62;bodyY=88;hipY=130;kneeY=164;footY=198;}
    const lean=(hip&&phase===1)?18:((id==='squat'&&phase>0&&phase<3)?10:0);
    const torsoX=x+lean;
    let legs='';
    if(hip&&phase===0){legs=`<path d="M ${x} ${hipY} L ${x+34} ${kneeY} L ${x+58} ${footY}"/><path d="M ${x} ${hipY} L ${x+6} ${kneeY} L ${x-4} ${footY}"/>`}
    else if(id==='squat'&&(phase===1||phase===2)){legs=`<path d="M ${x} ${hipY} L ${x+30} ${kneeY} L ${x+14} ${footY}"/><path d="M ${x} ${hipY} L ${x-28} ${kneeY} L ${x-10} ${footY}"/>`}
    else {legs=`<path d="M ${x} ${hipY} L ${x+8} ${kneeY} L ${x+12} ${footY}"/><path d="M ${x} ${hipY} L ${x-8} ${kneeY} L ${x-12} ${footY}"/>`}
    const chair=hip&&phase===0?`<path class="chair" d="M ${x-48} 125 L ${x-10} 125 L ${x-10} 190 M ${x-48} 125 L ${x-48} 190 M ${x-48} 125 L ${x-48} 72"/>`:'';
    return `<g class="figure">${chair}<circle cx="${torsoX}" cy="${headY}" r="15"/><path d="M ${torsoX} ${headY+15} L ${x} ${hipY}"/><ellipse cx="${x+lean/2}" cy="${bodyY+18}" rx="22" ry="31"/><circle cx="${x}" cy="${hipY}" r="7"/>${legs}<path d="M ${torsoX-7} ${bodyY} L ${x-28} ${bodyY+40}"/><path d="M ${torsoX+7} ${bodyY} L ${x+28} ${bodyY+38}"/><text x="${x}" y="220" text-anchor="middle">${label}</text></g>`;
  }
  const figs=positions.map((x,i)=>person(x,i,cfg.frames[i])).join('');
  const arrows=positions.slice(0,-1).map((x,i)=>`<path class="arrow" d="M ${x+72} 120 L ${positions[i+1]-72} 120"/><path class="arrow-head" d="M ${positions[i+1]-82} 112 L ${positions[i+1]-72} 120 L ${positions[i+1]-82} 128"/>`).join('');
  return `<svg class="movement-sequence-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${cfg.title}"><style>.figure{fill:none;stroke:#17233b;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.figure text{fill:#17233b;stroke:none;font:15px system-ui,sans-serif}.chair{stroke:#596579}.arrow,.arrow-head{fill:none;stroke:#4d7545;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}</style>${arrows}${figs}</svg>`;
};
})();
