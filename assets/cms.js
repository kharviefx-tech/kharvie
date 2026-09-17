/* Kharvie Public CMS Bridge
   Public site -> Supabase -> Admin Dashboard
   The same publishable Supabase project used by admin.html is read here.
*/
(function(){
  const SUPABASE_URL = "https://dprulohylwgzmetgrywj.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gNWkc787SxA7U76No3A4kg_XHP0x2j4";

  const state = { songs:[], releases:[], videos:[], gallery:[], news:[], events:[] };
  let client = null;

  function esc(value){
    return String(value ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }
  function first(obj, keys, fallback=""){
    for(const key of keys){ if(obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key]; }
    return fallback;
  }
  function link(value){
    if(!value) return "#";
    try{ const u = new URL(value, location.href); if(["http:","https:"].includes(u.protocol)) return u.href; }catch(e){}
    return "#";
  }
  function dateText(value){
    if(!value) return "";
    try{ return new Date(value).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}); }catch(e){ return String(value); }
  }
  function image(value){ return value ? `<img src="${esc(link(value))}" alt="" loading="lazy" onerror="this.style.display='none'">` : ""; }
  function empty(message){ return `<div class="cms-empty">${esc(message)}</div>`; }

  async function get(table, order){
    const q = client.from(table).select("*");
    const result = order ? await q.order(order,{ascending:false,nullsFirst:false}) : await q;
    if(result.error){ console.warn(`Kharvie CMS: ${table}`, result.error.message); return []; }
    return result.data || [];
  }

  function renderSongs(){
    const el = document.getElementById("cmsSongs"); if(!el) return;
    if(!state.songs.length){ el.innerHTML = empty("No songs have been published yet."); return; }
    el.innerHTML = state.songs.slice(0,8).map((s,i)=>{
      const title=first(s,["title","name"],"Untitled Song");
      const cover=first(s,["cover_url","cover_image_url","image_url","image"]);
      const stream=first(s,["spotify_url","apple_music_url","youtube_url","audiomack_url"]);
      return `<article class="cms-card">${cover?`<div class="cms-cover">${image(cover)}</div>`:""}<div class="cms-index">${String(i+1).padStart(2,"0")} · SONG</div><h3>${esc(title)}</h3><p>${esc(first(s,["artist"],"Kharvie"))} · ${esc(first(s,["genre"],"Afrobeats"))}</p>${stream?`<a class="btn" href="${esc(link(stream))}" target="_blank" rel="noopener">Listen</a>`:""}</article>`;
    }).join("");
  }

  function renderReleases(){
    const el = document.getElementById("cmsReleases"); if(!el) return;
    if(!state.releases.length){ el.innerHTML = empty("No releases have been published yet."); return; }
    el.innerHTML = state.releases.slice(0,6).map(r=>{
      const title=first(r,["title","name"],"Untitled Release");
      const cover=first(r,["cover_url","cover_image_url","image_url","image"]);
      const url=first(r,["spotify_url","apple_music_url","youtube_url","audiomack_url"]);
      return `<article class="cms-release">${cover?`<div class="cms-release-art">${image(cover)}</div>`:""}<div><div class="cms-index">${esc(first(r,["release_type"],"RELEASE"))}</div><h3>${esc(title)}</h3><p>${esc(dateText(first(r,["release_date","date"])))}</p><p>${esc(first(r,["description","summary","excerpt"],""))}</p>${url?`<a class="btn" href="${esc(link(url))}" target="_blank" rel="noopener">Open Release</a>`:""}</div></article>`;
    }).join("");
  }

  function renderVideos(){
    const el=document.getElementById("cmsVideos"); if(!el) return;
    if(!state.videos.length){ el.innerHTML=empty("No videos have been published yet."); return; }
    el.innerHTML=state.videos.slice(0,6).map(v=>{
      const title=first(v,["title","name"],"Kharvie Video");
      const url=first(v,["youtube_url","video_url","url","link"]);
      const thumb=first(v,["thumbnail_url","cover_url","image_url","thumbnail","image"]);
      return `<article class="cms-video">${thumb?`<div class="cms-video-thumb">${image(thumb)}</div>`:""}<div class="cms-index">VIDEO</div><h3>${esc(title)}</h3>${url?`<a class="btn" href="${esc(link(url))}" target="_blank" rel="noopener">Watch</a>`:""}</article>`;
    }).join("");
  }

  function renderGallery(){
    const el=document.getElementById("cmsGallery"); if(!el) return;
    if(!state.gallery.length){ el.innerHTML=empty("No gallery images have been published yet."); return; }
    el.innerHTML=state.gallery.slice(0,12).map(g=>{ const src=first(g,["image_url","url","image","photo_url","cover_url"]); const title=first(g,["title","name","caption"],"Kharvie"); return src?`<figure class="gallery-item">${image(src)}<figcaption>${esc(title)}</figcaption></figure>`:""; }).join("");
  }

  function renderNews(){
    const el=document.getElementById("cmsNews"); if(!el) return;
    if(!state.news.length){ el.innerHTML=empty("No news has been published yet."); return; }
    el.innerHTML=state.news.slice(0,6).map(n=>{ const title=first(n,["title","name"],"Kharvie Update"); const body=first(n,["excerpt","summary","content","body"],""); const d=first(n,["published_at","published_date","date","created_at"]); const url=first(n,["url","link"]); return `<article class="cms-news"><div class="cms-index">${esc(dateText(d))}</div><h3>${esc(title)}</h3><p>${esc(body).slice(0,260)}${String(body).length>260?"…":""}</p>${url?`<a class="text-link" href="${esc(link(url))}" target="_blank" rel="noopener">Read more →</a>`:""}</article>`; }).join("");
  }

  function renderEvents(){
    const el=document.getElementById("cmsEvents"); if(!el) return;
    if(!state.events.length){ el.innerHTML=empty("No upcoming events have been published yet."); return; }
    el.innerHTML=state.events.slice(0,6).map(e=>{ const title=first(e,["title","name"],"Kharvie Event"); const d=first(e,["event_date","date","start_date"]); const venue=first(e,["venue","location","place"],""); const url=first(e,["ticket_url","url","link"]); return `<article class="cms-event"><div class="event-date">${esc(dateText(d))}</div><h3>${esc(title)}</h3><p>${esc(venue)}</p>${url?`<a class="text-link" href="${esc(link(url))}" target="_blank" rel="noopener">Details →</a>`:""}</article>`; }).join("");
  }

  async function load(){
    try{
      if(!window.supabase) return;
      client = window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const [songs,releases,videos,gallery,news,events] = await Promise.all([
        get("songs","release_date"), get("releases","release_date"), get("videos","created_at"),
        get("gallery","created_at"), get("news","created_at"), get("events","event_date")
      ]);
      Object.assign(state,{songs,releases,videos,gallery,news,events});
      renderSongs(); renderReleases(); renderVideos(); renderGallery(); renderNews(); renderEvents();
      document.documentElement.dataset.cms="connected";
    }catch(error){ console.warn("Kharvie CMS connection failed",error); document.documentElement.dataset.cms="offline"; }
  }

  window.KharvieCMS={refresh:load,state};
  document.addEventListener("DOMContentLoaded",()=>{ load(); setInterval(load,60000); });
})();
