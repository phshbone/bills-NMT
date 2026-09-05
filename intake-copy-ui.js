(function(){
  const TITLE='Where are you feeling the problem?';
  const PLACEHOLDER='Describe as much or as little as you know. Example: Deep ache on the right side of my low back near the lower ribs, worse standing, better bending forward.';
  const NOTE='Use your own words. If you already know what movements, positions, or activities change it, include them. The app will use what you give it and ask only for useful details that are still missing.';
  const UNSUPPORTED='V0.1 does not yet have a validated reasoning neighborhood for that description. Choose one of the validated prototype pathways rather than forcing a bad match.';
  function normalizeUnsupported(){
    const input=document.getElementById('complaintInput');
    const label=input?.closest('label');
    if(!input||!label)return;
    const notices=[...label.querySelectorAll('.notice.small')].filter(x=>/does not yet have a validated reasoning neighborhood/i.test(x.textContent||''));
    notices.forEach((notice,i)=>{if(i===0){if(notice.textContent!==UNSUPPORTED)notice.textContent=UNSUPPORTED}else notice.remove()});
  }
  function apply(){
    const input=document.getElementById('complaintInput');
    if(!input)return;
    const label=input.closest('label');
    const fieldLabel=label?.querySelector('.field-label');
    if(fieldLabel&&fieldLabel.textContent!==TITLE)fieldLabel.textContent=TITLE;
    if(input.placeholder!==PLACEHOLDER)input.placeholder=PLACEHOLDER;
    if(label&&!label.querySelector('[data-intake-guidance]')){
      const note=document.createElement('p');
      note.className='small muted';
      note.dataset.intakeGuidance='true';
      note.textContent=NOTE;
      input.insertAdjacentElement('afterend',note);
    }
    normalizeUnsupported();
  }
  let scheduled=false;
  function enhance(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      apply();
    });
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  apply();
})();