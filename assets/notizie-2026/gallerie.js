/* Gallerie editoriali: nessun autoplay, immagini integre, controlli tastiera e touch. */
(() => {
 'use strict';
 for (const gallery of document.querySelectorAll('.article-gallery')) {
  const slides=[...gallery.querySelectorAll('.gallery-slide')];
  const tabs=[...gallery.querySelectorAll('[data-slide]')];
  const counter=gallery.querySelector('.gallery-counter');
  let index=0,start=null,origin=null;
  const dialog=document.createElement('dialog');
  dialog.className='gallery-dialog';
  dialog.setAttribute('aria-label','Immagine ingrandita della notizia');
  dialog.innerHTML='<button type="button" class="gallery-close" aria-label="Chiudi immagine ingrandita">Chiudi ×</button><figure></figure>';
  document.body.append(dialog);
  const close=()=>dialog.close();
  dialog.querySelector('.gallery-close').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  dialog.addEventListener('close',()=>origin?.focus());
  function enlarged() {
   const figure=dialog.querySelector('figure');
   const img=slides[index].querySelector('img').cloneNode();
   img.removeAttribute('loading');
   const caption=slides[index].querySelector('figcaption').cloneNode(true);
   const full=document.createElement('a');full.href=img.src;full.target='_blank';full.rel='noopener';full.textContent='Apri il file originale';
   const p=document.createElement('p');p.append(full);caption.append(p);
   figure.replaceChildren(img,caption);
  }
  function show(n) {
   index=(n+slides.length)%slides.length;
   slides.forEach((slide,i)=>{slide.hidden=i!==index;});
   tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
   counter.textContent=(index+1)+' / '+slides.length;
   if(dialog.open)enlarged();
  }
  gallery.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));
  gallery.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
  tabs.forEach(tab=>tab.addEventListener('click',()=>show(Number(tab.dataset.slide))));
  gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
  gallery.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{origin=button;enlarged();dialog.showModal();}));
  gallery.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.target.closest('.gallery-image'))start={x:e.clientX,y:e.clientY};});
  gallery.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));});
  gallery.addEventListener('pointercancel',()=>{start=null;});
  show(0);
 }
})();
