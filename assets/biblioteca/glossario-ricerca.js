/* Ricerca condivisa: le corrispondenze concettuali non sono sinonimi. */
(() => {
 'use strict';
 const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLocaleLowerCase('it').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const queryKey = value => normalize(value).replace(/^(?:(?:che cosa|che cos|cosa|cos) (?:e|sono|significa|significano)|che significa|come funziona|come funzionano|cosa si intende per|cosa vuol dire|mi spieghi|definisci|definizione (?:di|del|della|dell)|spiegami|parlami di)\s+/,'')
  .replace(/^(?:il|lo|la|i|gli|le|un|uno|una|l)\s+/,'');
 const stop = new Set('a ad al alla alle allo ai agli all anche ancora avere che chi ci cio come con da dal dalla dalle dei del della delle dello degli di e ed era essere fa fra gli ha hanno i il in la le lo loro ma ne nei nel nella nelle nello non o ogni per piu puo quale quali quando quanto questa queste questi questo se senza si sia sono su sul sulla sulle tra un una uno viene verso'.split(' '));
 const tokens = v => normalize(v).split(' ').filter(w=>w.length>2&&!stop.has(w));
 const records = window.AdAstraConcepts || (window.AdAstraGlossaryIndex || []).map(([id,name,...aliases])=>({id,name,aliases,definition:window.AdAstraGlossarySummaries?.[id]?.[0]||'',related:[],words:''}));
 const byId=new Map(records.map(e=>[e.id,e])), titles=new Map(), labels=new Map(), inverted=new Map();
 const add=(map,key,id)=>{if(!key)return;if(!map.has(key))map.set(key,new Set());map.get(key).add(id);};
 for(const e of records){
  add(titles,normalize(e.name),e.id);
  for(const label of [e.name,...(e.aliases||[])])add(labels,normalize(label),e.id);
  for(const word of new Set(tokens([e.name,...(e.aliases||[]),e.words||e.definition].join(' '))))add(inverted,word,e.id);
 }
 const hit = (id,extra={}) => ({id,name:byId.get(id).name,...extra});
 function lookup(value){
  const q=queryKey(value),ids=titles.get(q)||labels.get(q);
  return ids?[...ids].map(id=>hit(id)):[];
 }
 const stem = word => word.length>4?word.replace(/([cg])h([ie])$/,'$1$2').replace(/[aeio]$/,''):word;
 const inflections=new Map();
 for(const [label,ids]of labels){const key=label.split(' ').map(stem).join(' ');for(const id of ids)add(inflections,key,id);}
 function editDistance(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  let previous=Array.from({length:b.length+1},(_,i)=>i),older=previous;
  for(let i=1;i<=a.length;i++){
   const row=[i];
   for(let j=1;j<=b.length;j++){
    row[j]=Math.min(row[j-1]+1,previous[j]+1,previous[j-1]+Number(a[i-1]!==b[j-1]));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])row[j]=Math.min(row[j],older[j-2]+1);
   }
   older=previous;previous=row;
  }
  return previous[b.length];
 }
 function resolve(value){
  const q=queryKey(value),exact=lookup(value);
  if(exact.length)return {query:q,kind:titles.has(q)?'exact':'alias',matches:exact,suggestions:[]};
  if(!q||q.length>250)return {query:q,kind:'none',matches:[],suggestions:[]};
  const morph=inflections.get(q.split(' ').map(stem).join(' '));
  if(morph?.size)return {query:q,kind:'variant',matches:[],suggestions:[...morph].slice(0,5).map(id=>hit(id,{reason:'Possibile variante della voce'}))};
  if(q.length>=5){
   const max=q.length>=10?2:1,near=new Map();let best=max+1;
   for(const [label,ids]of labels){
    if(Math.abs(q.length-label.length)>max)continue;
    const d=editDistance(q,label,max);
    if(d>max||d>Math.ceil(q.length*.2))continue;
    if(d<best){best=d;near.clear();}
    if(d===best)for(const id of ids)near.set(id,hit(id,{reason:'Forse cercavi',distance:d}));
   }
   if(near.size)return {query:q,kind:'typo',matches:[],suggestions:[...near.values()].slice(0,5)};
  }
  const words=[...new Set(tokens(q))];
  if(!words.length)return {query:q,kind:'none',matches:[],suggestions:[]};
  const candidates=new Map();
  for(const word of words)for(const id of inverted.get(word)||[]){
   const score=Math.log(1+records.length/(inverted.get(word)?.size||1));
   const item=candidates.get(id)||{count:0,score:0};item.count++;item.score+=score;candidates.set(id,item);
  }
  // Un nome già noto dentro una frase propone una voce collegata, mai un sinonimo implicito.
  const embedded=new Set();
  for(const [label,ids]of labels){const parts=tokens(label);if((parts.length>=2||label.length>=6)&&(' '+q+' ').includes(' '+label+' '))for(const id of ids)embedded.add(id);}
  for(const id of embedded)if(!candidates.has(id))candidates.set(id,{count:0,score:0});
  const ranked=[...candidates].filter(([id,s])=>s.count===words.length||embedded.has(id)).map(([id,s])=>{
   const e=byId.get(id),title=normalize(e.name+' '+(e.aliases||[]).join(' '));
   return {id,score:s.score+words.filter(w=>title.split(' ').includes(w)).length*3+(title.split(' ').includes(words[0])?4:0)+(embedded.has(id)?3:0)};
  }).sort((a,b)=>b.score-a.score||byId.get(a.id).name.localeCompare(byId.get(b.id).name,'it')).slice(0,5);
  return {query:q,kind:ranked.length?'content':'none',matches:[],suggestions:ranked.map(({id})=>hit(id,{reason:'Parole della ricerca presenti nella spiegazione o nei nomi associati'}))};
 }
 function related(id){return (byId.get(id)?.related||[]).filter(x=>byId.has(x)).map(x=>hit(x));}
 function documents(value){
  const words=[...new Set(tokens(queryKey(value)))];if(!words.length)return [];
  return (window.AdAstraConceptDocuments||[]).filter(doc=>words.every(w=>(' '+doc.words+' ').includes(' '+w+' ')))
   .map(doc=>({...doc,score:words.filter(w=>normalize(doc.title).split(' ').includes(w)).length}))
   .sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,'it')).slice(0,5);
 }
 function renderSuggestions(container,result,{href=id=>'glossario.html#'+encodeURIComponent(id),select}={}){
  if(result.matches.length)return;
  const lessons=documents(result.query);
  if(!result.suggestions.length&&!lessons.length)return;
  const box=document.createElement('section');box.className='concept-suggestions';
  const title=document.createElement('p');
  title.textContent=result.kind==='typo'?'Forse cercavi…':result.kind==='variant'?'Possibili varianti del termine cercato':'Voci in cui il concetto è trattato';
  box.append(title);const list=document.createElement('ul');
  for(const item of result.suggestions){const li=document.createElement('li'),a=document.createElement(select?'button':'a');
   a.textContent=item.name;if(select){a.type='button';a.addEventListener('click',()=>select(item));}else a.href=href(item.id,item.name);
   li.append(a);list.append(li);}
  const note=document.createElement('p');note.textContent='Sono suggerimenti: scegli la voce pertinente per leggere la sua definizione e le fonti.';
  if(result.suggestions.length)box.append(list,note);
  else title.textContent='Il concetto nei percorsi didattici';
  if(lessons.length){const h=document.createElement('p'),ul=document.createElement('ul');h.textContent='Parole della ricerca presenti nelle lezioni:';for(const doc of lessons){const li=document.createElement('li'),a=document.createElement('a');a.href=doc.href;a.textContent=doc.title;li.append(a);ul.append(li);}box.append(h,ul);}
  container.append(box);
 }
 window.AdAstraGlossarySearch={normalize,queryKey,lookup,resolve,related,documents,renderSuggestions,get:id=>byId.get(id),records};
})();
