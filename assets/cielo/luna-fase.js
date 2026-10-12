/* Fase astronomica applicata alla fotografia NASA PIA00405.
   Ricostruzione illustrativa: non una ripresa attuale, non simula la librazione. */
(()=>{'use strict';
const {A,esc}=window.AdAstraAstro;let sequence=0;
function info(date){const fraction=A.Illumination('Moon',date).phase_fraction,angle=A.MoonPhase(date),name=fraction<.01?'Luna nuova':fraction>.99?'Luna piena':Math.abs(fraction-.5)<.025?(angle<180?'Primo quarto':'Ultimo quarto'):angle<180?(fraction<.5?'Falce crescente':'Gibbosa crescente'):(fraction<.5?'Falce calante':'Gibbosa calante');return {fraction,angle,name};}
function picture(date,label){const {fraction,angle,name}=info(date),r=96,center=100,coefficient=1-2*fraction,waxing=angle<=180,id='lunar-phase-'+(++sequence),edge=[],terminator=[];
 for(let y=-r;y<=r;y+=2){const x=Math.sqrt(Math.max(0,r*r-y*y));edge.push([center+(waxing?x:-x),center+y]);terminator.push([center+(waxing?coefficient*x:-coefficient*x),center+y]);}
 const path='M'+edge.concat(terminator.reverse()).map(p=>p.map(v=>v.toFixed(2)).join(',')).join('L')+'Z';
 return '<svg class="lunar-phase-picture" viewBox="0 0 200 200" role="img" aria-label="'+esc(label||name)+' — fase calcolata su fotografia NASA" data-illumination="'+fraction.toFixed(5)+'"><defs><clipPath id="'+id+'-disc"><circle cx="100" cy="100" r="96"/></clipPath><clipPath id="'+id+'-lit"><path d="'+path+'"/></clipPath></defs><circle cx="100" cy="100" r="97" fill="#050a12" stroke="#39455b" stroke-width=".6"/><g clip-path="url(#'+id+'-disc)"><image href="assets/cielo/foto/Moon.jpg" x="0" y="0" width="200" height="200" opacity=".035" style="filter:grayscale(1)"/><g clip-path="url(#'+id+'-lit)"><image href="assets/cielo/foto/Moon.jpg" x="0" y="0" width="200" height="200" style="filter:grayscale(1)"/></g></g></svg>';
}
window.AdAstraLuna={info,picture};
})();
