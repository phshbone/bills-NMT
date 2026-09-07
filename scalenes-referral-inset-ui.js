(function(){
  const D=window.NMT_DATA;
  if(!D)return;

  const STYLE_ID='scalenes-referral-inset-style';
  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .anatomy-atlas[data-anatomy-atlas="scalenes"] .atlas-image-window{position:relative}
      .scalene-referral-inset{position:absolute;right:10px;bottom:10px;z-index:4;width:min(31%,180px);min-width:116px;padding:8px 8px 7px;border:1px solid rgba(112,86,73,.28);border-radius:14px;background:rgba(255,250,242,.95);box-shadow:0 8px 22px rgba(24,35,59,.14);color:#17233b;text-align:left;font:inherit;cursor:pointer;backdrop-filter:blur(2px)}
      .scalene-referral-inset strong{display:block;margin:0 0 2px;font:700 .72rem/1.05 Georgia,'Times New Roman',serif;color:#6b3f47}
      .scalene-referral-inset span{display:block;margin-bottom:5px;font-size:.52rem;line-height:1.15;color:#687287}
      .scalene-referral-inset svg{display:block;width:100%;height:auto}
      .scalene-referral-inset .body-line{fill:#f4ede2;stroke:#8e887e;stroke-width:1.1}
      .scalene-referral-inset .limb-line{fill:none;stroke:#8e887e;stroke-width:5;stroke-linecap:round}
      .scalene-referral-inset .referral-zone{fill:#985b68;opacity:.78}
      .scalene-referral-inset .referral-soft{fill:none;stroke:#985b68;stroke-width:7;stroke-linecap:round;opacity:.68}
      .scalene-referral-inset .preview-label{font:600 8px/1 sans-serif;fill:#263a60}
      .scalene-soft-compass{position:absolute;right:12px;top:12px;z-index:3;width:82px;height:82px;border-radius:50%;background:rgba(255,250,242,.82);border:1px solid rgba(112,86,73,.18);color:#263a60;display:grid;place-items:center;pointer-events:none;box-shadow:0 4px 14px rgba(24,35,59,.08)}
      .scalene-soft-compass .axis{position:absolute;background:#263a60;opacity:.78}
      .scalene-soft-compass .axis.v{width:1px;height:34px}.scalene-soft-compass .axis.h{height:1px;width:34px}
      .scalene-soft-compass b{position:absolute;font:600 8px/1 Georgia,'Times New Roman',serif}.scalene-soft-compass .s{top:6px}.scalene-soft-compass .i{bottom:6px}.scalene-soft-compass .a{left:5px}.scalene-soft-compass .p{right:5px}
      @media (orientation:portrait) and (max-width:759px){
        .scalene-referral-inset{right:8px;bottom:8px;width:30%;min-width:108px;padding:7px;border-radius:12px}
        .scalene-referral-inset strong{font-size:.66rem}.scalene-referral-inset span{font-size:.48rem}
        .scalene-soft-compass{width:68px;height:68px;right:8px;top:8px}.scalene-soft-compass .axis.v{height:28px}.scalene-soft-compass .axis.h{width:28px}.scalene-soft-compass b{font-size:7px}
      }
      @media (orientation:landscape) and (min-width:600px) and (max-width:1099px){
        .scalene-referral-inset{width:25%;min-width:112px;right:9px;bottom:9px;padding:7px}
        .scalene-soft-compass{width:66px;height:66px;right:8px;top:8px}.scalene-soft-compass .axis.v{height:27px}.scalene-soft-compass .axis.h{width:27px}.scalene-soft-compass b{font-size:7px}
      }
    `;
    document.head.appendChild(style);
  }

  function previewSvg(){
    return `<svg viewBox="0 0 150 78" role="img" aria-label="Original schematic showing broad same-side neck shoulder and arm-hand referral neighborhoods">
      <g transform="translate(7 2)">
        <circle class="body-line" cx="31" cy="10" r="7"/><path class="body-line" d="M20 20 Q31 15 42 20 L45 48 Q31 55 17 48Z"/><path class="limb-line" d="M18 25 L9 48 L8 67"/><path class="limb-line" d="M44 25 L53 48 L55 67"/>
        <path class="referral-zone" d="M25 17 Q31 14 39 18 L41 30 Q31 34 22 28Z"/><path class="referral-soft" d="M43 29 L52 49 L54 66"/>
        <text class="preview-label" x="17" y="76">front</text>
      </g>
      <g transform="translate(78 2)">
        <circle class="body-line" cx="31" cy="10" r="7"/><path class="body-line" d="M20 20 Q31 15 42 20 L45 48 Q31 55 17 48Z"/><path class="limb-line" d="M18 25 L9 48 L8 67"/><path class="limb-line" d="M44 25 L53 48 L55 67"/>
        <path class="referral-zone" d="M25 17 Q31 14 39 18 L43 29 Q31 34 20 28Z"/><path class="referral-soft" d="M44 29 L53 49 L55 66"/>
        <text class="preview-label" x="18" y="76">back</text>
      </g>
    </svg>`;
  }

  function compass(){
    const el=document.createElement('div');
    el.className='scalene-soft-compass';
    el.setAttribute('aria-hidden','true');
    el.innerHTML='<span class="axis v"></span><span class="axis h"></span><b class="s">S</b><b class="i">I</b><b class="a">A</b><b class="p">P</b>';
    return el;
  }

  function activateReferral(section){
    const tab=section.querySelector('[data-card-mode="referral"]');
    if(tab)tab.click();
  }

  function enhance(section){
    const stage=section.querySelector('.atlas-stage');
    if(!stage||stage.dataset.mode!=='anatomy')return;
    const win=stage.querySelector('.atlas-image-window');
    if(!win)return;
    if(!win.querySelector('.scalene-soft-compass'))win.appendChild(compass());
    if(win.querySelector('.scalene-referral-inset'))return;
    const pattern=D.getReferralPattern?.('scalenes');
    if(!pattern||!String(pattern.validationStatus||'').startsWith('curated'))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='scalene-referral-inset';
    button.setAttribute('aria-label','Open full Scalenes referred pain view');
    button.title='Broad educational symptom neighborhoods; not diagnostic. Open the full referred-pain view.';
    button.innerHTML=`<strong>Referred pain preview</strong><span>Travell-derived composite · original schematic</span>${previewSvg()}`;
    button.addEventListener('click',()=>activateReferral(section));
    win.appendChild(button);
  }

  function scan(){
    installStyles();
    document.querySelectorAll('.anatomy-atlas[data-anatomy-atlas="scalenes"]').forEach(enhance);
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(scan).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['data-mode']});
  scan();
})();
