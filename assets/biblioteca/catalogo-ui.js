(() => {
 'use strict';
 const data=window.AD_ASTRA_LIBRARY, root=document.querySelector('#catalogo');
 if(!data||!root)return;
 const $=id=>document.getElementById(id), q=$('library-query'), area=$('library-area'), type=$('library-type'), language=$('library-language'), level=$('library-level'), source=$('library-source'), sort=$('library-sort'), cards=$('library-results'), count=$('library-count'), more=$('library-more'), reset=$('library-reset');
 const normalized=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it')
  .replace(/\bsupernov(?:ae|as|a|e)\b/g,'supernova');
 const aliases = {'stelle di neutroni':'stella di neutroni','neutron star':'stella di neutroni','nane bianche':'nana bianca','white dwarf':'nana bianca','nuclear fusion':'fusione nucleare','moon':'luna'};
 const tokenize = value => normalized(value).match(/[\p{L}\p{N}]+/gu) || [];
 const key = value => tokenize(value).join(' ');
 const supplement = [
  ['fleck-anno-anomalistico','Anno anomalistico · Dizionario di astronomia','https://www.heinrichfleck.net/astronomia/dizionario.pdf#page=35','01','Heinrich Fleck','Intervallo tra due passaggi consecutivi al perielio.'],
  ['fleck-anno-draconico','Anno draconico · Dizionario di astronomia','https://www.heinrichfleck.net/astronomia/dizionario.pdf#page=35','01','Heinrich Fleck','Ritorno del Sole apparente allo stesso nodo dell’orbita lunare.'],
  ['fleck-fusione','Fusione nucleare · Dizionario di astronomia','https://www.heinrichfleck.net/astronomia/dizionario.pdf#page=179','04','Heinrich Fleck','Voce dedicata alla fusione nucleare.'],
  ['draconico-nasa','Anno draconico e periodicità delle eclissi','https://eclipse.gsfc.nasa.gov/SEsaros/SEperiodicity.html','01','NASA','Stagioni delle eclissi e ritorno del Sole in prossimità dei nodi lunari.'],
  ['fusione-nasa','Fusione nucleare nel Sole','https://science.nasa.gov/sun/facts/','04','NASA','Nel nucleo del Sole l’idrogeno si trasforma in elio, liberando energia.'],
  ['fusione-reazioni-openstax','Fusione nucleare · Produzione di energia nelle stelle','https://openstax.org/books/astronomy-2e/pages/16-3-the-solar-interior-theory','04','OpenStax','La catena protone-protone e la produzione di energia nel nucleo solare.'],

  ["amplitudine-ortiva-e-occasa-mazzucato", "Amplitudine ortiva e occasa · Termini in astronomia", "https://www.gruppom1.it/wp-content/uploads/2012/04/mtm_terminiastronomici.pdf#page=1", "01", "Michele T. Mazzucato", "Distanza angolare lungo l’orizzonte fra il punto in cui un astro sorge e l’est, oppure fra il punto in cui tramonta e l’ovest."],
  ["arco-diurno-mazzucato", "Arco diurno · Termini in astronomia", "https://www.gruppom1.it/wp-content/uploads/2012/04/mtm_terminiastronomici.pdf#page=2", "01", "Michele T. Mazzucato", "Parte della traiettoria apparente di un astro che si trova sopra l’orizzonte nel corso del suo moto diurno."],
  ["anno-anomalistico-mazzucato", "Anno anomalistico · Termini in astronomia", "https://www.gruppom1.it/wp-content/uploads/2012/04/mtm_terminiastronomici.pdf#page=1", "01", "Michele T. Mazzucato", "Intervallo medio fra due passaggi consecutivi della Terra al perielio, pari a circa 365,26 giorni."],
  ["anno-draconico-mazzucato", "Anno draconico · Termini in astronomia", "https://www.gruppom1.it/wp-content/uploads/2012/04/mtm_terminiastronomici.pdf#page=1", "01", "Michele T. Mazzucato", "Intervallo medio fra due passaggi del Sole apparente per lo stesso nodo dell’orbita lunare, circa 346,62 giorni."],
  ["anno-anomalistico-inaf", "Anno anomalistico · Astronomia fondamentale", "https://www.oato.inaf.it/biblioteca/pdf/TechRep078_Lattanzi.pdf#page=60", "01", "INAF Torino", "Lattanzi e Pannunzio, pagina 60 del PDF. Durata dell’anno anomalistico e moto del perielio."],
  ["sait-coordinate", "Coordinate celesti · Bignamino SAIt", "https://www.sait.it/sites/sait.interlandia.net/files/pictures/notizie/2022/Bignamino_astronomia_2022.pdf#page=34", "01", "Società Astronomica Italiana", "Sistema altazimutale, azimut, altezza e coordinate equatoriali."],
  ["sait-circumpolari", "Stelle circumpolari · Bignamino SAIt", "https://www.sait.it/sites/sait.interlandia.net/files/pictures/notizie/2022/Bignamino_astronomia_2022.pdf#page=40", "01", "Società Astronomica Italiana", "Stelle circumpolari, latitudine e declinazione."],
  ["sait-giorno", "Giorno siderale · Bignamino SAIt", "https://www.sait.it/sites/sait.interlandia.net/files/pictures/notizie/2022/Bignamino_astronomia_2022.pdf#page=54", "01", "Società Astronomica Italiana", "Giorno siderale e giorno solare vero."],
  ["sait-tempo", "Equazione del tempo · Bignamino SAIt", "https://www.sait.it/sites/sait.interlandia.net/files/pictures/notizie/2022/Bignamino_astronomia_2022.pdf#page=55", "01", "Società Astronomica Italiana", "Equazione del tempo e differenza tra tempo solare medio e vero."],
  ["sait-keplero", "Leggi di Keplero · Bignamino SAIt", "https://www.sait.it/sites/sait.interlandia.net/files/pictures/notizie/2022/Bignamino_astronomia_2022.pdf#page=70", "01", "Società Astronomica Italiana", "Leggi di Keplero e orbite planetarie."],

  ['fusione-stellare','Fusione nucleare nelle stelle','lezione-4-1.html','04','AD ASTRA','Come la fusione alimenta la luce delle stelle.'],
  ['residui-nana-bianca','Nana bianca ed evoluzione stellare','lezione-4-6.html','04','AD ASTRA','Che cosa resta delle stelle simili al Sole.'],
  ['fusione-openstax','Fusione nucleare · Massa ed energia','https://openstax.org/books/astronomy-2e/pages/16-2-mass-energy-and-the-theory-of-relativity','04','OpenStax','Capitolo 16.2: come la fusione converte parte della massa in energia nelle stelle.'],
  ['nana-openstax','Nana bianca · La fine delle stelle di piccola massa','https://openstax.org/books/astronomy-2e/pages/23-1-the-death-of-low-mass-stars','04','OpenStax','Capitolo 23.1: dalla perdita degli strati esterni alla nana bianca.'],
  ['supernova-openstax','Supernova · Le osservazioni','https://openstax.org/books/astronomy-2e/pages/23-3-supernova-observations','04','OpenStax','Capitolo 23.3: come si osservano e si distinguono le esplosioni stellari.'],
  ['artemis-i-nasa','Artemis I · Il volo di prova','https://www.nasa.gov/mission/artemis-i/','astronautica','NASA','Missione senza equipaggio per provare il sistema di lancio e la capsula Orion.'],
  ['artemis-ii-nasa','Artemis II · Missione con equipaggio','https://www.nasa.gov/mission/artemis-ii/','astronautica','NASA','Scheda ufficiale del sorvolo lunare con equipaggio.'],
  ['artemis-orion-nasa','Artemis · La capsula Orion','https://www.nasa.gov/reference/orion-spacecraft/','astronautica','NASA','Guida alla capsula che trasporta gli astronauti nel programma Artemis.'],
  ['artemis-faq-nasa','Artemis · Domande frequenti sul programma','https://www.nasa.gov/missions/artemis/faq-nasas-artemis-campaign-and-recent-updates/','astronautica','NASA','Obiettivi e organizzazione del programma lunare secondo la NASA.'],
  ['artemis-nasa','Artemis · Programma lunare NASA','https://www.nasa.gov/humans-in-space/artemis/','astronautica','NASA','Programma di esplorazione lunare con equipaggio e prospettiva di future missioni verso Marte.']
 ].map(([id,title,url,area,source,description])=>({
  id,title,url,source,description,areas:[area],type:url.includes('.pdf#page=')?'PDF e dispense':source==='NASA'?'Portali e strumenti':'Corsi e lezioni',
  language:['NASA','OpenStax'].includes(source)?'Inglese':'Italiano',level:'Facile',scope:url.includes('.pdf#page=')?'Passaggio del PDF':source==='NASA'?'Pagina ufficiale':source==='OpenStax'?'Capitolo di manuale':'Lezione AD ASTRA',review:'Approfondimento tematico'
 }));
 const federation = window.AdAstraFederatedSearch;
 const resourceKey = value => {
  const url = new URL(value, location.href);
  url.hash = '';
  url.searchParams.delete('usp');
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.href;
 };
 const resourceMap = new Map();
 for (const resource of [...data.resources, ...supplement, ...Object.values(federation?.resources || {})]) {
  const id = resourceKey(resource.url);
  if (!resourceMap.has(id)) resourceMap.set(id, resource);
 }
 const resources = [...resourceMap.values()];
 const names=Object.fromEntries(data.areas.map(a=>[a.id,a.title]));
 const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
 const link=(label,url)=>{const n=el('a',label);n.href=url;if(/^https?:/.test(url)){n.target='_blank';n.rel='noopener noreferrer';n.setAttribute('aria-label',label+' (sito esterno, nuova scheda)');}return n;};
 const addOptions=(select,values)=>[...new Set(values)].sort((a,b)=>a.localeCompare(b,'it')).forEach(v=>{const o=el('option',v);o.value=v;select.append(o);});
 data.areas.forEach(a=>{const o=el('option',a.title);o.value=a.id;area.append(o);});
 addOptions(type,resources.map(r=>r.type));addOptions(language,resources.map(r=>r.language));addOptions(level,resources.map(r=>r.level));addOptions(source,resources.map(r=>r.source));
 const params=new URLSearchParams(location.search);for(const [key,control]of Object.entries({q,area,type,language,level,source,sort})){const v=params.get(key);if(v!==null && (control===q||[...control.options].some(o=>o.value===v)))control.value=v;}
 const topics = window.AD_ASTRA_LIBRARY_TOPICS || {};

 const siteConnections=el('div');cards.after(siteConnections);
 const glossaryHint = el('div', '', 'catalog-method');
 glossaryHint.hidden = true;
 count.before(glossaryHint);
 const indexed = resources.map(resource => ({
  ...resource,
  titleKey: key(resource.title),
  search: key([resource.title, resource.description, resource.source,
   resource.year, resource.note, resource.scope, ...(topics[resource.id] || []),
   ...resource.areas.map(id => names[id])].join(' '))
 }));
 const controls={q,area,type,language,level,source,sort};
 const readFilters=()=>Object.fromEntries(Object.entries(controls).map(([key,c])=>[key,c.value]));
 let applied=readFilters(),limit=24,rows=[];
 function storeFilters(){const u=new URL(location.href);for(const name of ['video','termine','t'])u.searchParams.delete(name);for(const[key,c]of Object.entries({q,area,type,language,level,source,sort})){if(c.value && !(key==='sort'&&c.value==='recommended'))u.searchParams.set(key,c.value);else u.searchParams.delete(key);}try{history.replaceState(null,'',u);}catch{}}
 function resourceCard(r){
  const article=el('article',undefined,'catalog-card');article.id='risorsa-'+r.id;
  const meta=el('div',undefined,'catalog-card-meta');meta.append(el('span',r.type,'resource-type'),el('span',r.language));
  const h=el('h3');h.append(link(r.title,r.url));const credit=el('p',r.source+(r.year?' · '+r.year:''),'catalog-credit');
  article.append(meta,h,credit);if(['restricted','unverified'].includes(r.linkState))article.append(el('p','Accesso alla fonte da verificare','catalog-access-note'));article.append(el('p',r.description,'catalog-description'));
  const tags=el('div',undefined,'catalog-tags');r.areas.filter(a=>names[a]).forEach(a=>{const button=el('button',names[a]);button.type='button';button.addEventListener('click',()=>{area.value=a;$('library-query').focus({preventScroll:true});root.scrollIntoView({behavior:'auto',block:'start'});});tags.append(button);});article.append(tags);
  const details=el('details',undefined,'resource-details');details.append(el('summary','Contenuti, livello e provenienza'));
  const dl=el('dl');for(const[label,value]of [['Formato',r.scope],['Livello',r.level],['Fonte / autore',r.source],['Consultazione',r.review],['Link',r.linkLabel||'Collegamento alla fonte originale']]){dl.append(el('dt',label),el('dd',value));}details.append(dl);
  if(r.note)details.append(el('p',r.note,'resource-note'));
  if(r.author)details.append(el('p','Relatore: '+r.author));
  if(r.linkState==='unverified'||r.linkState==='restricted')details.append(el('p','La verifica automatica non ha confermato l’accesso. Il sito può richiedere una verifica del browser o applicare restrizioni.','resource-note'));
  if(r.linkState==='metadata' && ['Video','Playlist'].includes(r.type))details.append(el('p','Titolo catalogato da un elenco pubblico; disponibilità attuale e riproduzione da verificare su YouTube.','resource-note'));
  details.append(link('Pagina di provenienza ↗',r.sourcePage||r.url));
  for(const rel of r.related||[])details.append(link(rel.label+' ↗',rel.url));
  article.append(details);
  const actions=el('div',undefined,'catalog-actions');actions.append(link(r.type==='Video'?'Apri il video ↗':r.type==='Playlist'?'Apri la playlist ↗':r.scope==='Programma del corso'?'Apri il programma ↗':r.type==='PDF e dispense'?'Apri il documento ↗':'Consulta la risorsa ↗',r.url));
  if (r.type === 'Video' && /https?:/.test(r.url)) {
   const url = new URL(r.url);
   const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
   if (window.AdAstraVideoIds?.has(id)) actions.append(link('Apri nella Videoteca →', 'videoteca.html?video=' + encodeURIComponent(id)));
  }
  if (r.reference?.page) article.append(el('p', 'Passaggio a pagina ' + r.reference.page + ' del PDF. Il lettore della fonte può richiedere la selezione manuale della pagina.', 'catalog-access-note'));
  const a = r.areas.find(area => names[area]);
  if (a) {
   const lesson = link('Percorso AD ASTRA →', a === 'astronautica' ? '#astronautica' : 'area-' + a + '.html');
   lesson.setAttribute('aria-label', 'Esplora ' + names[a] + ' su AD ASTRA');
   actions.append(lesson);
  }
  article.append(actions);
  return article;
 }
 const conceptNotes = {
  'accrescimento': 'Quando il gas in orbita cede parte del suo momento angolare, può spostarsi verso il centro. In una stella giovane, parte del gas finisce sulla superficie e può lasciare un segnale ultravioletto. Vicino a un buco nero, invece, si osserva la radiazione del gas caldo prima che attraversi l’orizzonte. L’accrescimento è il trasferimento di materia; il disco è una delle strutture attraverso cui avviene.'
 };
 function clearResults() {
  siteConnections.replaceChildren();
  rows = [];
  cards.replaceChildren();
  glossaryHint.replaceChildren();
  glossaryHint.hidden = true;
  count.textContent = 'Imposta i filtri e premi «Avvia ricerca» per consultare le fonti.';
  $('library-empty').hidden = true;
  more.hidden = true;
 }
 function draw(update) {
  const query = key(applied.q);
  const search = window.AdAstraGlossarySearch;
  const resolution = search.resolve(applied.q);
  const matches = resolution.matches;
  const match = matches.length === 1 ? matches[0] : null;
  const term = match ? key(match.name) : (aliases[query] || search.queryKey(applied.q));
  const words = tokenize(term).filter(word => !['di','del','della','la','il','le','un','una','e'].includes(word));
  const selected = [...(match && federation ? federation.sources(match.id) : []),...(window.AdAstraSiteSearch?.external(applied.q,24)||[])];
  const references = new Map(selected.map(resource => [resourceKey(resource.url), resource]));
  const variants = [words, ...Object.entries(aliases).filter(([, name]) => name === term).map(([alias]) => tokenize(alias))];
  const contains = (field, tokens) => tokens.length > 0 && tokens.every(word => (' ' + field + ' ').includes(' ' + word + ' '));
  const isRelevant = resource => !words.length || references.has(resourceKey(resource.url)) ||
   variants.some(tokens => contains(resource.search, tokens)) ||
   (!match && words.length === 1 && resource.search.includes(words[0]));
  const selectedConcepts = match && federation ? federation.terms[match.id] : null;
  glossaryHint.replaceChildren();
  glossaryHint.hidden = !matches.length && !resolution.suggestions.length && !search.documents(applied.q).length;
  search.renderSuggestions(glossaryHint,resolution,{href:(id,name)=>'biblioteca-online.html?'+new URLSearchParams({...applied,q:name})+'#catalogo'});
  if (matches.length > 1) {
   glossaryHint.append(el('strong', 'Scegli la voce del Glossario'));
   for (const {id, name} of matches) {
    glossaryHint.append(el('br'), link(name, 'biblioteca-online.html?' + new URLSearchParams({q: name}) + '#catalogo'));
   }
  }
  if (match) {
   const sheet = window.AdAstraGlossary?.find(entry => entry.id === match.id);
   const [definition] = window.AdAstraGlossarySummaries?.[match.id] || [];
   glossaryHint.append(el('h2', match.name + ' · Glossario'));
   glossaryHint.append(el('p', sheet?.definition || definition || '', 'catalog-concept-definition'));
   const expanded = sheet?.sections?.[0]?.paragraphs?.[0];
   if (expanded && expanded !== definition) glossaryHint.append(el('p', expanded, 'catalog-concept-definition'));
   glossaryHint.append(link('Leggi la voce completa →', 'glossario.html#' + encodeURIComponent(match.id)));
   const relations = search.related(match.id);
   if(relations.length){
    const details=el('details'),summary=el('summary','Concetti collegati'),list=el('ul');
    for(const item of relations){const row=el('li');row.append(link(item.name,'biblioteca-online.html?'+new URLSearchParams({q:item.name})+'#catalogo'));list.append(row);}
    details.append(summary,list);glossaryHint.append(details);
   }
   const wiki = window.AdAstraWikipediaNote?.(match.id);
   if (wiki) glossaryHint.append(wiki);
   if (conceptNotes[match.id]) glossaryHint.append(el('p', conceptNotes[match.id]));
   if (federation) {
    const showVideos = !applied.source && !applied.area && !applied.language && !applied.level &&
     (!applied.type || applied.type === 'Video');
    const panel = federation.referencePanel(match.id, {filters: applied, includeVideos: showVideos,
      includeLessons: !applied.source && !applied.type && !applied.area && !applied.language && !applied.level});
    if (panel) glossaryHint.append(panel);
   }
  }
  const seen = new Set(indexed.map(r=>resourceKey(r.url)));
  const additional = selected.filter(r=>!seen.has(resourceKey(r.url))).map(r=>({...r,search:key([r.title,r.description].join(' '))}));
  rows = [...indexed,...additional].map(resource => {
    const reference = references.get(resourceKey(resource.url));
    return reference ? {...resource, ...reference, search: resource.search} : resource;
   }).filter(resource => isRelevant(resource) &&
   (!applied.area || resource.areas.includes(applied.area)) &&
   (!applied.type || applied.type === resource.type) &&
   (!applied.language || applied.language === resource.language) &&
   (!applied.level || applied.level === resource.level) &&
   (!applied.source || applied.source === resource.source));
  const order = {'PDF e dispense': 0, 'Approfondimenti': 1, 'Portali e strumenti': 2, 'Corsi e lezioni': 3, 'Video': 4, 'Playlist': 5};
  const score = resource => resource.reference?.score || (contains(resource.titleKey || key(resource.title), words) ? 55 : 30);
  rows.sort((a, b) => applied.sort === 'title' ? a.title.localeCompare(b.title, 'it') :
   applied.sort === 'source' ? a.source.localeCompare(b.source, 'it') || a.title.localeCompare(b.title, 'it') :
   Number(!/^https?:/.test(a.url)) - Number(!/^https?:/.test(b.url)) ||
   score(b) - score(a) || (order[a.type] ?? 3) - (order[b.type] ?? 3) ||
   a.title.localeCompare(b.title, 'it'));
  const videoIndex = window.AdAstraVideoTitles || {};
  const requestedVideo = !update ? params.get('video') : null;
  const videoResults = !match && !applied.source && !applied.area && !applied.language && !applied.level &&
   (!applied.type || applied.type === 'Video') && words.length
   ? Object.entries(videoIndex).filter(([id, title]) => id === requestedVideo || contains(key(title), words)).slice(0, 5) : [];
  if (videoResults.length) {
   const list = el('ul');
   for (const [id, title] of videoResults) {
    const row = el('li');
    row.append(link(title, 'videoteca.html?video=' + encodeURIComponent(id)));
    list.append(row);
   }
   glossaryHint.hidden = false;
   glossaryHint.append(el('h3', 'Video nella Videoteca'), list);
  }
  cards.replaceChildren(...rows.slice(0, limit).map(resourceCard));
  siteConnections.replaceChildren();
  const connected=window.AdAstraSiteConnections?.render(applied.q,{includeGlossary:!match});
  const allowInternal=(!applied.source||applied.source==='AD ASTRA')&&(!applied.language||applied.language==='Italiano')&&!applied.level&&!applied.area&&!applied.type;
  if(connected&&allowInternal)siteConnections.append(connected);
  const siteCount=connected&&allowInternal?connected.querySelectorAll('li').length:0;
  const linkedVideoCount = (!applied.source && !applied.area && !applied.language && !applied.level &&
   (!applied.type || applied.type === 'Video') ? selectedConcepts?.videos?.length : 0) || videoResults.length;
  count.textContent = rows.length + ' risors' + (rows.length === 1 ? 'a trovata' : 'e trovate') +
   ' · ' + Math.min(limit, rows.length) + ' mostrate';
  $('library-empty').hidden = rows.length > 0 || linkedVideoCount > 0 || siteCount > 0;
  if(siteCount)count.textContent+=' · '+siteCount+' rimandi nei contenuti del sito';
  more.hidden = rows.length <= limit;
  if (update) storeFilters();
 }
 root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();applied=readFilters();limit=24;draw(true);count.scrollIntoView({behavior:'auto',block:'center'});});
 reset.addEventListener('click',()=>{for(const c of[q,area,type,language,level,source])c.value='';sort.value='recommended';applied=readFilters();limit=24;clearResults();storeFilters();q.focus({preventScroll:true});root.querySelector('form').scrollIntoView({behavior:'auto',block:'start'});});
 document.querySelectorAll('[data-library-type]').forEach(b=>b.addEventListener('click',()=>{type.value=b.dataset.libraryType;q.focus({preventScroll:true});root.scrollIntoView({behavior:'auto',block:'start'});}));
 more.addEventListener('click',()=>{const old=limit;limit+=24;draw(false);const target=cards.children[old]?.querySelector('h3 a');target?.focus({preventScroll:true});});
 document.querySelectorAll('[data-library-source]').forEach(button=>button.addEventListener('click',()=>{for(const c of[q,area,type,language,level])c.value='';source.value=button.dataset.librarySource;root.scrollIntoView({behavior:'auto',block:'start'});$('library-search').focus({preventScroll:true});}));
 $('library-total').textContent=resources.length;
 const requestedSearch = ['q','area','type','language','level','source','video'].some(name => params.get(name)?.trim());
 if (!requestedSearch) {
  count.textContent = 'Imposta i filtri e premi «Avvia ricerca» per consultare le fonti.';
  cards.replaceChildren();
  $('library-empty').hidden = true;
  more.hidden = true;
 } else draw(false);
})();
