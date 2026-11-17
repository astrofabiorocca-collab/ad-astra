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
 const resources = [...data.resources,...supplement];
 const names=Object.fromEntries(data.areas.map(a=>[a.id,a.title]));
 const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
 const link=(label,url)=>{const n=el('a',label);n.href=url;if(/^https?:/.test(url)){n.target='_blank';n.rel='noopener noreferrer';n.setAttribute('aria-label',label+' (sito esterno, nuova scheda)');}return n;};
 const addOptions=(select,values)=>[...new Set(values)].sort((a,b)=>a.localeCompare(b,'it')).forEach(v=>{const o=el('option',v);o.value=v;select.append(o);});
 data.areas.forEach(a=>{const o=el('option',a.title);o.value=a.id;area.append(o);});
 addOptions(type,resources.map(r=>r.type));addOptions(language,resources.map(r=>r.language));addOptions(level,resources.map(r=>r.level));addOptions(source,resources.map(r=>r.source));
 const params=new URLSearchParams(location.search);for(const [key,control]of Object.entries({q,area,type,language,level,source,sort})){const v=params.get(key);if(v!==null && (control===q||[...control.options].some(o=>o.value===v)))control.value=v;}
 const topics = window.AD_ASTRA_LIBRARY_TOPICS || {};

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
  if (r.type === 'Video' && /https?:/.test(r.url)) {
   const url = new URL(r.url);
   const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
   if (window.AdAstraVideoIds?.has(id)) actions.append(link('Apri nella Videoteca →', 'videoteca.html?video=' + encodeURIComponent(id)));
  }
  const a=r.areas[0];const lesson=link('Percorso AD ASTRA →',a==='astronautica'?'#astronautica':'area-'+a+'.html');lesson.setAttribute('aria-label','Esplora '+names[a]+' su AD ASTRA');actions.append(lesson);article.append(actions);return article;
 }
 function wikipediaCitation(match) {
  const details = el('details', undefined, 'catalog-criteria');
  const status = el('p', 'Caricamento della citazione…');
  status.setAttribute('aria-live', 'polite');
  details.append(el('summary', 'Citazione da Wikipedia'), status);
  details.addEventListener('toggle', async () => {
   if (!details.open || details.dataset.loaded) return;
   details.dataset.loaded = 'true';
   const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', origin: '*', redirects: '1',
    prop: 'extracts|info|pageprops', exintro: '1', explaintext: '1', exsentences: '1',
    ppprop: 'disambiguation', titles: match.name
   });
   try {
    const response = await fetch('https://it.wikipedia.org/w/api.php?' + params);
    if (!response.ok) throw new Error('Wikipedia indisponibile');
    const page = (await response.json()).query?.pages?.[0];
    const words = page?.extract?.trim().split(/\s+/) || [];
    if (page?.missing || page?.pageprops?.disambiguation !== undefined || !page?.lastrevid || !words.length) {
     status.textContent = 'Nessuna citazione disponibile per questa voce.';
     return;
    }
    const excerpt = words.slice(0, 25).join(' ') + (words.length > 25 ? ' […]' : '');
    const revision = 'https://it.wikipedia.org/w/index.php?oldid=' + encodeURIComponent(page.lastrevid);
    const credit = el('p');
    credit.append(link('Wikipedia · ' + page.title, revision), document.createTextNode(' · '),
      link('CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'));
    status.replaceWith(el('blockquote', excerpt), credit);
   } catch {
    status.textContent = 'Citazione temporaneamente indisponibile. Chiudi e riapri per riprovare.';
    delete details.dataset.loaded;
   }
  });
  return details;
 }
 const reviewedConceptSources = {
  'afocale': [
   ['Sistemi afocali · fasci paralleli e ingrandimento angolare', 'https://wp.optics.arizona.edu/jgreivenkamp/wp-content/uploads/sites/11/2018/12/201-202-12-Afocal-Systems.pdf', 'University of Arizona · EN'],
   ['Ripresa attraverso l’oculare con una fotocamera dotata di obiettivo', 'https://rasc.ca/sites/default/files/ardocuments/Patterson-vector.pdf', 'Royal Astronomical Society of Canada · EN']
  ],

  'nube-molecolare': [
   ['Gas molecolare freddo e traccianti del monossido di carbonio', 'https://www.oas.inaf.it/it/ricerca/m1-it/evoluzione-galassie/lato-freddo/', 'INAF OAS Bologna'],
   ['Come si formano i pilastri nelle nubi molecolari', 'https://science.nasa.gov/asset/webb/how-dense-pillars-form-in-molecular-clouds/', 'NASA, ESA e STScI · animazione EN'],
   ['Mezzo interstellare, formazione stellare e astrochimica', 'https://almascience.eso.org/alma-science/ism-star-formation-and-astrochemistry', 'ALMA Science Portal · EN'],
   ['Nubi molecolari come luoghi di formazione stellare', 'https://openstax.org/books/astronomy/pages/21-1-star-formation', 'OpenStax · EN'],
   ['Osservare le nubi interstellari con l’effetto Doppler', 'https://science.nasa.gov/wp-content/uploads/2023/09/Electromagnetic_Math.pdf', 'NASA · esercizio su dati radio · EN']
  ],

  'nana-bianca': [
   ['Nane bianche · evoluzione del Sole', 'https://www.oacn.inaf.it/rsn/rsn-2/nane-bianche/', 'INAF · Osservatorio Astronomico di Capodimonte'],
   ['Nane bianche · dimensioni, densità e raffreddamento', 'https://science.nasa.gov/universe/stars/types/', 'NASA Science · EN'],
   ['La fine delle stelle di piccola massa', 'https://openstax.org/books/astronomy-2e/pages/23-1-the-death-of-low-mass-stars', 'OpenStax · EN'],
   ['Il raffreddamento e la cristallizzazione delle nane bianche', 'https://www.media.inaf.it/2024/04/02/cristalli-ghiaccio-nane-bianche/', 'Media INAF'],
   ['Una nana bianca osservata con il Very Large Telescope', 'https://messenger.eso.org/public/news/eso2403/', 'ESO · EN']
  ],

  'adattamento-al-buio': [
   ['Quanto è buio il buio?', 'https://edu.inaf.it/astrodidattica/luce-buio/', 'EduINAF'],
   ['Adattamento al buio · Sensazione e percezione', 'https://www.uniba.it/it/docenti/curci-antonietta/attivita-didattica/psicologia-generale/slides-psicologia-generale-n.3-sensazione', 'Università di Bari'],
   ['Adattamento al buio e torce rosse', 'https://www.nps.gov/articles/dark-adaptation-of-the-human-eye-and-the-value-of-red-flashlights.htm', 'National Park Service · EN'],
   ['Condizioni di osservazione al telescopio', 'https://www.cambridge.org/core/books/abs/celestial-objects-for-modern-telescopes/observing-sites-and-conditions/3BCB860EC821DF6B7E580310193B9402', 'Cambridge University Press · EN'],
   ['Pigmenti visivi e sensibilità nella visione notturna', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11761961/', 'Studio sperimentale · PubMed Central · EN']
  ]
 };
 function draw(update){
  const query = key(applied.q);
  const matches = window.AdAstraGlossarySearch.lookup(applied.q);
  const term = matches.length === 1 ? key(matches[0].name) : (aliases[query] || query);
  const words = tokenize(term).filter(word => !['di','del','della','la','il','le','un','una','e'].includes(word));
  const match = matches.length === 1 ? matches[0] : null;
  glossaryHint.replaceChildren();
  glossaryHint.hidden = !matches.length;
  if (matches.length > 1) {
   glossaryHint.append(el('strong', 'Scegli la voce del glossario'));
   for (const {id, name} of matches) glossaryHint.append(el('br'), link(name, 'glossario.html#' + encodeURIComponent(id)));
  }
  if (match) {
   const {id, name} = match;
   const sheet = window.AdAstraGlossary?.find(entry => entry.id === id);
   const [definition = sheet?.definition, lesson = sheet?.lesson] = window.AdAstraGlossarySummaries?.[id] || [];
   glossaryHint.append(el('strong', name + ' · Glossario'));
   if (definition) glossaryHint.append(el('p', definition));
   const expanded = sheet?.sections?.[0]?.paragraphs?.[0];
   if (expanded && expanded !== definition) glossaryHint.append(el('p', expanded));
   glossaryHint.append(link('Apri la voce del glossario →', 'glossario.html#' + encodeURIComponent(id)));
   if (lesson) glossaryHint.append(document.createTextNode(' · '), link('Leggi la lezione →', lesson));
   const note = window.AdAstraWikipediaNote?.(id);
   if (note) glossaryHint.append(note);
   if (typeof sheet?.source === 'string' && /^https?:[/][/]/i.test(sheet.source)) {
    const reference = el('p');
    reference.append(link('Fonte indicata nella scheda del glossario ↗', sheet.source));
    glossaryHint.append(reference);
   }
   if (!note) glossaryHint.append(wikipediaCitation(match));
  }
  const variants = [words, ...Object.entries(aliases).filter(([, label]) => label === term).map(([alias]) => tokenize(alias))];
  const contains = (field, tokens) => tokens.every(word => (' '+field+' ').includes(' '+word+' '));
  const score = resource => !words.length ? 0 : variants.some(tokens => contains(resource.titleKey,tokens)) ? 2 : 1;
  const relevant = resource => variants.some(tokens => contains(resource.search,tokens)) || (!match && words.length === 1 && resource.search.includes(words[0]));
  rows=indexed.filter(r=>relevant(r)&&(!applied.area||r.areas.includes(applied.area))&&(!applied.type||applied.type===r.type)&&(!applied.language||applied.language===r.language)&&(!applied.level||applied.level===r.level)&&(!applied.source||applied.source===r.source));
  const order={'PDF e dispense':0,'Corsi e lezioni':1,'Portali e strumenti':2,'Approfondimenti':3,'Playlist':4,'Video':5};
  const institutionalSources = /^(?:edu inaf|inaf|nasa|esa|eso)(?:$|\s+[·–-])/i;
  const sourcePriority = resource => institutionalSources.test(resource.source) ? 0 : 1;
  rows.sort((a,b)=>applied.sort==='title'?a.title.localeCompare(b.title,'it'):applied.sort==='source'?a.source.localeCompare(b.source,'it')||a.title.localeCompare(b.title,'it'):(score(b)-score(a))||(Number(['restricted','unverified'].includes(a.linkState))-Number(['restricted','unverified'].includes(b.linkState)))||(words.length ? sourcePriority(a)-sourcePriority(b) : 0)||((order[a.type]??3)-(order[b.type]??3))||(a.language==='Italiano'?0:1)-(b.language==='Italiano'?0:1)||a.title.localeCompare(b.title,'it'));
  const handouts = match && !applied.source && !applied.type && !applied.area && !applied.language && !applied.level ? (window.AdAstraHandoutMatches?.[match.id] || []) : [];
  const reviewed = match && !applied.source && !applied.type && !applied.area && !applied.language && !applied.level ? (reviewedConceptSources[match.id] || []) : [];
  if (words.length && (rows.length || handouts.length || reviewed.length)) {
   const references = el('ul');
   const destinations = new Set();
   const documentUrl = url => url.split('#')[0].replace(/[?&]usp=sharing$/, '');
   for (const [title, url, sourceName] of reviewed) {
    destinations.add(documentUrl(url));
    const item = el('li');
    item.append(link(title, url), document.createTextNode(' · ' + sourceName));
    references.append(item);
   }
   for (const [title, url, page] of handouts) {
    if (destinations.size >= 5) break;
    const destination = documentUrl(url);
    if (destinations.has(destination)) continue;
    destinations.add(destination);
    const item = el('li');
    item.append(link(title, url), document.createTextNode(' · Dispensa INAF · testo a p. ' + page));
    references.append(item);
    if (destinations.size === 5) break;
   }
   for (const resource of rows) {
    if (destinations.size === 5) break;
    const destination = documentUrl(resource.url);
    if (destinations.has(destination) || ['restricted', 'unverified'].includes(resource.linkState)) continue;
    destinations.add(destination);
    const item = el('li');
    item.append(link(resource.title, resource.url), document.createTextNode(' · ' + resource.source));
    references.append(item);
    if (destinations.size === 5) break;
   }
   if (destinations.size) {
    glossaryHint.hidden = false;
    glossaryHint.append(el('h3', 'Puoi approfondire qui'), references);
   }
  }
  const video = match && window.AdAstraConceptVideos?.[match.id];
  if (video) {
   const related = el('p');
   related.append(document.createTextNode('In Videoteca · '),
      link(video.title, 'videoteca.html?video=' + encodeURIComponent(video.id)));
   glossaryHint.append(related);
  }
  const videoIndex = window.AdAstraVideoTitles || {};
  const requestedVideo = !update ? params.get('video') : null;
  const selectedTitle = requestedVideo && videoIndex[requestedVideo];
  const matchesVideoFilter = !applied.type || applied.type === 'Video';
  const videoResults = !applied.source && !applied.area && !applied.language && !applied.level && matchesVideoFilter && words.length
   ? Object.entries(videoIndex).filter(([, title]) => contains(key(title), words)).slice(0, 5) : [];
  if (selectedTitle && key(selectedTitle) === query && !videoResults.some(([id]) => id === requestedVideo)) {
   videoResults.unshift([requestedVideo, selectedTitle]);
   videoResults.length = Math.min(5, videoResults.length);
  }
  if (videoResults.length) {
   const results = el('ul');
   for (const [id, title] of videoResults) {
    const row = el('li');
    row.append(link(title, 'videoteca.html?video=' + encodeURIComponent(id)));
    results.append(row);
   }
   glossaryHint.hidden = false;
   glossaryHint.append(el('h3', 'Video nella Videoteca'), results);
  }
  cards.replaceChildren(...rows.slice(0,limit).map(resourceCard));
  count.textContent=rows.length+' risors'+(rows.length===1?'a trovata':'e trovate')+' · '+Math.min(limit,rows.length)+' mostrat'+(Math.min(limit,rows.length)===1?'a':'e');
  $('library-empty').hidden=rows.length!==0;more.hidden=rows.length<=limit;
  if(update)storeFilters();
 }
 root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();applied=readFilters();limit=24;draw(true);count.scrollIntoView({behavior:'auto',block:'center'});});
 reset.addEventListener('click',()=>{for(const c of[q,area,type,language,level,source])c.value='';sort.value='recommended';applied=readFilters();limit=24;rows=[];cards.replaceChildren();glossaryHint.hidden=true;glossaryHint.replaceChildren();count.textContent='Imposta i filtri e premi «Avvia ricerca» per consultare le fonti.';$('library-empty').hidden=true;more.hidden=true;storeFilters();q.focus({preventScroll:true});root.querySelector('form').scrollIntoView({behavior:'auto',block:'start'});});
 document.querySelectorAll('[data-library-type]').forEach(b=>b.addEventListener('click',()=>{type.value=b.dataset.libraryType;q.focus({preventScroll:true});root.scrollIntoView({behavior:'auto',block:'start'});}));
 more.addEventListener('click',()=>{const old=limit;limit+=24;draw(false);const target=cards.children[old]?.querySelector('h3 a');target?.focus({preventScroll:true});});
 document.querySelectorAll('[data-library-source]').forEach(button=>button.addEventListener('click',()=>{for(const c of[q,area,type,language,level])c.value='';source.value=button.dataset.librarySource;root.scrollIntoView({behavior:'auto',block:'start'});$('library-search').focus({preventScroll:true});}));
 $('library-total').textContent=resources.length;draw(false);
})();
