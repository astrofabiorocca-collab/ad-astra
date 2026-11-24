(() => {
 'use strict';
 if(document.querySelector('.galatea-launcher'))return;
 const scriptRoot=new URL('./',document.currentScript.src),siteRoot=new URL('../../',scriptRoot),asset=name=>new URL(name,scriptRoot).href;
 const SESSION='ad-astra-galatea-v1', POSITION=SESSION+'-position';
 const welcome='Ciao, sono Galatea, l’operatrice digitale di AD ASTRA. Come posso accompagnarti nella tua esplorazione dell’universo?';
 const normal=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const read=(storage,key)=>{try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}};
 const write=(storage,key,value)=>{try{storage.setItem(key,JSON.stringify(value));}catch{}};
 let sessionStore,localStore;try{sessionStore=window.sessionStorage;}catch{}try{localStore=window.localStorage;}catch{}
 const saved=read(sessionStore,SESSION)||{};
 const safeUrl=value=>{try{const u=new URL(value,siteRoot);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
 let messages=Array.isArray(saved.messages)?saved.messages.filter(m=>m&&['user','galatea'].includes(m.role)&&typeof m.text==='string').slice(-36):[];
 if(!messages.length)messages=[{role:'galatea',text:welcome}];
 let opened=false,busy=false,enginePromise,booksPromise;


 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};

 function createPortrait(){
  const img=el('img',undefined,'galatea-portrait');img.src=asset('galatea.webp');img.alt='';img.width=640;img.height=647;img.setAttribute('aria-hidden','true');return img;
 }
 const launcher=el('button',undefined,'galatea-launcher');launcher.type='button';launcher.setAttribute('aria-label','Apri Galatea, operatrice digitale di AD ASTRA');launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-expanded','false');launcher.title='Apri Galatea. Trascina per spostarla; Alt e frecce per spostarla con la tastiera.';
 launcher.append(createPortrait(),el('span',undefined,'launcher-dot'));
 const panel=el('aside',undefined,'galatea-panel');panel.hidden=true;panel.dataset.state='idle';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','galatea-name');
 panel.innerHTML=`<header><span class="galatea-avatar"></span><div class="galatea-identity"><h2 id="galatea-name">GALATEA</h2><p>Operatrice digitale · AD ASTRA</p><p class="galatea-state">A tua disposizione</p></div><div class="galatea-window-tools"><button type="button" data-minimize aria-label="Minimizza Galatea" title="Minimizza">−</button><button type="button" data-close aria-label="Chiudi Galatea" title="Chiudi">×</button></div></header><div class="galatea-messages" role="log" aria-label="Conversazione con Galatea" aria-live="polite" aria-relevant="additions"></div><form class="galatea-compose"><label for="galatea-query">Scrivi una domanda o un comando</label><div class="galatea-input-row"><input id="galatea-query" type="text" maxlength="400" placeholder="Per esempio: cos’è una nana bianca?" autocomplete="off" required><button type="submit">Invia</button></div><div class="galatea-toolbar"><details class="galatea-settings"><summary>Preferenze</summary><p>Conversazione conservata soltanto per questa sessione del browser.</p><button type="button" data-reset>Nuova conversazione</button><button type="button" data-position-reset>Ripristina posizione</button></details></div><p class="galatea-status" role="status">Scrivi la tua domanda: risposte e rimandi restano consultabili qui.</p></form>`;
 panel.querySelector('.galatea-avatar').append(createPortrait());
 document.body.append(launcher,panel);

 const log=panel.querySelector('.galatea-messages'),form=panel.querySelector('form'),input=panel.querySelector('input'),status=panel.querySelector('.galatea-status'),stateLabel=panel.querySelector('.galatea-state'),send=panel.querySelector('[type=submit]');
 const persist=()=>write(sessionStore,SESSION,{messages:messages.slice(-36),open:opened});
 const setState=(state,text)=>{panel.dataset.state=state;stateLabel.textContent=text||({idle:'A tua disposizione',loading:'Consulto le risorse…'}[state]);};
 const announce=text=>{status.textContent=text;};
 function placePanel(){
  if(!opened)return;
  const W=innerWidth,H=window.visualViewport?.height||innerHeight;
  panel.style.maxHeight=Math.max(160,H-16)+'px';
  const r=launcher.getBoundingClientRect(),w=panel.getBoundingClientRect().width,h=panel.getBoundingClientRect().height;
  let left=Math.min(Math.max(8,r.right-w),Math.max(8,W-w-8));
  let top=r.top-h-12;if(top<8)top=Math.min(r.bottom+12,H-h-8);
  top=Math.max(8,Math.min(top,H-h-8));
  panel.style.left=left+'px';panel.style.top=top+'px';panel.style.right='auto';panel.style.bottom='auto';
 }
 function openPanel(focus=true){opened=true;panel.hidden=false;launcher.setAttribute('aria-expanded','true');persist();requestAnimationFrame(()=>{placePanel();log.scrollTop=log.scrollHeight;if(focus)input.focus({preventScroll:true});});}
 function closePanel(minimize=false){opened=false;panel.hidden=true;launcher.setAttribute('aria-expanded','false');persist();launcher.focus({preventScroll:true});announce(minimize?'Galatea ridotta a icona.':'Galatea chiusa.');}
 launcher.addEventListener('click',event=>{if(Date.now()<suppressClick){event.preventDefault();suppressClick=0;return;}suppressClick=0;opened?closePanel(true):openPanel();});
 panel.querySelector('[data-close]').onclick=()=>closePanel();panel.querySelector('[data-minimize]').onclick=()=>closePanel(true);
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closePanel();}});
 function appendMessage(message,{save=true}={}){
  const box=el('article',undefined,'galatea-message');box.dataset.role=message.role;box.append(el('p',message.role==='user'?'TU':'GALATEA','galatea-message-label'),el('p',message.text));
  for(const item of (Array.isArray(message.links)?message.links:[]).slice(0,12)){
   const href=safeUrl(item.href);if(!href)continue;const a=el('a',String(item.label||'Approfondisci'));a.href=href;
   if(new URL(href).origin===siteRoot.origin&&new URL(href).pathname.startsWith(siteRoot.pathname)){a.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(href);});}
   else {a.target='_blank';a.rel='noopener noreferrer';}
   box.append(a);
  }
  for(const choice of (Array.isArray(message.choices)?message.choices:[]).slice(0,5)){if(typeof choice.query!=='string')continue;const button=el('button',choice.label||choice.query,'choice');button.type='button';button.onclick=()=>submit(choice.query);box.append(button);}
  log.append(box);while(log.children.length>36)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;
  if(save){messages.push(message);messages=messages.slice(-36);persist();}

 }
 for(const message of messages)appendMessage(message,{save:false});
 function loadScript(file){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(file,siteRoot).href;script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Risorsa non disponibile'));};document.head.append(script);});}
 function getEngine(){
  if(window.AdAstraGlossarySearch?.resolve)return Promise.resolve(window.AdAstraGlossarySearch);
  if(!enginePromise)enginePromise=loadScript('assets/biblioteca/glossario-concetti.js?v=20261121').then(()=>loadScript('assets/biblioteca/glossario-ricerca.js?v=20261121')).then(()=>window.AdAstraGlossarySearch).catch(error=>{enginePromise=null;throw error;});
  return enginePromise;
 }
 const siteLink=(label,href)=>({label,href:new URL(href,siteRoot).href});
 const routes=[['biblioteca federata','biblioteca-online.html','Biblioteca Federata'],['biblioteca online','biblioteca-online.html','Biblioteca Federata'],['biblioteca','biblioteca.html','Biblioteca'],['videoteca','videoteca.html','Videoteca'],['glossario','glossario.html','Glossario scientifico'],['scuola di astronomia','scuola-astronomia.html','Scuola di Astronomia'],['scuola','scuola-astronomia.html','Scuola di Astronomia'],['lezioni','lezioni.html','Lezioni'],['laboratorio','laboratorio.html','Laboratorio didattico'],['poster','poster.html','Poster educativi'],['pubblicazioni di fabio rocca','pubblicazioni-fabio-rocca.html','Le pubblicazioni di Fabio Rocca'],['le mie pubblicazioni','pubblicazioni-fabio-rocca.html','Le pubblicazioni di Fabio Rocca'],['pubblicazioni di ad astra','pubblicazioni-ad-astra.html','Blog e pubblicazioni'],['pubblicazioni ad astra','pubblicazioni-ad-astra.html','Blog e pubblicazioni'],['pubblicazioni','pubblicazioni-ad-astra.html','Blog e pubblicazioni'],['notizie','notizie.html','Notizie'],['magazine','ventunesimo.html','Magazine'],['chi cura ad astra','chi-cura-ad-astra.html','Chi cura AD ASTRA'],['contatti','contatti.html','Contatti'],['home','index.html','Home']];
 function routeCommand(q){const value=q.replace(/^(?:apri|mostra|mostrami|vai|portami)\s+/,'').replace(/^(?:a|al|alla|alle|nel|nella|nelle|il|la|le|lo)\s+/,'');return value!==q?routes.find(r=>r[0]===value):null;}
 function topicQuery(q,mode){let t=q;if(mode==='lesson')t=t.replace(/^.*?lezion\w*\s*/,'');else if(mode==='book')t=t.replace(/^.*?libr\w*\s*/,'').replace(/^(?:sono|e|disponibili|disponibile|ci sono|avete|presenti)\s*/g,'');return t.replace(/^(?:sono\s+)?(?:disponibili\s+)?(?:su|sui|sugli|sulle|sul|sulla|sullo|di|del|della|dei|delle|gli|i|le|il|la|un|una)\s+/,'').trim();}
 async function answerQuestion(text){
  const q=normal(text),route=routeCommand(q);
  if(route)return {text:'Ti accompagno nella sezione '+route[2]+'. Puoi continuare a consultarmi mentre esplori.',links:[siteLink('Apri '+route[2],route[1])],navigate:route[1]};
  if(/^(ciao|buongiorno|buonasera|salve|buon pomeriggio)$/.test(q))return {text:welcome,choices:[{label:'Che cos’è una nana bianca?',query:'nana bianca'},{label:'Apri la Biblioteca',query:'apri la biblioteca'}]};
  if(/^(chi sei|cosa puoi fare|come funzioni|chi e galatea|che cosa puoi fare)$/.test(q))return {text:'Sono l’operatrice digitale per consultare e navigare AD ASTRA. Cerco nelle schede del Glossario e nei percorsi disponibili, propongo fonti e riconosco comandi come “Apri la biblioteca”. Non genero nuove spiegazioni scientifiche e non uso un modello generativo.',links:[siteLink('Scopri il progetto AD ASTRA','chi-cura-ad-astra.html')]};
  const search=await getEngine();
  if(/\blibr[oi]\b/.test(q)){
   const topic=topicQuery(q,'book');
   if(!booksPromise)booksPromise=fetch(new URL('assets/biblioteca/libri.json',siteRoot)).then(r=>{if(!r.ok)throw Error('Catalogo non disponibile');return r.json();}).catch(e=>{booksPromise=null;throw e;});
   const books=await booksPromise,words=topic.split(' ').filter(w=>w.length>3&&!['quali','disponibili','sono'].includes(w));
   const found=Object.values(books).map(book=>{
    let matched=0,score=0;
    for(const word of words){let hit=false;for(const [field,weight]of [[book.title,4],[book.function,3],[book.short,2],[book.section,1],[book.description,1]]){const body=normal(field);if(body.includes(word)||word.length>6&&body.includes(word.slice(0,-2))){score+=weight;hit=true;}}if(hit)matched++;}
    return {book,matched,score};
   }).filter(r=>!words.length||r.matched===words.length).sort((a,b)=>b.score-a.score).slice(0,5);
   return {text:found.length?'Nelle schede della Biblioteca ho trovato queste letture'+(topic?' collegate al tema cercato':'')+'. Hanno tagli e livelli diversi. Apri la scheda del libro per conoscere autore, livello e presentazione.':'Non trovo una scheda di libro esplicitamente associata a questo tema. Puoi consultare il catalogo o cercare le fonti nella Biblioteca Federata.',links:[...found.map(({book})=>siteLink(book.title+' · '+book.author,'biblioteca.html#libro-'+book.isbn)),siteLink('Esplora i libri della Biblioteca','biblioteca.html'),...(topic?[siteLink('Cerca le fonti su questo tema','biblioteca-online.html?'+new URLSearchParams({q:topic})+'#catalogo')]:[])]};
  }
  if(/\blezion[ei]\b/.test(q)){
   const topic=topicQuery(q,'lesson'),result=search.resolve(topic),canonical=result.matches[0];
   const docs=search.documents(canonical?.name||topic);
   const links=docs.map(d=>siteLink(d.title,d.href));
   if(canonical){const lesson=search.get(canonical.id)?.lesson;if(lesson&&!links.some(l=>l.href===new URL(lesson,siteRoot).href))links.unshift(siteLink('Percorso consigliato: '+canonical.name,lesson));}
   return {text:links.length?'Ecco i percorsi in cui il tema è trattato. Le corrispondenze si basano sui titoli e sulle parole presenti nei testi.':'Non ho trovato una lezione specifica con queste parole. Puoi esplorare l’indice delle lezioni o provare un termine più breve.',links:[...links.slice(0,5),siteLink('Indice delle lezioni','lezioni.html')]};
  }
  const query=text.replace(/^\s*(?:cerca(?:mi)?|trova(?:mi)?)\s+(?:il\s+)?(?:significato|la definizione|definizione)\s+(?:di|del|della|dell[’'])\s*/i,'');
  const resolution=search.resolve(query);
  if(resolution.matches.length===1){
   const m=resolution.matches[0],record=search.get(m.id);
   return {text:record.definition,links:[siteLink('Glossario · '+m.name,'glossario.html#'+encodeURIComponent(m.id)),...(record.lesson?[siteLink('Leggi la lezione',record.lesson)]:[]),siteLink('Puoi approfondire qui · Biblioteca Federata','biblioteca-online.html?'+new URLSearchParams({q:m.name})+'#catalogo')],choices:search.related(m.id).slice(0,3).map(r=>({label:'Concetto collegato: '+r.name,query:r.name}))};
  }
  if(resolution.matches.length>1||resolution.suggestions.length){const options=resolution.matches.length?resolution.matches:resolution.suggestions;return {text:resolution.kind==='typo'?'Forse cercavi una di queste voci? Scegli il termine prima di leggere la definizione.':resolution.matches.length?'La ricerca può riferirsi a più voci. Quale intendi?':'Ho trovato alcune voci collegate alle parole della tua ricerca. Sono suggerimenti, non definizioni equivalenti.',choices:options.slice(0,5).map(m=>({label:m.name,query:m.name})),links:[siteLink('Cerca anche nelle fonti della Biblioteca','biblioteca-online.html?'+new URLSearchParams({q:query})+'#catalogo')]};}
  const docs=search.documents(query);
  return {text:docs.length?'Non trovo una definizione esatta, ma queste parole compaiono nei percorsi didattici indicati.':'Non trovo una definizione corrispondente nelle schede disponibili. Prova un termine scientifico più breve oppure cerca nelle fonti della Biblioteca Federata.',links:[...docs.map(d=>siteLink(d.title,d.href)),siteLink('Cerca nella Biblioteca Federata','biblioteca-online.html?'+new URLSearchParams({q:query})+'#catalogo')]};
 }
 async function submit(value){
  const text=String(value||'').trim().slice(0,400);if(!text||busy)return;
  input.value='';appendMessage({role:'user',text});busy=true;send.disabled=true;setState('loading');announce('Cerco nelle risorse disponibili…');
  try{const result=await answerQuestion(text);busy=false;setState('idle');appendMessage({role:'galatea',text:result.text,links:result.links||[],choices:result.choices||[]});announce('Risposta disponibile.');if(result.navigate)navigate(result.navigate);}
  catch{busy=false;setState('idle');appendMessage({role:'galatea',text:'Non riesco a caricare le risorse in questo momento. Puoi aprire direttamente il Glossario o la Biblioteca e riprovare.',links:[siteLink('Apri il Glossario','glossario.html'),siteLink('Apri la Biblioteca','biblioteca-online.html')]});announce('Risorse non caricate. Il testo della conversazione è conservato.');}
  finally{send.disabled=false;if(opened)input.focus({preventScroll:true});}
 }
 form.addEventListener('submit',e=>{e.preventDefault();submit(input.value);});
 panel.querySelector('[data-reset]').onclick=()=>{messages=[];log.replaceChildren();appendMessage({role:'galatea',text:welcome});announce('Nuova conversazione iniziata.');};
 // Real page navigation: conversation is retained in this browser tab.
 function navigate(value){
  const href=safeUrl(value);if(!href)return;const url=new URL(href);
  if(url.origin!==siteRoot.origin||!url.pathname.startsWith(siteRoot.pathname))return;
  persist();location.assign(url.href);
 }
 // Dragging stores only a normalized screen position, never an absolute device coordinate.
 let position=read(localStore,POSITION),drag,suppressClick=0;
 const validPosition=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1;
 const bounds=()=>({W:innerWidth,H:window.visualViewport?.height||innerHeight,size:launcher.getBoundingClientRect().width||70,margin:16});
 function moveLauncher(x,y,save=false){const b=bounds(),maxX=Math.max(b.margin,b.W-b.size-b.margin),maxY=Math.max(b.margin,b.H-b.size-b.margin);x=Math.max(b.margin,Math.min(x,maxX));y=Math.max(b.margin,Math.min(y,maxY));launcher.style.left=x+'px';launcher.style.top=y+'px';launcher.style.right='auto';launcher.style.bottom='auto';if(save){position={x:(x-b.margin)/Math.max(1,maxX-b.margin),y:(y-b.margin)/Math.max(1,maxY-b.margin)};write(localStore,POSITION,position);}placePanel();}
 function restorePosition(){if(!validPosition(position))return;const b=bounds();moveLauncher(b.margin+position.x*Math.max(0,b.W-b.size-b.margin*2),b.margin+position.y*Math.max(0,b.H-b.size-b.margin*2));}
 launcher.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType!=='touch')return;const r=launcher.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top,moved:false};launcher.setPointerCapture?.(e.pointerId);});
 launcher.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;e.preventDefault();launcher.classList.add('dragging');moveLauncher(drag.left+dx,drag.top+dy);});
 const endDrag=e=>{if(!drag||e.pointerId!==drag.id)return;if(drag.moved){const r=launcher.getBoundingClientRect();moveLauncher(r.left,r.top,true);suppressClick=Date.now()+500;}drag=null;launcher.classList.remove('dragging');};
 launcher.addEventListener('pointerup',endDrag);launcher.addEventListener('pointercancel',e=>{endDrag(e);suppressClick=0;});
 launcher.addEventListener('keydown',e=>{if(!e.altKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const r=launcher.getBoundingClientRect(),step=e.shiftKey?30:10;moveLauncher(r.left+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0),r.top+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0),true);announce('Posizione di Galatea aggiornata.');});
 panel.querySelector('[data-position-reset]').onclick=()=>{position=null;try{localStore?.removeItem(POSITION);}catch{}for(const key of ['left','top','right','bottom'])launcher.style[key]='';placePanel();announce('Posizione iniziale ripristinata.');};
 window.addEventListener('resize',()=>{restorePosition();placePanel();});window.visualViewport?.addEventListener('resize',()=>{restorePosition();placePanel();});
window.addEventListener('pagehide',persist);
 restorePosition();if(saved.open)openPanel(false);
 // Read-only hooks for local verification, not an external service.
 window.AdAstraGalatea={answerQuestion,getEngine,get state(){return {open:opened,busy,messages:messages.length};}};
})();
