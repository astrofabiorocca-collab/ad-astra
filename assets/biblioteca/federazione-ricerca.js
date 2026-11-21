(() => {
 'use strict';
 const data = window.AdAstraFederation;
 if (!data) return;
 const search = window.AdAstraGlossarySearch;
 if (!search) return;
 const {normalize, lookup, resolve} = search;
 // Le nuove schede hanno fonti proprie; i rimandi dei concetti affini restano distinti.
 for (const record of search.records.filter(e => e.added)) {
  if (data.terms[record.id]) continue;
  const refs = (record.sources || []).map((source, i) => {
   const id = 'concetti-' + record.id + '-' + i;
   data.resources[id] = {id,title:source.title,url:source.url,source:new URL(source.url).hostname,
    type:'Approfondimenti',language:'Inglese',level:'Medio',areas:[record.lesson?.match(/^lezione-(\d+)-/)?.[1]?.padStart(2,'0')||'07'],description:'Fonte della scheda '+record.name};
   return {resource:id,score:100,reason:'Fonte specifica della definizione'};
  });
  data.terms[record.id] = {name:record.name,aliases:record.aliases,sources:refs,related:(record.related||[]).flatMap(id=>(data.terms[id]?.sources||[]).slice(0,3).map(ref=>({...ref,name:search.get(id)?.name||id}))),videos:[],
   lessons:record.lesson?[{title:'Percorso sul concetto',href:record.lesson}]:[]};
 }
 function documentLink(resource, page) {
  if (!page) return resource.url;
  const url = new URL(resource.url);
  if (/\.pdf$/i.test(url.pathname)) url.hash = 'page=' + page;
  else if (url.hostname === 'drive.google.com' && /\/file\/d\//.test(url.pathname)) url.hash = 'page=' + page;
  return url.href;
 }
 function matchesFilters(resource, filters = {}) {
  return ['type', 'source', 'language', 'level'].every(key => !filters[key] || resource[key] === filters[key]) &&
   (!filters.area || resource.areas.includes(filters.area));
 }
 function sources(id, filters = {}) {
  return (data.terms[id]?.sources || []).map(reference => {
   const resource = data.resources[reference.resource];
   return {
    ...resource,
    url: documentLink(resource, reference.page),
    reference,
    description: resource.description || reference.reason + (reference.page ? ' · pagina ' + reference.page : '')
   };
  }).filter(resource => matchesFilters(resource, filters));
 }
 function videoUrl(reference, termId) {
  const params = new URLSearchParams({video: reference.id});
  if (reference.seconds !== undefined) params.set('t', reference.seconds);
  if (termId) params.set('termine', termId);
  return 'videoteca.html?' + params;
 }
 function externalLink(label, href) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  if (/^https?:\/\//.test(href)) {
   link.target = '_blank';
   link.rel = 'noopener noreferrer';
  }
  return link;
 }
 function timeLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes + ':' + String(seconds % 60).padStart(2, '0');
 }
 function sourceItem(resource) {
  const row = document.createElement('li');
  row.append(externalLink(resource.title, resource.url));
  const description = document.createElement('small');
  description.textContent = [resource.source, resource.language,
   resource.reference?.page ? 'p. ' + resource.reference.page + ' del PDF' : '',
   resource.reference?.reason].filter(Boolean).join(' · ');
  row.append(description);
  if (resource.note) {
   const note = document.createElement('small');
   note.textContent = resource.note;
   row.append(note);
  }
  return row;
 }
 function referencePanel(id, {limit = 5, includeLessons = true, includeVideos = true, filters = {}} = {}) {
  const term = data.terms[id];
  if (!term) return null;
  const section = document.createElement('section');
  section.className = 'federation-references';
  const heading = document.createElement('h3');
  heading.textContent = 'Puoi approfondire qui';
  section.append(heading);
  const resources = sources(id, filters);
  const list = document.createElement('ul');
  list.append(...resources.slice(0, limit).map(sourceItem));
  section.append(list);
  if (resources.length > limit) {
   const details = document.createElement('details');
   const summary = document.createElement('summary');
   summary.textContent = 'Altre ' + (resources.length - limit) + ' fonti sul concetto';
   const rest = document.createElement('ul');
   rest.append(...resources.slice(limit).map(sourceItem));
   details.append(summary, rest);
   section.append(details);
  }
  if (term.related.length) {
   const details = document.createElement('details');
   const summary = document.createElement('summary');
   summary.textContent = 'Per comprendere i concetti collegati';
   const related = document.createElement('ul');
   for (const ref of term.related) {
    const resource = data.resources[ref.resource];
    if (!matchesFilters(resource, filters)) continue;
    const item = document.createElement('li');
    item.append(document.createTextNode(ref.name + ' · '), externalLink(resource.title, resource.url));
    related.append(item);
   }
   if (related.childElementCount) {
    details.append(summary, related);
    section.append(details);
   }
  }
  if (includeVideos && term.videos.length) {
   const heading = document.createElement('h4');
   heading.textContent = 'In Videoteca';
   const videos = document.createElement('ul');
   const rest = document.createElement('ul');
   for (const [index, ref] of term.videos.entries()) {
    const row = document.createElement('li');
    const resource = data.videos[ref.id];
    row.append(externalLink(resource.title, videoUrl(ref, id)));
    const note = document.createElement('small');
    note.textContent = ref.basis === 'transcript'
     ? ref.reason + ' · ' + timeLabel(ref.seconds) + ' · ' + ref.language
     : 'Argomento indicato nel titolo';
    row.append(note);
    (index < 5 ? videos : rest).append(row);
   }
   section.append(heading, videos);
   if (rest.childElementCount) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Altri ' + rest.childElementCount + ' video sul concetto';
    details.append(summary, rest);
    section.append(details);
   }
  }
  if (includeLessons && term.lessons.length) {
   const details = document.createElement('details');
   const summary = document.createElement('summary');
   summary.textContent = 'Continua nelle lezioni AD ASTRA';
   const list = document.createElement('ul');
   for (const lesson of term.lessons) {
    const row = document.createElement('li');
    row.append(externalLink(lesson.title, lesson.href));
    list.append(row);
   }
   details.append(summary, list);
   section.append(details);
  }
  return section;
 }
 window.AdAstraFederatedSearch = {
  normalize, lookup, resolve, sources, matchesFilters, videoUrl, timeLabel, referencePanel,
  terms: data.terms, resources: data.resources, videos: data.videos
 };
 // Existing entry points (including the assistant prototype) share the same aliases.
 // AdAstraGlossarySearch rimane l’unico motore lessicale condiviso.
})();
