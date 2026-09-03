(function(){
  function apply(){
    const input=document.getElementById('complaintInput');
    if(!input)return;
    const label=input.closest('label');
    const fieldLabel=label?.querySelector('.field-label');
    if(fieldLabel)fieldLabel.textContent='Type or dictate your symptoms';
    input.placeholder='Describe what you feel in your own words. Include where you feel it and any movements, positions, or activities that make it better or worse.';
    if(label&&!label.querySelector('[data-intake-guidance]')){
      const note=document.createElement('p');
      note.className='small muted';
      note.dataset.intakeGuidance='true';
      note.textContent='Use natural language. Be as specific as you can about location, sensation, and what changes the symptoms.';
      input.insertAdjacentElement('afterend',note);
    }
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(apply).observe(app,{childList:true,subtree:true});
  apply();
})();