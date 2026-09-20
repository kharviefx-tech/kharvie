/* Kharvie public link visibility + touch repair + visual archive sizing */
(function(){
'use strict';
function hidePrivateAdmin(){
  const section=document.getElementById('website-settings');
  if(section) section.remove();
  document.querySelectorAll('a[href="#website-settings"]').forEach(a=>a.remove());
  document.querySelectorAll('a[href="admin/settings.html"],a[href="admin/editor.html"],a[href="admin/tools.html"],a[href="admin/tools-3000.html"],a[href="admin/publish.html"],a[href="admin/media.html"],a[href="admin/revenue.html"]').forEach(a=>{
    const insideFooter=a.closest('footer,.k-footer');
    if(insideFooter) a.remove();
  });
}
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
    #cmsGallery.k-visual-grid,#cmsGallery{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;align-items:start!important;width:100%!important;max-width:100%!important;min-width:0!important}
    #cmsGallery>*{display:block!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;max-width:100%!important;height:240px!important;max-height:240px!important;min-height:0!important;overflow:hidden!important;border-radius:14px!important}
    #cmsGallery img,#cmsGallery video{display:block!important;box-sizing:border-box!important;width:100%!important;height:240px!important;max-width:100%!important;max-height:240px!important;min-width:0!important;min-height:0!important;object-fit:cover!important;object-position:center!important;border-radius:12px!important}
    #cmsGallery figure,#cmsGallery .gallery-item,#cmsGallery .cms-card,#cmsGallery .item{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;height:240px!important;max-height:240px!important;min-width:0!important;min-height:0!important;overflow:hidden!important}
    #cmsGallery figure img,#cmsGallery .gallery-item img,#cmsGallery .cms-card img,#cmsGallery .item img{display:block!important;width:100%!important;height:240px!important;max-width:100%!important;max-height:240px!important;object-fit:cover!important}
    #cmsGallery .cms-empty{grid-column:1/-1!important;width:100%!important;height:auto!important;max-height:none!important}
    @media(max-width:900px){#cmsGallery.k-visual-grid,#cmsGallery{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}#cmsGallery>*,#cmsGallery figure,#cmsGallery .gallery-item,#cmsGallery .cms-card,#cmsGallery .item{height:190px!important;max-height:190px!important}#cmsGallery img,#cmsGallery video,#cmsGallery figure img,#cmsGallery .gallery-item img,#cmsGallery .cms-card img,#cmsGallery .item img{height:190px!important;max-height:190px!important}}
    @media(max-width:600px){#cmsGallery.k-visual-grid,#cmsGallery{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}#cmsGallery>*,#cmsGallery figure,#cmsGallery .gallery-item,#cmsGallery .cms-card,#cmsGallery .item{height:150px!important;max-height:150px!important;border-radius:12px!important}#cmsGallery img,#cmsGallery video,#cmsGallery figure img,#cmsGallery .gallery-item img,#cmsGallery .cms-card img,#cmsGallery .item img{height:150px!important;max-height:150px!important;border-radius:10px!important}}
  `;
  document.head.appendChild(s);
}
function repair(){
  hidePrivateAdmin();
  document.querySelectorAll('a').forEach(a=>{
    a.removeAttribute('disabled');
    a.removeAttribute('aria-disabled');
    a.style.pointerEvents='auto';
    const href=(a.getAttribute('href')||'').trim();
    if(!href) return;
    if(!a.textContent.trim()){
      const label=a.getAttribute('aria-label')||a.getAttribute('title')||a.dataset.label||'';
      if(label) a.textContent=label;
      else { try{const h=new URL(href,location.href).hostname.replace(/^www\\./,'');const map={'open.spotify.com':'Spotify','music.apple.com':'Apple Music','youtube.com':'YouTube','youtu.be':'YouTube','audiomack.com':'Audiomack','distrokid.com':'DistroKid','ffm.to':'Smart Link','instagram.com':'Instagram','tiktok.com':'TikTok','facebook.com':'Facebook','boomplay.com':'Boomplay','deezer.com':'Deezer','tidal.com':'TIDAL','music.amazon.com':'Amazon Music','shazam.com':'Shazam'};a.textContent=map[h]||h;}catch(e){} }
    }
  });
}
function run(){install();repair();setTimeout(repair,500);setTimeout(repair,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();