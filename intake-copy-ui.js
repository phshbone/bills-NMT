(function(){
  const TITLE='Type or dictate your symptoms';
  const PLACEHOLDER='Describe what you feel in your own words. Include where you feel it and any movements, positions, or activities that make it better or worse.';
  const NOTE='Use natural language. Be as specific as you can about location, sensation, and what changes the symptoms.';
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