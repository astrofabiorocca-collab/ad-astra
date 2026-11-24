/* Run from any directory: node tools/ricerca-concetti/verifica-corpus.cjs */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'../..'),c={window:{}};vm.createContext(c);
for(const f of ['assets/biblioteca/glossario-concetti.js','assets/biblioteca/glossario-ricerca.js','assets/galatea/contenuti-sito.js','assets/galatea/ricerca-sito.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const data=c.window.AdAstraSitePassages,engine=c.window.AdAstraSiteSearch;
for(const [file,hash]of Object.entries(data.sources))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n')).digest('hex'),hash,'Rebuild corpus after changing '+file);
for(const term of data.concepts)assert(engine.search(term.name).passages.some(r=>r.href==='glossario.html#'+term.id),'Glossary '+term.id);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/poster/revisioni-20261023/catalogo.json'),'utf8'));
const thematic=JSON.parse(fs.readFileSync(path.join(root,'assets/poster/testi-ricerca.json'),'utf8'));
assert.equal(Object.keys(thematic).length,catalog.posters.length);
for(const p of catalog.posters){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p.png))).digest('hex'),thematic[p.id].imageSha256,'Review poster '+p.id);assert(engine.search(p.title,{includeGlossary:false,limit:20}).passages.some(r=>r.href.endsWith('tavola='+p.id)),'Poster '+p.id);}
const docs=new Map(),ids=new Set(data.concepts.map(r=>r.id));
for(const r of data.passages){const u=new URL(r.href,'https://local/'),f=decodeURIComponent(u.pathname.slice(1));assert(fs.existsSync(path.join(root,f)),r.href);if(u.hash){const id=decodeURIComponent(u.hash.slice(1));if(f==='glossario.html')assert(ids.has(id),r.href);else{if(!docs.has(f))docs.set(f,fs.readFileSync(path.join(root,f),'utf8'));assert(docs.get(f).includes('id="'+id+'"')||docs.get(f).includes("id='"+id+"'"),r.href);}}}
for(const [name,id]of [['Stellarium','stellarium'],['Cartes du Ciel','cartes'],['Siril','siril'],['DeepSkyStacker','dss'],['AutoStakkert','autostakkert'],['RegiStax','registax'],['AstroSurface','astrosurface'],['GIMP','gimp'],['Affinity','makeup2']])assert(engine.search(name).passages.some(r=>r.href==='software.html?software='+id),name);
assert(engine.search('stacker fotografico').passages.some(r=>r.kind==='software'));
assert(engine.search('stalker fotografico').suggestions.length);
assert(!engine.search('banana cosmica inesistente').passages.length);
assert.equal(engine.stats.transcriptVideos,27);
console.log(JSON.stringify({status:'PASS',...engine.stats,posters:catalog.posters.length,sources:Object.keys(data.sources).length}));
