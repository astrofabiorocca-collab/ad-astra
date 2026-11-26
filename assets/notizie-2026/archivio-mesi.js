/* Ritorno al mese: apre il dettaglio corretto, mantenendo accessibili gli altri. */
(()=>{'use strict';
 function revealMonth(){
  if(!/^#mese-(?:[1-9]|1[01])$/.test(location.hash))return;
  const month=document.getElementById(location.hash.slice(1));
  if(!month||!month.matches('details.edition-month'))return;
  month.open=true;
  requestAnimationFrame(()=>month.scrollIntoView({block:'start',behavior:'instant'}));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',revealMonth,{once:true});else revealMonth();
 window.addEventListener('hashchange',revealMonth);
 window.addEventListener('pageshow',revealMonth);
})();
