(function(){
  const app=document.getElementById('app');
  if(!app)return;
  const style=document.createElement('style');
  style.textContent=`
    .observation-cue{height:128px;margin:0 0 12px;border:1px solid #cfc5b6;border-radius:5px;background:#fbf4e7;position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px #fffaf2}
    .observation-cue-label{position:absolute;left:9px;top:8px;color:#74695d;font:700 .67rem/1.1 Georgia,'Times New Roman',serif;letter-spacing:.04em;text-transform:uppercase}
    .observation-person{position:absolute;left:50%;top:24px;width:84px;height:94px;transform:translateX(-50%)}
    .observation-head{position:absolute;left:32px;top:0;width:20px;height:20px;border:2px solid #17233b;border-radius:50%}
    .observation-spine{position:absolute;left:41px;top:21px;width:2px;height:56px;background:#17233b;transform-origin:50% 100%}
    .observation-shoulders{position:absolute;left:17px;top:30px;width:50px;height:2px;background:#17233b;transform-origin:50% 50%}
    .observation-pelvis{position:absolute;left:22px;top:75px;width:40px;height:3px;background:#6f2733;transform-origin:50% 50%}
    .observation-scapula{position:absolute;top:32px;width:13px;height:23px;border:2px solid #6f2733;border-radius:55% 20% 55% 20%;transform-origin:50% 50%}
    .observation-scapula.left{left:21px;transform:rotate(12deg)}.observation-scapula.right{right:21px;transform:rotate(-12deg)}
    .observation-cue.winging .observation-scapula.right{animation:nmt-wing 2.4s ease-in-out infinite}
    .observation-cue.shrug .observation-shoulders,.observation-cue.shrug .observation-scapula.right{animation:nmt-shrug 2.4s ease-in-out infinite}
    .observation-cue.upright .observation-spine,.observation-cue.upright .observation-head,.observation-cue.upright .observation-shoulders{animation:nmt-upright 2.8s ease-in-out infinite}
    .observation-cue.drop .observation-pelvis{animation:nmt-drop 2.4s ease-in-out infinite}
    .observation-cue-note{position:absolute;left:9px;right:9px;bottom:7px;text-align:center;color:#74695d;font-size:.67rem}
    @keyframes nmt-wing{0%,25%,100%{transform:rotate(-12deg) translateX(0)}55%,75%{transform:rotate(-25deg) translateX(7px)}}
    @keyframes nmt-shrug{0%,25%,100%{transform:translateY(0)}55%,75%{transform:translateY(-9px)}}
    @keyframes nmt-upright{0%,20%,100%{transform:rotate(8deg)}55%,75%{transform:rotate(0deg)}}
    @keyframes nmt-drop{0%,25%,100%{transform:rotate(0deg)}55%,75%{transform:rotate(9deg)}}
    @media(prefers-reduced-motion:reduce){.observation-cue *{animation:none!important}}
  `;
  document.head.appendChild(style);

  const kinds={
    'Scapular winging':'winging',
    'Early shoulder shrug':'shrug',
    'Difficulty standing fully upright':'upright',
    'Pelvic drop during gait/single-leg stance':'drop'
  };
  function visual(kind){return `<div class="observation-cue ${kind}" aria-label="Animated visual cue for this observation"><span class="observation-cue-label">motion cue</span><div class="observation-person" aria-hidden="true"><span class="observation-head"></span><span class="observation-spine"></span><span class="observation-shoulders"></span><span class="observation-pelvis"></span><span class="observation-scapula left"></span><span class="observation-scapula right"></span></div><span class="observation-cue-note">Visual comparison only · not a diagnostic test</span></div>`}
  function enhance(){
    if(document.querySelector('.nav-btn.active')?.dataset.route!=='observation')return;
    [...app.querySelectorAll('.record-card')].forEach(card=>{
      if(card.querySelector('.observation-cue'))return;
      const name=card.querySelector('h3')?.textContent.trim();
      const kind=kinds[name];if(!kind)return;
      card.querySelector('h3')?.insertAdjacentHTML('afterend',visual(kind));
    });
  }
  new MutationObserver(enhance).observe(app,{childList:true,subtree:true});enhance();
})();