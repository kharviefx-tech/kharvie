/* Kharvie Site Core: shared runtime safeguards for public pages. */
/* Final homepage entity normalization trigger. */
(function(){
  'use strict';
  const OFFICIAL='Kharvie | Official Website';
  const LINKS={
    'open.spotify.com':'Spotify','music.apple.com':'Apple Music','youtube.com':'YouTube','youtu.be':'YouTube',
    'audiomack.com':'Audiomack','boomplay.com':'Boomplay','deezer.com':'Deezer','tidal.com':'TIDAL',
    'music.amazon.com':'Amazon Music','shazam.com':'Shazam','instagram.com':'Instagram','tiktok.com':'TikTok',
    'facebook.com':'Facebook','distrokid.com':'DistroKid','ffm.to':'Smart Link'
  };
  function ensureTitle(){
    if(location.pathname.endsWith('/index.html') || location.pathname==='/' || location.pathname.endsWith('/kharvie/')){
      document.title=OFFICIAL;
      const meta=document.querySelector('meta[property="og:title"]'); if(meta) meta.content=OFFICIAL;
      const tw=document.querySelector('meta[name="twitter:title"]'); if(tw) tw.content=OFFICIAL;
    }
  }
  function normalizeEntity(){
    if(!(location.pathname==='/' || location.pathname.endsWith('/index.html') || location.pathname.endsWith('/kharvie/'))) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script=>{
      try{
        const data=JSON.parse(script.textContent);
        if(!Array.isArray(data['@graph'])) return;
        const artist=data['@graph'].find(x=>x && x['@id'] && x['@id'].endsWith('#artist'));
        if(!artist) return;
        artist['@type']='Person';
        artist.name='Kharvie';
        artist.alternateName=['Victor Avannah','Kharvie (Victor Avannah)'];
        delete artist.member;
        delete artist.foundingLocation;
        delete artist.foundingDate;
        delete artist.genre;
        delete artist.disambiguatingDescription;
        const page=data['@graph'].find(x=>x && x['@type']==='WebPage');
        if(page){page.mainEntity={'@id':artist['@id']};page.about={'@id':artist['@id']};}
        const website=data['@graph'].find(x=>x && x['@type']==='WebSite');
        if(website) website.publisher={'@id':artist['@id']};
        script.textContent=JSON.stringify(data);
      }catch(_){}
    });
  }
  function repairLinks(){
    document.querySelectorAll('a[href]').forEach(a=>{
      a.style.pointerEvents='auto';
      a.style.touchAction='manipulation';
      if(!a.getAttribute('aria-label')){
        const text=a.textContent.trim();
        if(text) a.setAttribute('aria-label',text);
      }
      if(!a.textContent.trim()){
        const label=a.getAttribute('title')||a.dataset.label;
        if(label) a.textContent=label;
        else { try { const h=new URL(a.href).hostname.replace(/^www\./,''); if(LINKS[h]) a.textContent=LINKS[h]; } catch(_){} }
      }
    });
  }
  function repairArchive(){
    const g=document.getElementById('cmsGallery'); if(!g) return;
    g.style.display='grid'; g.style.width='100%'; g.style.maxWidth='100%'; g.style.minWidth='0';
    g.style.gridTemplateColumns=innerWidth<=600?'repeat(2,minmax(0,1fr))':innerWidth<=900?'repeat(3,minmax(0,1fr))':'repeat(4,minmax(0,1fr))';
    g.querySelectorAll(':scope > *').forEach(card=>{
      if(card.classList.contains('cms-empty')) return;
      const h=innerWidth<=600?150:innerWidth<=900?190:240;
      card.style.width='100%'; card.style.maxWidth='100%'; card.style.minWidth='0'; card.style.height=h+'px'; card.style.maxHeight=h+'px'; card.style.overflow='hidden';
      card.querySelectorAll('img,video').forEach(media=>{media.style.width='100%';media.style.height=h+'px';media.style.maxWidth='100%';media.style.maxHeight=h+'px';media.style.objectFit='cover';});
    });
  }
  function run(){ensureTitle();normalizeEntity();repairLinks();repairArchive();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('resize',repairArchive,{passive:true});
  new MutationObserver(run).observe(document.documentElement,{subtree:true,childList:true});
})();
