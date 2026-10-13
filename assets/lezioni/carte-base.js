(()=>{'use strict';
const descriptions={inverno:'Inverno: cerca la Cintura di Orione, poi il Toro e Capella nell’Auriga.',primavera:'Primavera: riconosci il Leone, poi Arturo nel Boote e Spica nella Vergine.',estate:'Estate: Vega, Deneb e Altair definiscono il Triangolo Estivo, fra Lira, Cigno e Aquila.',autunno:'Autunno: cerca il Grande Quadrato di Pegaso, poi la sequenza di Andromeda e Perseo.'};
document.querySelectorAll('[data-chart]').forEach(box=>{
 const svgs=[...box.querySelectorAll('.chart-picture svg')],lines=box.querySelector('[data-chart-lines]'),names=box.querySelector('[data-chart-names]'),season=box.querySelector('[data-chart-season]'),focus=box.querySelector('[data-chart-focus]'),reading=box.querySelector('.chart-reading');
 function active(){return svgs.find(s=>!s.hasAttribute('hidden'))||svgs[0];}
 function update(){for(const s of svgs){s.querySelectorAll('.chart-lines').forEach(n=>n.style.display=lines.checked?'':'none');s.querySelectorAll('.chart-names').forEach(n=>n.style.display=names.checked?'':'none');}
 if(season){for(const s of svgs){const hide=s.dataset.season!==season.value;s.toggleAttribute('hidden',hide);s.style.display=hide?'none':'';}reading.textContent=descriptions[season.value]+' Roma, giorno 15 del mese indicato, ore 22:00 locali nel 2026. Il bordo è l’orizzonte; est a sinistra, ovest a destra.';}
 if(focus){const svg=active(),id=focus.value,target=svg.querySelector('[data-constellation="'+id+'"]');if(target){const before=target.style.display;target.style.display='';const b=target.getBBox();target.style.display=before;const pad=70;svg.setAttribute('viewBox',`${b.x-pad} ${b.y-pad} ${b.width+pad*2} ${b.height+pad*2}`);reading.textContent='Dettaglio di '+focus.options[focus.selectedIndex].text+'. Ritaglio della stessa carta equatoriale: non cambia luogo o ora. Ripristina la carta per ritrovare il polo e il reticolo completo.';}else{svg.setAttribute('viewBox','0 0 800 900');reading.textContent='Carta equatoriale boreale: polo al centro, equatore al bordo. Mostra o nascondi le figure e prova a riconoscere le stelle. Non è una mappa dell’orizzonte locale.';}}
 }
 [lines,names,season,focus].filter(Boolean).forEach(e=>e.addEventListener('change',update));
 box.querySelector('[data-chart-reset]').addEventListener('click',()=>{lines.checked=names.checked=true;if(season)season.value='inverno';if(focus)focus.value='all';update();});
 update();
});
})();
