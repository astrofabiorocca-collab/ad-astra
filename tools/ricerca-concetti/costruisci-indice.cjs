const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);
for(const p of ['assets/scuola-attiva/glossario-dati.js','assets/biblioteca/federazione-dati.js'])vm.runInContext(fs.readFileSync(p,'utf8'),c);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const reviewed={orbita:['orbite'],fotometria:['fotometria'],pulsar:['pulsars'],interferometria:['interferometrie'],polarimetro:['polarimetri'],bolometro:['bolometri']};
const data=c.window.AdAstraGlossary,fed=c.window.AdAstraFederation;
const stop=new Set('a ad al alla alle allo ai agli all anche ancora avere che chi ci cio come con da dal dalla dalle dei del della delle dello degli di e ed era essere fa fra gli ha hanno i il in la le lo loro ma ne nei nel nella nelle nello non o ogni per piu puo quale quali quando quanto questa queste questi questo se senza si sia sono su sul sulla sulle tra un una uno viene verso'.split(' '));
const records=data.map(e=>{
 const body=norm([e.definition,e.example,...(e.facts||[]),...(e.sections||[]).flatMap(s=>[s.title,...s.paragraphs])].join(' '));
 return {id:e.id,name:e.name,aliases:[...new Set([...(e.aliases||[]),...(fed.terms[e.id]?.aliases||[]),e.id.replace(/-/g,' '),...(reviewed[e.id]||[])])].filter(a=>norm(a)!==norm(e.name)),definition:e.definition,lesson:e.lesson,related:[...new Set(e.related||[])].filter(id=>data.some(x=>x.id===id)),words:[...new Set(body.split(' ').filter(w=>w.length>2&&!stop.has(w)))].join(' '),...(fed.terms[e.id]?{}:{sources:e.sources,added:true})};
});
for(const e of records)for(const id of [...e.related]){const target=records.find(t=>t.id===id);if(target&&!target.related.includes(e.id))target.related.push(e.id);}
const decode=value=>value.replace(/&#x([a-f0-9]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#([0-9]+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&');
const documents=fs.readdirSync('.').filter(n=>/^lezione-\d+-\d+\.html$/.test(n)||['guide.html','strumentazione.html','astrofotografia.html'].includes(n)).map(href=>{const html=fs.readFileSync(href,'utf8'),main=html.match(/<main[\s>][\s\S]*?<\/main>/i)?.[0]||'',text=main.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|quot|apos|#\d+);/g,' ');return {href,title:decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||href).replace(/\s*\| AD ASTRA$/,''),words:[...new Set(norm(text).split(' ').filter(w=>w.length>2&&!stop.has(w)))].join(' ')};});
const output='/* Generato da tools/ricerca-concetti/costruisci-indice.cjs; testi originali AD ASTRA. */\nwindow.AdAstraConcepts='+JSON.stringify(records)+';\nwindow.AdAstraConceptDocuments='+JSON.stringify(documents)+';\n';
fs.writeFileSync('assets/biblioteca/glossario-concetti.js',output);
fs.writeFileSync('assets/biblioteca/glossario-indice.js','window.AdAstraGlossaryIndex='+JSON.stringify(records.map(e=>[e.id,e.name,...e.aliases]))+';\n');
fs.writeFileSync('assets/biblioteca/glossario-sintesi.js','window.AdAstraGlossarySummaries='+JSON.stringify(Object.fromEntries(records.map(e=>[e.id,[e.definition,e.lesson]])))+';\n');
const audit={date:'2026-11-21',entries:records.length,indexedLessons:documents.length,aliases:records.reduce((n,e)=>n+e.aliases.length,0),relations:records.reduce((n,e)=>n+e.related.length,0),newDefinitions:records.filter(e=>e.added).map(e=>e.id),bytes:Buffer.byteLength(output)};
fs.writeFileSync('docs/ricerca-concetti-inventario.json',JSON.stringify(audit,null,2));console.log(audit);
