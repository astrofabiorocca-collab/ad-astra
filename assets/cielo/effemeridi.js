/* AD ASTRA: effemeridi locali, mese e città condivisi con Il cielo del mese. */
(()=>{
'use strict';
const {A,tz,cities,names,timeParts,localDate,stamp,direction,esc,horizon,events,activeMonth}=window.AdAstraAstro;
const $=s=>document.querySelector(s), select=$('#eff-city');
const clock=d=>new Intl.DateTimeFormat('it-IT',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(d);
const dayLabel=d=>new Intl.DateTimeFormat('it-IT',{timeZone:tz,day:'numeric',month:'long'}).format(d);
const planetBodies=['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune'];
const notes={Mercury:'Vicino al Sole: osservare solo dopo il tramonto o prima dell’alba, con il Sole sotto l’orizzonte.',Venus:'Molto luminoso; al telescopio mostra le fasi.',Mars:'Il colore rossastro aiuta a riconoscerlo; i dettagli richiedono un telescopio.',Jupiter:'Un binocolo stabile può mostrare i satelliti maggiori; al telescopio le fasce nuvolose.',Saturn:'Gli anelli si riconoscono al telescopio.',Uranus:'Consigliati binocolo e carta di riferimento; il piccolo disco si distingue al telescopio.',Neptune:'Serve un telescopio e una carta di riferimento; non è visibile a occhio nudo.'};
const symbols=['☿','♀','♂','♃','♄','♅','♆'];
select.replaceChildren();for(const c of cities){const o=document.createElement('option');o.value=o.textContent=c[0];select.append(o);}try{select.value=localStorage.getItem('ad-astra-city')||'Roma';}catch(e){select.value='Roma';}if(!select.value)select.value='Roma';
const status=$('#eff-status')||document.createElement('p');status.id='eff-status';status.className='eff-status';status.setAttribute('role','status');if(!status.isConnected)$('.reference-card').append(status);
const lunarLocal=$('.moon-local')||document.createElement('p');lunarLocal.className='moon-local';if(!lunarLocal.isConnected)$('.moon-list').after(lunarLocal);
function riseSet(body,y,m,day,obs){const start=localDate(y,m,day,0),end=localDate(y,m,day+1,0),limit=(end-start)/86400000;return [1,-1].map(sign=>{const t=A.SearchRiseSet(body,obs,sign,start,limit);return t&&t.date<end?t.date:null;});}
function solarRows(y,m,obs){const last=new Date(Date.UTC(y,m,0)).getUTCDate();return [1,last].flatMap(day=>{const [rise,set]=riseSet('Sun',y,m,day,obs),duration=rise&&set?Math.round((set-rise)/60000):null;return [{label:'Alba — '+(day===1?'inizio':'fine')+' mese ('+day+')',value:rise?clock(rise):'Non sorge'},{label:'Tramonto — '+(day===1?'inizio':'fine')+' mese ('+day+')',value:set?clock(set):'Non tramonta'},{label:'Durata del giorno',value:duration===null?'Non disponibile':Math.floor(duration/60)+' h '+duration%60+' min'}];});}
function planetData(body,y,m,obs){
 const date=localDate(y,m,15),eq=A.Equator(body,date,obs,false,true),constellation=A.Constellation(eq.ra,eq.dec),pos=horizon(body,date,obs),mag=A.Illumination(body,date).mag;
 // Una notte di riferimento: mezzogiorno del 15 → mezzogiorno del 16, compresa l'alba.
 const start=localDate(y,m,15,12),end=localDate(y,m,16,12),samples=[];
 for(let ms=+start;ms<+end;ms+=600000){const d=new Date(ms),h=horizon(body,d,obs),sun=horizon('Sun',d,obs);if(h.altitude>=10&&sun.altitude<=-6)samples.push({d,h});}
 const intervals=[];for(const s of samples){let last=intervals[intervals.length-1];if(!last||s.d-last.end>600000)intervals.push({start:s.d,end:s.d});else last.end=s.d;}
 const best=samples.slice().sort((a,b)=>b.h.altitude-a.h.altitude)[0];
 const intervalsText=intervals.map(i=>clock(i.start)+'–'+clock(i.end)+(timeParts(i.end).day===16?' (16)':' (15)')).join('; ');
 const cn={Psc:'Pesci',Aqr:'Acquario',Cap:'Capricorno',Sgr:'Sagittario',Sco:'Scorpione',Lib:'Bilancia',Vir:'Vergine',Leo:'Leone',Cnc:'Cancro',Gem:'Gemelli',Tau:'Toro',Ari:'Ariete',Oph:'Ofiuco',Cet:'Balena',Ori:'Orione',Sex:'Sestante'};
 return {body,visibility:best?'Osservabile nelle ore buie':'Poco favorevole nella notte di riferimento',period:intervalsText||'Nessuna finestra con altezza ≥ 10° e Sole ≤ −6°',position:(cn[constellation.symbol]||constellation.name)+' · '+(pos.altitude>0?direction(pos.azimuth)+', '+Math.round(pos.altitude)+'° di altezza alle 22:00':'sotto l’orizzonte alle 22:00'),note:notes[body]+' Magnitudine '+mag.toFixed(1).replace('.',',')+'.',best:best?best.h.altitude:null};
}
function selectedEvents(y,m,obs){
 const all=events(y,m,obs).filter(e=>e.type!=='meteor');
 // Gli sciami hanno una data indicativa; non attribuiamo al massimo un'ora esatta.
 const score=e=>e.type==='eclipse'?100:e.type==='opposition'?90:e.type==='meteor'?80:e.type==='conjunction'&&e.observable?70:e.type==='phase'?(e.title==='Luna nuova'||e.title==='Luna piena'?60:50):e.type==='season'?45:20;
 const chosen=all.slice().sort((a,b)=>score(b)-score(a)||a.date-b.date).slice(0,6);
 if(chosen.length<6){const end=localDate(y,m+1,1,0);let ap=A.SearchLunarApsis(localDate(y,m,1,0));while(chosen.length<6&&ap.time.date<end){chosen.push({date:ap.time.date,title:ap.kind===0?'Luna al perigeo':'Luna all’apogeo',text:'La Luna raggiunge '+(ap.kind===0?'la minima':'la massima')+' distanza dalla Terra: circa '+Math.round(ap.dist_km).toLocaleString('it-IT')+' km. È una proprietà dell’orbita, non un cambiamento improvviso del disco lunare.',type:'apsis'});ap=A.NextLunarApsis(ap);}}
 return chosen.sort((a,b)=>a.date-b.date);
}
function eventPhotos(event){
 if(event.type==='phase')return {html:'<div class="event-image phase-photo">'+window.AdAstraLuna.picture(event.date,event.title)+'</div>',credit:'Illuminazione calcolata su fotografia di archivio <a href="https://images.nasa.gov/details/PIA00405">NASA/JPL</a>; fase riferita all’istante indicato.'};
 let keys;
 if(event.type==='eclipse')keys=[event.title.includes('Sole')?'eclissiSole':'eclissiLuna'];
 else if(event.type==='conjunction')keys=Object.keys(names).filter(k=>event.title.includes(names[k])).sort((a,b)=>event.title.indexOf(names[a])-event.title.indexOf(names[b]));
 else if(event.type==='opposition')keys=planetBodies.filter(k=>event.title.includes(names[k]));
 else if(event.type==='meteor')keys=[event.title.startsWith('Orionidi')?'costellazione-Ori':'costellazione-Cas'];
 else keys=[event.type==='season'?'Earth':'Moon'];
 // Non illustrare uno sciame con un'altra costellazione: la selezione dei sei usa foto reali della Luna o pianeti.
 if(event.type==='meteor'&&event.title.startsWith('Draconidi'))keys=['Earth'];
 const photos=keys.map(k=>({k,p:window.CieloFoto[k]}));if(photos.some(x=>!x.p))throw Error('Foto mancante: '+event.title);
 const pair=photos.length>1;
 const caption=event.type==='meteor'?(keys[0]==='Earth'?'Terra: il fenomeno è osservato dalla superficie terrestre. ':'Campo stellare di Orione, area del radiante; fotografia senza meteore. '):pair?'Fotografie separate dei due astri. ':'Fotografia di archivio. ';
 return {html:'<div class="event-image'+(pair?' photo-pair':'')+'">'+photos.map(({k,p})=>'<img src="'+esc(p.file)+'" alt="'+esc(names[k]||p.title)+' — fotografia d’archivio" width="640" height="360" loading="lazy">').join('')+'</div>',credit:caption+photos.map(({p})=>'<a href="'+esc(p.source)+'">'+esc(p.credit)+'</a>'+(p.license==='CC BY 4.0'?' · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>':'')).join('<br>')};
}
let monthKey='',timer;
function render(){try{
 const {year:y,month:m}=activeMonth(),city=cities.find(c=>c[0]===select.value),obs=new A.Observer(city[1],city[2],0),reference=localDate(y,m,15),label=new Intl.DateTimeFormat('it-IT',{timeZone:tz,month:'long',year:'numeric'}).format(reference);
 $('.intro-month').textContent=label.toLocaleUpperCase('it-IT');
 $('.intro-text').textContent='Le effemeridi raccolgono in una sola pagina i principali dati astronomici del mese: movimento apparente del Sole e della Luna, fasi lunari, visibilità dei pianeti e fenomeni di maggiore interesse. Scegli la città nei dati di riferimento per adattare gli orari e la visibilità al tuo luogo di osservazione.';
 const rows=solarRows(y,m,obs);$('.data-card:first-child .card-note').textContent='Orari di '+city[0]+', riferiti al bordo del Sole e a un orizzonte libero. La durata è il tempo tra alba e tramonto.';
 document.querySelectorAll('.sun-row').forEach((r,i)=>{r.querySelector('span').textContent=rows[i].label;r.querySelector('strong').textContent=rows[i].value;});
 const phases=events(y,m,obs).filter(e=>e.type==='phase');
 $('.moon-list').innerHTML=phases.map(e=>{const full=e.title==='Luna piena',fresh=e.title==='Luna nuova',left=e.title==='Ultimo quarto';return '<div class="moon-phase"><div class="moon-symbol" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="'+(full?'#f9e8ba':'#afb5d7')+'"/>'+(!full&&!fresh?'<path d="M20 4A16 16 0 0 '+(left?'0':'1')+'20 36Z" fill="#f9e8ba"/>':'')+'</svg></div><div><strong>'+esc(e.title)+'</strong><span>'+esc(stamp(e.date))+'</span></div></div>';}).join('');
 const [mr,ms]=riseSet('Moon',y,m,15,obs);lunarLocal.textContent='Luna il 15 a '+city[0]+': sorge '+(mr?clock(mr):'non in questa data')+', tramonta '+(ms?clock(ms):'non in questa data')+'. Le fasi avvengono nello stesso istante per tutte le città.';
 $('.reference-list').innerHTML='<p><strong>Località:</strong> '+esc(city[0])+'</p><p><strong>Coordinate:</strong> '+city[1].toFixed(4).replace('.',',')+'° N · '+city[2].toFixed(4).replace('.',',')+'° E</p><p><strong>Fuso orario:</strong> Europe/Rome</p><p><strong>Riferimento:</strong> orizzonte locale libero</p><p><strong>Orari:</strong> ora civile, con ora legale quando prevista</p>';
 const planets=planetBodies.map(b=>planetData(b,y,m,obs));$('.planet-table tbody').innerHTML=planets.map((p,i)=>'<tr><td><span class="planet-name"><span class="planet-symbol">'+symbols[i]+'</span>'+names[p.body]+'</span></td><td>'+esc(p.visibility)+'</td><td>'+esc(p.period)+'</td><td>'+esc(p.position)+'</td><td>'+esc(p.note)+'</td></tr>').join('');
 $('#planet-reference').textContent='Notte di riferimento: 15–16 '+label+' · '+city[0]+'. Finestre indicative al minuto, campionate ogni 10 minuti: pianeta almeno 10° sopra l’orizzonte e Sole almeno 6° sotto. (15) e (16) indicano il giorno; la posizione è riferita al 15 alle 22:00. Le condizioni cambiano durante il mese.';
 const banner=['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];$('#planet-strip').innerHTML=banner.map(b=>'<figure class="planet-portrait"><img src="'+esc(window.CieloFoto[b].file)+'" alt="'+names[b]+' — foto NASA" width="160" height="160"><figcaption>'+names[b]+'</figcaption></figure>').join('');
 $('#planet-credit').innerHTML='Fotografie e mosaici d’archivio; dimensioni illustrative, non in scala. '+banner.map(b=>'<a href="'+esc(window.CieloFoto[b].source)+'">'+names[b]+': '+esc(window.CieloFoto[b].credit)+'</a>').join(' · ')+'. Venere: fotografia UV colorizzata; Nettuno: colori elaborati delle riprese Voyager.';
 const list=selectedEvents(y,m,obs);$('.events-grid').innerHTML=list.map(e=>{const p=eventPhotos(e);return '<article class="event-item">'+p.html+'<div class="event-content"><h3>'+esc(e.title)+'</h3><p class="event-time">'+esc(e.type==='meteor'?dayLabel(e.date)+' · data indicativa':stamp(e.date))+'</p><p>'+esc(e.text)+'</p><p class="photo-credit">'+p.credit+'</p></div></article>';}).join('');
 $('.calendar-list').innerHTML=list.map(e=>'<li class="calendar-item"><span class="calendar-date">'+esc(dayLabel(e.date))+'<span class="cal-time">'+(e.type==='meteor'?'Massimo indicativo':clock(e.date))+'</span></span><span class="calendar-event">'+esc(e.title)+'</span></li>').join('');
 $('.brief-box ul').innerHTML=['Località: '+city[0],'Sole: alba il 1° alle '+rows[0].value,'Luna: '+phases.map(e=>dayLabel(e.date)+' — '+e.title).join('; '),'Pianeti: sette schede, compresi Urano e Nettuno','Calendario: sei fenomeni selezionati'].map(t=>'<li>'+esc(t)+'</li>').join('');
 $('.notes-box ul').innerHTML='<li>Orari in Europe/Rome, con il passaggio automatico tra ora solare e legale. Il mese cambia il primo giorno alle 00:00, insieme a Il cielo del mese; ottobre 2026 è il mese iniziale.</li><li>Calcoli con <a href="https://github.com/cosinekitty/astronomy">Astronomy Engine</a>. Coordinate geografiche dei centri cittadini, quota convenzionale zero: rilievi, edifici e atmosfera possono modificare l’osservazione.</li><li>Congiunzioni: istante di uguale longitudine eclittica; l’orario consigliato di osservazione può essere diverso. Fasi e istanti geocentrici sono comuni; posizione, orizzonte e visibilità dipendono dalla città.</li><li>Fotografie d’archivio con fonte e crediti; non sono riprese degli eventi annunciati. I massimi meteorici sono date indicative del <a href="https://www.imo.net/resources/calendar/">calendario IMO 2026</a>, limitate all’anno verificato.</li><li>Per una lettura osservativa e la carta delle 22:00 consulta <a href="cielo-del-mese.html">Il cielo del mese</a>. Gli eventi si ricalcolano all’apertura e al cambio del mese anche se il dispositivo è stato spento.</li>';
 status.textContent=city[0]+' · '+label+' · dati e calendario aggiornati.';
 monthKey=y+'-'+m;window.Effemeridi={ready:true,year:y,month:m,city:city[0],solar:rows,planets,events:list.map(e=>({title:e.title,date:e.date.toISOString(),type:e.type})),reference:reference.toISOString()};
 }catch(e){console.error('Effemeridi:',e);status.textContent='Calcolo non completato: ricarica la pagina.';window.Effemeridi={ready:false,error:String(e)};}}
function check(){const p=activeMonth();if(monthKey!==p.year+'-'+p.month)render();}
function schedule(){clearTimeout(timer);const p=timeParts(new Date()),next=localDate(p.year,p.month+1,1,0);timer=setTimeout(()=>{check();schedule();},Math.min(2147483647,Math.max(100,next-Date.now()+100)));}
select.addEventListener('change',()=>{try{localStorage.setItem('ad-astra-city',select.value);}catch(e){}render();});window.addEventListener('storage',e=>{if(e.key==='ad-astra-city'&&cities.some(c=>c[0]===e.newValue)){select.value=e.newValue;render();}});document.addEventListener('visibilitychange',()=>{if(!document.hidden){check();schedule();}});window.addEventListener('pageshow',check);render();schedule();
})();
