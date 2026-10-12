/* AD ASTRA: calcoli locali, catalogo divulgativo e immagini riutilizzabili.
   Mese iniziale ottobre 2026; dal 1/11/2026 si usa il mese corrente in Europe/Rome.
   Nessun servizio a pagamento né geolocalizzazione richiesta. */
(() => {
'use strict';
const A=window.Astronomy, $=s=>document.querySelector(s), tz='Europe/Rome';
const {cities,names:sharedNames,timeParts,localDate,stamp,direction,esc,horizon,events,activeMonth}=window.AdAstraAstro;
const names={Mercury:sharedNames.Mercury,Venus:sharedNames.Venus,Mars:sharedNames.Mars,Jupiter:sharedNames.Jupiter,Saturn:sharedNames.Saturn,Moon:sharedNames.Moon};
const descriptions={Mercury:'Il pianeta più vicino al Sole: cercalo soltanto con il Sole già sotto l’orizzonte.',Venus:'Brilla molto intensamente; un piccolo telescopio permette di seguirne le fasi.',Mars:'Si riconosce per il colore rossastro. I dettagli della superficie richiedono un telescopio e condizioni favorevoli.',Jupiter:'Un binocolo ben fermo può mostrare i suoi quattro satelliti maggiori; al telescopio si distinguono le fasce delle nubi.',Saturn:'Al telescopio si possono riconoscere gli anelli; a occhio nudo appare come un punto luminoso stabile.'};
// Coordinate equatoriali J2000. Testi divulgativi originali basati sulle schede NASA/Hubble.
const objects=[
['M31','Galassia di Andromeda',.712,41.269,'binocolo','Una galassia vicina alla Via Lattea: sotto un cielo buio appare come una piccola nube allungata.'],
['M45','Pleiadi',3.791,24.117,'binocolo','Un gruppo di stelle giovani: il binocolo le raccoglie nello stesso campo e ne rivela molte più che a occhio nudo.'],
['M42','Nebulosa di Orione',5.588,-5.391,'binocolo o piccolo telescopio','Una nube in cui nascono stelle, nella “spada” di Orione. La fotografia ne mostra colori che all’occhio appaiono molto più tenui.'],
['M44','Presepe',8.672,19.672,'binocolo','Un ammasso aperto nel Cancro, formato da stelle che al binocolo si separano in un piccolo sciame luminoso.'],
['M35','Ammasso nei Gemelli',6.149,24.333,'binocolo o piccolo telescopio','Vicino ai piedi dei Gemelli, è una raccolta di stelle: il telescopio ne mostra meglio i singoli punti luminosi.'],
['M36','Ammasso nell’Auriga',5.602,34.14,'binocolo o piccolo telescopio','Un piccolo gruppo di stelle giovani nell’Auriga, più facile da riconoscere lontano dalle luci della città.'],
['M37','Ammasso nell’Auriga',5.873,32.553,'piccolo telescopio','Un ricco ammasso di stelle: al binocolo sembra una macchia, al telescopio si distingue meglio la sua trama stellare.'],
['M38','Ammasso nell’Auriga',5.478,35.854,'piccolo telescopio','Un ammasso aperto nell’Auriga, da cercare con ingrandimenti bassi per conservare un campo ampio.'],
['M41','Ammasso nel Cane Maggiore',6.767,-20.757,'binocolo o piccolo telescopio','Si trova sotto Sirio: un gruppo di stelle che richiede un orizzonte meridionale libero.'],
['M13','Ammasso di Ercole',16.695,36.46,'binocolo o piccolo telescopio','Una sfera di moltissime stelle. Al binocolo si vede come un piccolo batuffolo; un telescopio ne mostra meglio l’aspetto granuloso.'],
['M92','Ammasso di Ercole',17.285,43.136,'piccolo telescopio','Un ammasso globulare compatto: appare come una piccola nube rotonda, soprattutto sotto un cielo buio.'],
['M3','Ammasso nei Cani da Caccia',13.703,28.377,'piccolo telescopio','Un ammasso globulare ricco di stelle, visibile come una macchia rotonda e luminosa al centro.'],
['M5','Ammasso nel Serpente',15.309,2.081,'piccolo telescopio','Una grande famiglia sferica di stelle: osserva prima a basso ingrandimento, poi aumenta se il cielo è stabile.'],
['M15','Ammasso di Pegaso',21.5,12.167,'piccolo telescopio','Vicino a Pegaso, appare come una piccola nube rotonda con un centro luminoso.'],
['M2','Ammasso nell’Acquario',21.557,-.823,'piccolo telescopio','Un ammasso globulare nell’Acquario: un piccolo telescopio lo mostra come un batuffolo compatto.'],
['M11','Ammasso dell’Anitra Selvatica',18.851,-6.27,'binocolo o piccolo telescopio','Un ammasso aperto molto ricco nello Scudo; il telescopio permette di distinguere più stelle.'],
['M27','Nebulosa Manubrio',19.993,22.721,'piccolo telescopio','Il guscio di gas lasciato da una stella. Sotto un cielo buio si riconosce come una macchia tenue, senza i colori delle fotografie.'],
['M57','Nebulosa Anello',18.893,33.029,'piccolo telescopio','Nella Lira, un piccolo involucro di gas attorno a una stella. Il suo aspetto ad anello si distingue meglio con un cielo buio.'],
['M81','Galassia di Bode',9.926,69.065,'piccolo telescopio','Nell’Orsa Maggiore, una galassia che sotto un cielo buio appare come un piccolo ovale luminoso.'],
['M82','Galassia Sigaro',9.932,69.679,'piccolo telescopio','Vicina a M81, appare più stretta e allungata. Le luci cittadine ne rendono difficile l’osservazione.'],
['NGC869','Doppio Ammasso di Perseo',2.333,57.133,'binocolo o piccolo telescopio','Due ammassi stellari vicini nel cielo: un campo ampio permette di ammirarli insieme.']
];
const constellations=[['Ori','Orione',5.5,0,'La cintura di tre stelle è il riferimento più semplice per riconoscere questa figura del cielo invernale.'],['Gem','Gemelli',7,24,'Castore e Polluce segnano le teste dei Gemelli: due stelle facili da riconoscere nel cielo.'],['Leo','Leone',10.7,15,'Cerca Regolo e la sequenza di stelle che disegna una falce: è la testa del Leone.'],['Vir','Vergine',13.4,-8,'Spica, la sua stella più luminosa, guida verso questa ampia costellazione primaverile.'],['Boo','Boote',14.7,30,'Arturo, luminosa e arancione, aiuta a riconoscere la figura allungata di Boote.'],['Her','Ercole',17,30,'Un quadrilatero di stelle forma la parte centrale di Ercole; nelle vicinanze si trova l’ammasso M13.'],['Cyg','Cigno',20.3,40,'Deneb e le stelle della Croce del Nord aiutano a riconoscere il Cigno lungo la Via Lattea.'],['Peg','Pegaso',23,22,'Il Grande Quadrato è un riferimento ampio e riconoscibile del cielo autunnale.'],['And','Andromeda',1,38,'Una catena di stelle si allunga accanto al Quadrato di Pegaso, verso la galassia M31.'],['Cas','Cassiopea',1,60,'La caratteristica W di stelle è un riferimento del cielo settentrionale.'],['Tau','Toro',4.5,20,'Aldebaran e le Iadi formano il volto del Toro; nelle vicinanze brillano le Pleiadi.']];
const chartConstellations=constellations.concat([
['UMa','Orsa Maggiore',11.8,55],['UMi','Orsa Minore',15,78],['Per','Perseo',3.3,44],['Aur','Auriga',5.7,41],['Lyr','Lira',18.8,36],['Aql','Aquila',19.7,3],['Aqr','Acquario',22.4,-12],['Psc','Pesci',.4,10],['Cet','Balena',1.7,-16],['Cep','Cefeo',22,67],['Dra','Drago',17.3,65],['Cnc','Cancro',8.7,20],['Sco','Scorpione',16.8,-29],['Sgr','Sagittario',18.6,-27],['CMa','Cane Maggiore',6.8,-23],['CMe','Cane Minore',7.6,7]]);
const narrative=[
['Gennaio invita a osservare presto: le sere sono lunghe e il cielo invernale offre stelle luminose, facili da riconoscere anche per chi comincia. Nelle notti limpide, Orione e le costellazioni vicine accompagnano lo sguardo verso sud.', 'Prepara una giacca calda, guanti e scarpe adatte al terreno. Il freddo si sente soprattutto quando si rimane fermi; alterna l’osservazione a una pausa al riparo e proteggi gli strumenti dalla condensa.'],
['Febbraio conserva le lunghe serate d’inverno, ma la luce del giorno comincia a guadagnare spazio. Il cielo serale è ancora ricco di stelle brillanti: basta un orizzonte libero per ritrovare figure familiari e imparare a collegarle.', 'Vestiti a strati e scegli un posto riparato dal vento. Un binocolo e una sedia rendono più comoda una breve uscita; prima di partire controlla nuvole, nebbia e condizioni del percorso.'],
['Marzo è un mese di passaggio: le giornate si allungano e il cielo porta con sé il cambio di stagione. Le figure invernali si spostano verso ovest, mentre nuove costellazioni prendono posto nel cielo della sera.', 'Le temperature possono cambiare molto tra il pomeriggio e la notte. Porta uno strato caldo in più e lascia agli occhi il tempo di abituarsi al buio; verso fine mese il cambio all’ora legale sposta più avanti la notte sull’orologio.'],
['Aprile apre le serate primaverili: il buio arriva più tardi e il cielo cambia volto. Le costellazioni dell’inverno salutano a ovest, mentre quelle di primavera invitano a esplorare nuove zone con calma.', 'Anche dopo una giornata mite, l’aria può rinfrescarsi rapidamente. Una giacca leggera, un luogo asciutto e una piccola torcia rossa aiutano a osservare senza fretta e senza perdere l’adattamento al buio.'],
['Maggio invita a prolungare le passeggiate serali, ma per incontrare un cielo davvero buio occorre aspettare un po’. Le stelle compaiono gradualmente e permettono di seguire il passaggio dal crepuscolo alla notte.', 'Scegli un luogo lontano dai lampioni e porta una felpa: restando fermi si avverte il fresco anche nelle sere piacevoli. Per le osservazioni più deboli, evita le notti con molta Luna e concedi tempo agli occhi.'],
['Giugno regala sere lunghe: il tramonto si attarda e, soprattutto nel nord Italia, alle 22 può esserci ancora luce nel cielo. È un buon momento per imparare a riconoscere le prime stelle e attendere insieme l’arrivo della notte.', 'Per gli oggetti più deboli aspetta che il crepuscolo sia terminato. Porta acqua, una giacca per il fresco notturno e quanto serve per stare comodo all’aperto; controlla il vento e gli eventuali temporali prima di uscire.'],
['Luglio porta il cielo estivo e il piacere di osservare all’aperto. Quando il buio è completo, le grandi figure dell’estate guidano lo sguardo; lontano dalle luci, nelle notti favorevoli, si può cercare la fascia della Via Lattea.', 'Il caldo del giorno non garantisce una notte asciutta o trasparente: foschia e umidità possono attenuare le stelle. Scegli una sera limpida, porta acqua e uno strato leggero e ripara gli strumenti dalla rugiada.'],
['Agosto invita a guardare il cielo durante le serate di vacanza. Il buio torna un poco prima e le costellazioni estive restano ottime compagne per orientarsi, con un binocolo o semplicemente a occhio nudo.', 'Cerca un posto tranquillo e lontano dalle luci, con una visuale ampia. Anche in estate la notte può essere fresca, soprattutto in montagna: una coperta o una felpa rendono più piacevole l’attesa delle stelle.'],
['Settembre accompagna il passaggio dall’estate all’autunno: le serate si accorciano e il cielo buio torna più accessibile. Le figure estive resistono a ovest, mentre quelle autunnali si fanno spazio dalla parte opposta.', 'Approfitta delle notti limpide senza dare per scontata la trasparenza dell’aria: umidità e foschia variano molto da luogo a luogo. Porta una giacca e osserva da un terreno asciutto, lontano dalle luci dirette.'],
['Ottobre riporta il buio dentro la sera: il Sole tramonta sempre prima e non occorre più aspettare fino a notte fonda per mettersi a osservare. Le costellazioni estive scivolano verso ovest; Pegaso e Andromeda prendono il loro posto, mentre a est si affacciano le stelle che ci accompagneranno verso l’inverno.', 'Dopo il passaggio di una perturbazione, alcune serate possono offrire un’aria limpida e stelle ben definite. È il momento di approfittarne, ma senza dare per scontato un cielo sempre asciutto: nebbia, foschia e rugiada possono comparire, soprattutto nelle valli e in pianura. Prima di uscire, controlla le condizioni del luogo scelto.', 'Vestiti a strati, porta una giacca calda e indossa scarpe adatte al terreno: restando fermi al binocolo il fresco si sente più che durante una passeggiata. Una sedia e una piccola torcia rossa rendono l’uscita più comoda. Spegni le luci vicine, lascia agli occhi il tempo di abituarsi al buio e comincia dalle figure più riconoscibili: il cielo di ottobre si scopre senza fretta.'],
['Novembre allunga le notti e riporta l’osservazione nelle prime ore della sera. Il cielo autunnale è ancora protagonista, mentre le figure dell’inverno salgono progressivamente da est e preparano un nuovo percorso tra le stelle.', 'Le notti limpide possono essere fredde e l’umidità può appannare gli strumenti. Vestiti a strati, proteggi mani e piedi e scegli un luogo con un orizzonte libero; se arriva la nebbia, rimanda l’uscita a una sera più favorevole.'],
['Dicembre offre molte ore di buio e un cielo serale che invita a riconoscere le stelle dell’inverno. Anche una breve osservazione dopo cena può diventare un piccolo viaggio: prima a occhio nudo, poi con il binocolo.', 'Il freddo richiede qualche attenzione pratica: guanti, scarpe calde e una pausa al riparo aiutano a godersi l’uscita. Controlla terreno, vento e nuvole, proteggi gli strumenti dalla condensa e scegli la qualità della serata, senza inseguire per forza una lunga sessione.']
];
const monthConst=[0,1,2,3,4,5,6,6,7,7,8,10];
let selected='Roma';try{selected=localStorage.getItem('ad-astra-city')||selected;}catch(e){}
const select=$('#sky-city');select.replaceChildren();cities.forEach(c=>{const op=document.createElement('option');op.value=c[0];op.textContent=c[0];select.appendChild(op);});select.value=cities.some(c=>c[0]===selected)?selected:'Roma';
function starHorizon(ra,dec,date,obs,rotation){const r=ra*Math.PI/12,d=dec*Math.PI/180;const v=new A.Vector(Math.cos(d)*Math.cos(r),Math.cos(d)*Math.sin(r),Math.sin(d),date);const eq=A.EquatorFromVector(A.RotateVector(rotation,v));return A.Horizon(date,obs,eq.ra,eq.dec,'normal');}
function coordinates(ra,dec){const minutes=Math.round(ra*60),degrees=Math.floor(Math.abs(dec)),arcmin=Math.round((Math.abs(dec)-degrees)*60);return 'AR '+String(Math.floor(minutes/60)%24).padStart(2,'0')+'h '+String(minutes%60).padStart(2,'0')+'m · Dec '+(dec<0?'−':'+')+degrees+'° '+String(arcmin).padStart(2,'0')+'′';}
function project(h){const r=(90-h.altitude)/90*238,ang=h.azimuth*Math.PI/180;return [250-r*Math.sin(ang),250-r*Math.cos(ang)];}
function map(date,obs,deep){
 const rotation=A.Rotation_EQJ_EQD(date);
 const pos=(ra,dec)=>starHorizon(ra,dec,date,obs,rotation);
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" role="img" aria-labelledby="chart-name"><title id="chart-name">Carta del cielo: '+esc(select.value)+', '+esc(stamp(date))+'</title><defs><radialGradient id="sky-grad"><stop stop-color="#4083ad"/><stop offset="1" stop-color="#205c89"/></radialGradient><clipPath id="sky-disc"><circle cx="250" cy="250" r="239"/></clipPath></defs><circle cx="250" cy="250" r="249" fill="url(#sky-grad)"/><g clip-path="url(#sky-disc)">';
 const labels=[],occupied=[];
 function label(x,y,text,color,size=10,bold=false){
  const width=text.length*size*.53,height=size+3;
  for(const [dx,dy]of [[0,0],[0,14],[0,-14],[20,20],[-20,-20],[0,28],[0,-28]]){
   const cx=x+dx,cy=y+dy,box=[cx-width/2,cy-height,cx+width/2,cy+3];
   if([[box[0],box[1]],[box[2],box[1]],[box[0],box[3]],[box[2],box[3]]].some(([a,b])=>Math.hypot(a-250,b-250)>236))continue;
   if(occupied.some(b=>box[0]<b[2]+3&&box[2]>b[0]-3&&box[1]<b[3]+3&&box[3]>b[1]-3))continue;
   occupied.push(box);labels.push(`<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" font-size="${size}" font-weight="${bold?600:400}" font-family="Arial,sans-serif" fill="${color}" stroke="#205c89" stroke-width="2.5" paint-order="stroke">${esc(text)}</text>`);return true;
  }return false;
 }
 function curve(points){let path='',connected=false;const visible=[];for(const [ra,dec]of points){const h=pos(ra,dec);if(h.altitude<0){connected=false;continue;}const [x,y]=project(h);path+=(connected?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);connected=true;visible.push({x,y,h});}svg+=`<path data-layer="equatorial-grid" d="${path}" fill="none" stroke="#b8d9ec" stroke-width=".65" stroke-dasharray="3 5" opacity=".4"/>`;return visible;}
 for(let ra=0;ra<24;ra+=2){const points=curve(Array.from({length:59},(_,i)=>[ra,-87+i*3]));const p=points.filter(p=>p.h.altitude>10&&p.h.altitude<25).sort((a,b)=>Math.abs(a.h.altitude-16)-Math.abs(b.h.altitude-16))[0];if(p)label(p.x,p.y,ra+'h','#c5dfef',8.5);}
 for(const dec of [-60,-30,0,30,60]){const points=curve(Array.from({length:121},(_,i)=>[i/5,dec]));const p=points.filter(p=>p.h.altitude>12&&p.h.altitude<75).sort((a,b)=>Math.hypot(a.x-355,a.y-170)-Math.hypot(b.x-355,b.y-170))[0];if(p)label(p.x,p.y,(dec>=0?'+':'−')+Math.abs(dec)+'°','#d0e6f3',8.5);}
 const ids=new Set(chartConstellations.map(c=>c[0])),vertices=new Set();
 window.CieloStelle.lines.forEach((constellation,index)=>{
  if(!ids.has(window.CieloStelle.lineIds[index]))return;
  for(const line of constellation)for(let i=1;i<line.length;i++){
   const h1=pos(((line[i-1][0]+360)%360)/15,line[i-1][1]),h2=pos(((line[i][0]+360)%360)/15,line[i][1]);if(h1.altitude<0||h2.altitude<0)continue;
   const [x1,y1]=project(h1),[x2,y2]=project(h2);
   svg+=`<path data-layer="constellation" d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#cde8fb" stroke-width="1.3" opacity=".86"/>`;
   vertices.add(x1.toFixed(1)+','+y1.toFixed(1));vertices.add(x2.toFixed(1)+','+y2.toFixed(1));
  }
 });
 for(const point of vertices){const [x,y]=point.split(',');svg+=`<circle cx="${x}" cy="${y}" r="1.35" fill="#f3f8ff"/>`;}
 for(const [ra,dec,mag]of window.CieloStelle.stars){if(mag>4.4)continue;const h=pos(((ra+360)%360)/15,dec);if(h.altitude<0)continue;const [x,y]=project(h);svg+=`<circle data-star="true" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.max(.75,3.1-mag*.45).toFixed(2)}" fill="#fff"/>`;}
 for(const body of Object.keys(names)){
  const h=horizon(body,date,obs);if(h.altitude<0)continue;const [x,y]=project(h);
  svg+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${body==='Moon'?5:3.8}" fill="#ffe29a" stroke="#17456a" stroke-width="1.2"><title>${names[body]}</title></circle>`;
  label(x+18,y-9,names[body],'#ffe29a',10.5,true);
 }
 for(const o of deep){const h=pos(o[2],o[3]);if(h.altitude<0)continue;const [x,y]=project(h);
  svg+=`<circle data-object="${esc(o[0])}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="#143f63" stroke="#a5f1f5" stroke-width="1.6"><title>${esc(o[0]+' · '+o[1]+' · '+coordinates(o[2],o[3]))}</title></circle>`;
  label(x+16,y-9,o[0],'#aff5f7',10,true);
 }
 for(const c of chartConstellations){const h=pos(c[2],c[3]);if(h.altitude<10)continue;const [x,y]=project(h);label(x,y+11,c[1],'#fff',10.5,true);}
 svg+=labels.join('')+'</g><circle cx="250" cy="250" r="238" fill="none" stroke="#d1e8fa" stroke-width="1" opacity=".6"/><text x="250" y="255" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" fill="#d0e6f3">ZENIT</text></svg>';
 return svg;
}


function cardPhoto(card){
 if(card.phaseDate)return {html:'<div class="protagonist-image">'+window.AdAstraLuna.picture(card.phaseDate,card.title)+'</div>',credit:'<p class="photo-credit">Illuminazione calcolata su fotografia di archivio <a href="https://images.nasa.gov/details/PIA00405">NASA/JPL</a>; fase riferita all’evento indicato.</p>'};
 const keys=card.image==='congiunzione'?Object.keys(names).filter(key=>card.title.includes(names[key])).sort((a,b)=>card.title.indexOf(names[a])-card.title.indexOf(names[b])):[card.image==='eclissi'?(card.title.includes('Sole')?'eclissiSole':'eclissiLuna'):card.image];
 const chosen=keys.map(key=>({key,photo:window.CieloFoto[key]})).filter(item=>item.photo);
 if(!chosen.length)throw new Error('Fotografia mancante per '+card.title);
 const pair=chosen.length>1;
 const images=chosen.map(({key,photo})=>'<img src="'+esc(photo.file)+'" alt="'+esc(names[key]||card.title)+' — fotografia di archivio" width="640" height="360" loading="lazy">').join('');
 const credit=chosen.map(({key,photo})=>'<a href="'+esc(photo.source)+'">'+esc(pair?(names[key]+': '+photo.credit):photo.credit)+'</a>'+ (photo.license==='CC BY 4.0'?' · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>':photo.license==='CC BY-SA 3.0'?' · <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>':'')).join('<br>');
 return {html:'<div class="protagonist-image'+(pair?' photo-pair':'')+'">'+images+'</div>',credit:'<p class="photo-credit">'+(pair?'Fotografie separate dei due astri. ':'Fotografia di archivio. ')+credit+'</p>'};
}

function visibleText(body,y,m,obs){const at22=horizon(body,localDate(y,m,15),obs);if(at22.altitude>=15)return `Il 15 del mese alle 22:00 si trova verso ${direction(at22.azimuth)}${at22.altitude<25?', piuttosto basso sull’orizzonte':''}.`;
let best=null;for(const day of [5,15,25])for(const hr of [18,19,20,21,23,0,1,2,3,4,5,6]){const d=localDate(y,m,day,hr),h=horizon(body,d,obs),sun=horizon('Sun',d,obs);if(sun.altitude<-8&&h.altitude>15&&(!best||h.altitude>best.h.altitude))best={d,h,hr,day};}if(!best)return 'Nel mese è poco favorevole: troppo vicino al Sole oppure basso nelle ore buie.';
return `Intorno al ${best.day} del mese, cercalo verso ${direction(best.h.azimuth)} alle ${String(best.hr).padStart(2,'0')}:00${best.hr<7?', nelle ore dopo mezzanotte':''}. Alle 22:00 del giorno 15 ${at22.altitude<=0?'è sotto l’orizzonte':'è basso sull’orizzonte'}.`;}
let monthKey='',timer;
function render(){try{
const {year:y,month:m}=activeMonth(),city=cities.find(c=>c[0]===select.value)||cities.find(c=>c[0]==='Roma'),obs=new A.Observer(city[1],city[2],0),date=localDate(y,m,15),rot=A.Rotation_EQJ_EQD(date),label=new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric',timeZone:tz}).format(date),month=label[0].toUpperCase()+label.slice(1);
const ranked=objects.map(o=>({o,h:starHorizon(o[2],o[3],date,obs,rot)})).filter(x=>x.h.altitude>=25).sort((a,b)=>b.h.altitude-a.h.altitude);const deep=[];for(const x of ranked){if(deep.length>=5)break;if(deep.filter(o=>o[0].startsWith('M8')).length>=1&&x.o[0].startsWith('M8'))continue;if(deep.filter(o=>['M36','M37','M38'].includes(o[0])).length>=1&&['M36','M37','M38'].includes(x.o[0]))continue;deep.push(x.o);}
const eventList=events(y,m,obs),phaseList=eventList.filter(e=>e.type==='phase'),planets=['Saturn','Jupiter','Mars','Venus','Mercury'].map(body=>({body,score:Math.max(...[19,20,21,22,23,0,1,2,3,4,5].map(hr=>{const d=localDate(y,m,15,hr);return horizon('Sun',d,obs).altitude<-8?horizon(body,d,obs).altitude+(hr>=19&&hr<=23&&horizon(body,d,obs).altitude>15?45:0):-90;}))})).filter(p=>p.score>15).sort((a,b)=>b.score-a.score);
const cards=planets.slice(0,2).map(p=>({title:names[p.body],image:p.body,description:descriptions[p.body]+' '+visibleText(p.body,y,m,obs)}));
const highlight=eventList.find(e=>e.type==='eclipse')||eventList.find(e=>e.type==='conjunction'&&e.observable)||phaseList.find(e=>e.title==='Luna nuova');if(highlight)cards.push({title:highlight.title,image:highlight.type==='eclipse'?'eclissi':highlight.type==='conjunction'?'congiunzione':'Moon',phaseDate:highlight.type==='phase'?highlight.date:null,description:stamp(highlight.date)+'. '+highlight.text});
const c=constellations[monthConst[m-1]],ch=starHorizon(c[2],c[3],date,obs,rot);cards.push({title:c[1],image:'costellazione-'+c[0],description:c[4]+` Il 15 alle 22:00 ${ch.altitude>0?'si trova verso '+direction(ch.azimuth):'non è ancora sopra l’orizzonte'}.`});
if(cards.length<4){const full=phaseList.find(e=>e.title==='Luna piena');if(full)cards.push({title:'Luna piena',image:'Moon',phaseDate:full.date,description:stamp(full.date)+'. '+full.text});}
const equipmentNote=[1,2,3,10,11,12].includes(m)?'Prima di uscire controlla il rischio di gelate, soprattutto in quota e nelle località più fredde: scegli un terreno sicuro e proteggi mani e piedi. Dedica un riguardo anche agli strumenti: rugiada e condensa possono velare le lenti, mentre il freddo riduce l’autonomia delle batterie. Non strofinare le superfici ottiche per togliere ghiaccio o umidità; al rientro lascia asciugare gli strumenti prima di chiuderli nelle custodie.':'Anche nelle serate miti, rugiada e condensa possono appannare binocoli e telescopi. Tieni le custodie al riparo dall’umidità, evita di toccare o strofinare le lenti e lascia asciugare gli strumenti prima di riporli. Una serata breve ma comoda permette di osservare meglio che una lunga uscita in condizioni poco favorevoli.';
const objectNote=`A guidare questa esplorazione c’è ${c[1]}. ${c[4]} Tra le mete consigliate trovi ${deep.slice(0,2).map(o=>`${o[1]} (${o[0]}): ${o[5]}`).join(' ')} Le schede dei protagonisti accompagnano il percorso con ${cards.slice(0,2).map(card=>card.title).join(' e ')}, indicando il momento più adatto per cercarli dalla città scelta.`;
$('.month-main h2').textContent=month;$('#month-description').innerHTML=[...narrative[m-1],equipmentNote,objectNote].map(text=>'<span class="month-note">'+esc(text)+'</span>').join('');
$('.quick-summary-list').innerHTML=`<li><strong>Mese</strong>${esc(month)}</li><li><strong>Cielo serale</strong>Il 15 alle 22:00 · ${esc(city[0])}</li><li><strong>Fenomeni</strong>${eventList.filter(e=>e.type!=='phase').length} appuntamenti, oltre alle fasi lunari</li><li><strong>Osservazione</strong>Orizzonte libero, cielo buio e binocolo o piccolo telescopio</li>`;
$('.sky-chart-title').textContent=`Carta del cielo · ${month}`;$('#sky-map').innerHTML=map(date,obs,deep);
const sun=horizon('Sun',date,obs),illum=Math.round(A.Illumination('Moon',date).phase_fraction*100),moon=horizon('Moon',date,obs);
$('#sky-caption').textContent=`${city[0]} · 15 ${label} · ore 22:00 (${timeParts(date).hour===date.getUTCHours()+2?'ora legale':'ora solare'}). Per gli oggetti del cielo profondo scegli un luogo lontano dalle luci cittadine. Carta vista guardando verso l’alto: est a sinistra, ovest a destra; il centro è lo zenit. Punti dorati: pianeti; anelli azzurri: oggetti consigliati. Reticolo equatoriale J2000: ascensione retta (AR) in ore e declinazione (Dec) in gradi. ${sun.altitude>-18?'A quest’ora può essere ancora presente il crepuscolo. ':''}${moon.altitude>0?`Luna sopra l’orizzonte, illuminata al ${illum}%: gli oggetti deboli possono risultare meno visibili.`:'La Luna è sotto l’orizzonte.'}`;
$('#deep-sky-list').innerHTML=deep.map(o=>{const h=starHorizon(o[2],o[3],date,obs,rot);return `<li class="object-item"><strong>${esc(o[0]+' · '+o[1])}</strong><p>${esc(o[5])} Il 15 alle 22:00 cercalo verso ${direction(h.azimuth)}. Strumento: ${esc(o[4])}.</p><small class="object-coordinates">${coordinates(o[2],o[3])} · J2000</small></li>`;}).join('');
$('#monthly-protagonists').innerHTML=cards.slice(0,4).map(c=>{const photo=cardPhoto(c);return '<article class="protagonist-card">'+photo.html+'<div class="protagonist-content"><h3>'+esc(c.title)+'</h3><p>'+esc(c.description)+'</p>'+photo.credit+'</div></article>';}).join('');
$('#month-events').innerHTML=eventList.map(e=>`<li><strong>${esc(e.type==='meteor'?new Intl.DateTimeFormat('it-IT',{timeZone:tz,day:'numeric',month:'long'}).format(e.date):stamp(e.date))} · ${esc(e.title)}</strong> — ${esc(e.text)}</li>`).join('');
$('#sky-status').textContent=`${city[0]} · ${city[1].toFixed(2)}° N, ${city[2].toFixed(2)}° E · ${month}. Mappa e schede aggiornate insieme.`;
monthKey=y+'-'+m;window.CieloMese={year:y,month:m,city:city[0],reference:date.toISOString(),objects:deep.map(o=>o[0]),events:eventList.map(e=>({title:e.title,date:e.date.toISOString()})),cards:cards.map(c=>c.title),ready:true};
}catch(e){console.error('Carta del cielo:',e);$('#sky-status').textContent='Non è stato possibile completare il calcolo. Ricarica la pagina per riprovare.';window.CieloMese={ready:false,error:String(e)};}}
function schedule(){clearTimeout(timer);const p=timeParts(new Date()),next=p.month===12?localDate(p.year+1,1,1,0):localDate(p.year,p.month+1,1,0);timer=setTimeout(()=>{check();schedule();},Math.min(2147483647,Math.max(100,next.getTime()-Date.now()+100)));}
function check(){const p=activeMonth();if(monthKey!==p.year+'-'+p.month)render();}
select.addEventListener('change',()=>{try{localStorage.setItem('ad-astra-city',select.value);}catch(e){}render();});document.addEventListener('visibilitychange',()=>{if(!document.hidden){check();schedule();}});window.addEventListener('pageshow',check);
window.addEventListener('storage',e=>{if(e.key==='ad-astra-city'&&cities.some(c=>c[0]===e.newValue)){select.value=e.newValue;render();}});
render();schedule();
})();
