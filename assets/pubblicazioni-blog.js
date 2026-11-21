(()=>{'use strict';const articles=window.AdAstraPublicationPreview||[];if(!articles.length)return;const q=s=>document.querySelector(s),reader=q('#pub-reader'),stage=q('#pub-stage'),spread=q('#pub-spread'),cards=q('#pub-articles'),count=q('#pub-page-count'),status=q('#pub-status'),mobile=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=0,page=0,single=mobile.matches,zoom=1,turning=false,authorCollection=false;
function layout(){
const pad=parseFloat(getComputedStyle(stage).paddingLeft)||20;
const availW=Math.max(100,stage.clientWidth-2*pad),availH=Math.max(100,stage.clientHeight-2*pad);
const n=single?1:2,ratio=595.276/841.89;
const fit=Math.min(availW,availH*ratio*n),width=fit*zoom;
spread.style.width=width+'px';spread.style.height=(width/(ratio*n))+'px';
spread.style.minWidth=width+'px';spread.style.maxWidth='none';spread.style.maxHeight='none';
spread.style.marginLeft=Math.max(0,(availW-width)/2)+'px';
stage.classList.toggle('zoomed',zoom>1);
for(const img of spread.querySelectorAll('.pub-sheet img')){const src=zoom>1.3?articles[current].pages[page+[...spread.children].indexOf(img.parentElement)]?.png:null;if(src)img.src=src;}
}
if(window.ResizeObserver)new ResizeObserver(layout).observe(stage);
window.addEventListener('resize',layout);

function setTextVersion(a){const target=q('#pub-readable');target.replaceChildren();const h=document.createElement('h3');h.textContent=a.title;target.append(h);const intro=document.createElement('p');intro.textContent=a.intro;target.append(intro);for(const s of a.sections){const h=document.createElement('h3');h.textContent=s.title;target.append(h);for(const value of s.paragraphs){const p=document.createElement('p');p.textContent=value;target.append(p);}}const h2=document.createElement('h3');h2.textContent='Immagini e fonti';target.append(h2);for(const credit of [a.credit,a.secondaryCredit].filter(Boolean)){const p=document.createElement('p');p.textContent=credit;target.append(p);}const list=document.createElement('ul');for(const[label,url]of a.sources){const li=document.createElement('li'),link=document.createElement('a');link.href=url;link.textContent=label;li.append(link);list.append(li);}target.append(list);}
function render(announce=false){if(authorCollection)return;const a=articles[current],step=single?1:2;page=Math.max(0,Math.min(page,a.pages.length-1));if(!single)page=Math.floor(page/2)*2;const visible=a.pages.slice(page,page+step);spread.replaceChildren();spread.className='pub-spread'+(single?' single':'');spread.dataset.count=String(visible.length);visible.forEach((p,i)=>{const fig=document.createElement('figure'),img=document.createElement('img');fig.className='pub-sheet';img.src=p.image;img.alt=p.alt;img.width=1071;img.height=1515;img.decoding='async';fig.append(img);spread.append(fig);});q('#pub-reader-title').textContent=a.title;q('#pub-reader-meta').textContent='di '+a.author+' · autore di esempio — '+a.subtitle+' · '+a.pages.length+' pagine';q('#pub-category').textContent=a.category;count.innerHTML=String(page+1).padStart(2,'0')+(visible.length>1?' — '+String(page+visible.length).padStart(2,'0'):'')+' <small>/ '+String(a.pages.length).padStart(2,'0')+'</small>';q('#pub-prev').disabled=page===0;q('#pub-next').disabled=page+step>=a.pages.length;q('#pub-mode').setAttribute('aria-pressed',String(single));q('#pub-mode-label').textContent=single?'Doppia pagina':'Pagina singola';q('#pub-pdf').href=a.pdf;q('#pub-pdf').download=a.id+'.pdf';q('#pub-png').href=a.pages[page].png;q('#pub-png').download=a.id+'-pagina-'+(page+1)+'.png';q('#pub-png').textContent='PNG · pagina '+(page+1);for(const card of cards.querySelectorAll('button')){const selected=+card.dataset.article===current;card.setAttribute('aria-pressed',String(selected));card.querySelector('.pub-card-badge').hidden=!selected;card.querySelector('.pub-card-link').textContent=selected?'In lettura':'Sfoglia l’articolo →';}stage.classList.toggle('zoomed',zoom>1);stage.style.setProperty('--pub-zoom',zoom);q('#pub-zoom-value').textContent=Math.round(zoom*100)+'%';layout();if(announce)status.textContent=a.title+', '+(visible.length>1?'pagine '+(page+1)+' e '+(page+2):'pagina '+(page+1))+' di '+a.pages.length;}
function choose(index,scroll=true){if(turning)return;if(authorCollection)collection(false,false);current=index;page=0;zoom=1;q('#pub-zoom-input').value='1';setTextVersion(articles[index]);lessonLinks(index);render(true);if(scroll){reader.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});q('#pub-reader-title').focus({preventScroll:true});}}
articles.forEach((a,i)=>{const button=document.createElement('button');button.className='pub-card';button.type='button';button.dataset.article=i;button.setAttribute('aria-label','Sfoglia '+a.title);button.innerHTML='<span class="pub-cover"><img alt="Copertina di '+a.title+'" loading="lazy" src="'+a.pages[0].image+'"><span class="pub-card-badge" hidden>IN LETTURA</span></span><span class="pub-card-category"></span><span class="pub-card-title"></span><span class="pub-card-summary"></span><span class="pub-card-action"><span class="pub-card-link">Sfoglia l’articolo →</span><small>'+a.pages.length+' pagine</small></span>';button.querySelector('.pub-card-category').textContent=a.category;button.querySelector('.pub-card-title').textContent=a.title;button.querySelector('.pub-card-summary').textContent=a.summary;button.onclick=()=>choose(i);cards.append(button);});
async function move(direction){
const step=single?1:2,next=page+direction*step;
if(turning||authorCollection||next<0||next>=articles[current].pages.length)return;
const old=Array.from(spread.querySelectorAll('.pub-sheet img')).map(i=>i.src);
page=next;render(true);
if(reduced.matches||!Element.prototype.animate)return;
turning=true;reader.setAttribute('aria-busy','true');
const leaf=document.createElement('div');leaf.className='pub-turn-leaf '+(direction>0?'forward':'backward');
const front=document.createElement('div'),back=document.createElement('div');front.className='pub-turn-face';back.className='pub-turn-face back';
const f=document.createElement('img'),r=document.createElement('img');
f.src=direction>0?old[old.length-1]:articles[current].pages[page].image;
r.src=direction>0?articles[current].pages[page].image:old[0];f.alt=r.alt='';front.append(f);back.append(r);leaf.append(front,back);spread.append(leaf);
const from=direction>0?0:-180,to=direction>0?-180:0;
try{await leaf.animate([{transform:'rotateY('+from+'deg)',filter:'brightness(1)'},{transform:'rotateY(-85deg)',filter:'brightness(.65)',offset:.5},{transform:'rotateY('+to+'deg)',filter:'brightness(1)'}],{duration:1050,easing:'cubic-bezier(.35,.05,.25,1)',fill:'forwards'}).finished;}finally{leaf.remove();turning=false;reader.removeAttribute('aria-busy');}
}
q('#pub-prev').onclick=()=>move(-1);q('#pub-next').onclick=()=>move(1);q('#pub-mode').onclick=()=>{if(turning||authorCollection)return;single=!single;render(true);};q('#pub-zoom-input').oninput=e=>{zoom=+e.target.value;render();};q('#pub-fit').onclick=()=>{zoom=1;q('#pub-zoom-input').value='1';stage.scrollTop=stage.scrollLeft=0;render();};
function expanded(value){reader.classList.toggle('pub-expanded',value);document.body.classList.toggle('pub-reading-expanded',value);q('#pub-fullscreen-label').textContent=value?'Esci':'Schermo intero';requestAnimationFrame(layout);}
q('#pub-fullscreen').onclick=async()=>{if(reader.classList.contains('pub-expanded')){expanded(false);return;}try{if(document.fullscreenElement)await document.exitFullscreen();else if(reader.requestFullscreen)await reader.requestFullscreen();else expanded(true);}catch{expanded(true);}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&reader.classList.contains('pub-expanded'))expanded(false);});
document.addEventListener('fullscreenchange',()=>{q('#pub-fullscreen-label').textContent=document.fullscreenElement?'Esci':'Schermo intero';requestAnimationFrame(layout);});
reader.addEventListener('keydown',e=>{if(e.target.closest('input,a'))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});let touchStart;stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&zoom===1)touchStart={x:e.clientX,y:e.clientY};});stage.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>80&&Math.abs(dy)<70)move(dx<0?1:-1);touchStart=null;});

const originalCards=[...cards.children];
function collection(author,scroll=true){
if(turning)return;authorCollection=author;
q('#pub-lessons').hidden=author;q('#pub-back-collection').hidden=!author;q('.pub-text-version').hidden=author;
q('#pub-collection-title').textContent=author?'Fabio Rocca · Pubblicazioni su altre riviste':'Quattro sguardi sul cielo.';
q('#pub-archive').hidden=author;
if(author){cards.replaceChildren();const empty=document.createElement('div');empty.className='pub-collection-empty';empty.innerHTML='<h3>La raccolta delle pubblicazioni</h3><p>Qui compariranno i tuoi articoli con copertina, testata, numero e anno. Per il provino il cambio di raccolta è attivo; nessun articolo campione viene attribuito a Fabio Rocca.</p>';cards.append(empty);spread.hidden=true;q('#pub-reader-title').textContent='Fabio Rocca · Pubblicazioni';q('#pub-reader-meta').textContent='Seleziona un contributo dalla raccolta: i documenti originali devono ancora essere inseriti.';q('#pub-category').textContent='ARCHIVIO DELL’AUTORE';for(const id of ['pub-pdf','pub-png','pub-prev','pub-next','pub-mode','pub-zoom-input','pub-fit'])q('#'+id).hidden=true;count.textContent='Archivio in preparazione';stage.classList.add('empty-collection');}
else{cards.replaceChildren(...originalCards);spread.hidden=false;for(const id of ['pub-pdf','pub-png','pub-prev','pub-next','pub-mode','pub-zoom-input','pub-fit'])q('#'+id).hidden=false;stage.classList.remove('empty-collection');choose(0,false);}
if(scroll)reader.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
}
// Le pubblicazioni personali sono una pagina separata, raggiungibile dal banner autore.
q('#pub-back-collection').onclick=()=>collection(false);
function lessonLinks(index){
const pairs=[['lezione-4-1.html','Che cos’è una stella'],['lezione-4-3.html','I colori e la luce delle stelle'],['lezione-2-4.html','La Luna e le sue fasi'],['lezione-3-6.html','Origine e movimento del Sistema Solare']];
const target=q('#pub-lessons');target.replaceChildren();const span=document.createElement('span');span.textContent='Per approfondire nella Scuola di Astronomia: ';const a=document.createElement('a');a.href=pairs[index][0];a.textContent=pairs[index][1]+' →';target.append(span,a);
}
function searchArchive(){
const norm=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const query=norm(q('#pub-search').value.trim()),topic=q('#pub-topic').value,author=q('#pub-author-filter').value;
const results=q('#pub-search-results');results.replaceChildren();let found=0;
articles.forEach((a,i)=>{if(topic&&topic!==a.category||author&&author!==a.author)return;if(query&&!norm([a.title,a.subtitle,a.category,a.author,a.summary].join(' ')).includes(query))return;found++;const button=document.createElement('button');button.type='button';button.className='pub-search-result';const title=document.createElement('strong');title.textContent=a.title;const meta=document.createElement('span');meta.textContent=a.author+' · '+a.category+' · selezione campione';button.append(title,meta);button.onclick=()=>choose(i);results.append(button);});q('#pub-search-count').textContent=found?found+(found===1?' articolo trovato':' articoli trovati'):'Nessun articolo corrisponde alla ricerca.';
}
for(const [id,values]of [['pub-topic',articles.map(a=>a.category)],['pub-author-filter',articles.map(a=>a.author)]]){for(const v of [...new Set(values)]){const option=document.createElement('option');option.value=option.textContent=v;q('#'+id).append(option);}q('#'+id).onchange=searchArchive;}
q('#pub-search').oninput=searchArchive;searchArchive();
mobile.addEventListener('change',e=>{single=e.matches;render();});choose(0,false);window.AdAstraPublicationReader={choose,move,get state(){return{article:articles[current].id,page:page+1,pages:articles[current].pages.length,single,zoom,authorCollection,turning};}};
})();
