/* Controllo dei collegamenti delle notizie senza dipendenze o richieste esterne. */
const fs=require('fs'),path=require('path'),assert=require('assert'),root=path.resolve(__dirname,'../..');
const files=fs.readdirSync(root).filter(n=>/^notizia-2026-\d{2}\.html$/.test(n));
assert.equal(files.length,44);let links=0;
for(const name of ['notizie.html',...files]){
 const html=fs.readFileSync(path.join(root,name),'utf8');
 assert(!/\.\.\/github-sync|href="n26-|src="assets\/N26-/.test(html),name+' percorso privato');
 if(name!=='notizie.html'){
  assert(html.includes('Redazione AD ASTRA'));assert(!html.includes('class="draft-review"'));
  assert.equal([...html.matchAll(/class="gallery-slide"/g)].length,3,name+' galleria incompleta');
  assert.equal([...html.matchAll(/class="news-month-link"/g)].length,3,name+' notizie dello stesso mese');
  const month=Math.ceil(Number(name.match(/(\d{2})\.html$/)[1])/4);
  assert.equal([...html.matchAll(new RegExp('href="notizie.html#mese-'+month+'"','g'))].length,3,name+' ritorno al mese');
 }
 for(const m of html.matchAll(/(?:href|src)="([^"]*)"/g)){
  const value=m[1].replace(/&amp;/g,'&');if(!value||/^(https?:|data:|mailto:|tel:|\/)/.test(value))continue;
  const [file,hash]=value.split('#'),target=path.join(root,decodeURIComponent(file.split('?')[0]||name));
  assert(fs.existsSync(target),name+' -> '+value);links++;
  if(hash&&target.endsWith('.html')&&!target.endsWith('glossario.html')){
   const dest=fs.readFileSync(target,'utf8');assert(dest.includes('id="'+hash+'"')||dest.includes("id='"+hash+"'"),name+' -> '+value);
  }
 }
}
const index=fs.readFileSync(path.join(root,'notizie.html'),'utf8');
assert.equal([...index.matchAll(/class="edition-month"/g)].length,11);
assert.equal([...index.matchAll(/class="edition-card"/g)].length,3);
assert.equal([...index.matchAll(/class="archive-news-icon"/g)].length,44);
console.log(JSON.stringify({articles:files.length,months:11,recentCards:3,localReferences:links,status:'PASS'}));
