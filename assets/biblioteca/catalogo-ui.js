(() => {
 'use strict';
 const data=window.AD_ASTRA_LIBRARY, root=document.querySelector('#catalogo');
 if(!data||!root)return;
 const $=id=>document.getElementById(id), q=$('library-query'), area=$('library-area'), type=$('library-type'), language=$('library-language'), level=$('library-level'), source=$('library-source'), sort=$('library-sort'), cards=$('library-results'), count=$('library-count'), more=$('library-more'), reset=$('library-reset');
 const normalized=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it');
 const names=Object.fromEntries(data.areas.map(a=>[a.id,a.title]));
 const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
 const link=(label,url)=>{const n=el('a',label);n.href=url;if(/^https?:/.test(url)){n.target='_blank';n.rel='noopener noreferrer';n.setAttribute('aria-label',label+' (sito esterno, nuova scheda)');}return n;};
 const addOptions=(select,values)=>[...new Set(values)].sort((a,b)=>a.localeCompare(b,'it')).forEach(v=>{const o=el('option',v);o.value=v;select.append(o);});
 data.areas.forEach(a=>{const o=el('option',a.title);o.value=a.id;area.append(o);});
 addOptions(type,data.resources.map(r=>r.type));addOptions(language,data.resources.map(r=>r.language));addOptions(level,data.resources.map(r=>r.level));addOptions(source,data.resources.map(r=>r.source));
 const params=new URLSearchParams(location.search);for(const [key,control]of Object.entries({q,area,type,language,level,source,sort})){const v=params.get(key);if(v!==null && (control===q||[...control.options].some(o=>o.value===v)))control.value=v;}
 const indexed=data.resources.map(r=>({...r,search:normalized([r.title,r.description,r.source,r.year,r.note,r.scope,...r.areas.map(a=>names[a])].join(' '))}));
 const controls={q,area,type,language,level,source,sort};
 const readFilters=()=>Object.fromEntries(Object.entries(controls).map(([key,c])=>[key,c.value]));
 let applied=readFilters(),limit=24,rows=[];
 function storeFilters(){const u=new URL(location.href);for(const[key,c]of Object.entries({q,area,type,language,level,source,sort})){if(c.value && !(key==='sort'&&c.value==='recommended'))u.searchParams.set(key,c.value);else u.searchParams.delete(key);}try{history.replaceState(null,'',u);}catch{}}
 function resourceCard(r){
  const article=el('article',undefined,'catalog-card');article.id='risorsa-'+r.id;
  const meta=el('div',undefined,'catalog-card-meta');meta.append(el('span',r.type,'resource-type'),el('span',r.language));
  const h=el('h3');h.append(link(r.title,r.url));const credit=el('p',r.source+(r.year?' · '+r.year:''),'catalog-credit');
  article.append(meta,h,credit);if(['restricted','unverified'].includes(r.linkState))article.append(el('p','Accesso alla fonte da verificare','catalog-access-note'));article.append(el('p',r.description,'catalog-description'));
  const tags=el('div',undefined,'catalog-tags');r.areas.forEach(a=>{const button=el('button',names[a]);button.type='button';button.addEventListener('click',()=>{area.value=a;$('library-query').focus({preventScroll:true});root.scrollIntoView({behavior:'auto',block:'start'});});tags.append(button);});article.append(tags);
  const details=el('details',undefined,'resource-details');details.append(el('summary','Contenuti, livello e provenienza'));
  const dl=el('dl');for(const[label,value]of [['Formato',r.scope],['Livello',r.level],['Fonte / autore',r.source],['Consultazione',r.review],['Link',r.linkLabel||'Collegamento alla fonte originale']]){dl.append(el('dt',label),el('dd',value));}details.append(dl);
  if(r.note)details.append(el('p',r.note,'resource-note'));
  if(r.author)details.append(el('p','Relatore: '+r.author));
  if(r.linkState==='unverified'||r.linkState==='restricted')details.append(el('p','La verifica automatica non ha confermato l’accesso. Il sito può richiedere una verifica del browser o applicare restrizioni.','resource-note'));
  if(r.linkState==='metadata')details.append(el('p','Titolo catalogato da un elenco pubblico; disponibilità attuale e riproduzione da verificare su YouTube.','resource-note'));
  details.append(link('Pagina di provenienza ↗',r.sourcePage||r.url));
  for(const rel of r.related||[])details.append(link(rel.label+' ↗',rel.url));
  article.append(details);
  const actions=el('div',undefined,'catalog-actions');actions.append(link(r.type==='Video'?'Apri il video ↗':r.type==='Playlist'?'Apri la playlist ↗':r.scope==='Programma del corso'?'Apri il programma ↗':r.type==='PDF e dispense'?'Apri il documento ↗':'Consulta la risorsa ↗',r.url));
  const a=r.areas[0];const lesson=link('Percorso AD ASTRA →',a==='astronautica'?'#astronautica':'area-'+a+'.html');lesson.setAttribute('aria-label','Esplora '+names[a]+' su AD ASTRA');actions.append(lesson);article.append(actions);return article;
 }
 function draw(update){
  const words=normalized(applied.q.trim()).split(/\s+/).filter(Boolean);
  rows=indexed.filter(r=>words.every(w=>r.search.includes(w))&&(!applied.area||r.areas.includes(applied.area))&&(!applied.type||applied.type===r.type)&&(!applied.language||applied.language===r.language)&&(!applied.level||applied.level===r.level)&&(!applied.source||applied.source===r.source));
  const order={'PDF e dispense':0,'Corsi e lezioni':1,'Portali e strumenti':2,'Approfondimenti':3,'Playlist':4,'Video':5};
  rows.sort((a,b)=>applied.sort==='title'?a.title.localeCompare(b.title,'it'):applied.sort==='source'?a.source.localeCompare(b.source,'it')||a.title.localeCompare(b.title,'it'):(Number(['restricted','unverified'].includes(a.linkState))-Number(['restricted','unverified'].includes(b.linkState)))||((order[a.type]??3)-(order[b.type]??3))||(a.language==='Italiano'?0:1)-(b.language==='Italiano'?0:1)||a.title.localeCompare(b.title,'it'));
  cards.replaceChildren(...rows.slice(0,limit).map(resourceCard));
  count.textContent=rows.length+' risors'+(rows.length===1?'a trovata':'e trovate')+' · '+Math.min(limit,rows.length)+' mostrat'+(Math.min(limit,rows.length)===1?'a':'e');
  $('library-empty').hidden=rows.length!==0;more.hidden=rows.length<=limit;
  if(update)storeFilters();
 }
 root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();applied=readFilters();limit=24;draw(true);count.scrollIntoView({behavior:'auto',block:'center'});});
 reset.addEventListener('click',()=>{for(const c of[q,area,type,language,level,source])c.value='';sort.value='recommended';applied=readFilters();limit=24;draw(true);q.focus();});
 document.querySelectorAll('[data-library-type]').forEach(b=>b.addEventListener('click',()=>{type.value=b.dataset.libraryType;q.focus({preventScroll:true});root.scrollIntoView({behavior:'auto',block:'start'});}));
 more.addEventListener('click',()=>{const old=limit;limit+=24;draw(false);const target=cards.children[old]?.querySelector('h3 a');target?.focus({preventScroll:true});});
 document.querySelectorAll('[data-library-source]').forEach(button=>button.addEventListener('click',()=>{for(const c of[q,area,type,language,level])c.value='';source.value=button.dataset.librarySource;root.scrollIntoView({behavior:'auto',block:'start'});$('library-search').focus({preventScroll:true});}));
 $('library-total').textContent=data.resources.length;draw(false);
})();
