/* Kharvie public link visibility + touch repair */
(function(){
'use strict';
function install(){
  if(document.getElementById('kharvie-link-fix-style')) return;
  const s=document.createElement('style');
  s.id='kharvie-link-fix-style';
  s.textContent=`
    a[href],button{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}
    a[href]{position:relative;z-index:2}
    .featured-release-links,.cms-release-links,.k-links-row,.platforms,.socials,.links,.kp-social,.kp-pills{position:relative;z-index:5;display:flex!important;flex-wrap:wrap!important;gap:8px!important}
    .featured-release-links a,.cms-release-links a,.k-links-row a,.platforms a,.socials a,.links a,.kp-social a,.kp-pill{display:inline-flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;color:#f6f7f2!important;background:#101610!important;border:1px solid #445248!important;text-decoration:none!important;min-height:38px!important;padding:8px 12px!important;border-radius:10px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important}
    .featured-release-links a:hover,.cms-release-links a:hover,.k-links-row a:hover,.platforms a:hover,.socials a:hover,.links a:hover,.kp-social a:hover,.kp-pill:hover{color:#061008!important;background:#21c46b!important;border-color:#21c46b!important}
    .featured-release-card,.cms-release{position:relative!important}
  `;
  document.head.appendChild(s);
}
function repair(){
  document.querySelectorAll('a').forEach(a=>{
    a.removeAttribute('disabled');
    a.removeAttribute('aria-disabled');
    a.style.pointerEvents='auto';
    const href=(a.getAttribute('href')||'').trim();
    if(!href) return;
    if(!a.textContent.trim()){
      const label=a.getAttribute('aria-label')||a.getAttribute('title')||a.dataset.label||'';
      if(label) a.textContent=label;
      else {
        try{
          const h=new URL(href,location.href).hostname.replace(/^www\./,'');
          const map={'open.spotify.com':'Spotify','music.apple.com':'Apple Music','youtube.com':'YouTube','youtu.be':'YouTube','audiomack.com':'Audiomack','distrokid.com':'DistroKid','ffm.to':'Smart Link','instagram.com':'Instagram','tiktok.com':'TikTok','facebook.com':'Facebook','boomplay.com':'Boomplay','deezer.com':'Deezer','tidal.com':'TIDAL','music.amazon.com':'Amazon Music','shazam.com':'Shazam'};
          a.textContent=map[h]||h;
        }catch(e){}
      }
    }
  });
}
function run(){install();repair();setTimeout(repair,500);setTimeout(repair,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
