/* Shared corpus retrieval. Related concepts are labelled, never treated as definitions. */
(() => {
 'use strict';
 if(window.AdAstraSiteSearch)return;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const stop=new Set('a ad al alla alle allo ai agli all anche che chi ci cio come cosa cos con da dal dalla dalle dei del della delle dello degli di e ed essere fa fra gli ha hanno i il in la le lo loro ma ne nei nel nella nelle nello non o ogni per piu puo quale quali quando questa queste questi questo se senza si sia sono su sul sulla sulle tra un una uno viene vorrei sapere significa significato spiegami parlami funziona funzionano cerca cercami trovare trova mi puoi spiegare posso usare utilizzar utilizzare cerco consigli consigliami adatto dedicato'.split(' '));
 const stem=w=>w.length>4?w.replace(/([cg])h([ie])$/,'$1$2').replace(/[aeio]$/,''):w;
 const words=v=>[...new Set(normalize(v).split(' ').filter(w=>w.length>1&&!stop.has(w)).map(stem))];
 const raw=window.AdAstraSitePassages||{},concepts=raw.concepts||[];
 const byId=new Map(concepts.map(c=>[c.id,c]));
 const labels=new Map();for(const c of concepts)for(const label of [c.name,...(c.aliases||[])])labels.set(words(label).join(' '),c);
 const synonyms=[['stacking','stacker fotografico','stacking fotografico','sovrapposizione fotografica','sovrapposizione immagini'],['astroinseguitore','astroinseguitori','star tracker'],['reflex','fotocamera reflex','dslr'],['mirrorless','fotocamera mirrorless'],['deepskystacker','dss'],['cartes du ciel','skychart'],['affinity','affinity photo']];
 const related=[['interferometro','interferometria'],['spettroscopio','spettroscopia'],['fotometro','fotometria'],['polarimetro','polarimetria']];
 const indexed=(raw.passages||[]).map((r,order)=>({...r,order,titleKeys:new Set(words(r.section)),keys:new Set(words(r.text+' '+r.section+' '+r.page)),names:(r.terms||[]).map(normalize)}));
 const inverted=new Map();for(const r of indexed)for(const key of r.keys){if(!inverted.has(key))inverted.set(key,new Set());inverted.get(key).add(r.order);}
 const videoTitles=(raw.videos||[]).map(r=>({...r,keys:new Set(words(r.title)),basis:'title'}));
 const cache=new Map();
 function variants(q){
  const list=[{text:q,basis:'literal'}],key=words(q).join(' '),concept=labels.get(key);
  if(concept){for(const label of [concept.name,...(concept.aliases||[])])list.push({text:label,basis:'alias'});for(const id of (concept.related||[]).slice(0,8)){const target=byId.get(id);if(target)list.push({text:target.name,basis:'related'});}}
  for(const group of synonyms)if(group.some(v=>words(v).join(' ')===key))for(const text of group)list.push({text,basis:'alias'});
  for(const group of related)if(group.some(v=>words(v).join(' ')===key))for(const text of group)if(words(text).join(' ')!==key)list.push({text,basis:'related'});
  return list;
 }
 function search(value,{limit=8,includeGlossary=true}={}){
  const q=window.AdAstraGlossarySearch?.queryKey(value)||normalize(value),cacheKey=q+'|'+limit+'|'+includeGlossary;
  if(cache.has(cacheKey))return cache.get(cacheKey);
  const queryWords=words(q);if(!queryWords.length||queryWords.length>16)return {passages:[],videos:[],suggestions:[]};
  const candidates=new Map();
  for(const variant of variants(q)){
   const terms=words(variant.text);if(!terms.length)continue;
   const lists=terms.map(t=>inverted.get(t)||new Set()).sort((a,b)=>a.size-b.size);
   for(const id of lists[0]){
    const r=indexed[id];if(!includeGlossary&&r.kind==='glossario'||!terms.every(t=>r.keys.has(t)))continue;
    const exact=r.names.includes(normalize(q));
    const titleMatch=terms.every(t=>r.titleKeys.has(t));
    const score=(exact?1000:0)+(titleMatch?100:0)+(r.kind==='software'?20:0)+(r.kind==='glossario'?-12:0)+(r.coverage==='scheda'?-8:0)+(variant.basis==='related'?-90:0)+terms.reduce((sum,w)=>sum+Math.log(1+indexed.length/((inverted.get(w)?.size||0)+1)),0)+(r.text.length<650?2:0);
    const previous=candidates.get(id);if(!previous||score>previous.score)candidates.set(id,{...r,exact,score,basis:variant.basis,matched:variant.text});
   }
  }
  const ranked=[...candidates.values()].sort((a,b)=>b.score-a.score||a.order-b.order),seen=new Set();
  const passages=ranked.filter(r=>r.kind!=='trascrizione'&&!seen.has(r.href)&&seen.add(r.href)).slice(0,limit);
  const videoSeen=new Set(),videos=[];
  for(const r of ranked.filter(r=>r.kind==='trascrizione'))if(!videoSeen.has(r.id)){videoSeen.add(r.id);videos.push({id:r.id,title:r.section,href:r.href,basis:'transcript',seconds:r.seconds,language:r.language,automatic:r.automatic});if(videos.length>=3)break;}
  for(const v of videoTitles)if(videos.length<3&&!videoSeen.has(v.id)&&queryWords.every(w=>v.keys.has(w))){videos.push(v);videoSeen.add(v.id);}
  const suggestions=/\bstalker fotografic[oa]\b/.test(q)?[{label:'Intendevi stacking fotografico?',query:'stacking fotografico'}]:[];
  const result={passages,videos,suggestions};cache.set(cacheKey,result);if(cache.size>150)cache.delete(cache.keys().next().value);return result;
 }
 let externalIndex,externalResources;
 function external(value,limit=4){
  const f=window.AdAstraFederatedSearch;if(!f)return [];
  const matches=window.AdAstraGlossarySearch?.lookup(value)||[];
  const linked=matches.flatMap(m=>f.sources(m.id));
  if(externalResources!==f.resources){externalResources=f.resources;externalIndex=Object.values(f.resources).map(r=>({resource:r,keys:new Set(words(r.title+' '+r.description))}));}
  const query=window.AdAstraGlossarySearch?.queryKey(value)||normalize(value),options=variants(query).filter(v=>v.basis!=='related').map(v=>words(v.text)).filter(v=>v.length);
  const literal=externalIndex.filter(r=>options.some(terms=>terms.every(t=>r.keys.has(t)))).map(r=>r.resource);
  const seen=new Set();return [...linked,...literal].filter(r=>/^https?:\/\//.test(r.url)&&!seen.has(r.url)&&seen.add(r.url)).slice(0,limit);
 }
 window.AdAstraSiteSearch={search,external,normalize,stats:{pages:raw.pages,passages:indexed.length,videos:videoTitles.length,concepts:concepts.length,transcriptVideos:new Set(indexed.filter(r=>r.kind==='trascrizione').map(r=>r.id)).size}};
})();
