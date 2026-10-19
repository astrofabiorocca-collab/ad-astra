(() => {
 'use strict';
 const viewer=document.querySelector('.poster-viewer');
 if(!viewer)return;
 let trigger;
 document.querySelectorAll('.poster-open').forEach(button=>button.addEventListener('click',()=>{
  trigger=button;
  document.getElementById('poster-viewer-title').textContent=button.dataset.posterTitle;
  const img=document.getElementById('poster-viewer-image');
  img.src=button.dataset.posterSrc;img.alt=button.dataset.posterTitle;
  viewer.showModal();viewer.querySelector('.poster-viewer-scroll').scrollTo(0,0);
 }));
 viewer.querySelector('.poster-close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('click',event=>{if(event.target===viewer&& (event.clientX<viewer.getBoundingClientRect().left||event.clientX>viewer.getBoundingClientRect().right||event.clientY<viewer.getBoundingClientRect().top||event.clientY>viewer.getBoundingClientRect().bottom))viewer.close();});
 viewer.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
})();
