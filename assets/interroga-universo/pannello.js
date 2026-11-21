(() => {
 const search = window.AdAstraGlossarySearch;
 if (!search) return;
 const launcher = document.createElement('button');
 launcher.type = 'button';
 launcher.className = 'universe-launcher';
 launcher.setAttribute('aria-label', 'Interroga l’universo');
 launcher.setAttribute('aria-haspopup', 'dialog');
 launcher.innerHTML = '<img src="assets/interroga-universo/icona.png" alt="">';
 const panel = document.createElement('dialog');
 panel.className = 'universe-panel';
 panel.setAttribute('aria-labelledby', 'universe-title');
 panel.innerHTML = `
  <header><h2 id="universe-title">Interroga l’universo</h2>
  <form method="dialog"><button aria-label="Chiudi">×</button></form></header>
  <form class="universe-search">
   <label for="universe-query">Cerca un termine del Glossario</label>
   <input id="universe-query" type="search" placeholder="Per esempio: nana bianca" required>
   <button>Cerca</button>
  </form>
  <div class="universe-answer" aria-live="polite"></div>`;
 document.body.append(launcher, panel);
 const input = panel.querySelector('input');
 const answer = panel.querySelector('.universe-answer');
 launcher.addEventListener('click', () => { panel.showModal(); input.focus(); });
 panel.addEventListener('close', () => launcher.focus());
 function showAnswer(query){
  answer.replaceChildren();
  const result=search.resolve(query),matches=result.matches;
  const addLink=(label,href)=>{const link=document.createElement('a');link.textContent=label;link.href=href;answer.append(link);};
  if(!matches.length){
   search.renderSuggestions(answer,result,{select:item=>{input.value=item.name;showAnswer(item.name);}});
   if(!result.suggestions.length&&!search.documents(query).length){const text=document.createElement('p');text.textContent='Non ho trovato una definizione corrispondente. Puoi cercare il concetto nelle fonti della Biblioteca.';answer.append(text);}
  }
  for(const {id,name} of matches){
   const record=search.get(id),[fallback,lesson]=window.AdAstraGlossarySummaries?.[id]||[];
   const heading=document.createElement('h3');heading.textContent=name;answer.append(heading);
   const definition=record?.definition||fallback;
   if(definition){const text=document.createElement('p');text.textContent=definition;answer.append(text);}
   addLink('Apri la voce del Glossario','glossario.html#'+encodeURIComponent(id));
   if(record?.lesson||lesson)addLink('Leggi la lezione',record?.lesson||lesson);
   addLink('Puoi approfondire qui · Biblioteca Federata','biblioteca-online.html?'+new URLSearchParams({q:name})+'#catalogo');
   const related=search.related(id).slice(0,4);
   if(related.length){const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ul');summary.textContent='Concetti collegati';
    for(const item of related){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=item.name;button.addEventListener('click',()=>{input.value=item.name;showAnswer(item.name);});li.append(button);list.append(li);}details.append(summary,list);answer.append(details);}
  }
  if(!matches.length)addLink('Cerca nella Biblioteca Federata','biblioteca-online.html?'+new URLSearchParams({q:query})+'#catalogo');
 }
 panel.querySelector('.universe-search').addEventListener('submit',event=>{event.preventDefault();const query=input.value.trim();if(query)showAnswer(query);});
})();
