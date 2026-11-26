/* Rimandi discreti: prima occorrenza, uno per paragrafo, due per sezione, massimo 14 per pagina. */
(()=>{'use strict';
const terms=window.AdAstraGlossary||[],root=document.querySelector('main');
if(!terms.length||!root||document.querySelector('#glossary-index'))return;
const byId=new Map(terms.map(e=>[e.id,e])),byName=new Map(),escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const e of terms)for(const name of e.linkNames||[e.name,...(e.aliases||[])]){const key=name.toLocaleLowerCase('it');if(!byName.has(key))byName.set(key,e);}
const names=[...byName.keys()].sort((a,b)=>b.length-a.length),pattern=new RegExp('(?<![\\p{L}\\p{N}])('+names.map(escape).join('|')+')(?![\\p{L}\\p{N}])','giu');
const exclude='.np-heading,.np-sources,.np-terms,.np-context,.np-notice,.np-signoff,.draft-review,.edition-notice,.edition-archive,.edition-heading,a,button,label,script,style,nav,figure,code,kbd,samp,math,.course-quiz,.lab-work,.quiz-question,.glossary-popup,.section-sources,.sources,.scene-credit,.glossary-source';
function enhance(scope=root){
 const existing=[...root.querySelectorAll('a[data-glossary]')],used=new Set(existing.map(a=>a.dataset.glossary)),sectionCounts=new Map();let count=existing.length;
 for(const a of existing){const s=a.closest('section')||root;sectionCounts.set(s,(sectionCounts.get(s)||0)+1);}
 const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement?.closest('p,li');return p&&!n.parentElement.closest(exclude)&&!p.textContent.trim().startsWith('Riferimenti:')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}}),nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(count>=14)break;const p=node.parentElement.closest('p,li'),section=p.closest('section')||root;if(p.querySelector('a[data-glossary]')||(sectionCounts.get(section)||0)>=2)continue;
  const match=[...node.nodeValue.matchAll(pattern)].find(m=>!used.has(byName.get(m[0].toLocaleLowerCase('it'))?.id));if(!match)continue;
  const entry=byName.get(match[0].toLocaleLowerCase('it'));if(!entry)continue;
  const fragment=document.createDocumentFragment(),a=document.createElement('a');a.className='glossary-term';a.href='glossario.html#'+entry.id;a.textContent=match[0];a.dataset.glossary=entry.id;a.setAttribute('aria-haspopup','dialog');
  fragment.append(node.nodeValue.slice(0,match.index),a,node.nodeValue.slice(match.index+match[0].length));node.replaceWith(fragment);used.add(entry.id);sectionCounts.set(section,(sectionCounts.get(section)||0)+1);count++;
 }
}
enhance();document.addEventListener('ad-astra:content-updated',event=>enhance(event.detail?.root||root));
let dialog,lastFocus;
document.addEventListener('click',event=>{
 const a=event.target.closest('a[data-glossary]');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const entry=byId.get(a.dataset.glossary);if(!entry||!window.HTMLDialogElement?.prototype.showModal)return;
 event.preventDefault();lastFocus=a;
 if(!dialog){dialog=document.createElement('dialog');dialog.className='glossary-popup';dialog.setAttribute('aria-labelledby','glossary-popup-title');document.body.append(dialog);dialog.addEventListener('close',()=>lastFocus?.isConnected&&lastFocus.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});}
 const close=document.createElement('button'),title=document.createElement('h2'),p=document.createElement('p'),full=document.createElement('a');close.textContent='Chiudi ×';close.type='button';close.onclick=()=>dialog.close();title.id='glossary-popup-title';title.textContent=entry.name;p.textContent=entry.definition;full.href='glossario.html#'+entry.id;full.textContent='Apri la voce completa, gli esempi e le fonti →';const library=document.createElement('a'),links=document.createElement('p');library.href='biblioteca-online.html?'+new URLSearchParams({q:entry.name})+'#catalogo';library.textContent='Fonti nella Biblioteca Federata →';links.append(library);const galatea=document.createElement('button');galatea.type='button';galatea.textContent='Chiedi a Galatea';galatea.onclick=()=>{dialog.close();const launcher=document.querySelector('.galatea-launcher');if(launcher?.getAttribute('aria-expanded')!=='true')launcher?.click();const query=document.querySelector('#galatea-query');if(query){query.value='Che cos’è '+entry.name+'?';query.focus();}};dialog.replaceChildren(close,title,p,full,links,galatea);dialog.showModal();
});window.AdAstraGlossaryLinks={enhance};})();
