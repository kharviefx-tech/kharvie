/* Kharvie Public CMS Bridge — stable public-site link + identity layer. */
(function(){
'use strict';
const SUPABASE_URL='https://dprulohylwgzmetgrywj.supabase.co';
const SUPABASE_KEY='sb_publishable_gNWkc787SxA7U76No3A4kg_XHP0x2j4';
const OFFICIAL_TITLE='Kharvie | Official Website';
const OFFICIAL_CANONICAL='https://kharviefx-tech.github.io/kharvie/';
const state={identity:{},songs:[],releases:[],videos:[],gallery:[],news:[],events:[]};
let client=null,analyticsWired=false;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const first=(o,keys,f='')=>{for(const k of keys)if(o&&o[k]!==undefined&&o[k]!==null&&o[k]!=='')return o[k];return f};
const safeUrl=v=>{if(!v)return '';try{const u=new URL(String(v),location.href);return ['http:','https:','mailto:','tel:'].includes(u.protocol)?u.href:''}catch(e){return ''}};
const dateText=v=>{if(!v)return '';try{return new Date(v).toLocaleDateString('en-NG',{year:'numeric',month:'short',day:'numeric'})}catch(e){return String(v)}};
const image=v=>{const u=safeUrl(v);return u?`<img src="${esc(u)}" alt="" loading="lazy" onerror="this.style.display='none'">`:''};
const empty=m=>`<div class="cms-empty">${esc(m)}</div>`;

/* This layer fixes the public interaction problem without changing the visual design. */
function installInteractionFix(){
 if(document.getElementById('kharvie-link-fix'))return;
 const style=document.createElement('style');
 style.id='kharvie-link-fix';
 style.textContent=`
 a[href],button{pointer-events:auto!important;cursor:pointer!important}
 a[href]{position:relative}
 .k-nav,.k-navin,.k-links,.k-menu,.k-footer,.k-foot,.k-footnav,.k-foot-main,.k-foot-tools{pointer-events:auto!important}
 .k-links a,.k-btn,.k-primary,.hero-enter a,.featured-release-links a,.cms-release-links a,.kp-link,.kp-pill,.kp-social a,.k-foot-main a,.k-foot-tools a,.contact-mail,.kc-card a{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:rgba(33,196,107,.22)}
 .featured-release-links a,.cms-release-links a{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:34px!important;padding:7px 11px!important;color:#f6f7f2!important;background:#0d110e!important;border:1px solid #445248!important;border-radius:10px!important;font-size:10px!important;font-weight:800!important;line-height:1.2!important;text-decoration:none!important;opacity:1!important;visibility:visible!important}
 .featured-release-links a:hover,.cms-release-links a:hover{color:#061008!important;background:#21c46b!important;border-color:#21c46b!important}
 .k-links a,.k-foot-main a,.k-foot-tools a,.kp-link,.kp-pill,.kp-social a{opacity:1!important;visibility:visible!important}
 `;
 document.head.appendChild(style);
}

function enforceOfficialIdentity(){
 const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html')||location.pathname.endsWith('/kharvie/');
 if(!isHome)return;
 document.title=OFFICIAL_TITLE;
 let meta=document.querySelector('meta[name="description"]');
 if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
 meta.content='Official website of Kharvie (Victor Avannah) — Nigerian singer and songwriter from Delta State, Nigeria. Official music, releases, videos, live dates, EPK and bookings.';
 let canonical=document.querySelector('link[rel="canonical"]');
 if(canonical)canonical.href=OFFICIAL_CANONICAL;
 const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=OFFICIAL_TITLE;
 const twitterTitle=document.querySelector('meta[name="twitter:title"]');if(twitterTitle)twitterTitle.content=OFFICIAL_TITLE;
}

function repairAnchors(){
 document.querySelectorAll('a').forEach(a=>{
  a.removeAttribute('disabled');
  a.removeAttribute('aria-disabled');
  a.style.pointerEvents='auto';
  const href=(a.getAttribute('href')||'').trim();
  if(!href && a.dataset.url)a.setAttribute('href',a.dataset.url);
 });
}

function applyIdentity(s){
 Object.assign(state.identity,s||{});
 const setText=(sel,val)=>{const e=document.querySelector(sel);if(e&&val)e.textContent=val};
 if(s.artist_name){setText('.k-logo',s.artist_name.toUpperCase());setText('.hero-bottom h1',s.artist_name)}
 if(s.artist_role||s.profession)setText('.hero-bottom p',s.artist_role||s.profession);
 if(s.hero_intro)setText('.statement-band p',s.hero_intro);
 if(s.short_bio)setText('.about-copy p',s.short_bio);
 /* Do not let an old CMS site_title replace the official browser title. */
 if(s.site_title&&!/^Kharvie\s*\|\s*Official Website$/i.test(s.site_title)){
   const title=document.querySelector('title');if(title&&!(location.pathname==='/'||location.pathname.endsWith('/index.html')||location.pathname.endsWith('/kharvie/')))title.textContent=s.site_title;
 }
 if(s.meta_description){const meta=document.querySelector('meta[name="description"]');if(meta)meta.setAttribute('content',s.meta_description)}
 if(s.booking_email)document.querySelectorAll('.contact-mail,.contact-email').forEach(e=>{e.textContent=s.booking_email;e.href='mailto:'+s.booking_email});
 const facts={artist_name:'artist',real_name:'real name',profession:'profession',origin:'from',genre:'genre'};
 document.querySelectorAll('.k-fact').forEach(row=>{const label=(row.querySelector('span:first-child')?.textContent||'').trim().toLowerCase();const value=row.querySelector('span:last-child');if(!value)return;for(const[k,name]of Object.entries(facts))if(label===name||label.includes(name)){if(s[k])value.textContent=s[k]}});
 const urls={spotify_url:'spotify.com',apple_music_url:'music.apple.com',youtube_url:'youtube.com',instagram_url:'instagram.com',tiktok_url:'tiktok.com',facebook_url:'facebook.com',audiomack_url:'audiomack.com',boomplay_url:'boomplay.com',deezer_url:'deezer.com',tidal_url:'tidal.com',amazon_music_url:'music.amazon.com',shazam_url:'shazam.com'};
 document.querySelectorAll('a[href]').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase(),text=(a.textContent||'').trim().toLowerCase();for(const[key,domain]of Object.entries(urls)){const label=key.replace('_url','').replaceAll('_',' ');if(href.includes(domain)||text===label||text===key.replace('_url','').replaceAll('_',' ')){if(s[key])a.href=safeUrl(s[key])||a.href}}if(/official playlist|playlist/i.test(text)&&s.youtube_playlist_url)a.href=safeUrl(s.youtube_playlist_url)||a.href});
 enforceOfficialIdentity();repairAnchors();
}

async function get(t,o){if(!client)return[];let q=client.from(t).select('*').eq('is_published',true);if(o)q=q.order(o,{ascending:false,nullsFirst:false});const r=await q;if(r.error){console.warn('Kharvie CMS:',t,r.error.message);return[]}return r.data||[]}
async function loadIdentity(){if(!client)return;const r=await client.from('site_settings').select('setting_key,setting_value');if(!r.error){const s={};(r.data||[]).forEach(x=>s[x.setting_key]=x.setting_value);applyIdentity(s)}else enforceOfficialIdentity()}

function renderSongs(){const el=document.getElementById('cmsSongs');if(!el)return;if(!state.songs.length){el.innerHTML=empty('No songs have been published yet.');return}el.innerHTML=state.songs.slice(0,8).map((s,i)=>{const t=first(s,['title'],'Untitled Song'),c=first(s,['cover_url','image_url']),u=first(s,['spotify_url','apple_music_url','youtube_url','audiomack_url']);return`<article class="cms-card">${c?`<div class="cms-cover">${image(c)}</div>`:''}<div class="cms-index">${String(i+1).padStart(2,'0')} · SONG</div><h3>${esc(t)}</h3><p>${esc(first(s,['artist'],'Kharvie'))} · ${esc(first(s,['genre'],'Afrobeats'))}</p>${u?`<a class="btn cms-track-click" data-track-name="${esc(t)}" href="${esc(safeUrl(u))}" target="_blank" rel="noopener">Listen</a>`:''}</article>`}).join('');repairAnchors()}

function renderReleases(){
 const el=document.getElementById('cmsReleases');if(!el)return;
 if(!state.releases.length){el.innerHTML=empty('No official releases are currently available.');return}
 el.innerHTML=state.releases.slice(0,12).map((r,i)=>{
  const t=first(r,['title'],'Untitled Release'),c=first(r,['cover_url','image_url','artwork']),d=first(r,['release_date','releaseDate','date']);
  const links=r.links||{};
  const urls=[['Spotify',links.spotify||r.spotify_url],['Apple Music',links.apple||r.apple_music_url||r.appleUrl],['YouTube',links.youtube||r.youtube_url],['Audiomack',links.audiomack||r.audiomack_url],['Smart Link',links.smartLink||links.hyperFollow]].filter(x=>safeUrl(x[1]));
  return `<article class="cms-release">${c?`<div class="cms-release-art">${image(c)}</div>`:''}<div><div class="cms-index">${String(i+1).padStart(2,'0')} / RELEASE</div><h3>${esc(t)}</h3><p>${esc(dateText(d)||'Official release')}</p><p>${esc(first(r,['description','summary','excerpt','genre'],'Kharvie official release'))}</p><div class="cms-release-links">${urls.map(x=>`<a class="text-link cms-track-click" data-track-name="${esc(t)}" href="${esc(safeUrl(x[1]))}" target="_blank" rel="noopener">${esc(x[0])} →</a>`).join('')}</div></div></article>`;
 }).join('');
 repairAnchors();
}

function renderVideos(){const el=document.getElementById('cmsVideos');if(!el)return;if(!state.videos.length){el.innerHTML=empty('No videos have been published yet.');return}el.innerHTML=state.videos.slice(0,6).map(v=>{const t=first(v,['title'],'Kharvie Video'),u=first(v,['video_url','youtube_url','url','link']),c=first(v,['thumbnail_url','cover_url','image_url','thumbnail','image']);const isFile=/^https?:\/\/.*\.(mp4|webm|mov)(\?.*)?$/i.test(u||'')||String(v.platform||'').toLowerCase().includes('website');return`<article class="cms-video">${c?`<div class="cms-video-thumb">${image(c)}</div>`:isFile&&u?`<div class="cms-video-thumb"><video controls preload="metadata" src="${esc(safeUrl(u))}" style="width:100%;height:100%;object-fit:cover"></video></div>`:''}<div class="cms-index">VIDEO</div><h3>${esc(t)}</h3>${u?`<a class="btn cms-video-click" data-video-name="${esc(t)}" href="${esc(safeUrl(u))}" ${isFile?'download':''} target="_blank" rel="noopener">Watch</a>`:''}</article>`}).join('');repairAnchors()}
function renderGallery(){const el=document.getElementById('cmsGallery');if(!el)return;if(!state.gallery.length){el.innerHTML=empty('No gallery images have been published yet.');return}el.innerHTML=state.gallery.slice(0,12).map(g=>{const s=first(g,['image_url','url','image','photo_url','cover_url']),t=first(g,['title','name','caption'],'Kharvie');return s?`<figure class="gallery-item">${image(s)}<figcaption>${esc(t)}</figcaption></figure>`:''}).join('');repairAnchors()}
function renderNews(){const el=document.getElementById('cmsNews');if(!el)return;if(!state.news.length){el.innerHTML=empty('No news has been published yet.');return}el.innerHTML=state.news.slice(0,6).map(n=>{const t=first(n,['title'],'Kharvie Update'),b=first(n,['excerpt','summary','content','body'],''),d=first(n,['published_at','published_date','date','created_at']),u=first(n,['url','link']),c=first(n,['featured_image_url','image_url','cover_url']);return`<article class="cms-news">${c?`<div class="cms-cover">${image(c)}</div>`:''}<div class="cms-index">${esc(dateText(d))}</div><h3>${esc(t)}</h3><p>${esc(b).slice(0,260)}${String(b).length>260?'…':''}</p>${u?`<a class="text-link cms-news-click" data-news-name="${esc(t)}" href="${esc(safeUrl(u))}" target="_blank" rel="noopener">Read more →</a>`:''}</article>`}).join('');repairAnchors()}
function renderEvents(){const el=document.getElementById('cmsEvents');if(!el)return;if(!state.events.length){el.innerHTML=empty('No upcoming events have been published yet.');return}el.innerHTML=state.events.slice(0,6).map(e=>{const t=first(e,['title'],'Kharvie Event'),d=first(e,['event_date','date','start_date']),v=[first(e,['venue','location','place']),first(e,['city']),first(e,['country'])].filter(Boolean).join(' · '),u=first(e,['ticket_url','url','link']);return`<article class="cms-event"><div class="event-date">${esc(dateText(d))}</div><h3>${esc(t)}</h3><p>${esc(v)}</p>${u?`<a class="text-link cms-event-click" data-event-name="${esc(t)}" href="${esc(safeUrl(u))}" target="_blank" rel="noopener">Details →</a>`:''}</article>`}).join('');repairAnchors()}

function trafficSource(){try{const ref=document.referrer||'';const u=ref?new URL(ref):null;const h=(u?.hostname||'').toLowerCase();if(/(^|\.)google\./i.test(h))return'Google Search';if(/(^|\.)bing\./i.test(h))return'Bing Search';if(/(^|\.)duckduckgo\./i.test(h))return'DuckDuckGo Search';if(/(^|\.)(instagram|tiktok|facebook|youtube|x|twitter)\.com$/i.test(h))return h.includes('instagram')?'Instagram':h.includes('tiktok')?'TikTok':h.includes('facebook')?'Facebook':h.includes('youtube')?'YouTube':'X';return h||'Direct / Other'}catch(e){return'Direct / Other'}}
async function track(event_name,extra={}){try{if(!client)return;let sid=localStorage.getItem('kharvie_session');if(!sid){sid=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();localStorage.setItem('kharvie_session',sid)}const metadata=Object.assign({},extra.metadata||{});if(event_name==='page_view'){metadata.traffic_source=trafficSource();metadata.referrer=document.referrer||'';metadata.landing_page=location.pathname}await client.from('analytics_events').insert({event_name,page_path:location.pathname,target_url:extra.target_url||null,metadata,session_id:sid})}catch(e){}}
function wireAnalytics(){if(analyticsWired)return;analyticsWired=true;track('page_view',{metadata:{title:document.title}});document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;let name='link_click';const c=a.classList;if(c.contains('cms-track-click'))name='music_platform_click';else if(c.contains('cms-video-click'))name='video_click';else if(c.contains('cms-event-click'))name='event_click';else if(/booking/i.test(a.href))name='booking_click';else if(/press/i.test(a.href))name='epk_click';else if(/instagram\.com|tiktok\.com|facebook\.com|youtube\.com/i.test(a.href))name='social_click';else if(/spotify\.com|music\.apple\.com|audiomack\.com|boomplay\.com|deezer\.com|tidal\.com|music\.amazon\.com|shazam\.com/i.test(a.href))name='streaming_click';else if(/^mailto:/i.test(a.href))name='commercial_enquiry_click';track(name,{target_url:a.href,metadata:{text:(a.textContent||'').trim().slice(0,100)}})},{passive:true})}

async function load(){
 installInteractionFix();enforceOfficialIdentity();repairAnchors();
 try{
  if(!window.supabase){enforceOfficialIdentity();return}
  client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  await loadIdentity();
  const homepage=location.pathname==='/'||location.pathname.endsWith('/index.html')||location.pathname.endsWith('/kharvie/');
  let releases=[];
  if(homepage){try{const rr=await fetch(new URL('releases.json?v='+Date.now(),location.href),{cache:'no-store'});if(!rr.ok)throw new Error('releases.json HTTP '+rr.status);const jd=await rr.json();releases=Array.isArray(jd.releases)?jd.releases:[]}catch(e){console.warn('Kharvie catalogue JSON unavailable; using CMS releases',e);releases=await get('releases','release_date')}}else releases=await get('releases','release_date');
  const [songs,videosDb,galleryDb,news,events]=await Promise.all([get('songs','release_date'),get('videos','release_date'),get('gallery','created_at'),get('posts','published_at'),get('events','event_date')]);
  let videos=videosDb,gallery=galleryDb;
  if(homepage){
   try{const vr=await fetch(new URL('videos.json?v='+Date.now(),location.href),{cache:'no-store'});if(vr.ok){const vd=await vr.json();if(Array.isArray(vd.videos)&&vd.videos.length)videos=vd.videos}}catch(e){}
   try{const gr=await fetch(new URL('gallery.json?v='+Date.now(),location.href),{cache:'no-store'});if(gr.ok){const gd=await gr.json();if(Array.isArray(gd.gallery)&&gd.gallery.length)gallery=gd.gallery}}catch(e){}
   try{const er=await fetch(new URL('events.json?v='+Date.now(),location.href),{cache:'no-store'});if(er.ok){const ed=await er.json();if(Array.isArray(ed.events)&&ed.events.length)events=ed.events}}catch(e){}
  }
  if(homepage&&!videos.length)videos=[{title:'Official Kharvie Videos',video_url:'https://youtube.com/@kharvie-m',youtube_url:'https://youtube.com/@kharvie-m',thumbnail_url:'assets/kharvie.jpg',platform:'YouTube'}];
  if(homepage&&!gallery.length)gallery=[{title:'Kharvie — Official Portrait',image_url:'assets/IMG-20260912-WA0004.jpg'},{title:'Kharvie — Official Artist Image',image_url:'assets/kharvie.jpg'}];
  Object.assign(state,{songs,releases,videos,gallery,news,events});
  renderSongs();renderReleases();renderVideos();renderGallery();renderNews();renderEvents();
  enforceOfficialIdentity();repairAnchors();
  document.documentElement.dataset.cms='connected';wireAnalytics();
 }catch(e){console.warn('Kharvie CMS connection failed',e);document.documentElement.dataset.cms='offline';enforceOfficialIdentity();repairAnchors()}
}
window.KharvieCMS={refresh:load,state};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
setInterval(()=>{if(document.visibilityState==='visible')load()},60000);
})();