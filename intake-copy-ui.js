(function(){
  const TITLE='Type or dictate your symptoms';
  const PLACEHOLDER='Describe what you feel in your own words. Include where you feel it and any movements, positions, or activities that make it better or worse.';
  const NOTE='Use natural language. Be as specific as you can about location, sensation, and what changes the symptoms.';
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
