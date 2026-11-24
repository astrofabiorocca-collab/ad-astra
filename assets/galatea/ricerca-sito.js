/* Ricerca estrattiva nei passaggi del sito. I titoli video non sono trascrizioni. */
(() => {
 'use strict';
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const stop=new Set('a ad al alla alle allo ai agli all anche che chi ci cio come cosa cos con da dal dalla dalle dei del della delle dello degli di e ed essere fa fra gli ha hanno i il in la le lo loro ma ne nei nel nella nelle nello non o ogni per piu puo quale quali quando quanto questa queste questi questo se senza si sia sono su sul sulla sulle tra un una uno viene vorrei sapere significa significato spiegami parlami funziona funzionano'.split(' '));
 const stem=w=>w.length>4?w.replace(/([cg])h([ie])$/,'$1$2').replace(/[aeio]$/,''):w;
 const words=v=>[...new Set(normalize(v).split(' ').filter(w=>w.length>1&&!stop.has(w)).map(stem))];
 const raw=window.AdAstraSitePassages||{},index=(raw.passages||[]).map((r,order)=>({...r,order,keys:new Set(words(r.text)),titleKeys:new Set(words(r.section)),names:(r.terms||[]).map(normalize)}));
 const videos=(raw.videos||[]).map(r=>({...r,keys:new Set(words(r.title))}));
 const aliases=new Map();for(const r of index)for(const name of r.names)aliases.set(name,r);
 function search(value){
  const q=window.AdAstraGlossarySearch?.queryKey(value)||normalize(value),terms=words(q);
  if(!terms.length||terms.length>12)return {passages:[],videos:[]};
  const named=aliases.get(q)||[...aliases].find(([name])=>{const a=words(name);return a.length===terms.length&&a.every(w=>terms.includes(w));})?.[1];
  const counts=terms.map(w=>index.filter(r=>r.keys.has(w)).length);
  const ranked=index.filter(r=>r===named||terms.every(w=>r.keys.has(w))).map(r=>({...r,exact:r===named,score:(r===named?1000:0)+terms.reduce((sum,w,i)=>sum+(r.titleKeys.has(w)?8:0)+Math.log(1+index.length/(counts[i]+1)),0)+(r.text.length<650?1:0)})).sort((a,b)=>b.score-a.score||a.order-b.order);
  const seen=new Set(),passages=ranked.filter(r=>!seen.has(r.href)&&seen.add(r.href)).slice(0,5);
  const foundVideos=videos.filter(r=>terms.every(w=>r.keys.has(w))).slice(0,3);
  return {passages,videos:foundVideos};
 }
 window.AdAstraSiteSearch={search,stats:{pages:raw.pages,passages:index.length,videos:videos.length}};
})();
