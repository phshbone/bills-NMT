const CACHE='nmt-reasoning-v0.1.48';
const ASSETS=['./','./index.html','./styles.css','./anatomy-atlas.css','./manifest.webmanifest','./icon.svg','./data-init.js','./data-sources-1.js','./data-muscles-1.js','./data-muscles-2.js','./data-provenance-1.js','./data-relationships-1.js','./data-skeletal-1.js','./data-interventions-1.js','./data-movements-1.js','./data-movements-2.js','./data-visuals-1.js','./visual-overrides.js','./data-attachments-1.js','./data-referrals-1.js','./data-anatomy-atlas.js','./data-questions-1.js','./data-pathways-1.js','./data-rules-1.js','./data-forearm-1.js','./data-observations-1.js','./reasoning.js','./clinical-vocabulary.js','./reasoning-neutral.js','./adaptive-intake.js','./app.js','./complaint-intake-ui.js','./intake-copy-ui.js','./reasoning-friction-ui.js','./session-share-ui.js','./relationship-ui.js','./intervention-ui.js','./visual-ui.js','./reasoning-visual-ui.js','./attachment-ui.js','./anatomy-atlas-ui.js','./muscle-card-details-ui.js','./muscle-detail-shell-ui.js','./ux-repair-ui.js','./assets/anatomy/iliopsoas.webp','./assets/anatomy/quadratus-lumborum.webp','./assets/anatomy/scalenes.webp','./assets/anatomy/serratus-anterior.webp'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
async function navigationResponse(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put('./index.html',response.clone()).catch(()=>{});
      return response;
    }
  }catch{}
  return (await caches.match('./index.html'))||(await caches.match('./'))||Response.error();
}
async function assetResponse(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  try{
    const response=await fetch(request);
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone()).catch(()=>{});
    }
    return response;
  }catch{return Response.error()}
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate')event.respondWith(navigationResponse(event.request));
  else event.respondWith(assetResponse(event.request));
});