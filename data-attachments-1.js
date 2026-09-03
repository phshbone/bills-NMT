(function(){
const D=window.NMT_DATA;
D.ATTACHMENTS={
  'serratus-anterior':{name:'Serratus anterior',region:'scapula-ribs',origin:'Upper lateral ribs',insertion:'Anterior medial scapular border / inferior angle',muscle:'M 150 88 C 185 105 205 145 218 198',o:[145,86],i:[220,198]},
  'scalenes':{name:'Scalenes',region:'neck-ribs',origin:'Cervical transverse processes',insertion:'First and second ribs',muscle:'M 182 58 C 168 92 164 120 160 162 M 202 62 C 194 96 190 128 186 168',o:[190,58],i:[174,166]},
  'sternocleidomastoid':{name:'Sternocleidomastoid',region:'neck-clavicle',origin:'Manubrium and medial clavicle',insertion:'Mastoid process',muscle:'M 170 170 C 178 128 192 92 214 55',o:[168,170],i:[214,55]},
  'levator-scapulae':{name:'Levator scapulae',region:'neck-scapula',origin:'C1–C4 transverse processes',insertion:'Superior medial border of scapula',muscle:'M 188 62 C 202 98 214 124 236 150',o:[188,62],i:[236,150]},
  'pectoralis-minor':{name:'Pectoralis minor',region:'chest-scapula',origin:'Ribs 3–5',insertion:'Coracoid process',muscle:'M 152 154 C 175 133 194 117 218 104',o:[152,154],i:[219,104]},
  'iliopsoas':{name:'Iliopsoas',region:'pelvis',origin:'Lumbar spine and iliac fossa',insertion:'Lesser trochanter',muscle:'M 178 55 C 178 102 186 138 207 190 M 145 118 C 169 135 188 158 207 190',o:[160,78],i:[208,191]},
  'quadratus-lumborum':{name:'Quadratus lumborum',region:'lumbar-rib',origin:'Iliac crest / iliolumbar ligament',insertion:'12th rib and lumbar transverse processes',muscle:'M 166 176 C 166 138 174 102 182 74',o:[166,176],i:[182,74]}
};

function bones(region){
  const common='<g class="bone"><path d="M 120 45 Q 170 20 220 45"/><path d="M 170 45 L 170 188"/></g>';
  if(region==='scapula-ribs'||region==='chest-scapula')return `<g class="bone"><path d="M 120 72 Q 168 42 220 72"/><path d="M 132 86 Q 162 104 132 122 M 137 116 Q 165 134 136 150 M 142 146 Q 168 164 143 178"/><path d="M 225 82 L 260 115 L 238 180 L 210 150 Z"/><circle cx="222" cy="102" r="5"/></g>`;
  if(region==='neck-ribs'||region==='neck-clavicle'||region==='neck-scapula')return `<g class="bone"><path d="M 176 42 L 176 126"/><path d="M 164 54 L 188 54 M 162 70 L 190 70 M 160 86 L 192 86 M 158 102 L 194 102"/><path d="M 128 164 Q 176 146 230 164"/><path d="M 132 178 Q 176 160 236 180"/>${region==='neck-scapula'?'<path d="M 230 120 L 262 146 L 242 198 L 212 158 Z"/>':''}<circle cx="208" cy="46" r="8"/></g>`;
  if(region==='pelvis')return `<g class="bone"><path d="M 132 110 Q 148 78 176 86 Q 205 78 226 110 L 218 162 Q 198 176 176 164 Q 154 176 134 162 Z"/><path d="M 176 48 L 176 116"/><path d="M 208 164 L 226 214"/><circle cx="210" cy="165" r="6"/></g>`;
  if(region==='lumbar-rib')return `<g class="bone"><path d="M 176 48 L 176 168"/><path d="M 158 62 L 194 62 M 156 82 L 196 82 M 154 102 L 198 102 M 152 122 L 200 122 M 150 142 L 202 142"/><path d="M 118 72 Q 174 48 236 72"/><path d="M 128 184 Q 176 162 224 184"/></g>`;
  return common;
}

D.attachmentSketchSvg=function(id){
  const a=D.ATTACHMENTS[id];if(!a)return '';
  return `<svg class="attachment-sketch" data-attachment-sketch="${id}" viewBox="0 0 360 250" role="img" aria-label="${a.name} origin and insertion orientation sketch"><style>.bone{fill:none;stroke:#c8bda8;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.muscle{fill:none;stroke:#a64f4b;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;opacity:.9}.label{font:700 14px system-ui,sans-serif;fill:#17233b}.mark{fill:#f7f5ef;stroke:#17233b;stroke-width:2}.oi{font:800 13px system-ui,sans-serif;fill:#17233b}.leader{stroke:#596579;stroke-width:1.5}.title{font:800 15px system-ui,sans-serif;fill:#9a6d3a;letter-spacing:.04em}</style><rect x="1" y="1" width="358" height="248" rx="18" fill="#fbf7ef" stroke="#ddd5c7"/><text class="title" x="18" y="24">ORIGIN + INSERTION</text>${bones(a.region)}<path class="muscle" d="${a.muscle}"/><line class="leader" x1="${a.o[0]}" y1="${a.o[1]}" x2="70" y2="58"/><circle class="mark" cx="${a.o[0]}" cy="${a.o[1]}" r="10"/><text class="oi" x="${a.o[0]}" y="${a.o[1]+5}" text-anchor="middle">O</text><text class="label" x="18" y="54">${a.origin}</text><line class="leader" x1="${a.i[0]}" y1="${a.i[1]}" x2="286" y2="214"/><circle class="mark" cx="${a.i[0]}" cy="${a.i[1]}" r="10"/><text class="oi" x="${a.i[0]}" y="${a.i[1]+5}" text-anchor="middle">I</text><text class="label" x="342" y="210" text-anchor="end">${a.insertion}</text></svg>`;
};
})();