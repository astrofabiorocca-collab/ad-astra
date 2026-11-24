/* The same corpus results are rendered in Library and Glossary. No results on an empty query. */
(() => {
 'use strict';
 function render(query,{includeGlossary=false,limit=6}={}){
  const engine=window.AdAstraSiteSearch;if(!engine||!query.trim())return null;
  const result=engine.search(query,{includeGlossary,limit});if(!result.passages.length&&!result.videos.length&&!result.suggestions.length)return null;
  const box=document.createElement('section');box.className='site-connections';
  const heading=document.createElement('h3');heading.textContent='Continua nei contenuti di AD ASTRA';box.append(heading);
  const list=document.createElement('ul');
  const append=(label,href,note)=>{const row=document.createElement('li'),a=document.createElement('a');a.textContent=label;a.href=href;row.append(a);if(note){const p=document.createElement('small');p.textContent=note;row.append(p);}list.append(row);};
  for(const r of result.passages)append(r.page+' · '+r.section,r.href,(r.basis==='related'?'Concetto collegato · ':'')+(r.kind==='poster'?(r.coverage==='scheda'?'Corrispondenza nella scheda della tavola':'Argomenti letti nei riquadri della tavola'):''));
  for(const r of result.videos)append('Videoteca · '+r.title,r.href,r.basis==='transcript'?'Parole nei sottotitoli '+(r.automatic?'automatici ':'')+'· '+Math.floor(r.seconds/60)+':'+String(r.seconds%60).padStart(2,'0')+' · '+r.language:'Corrispondenza nel titolo del video');
  for(const r of result.suggestions)append(r.label,'biblioteca-online.html?'+new URLSearchParams({q:r.query})+'#catalogo','Correzione proposta: scegli per confermare');
  box.append(list);return box;
 }
 window.AdAstraSiteConnections={render};
})();
