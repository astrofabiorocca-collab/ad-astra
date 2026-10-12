# Il cielo del mese — AD ASTRA

La pagina `cielo-del-mese.html` esegue i calcoli nel browser, anche nella copia locale. Non richiede un server, API a pagamento, un programma sul PC o una pubblicazione mensile dei file.

## Regole

- Ottobre 2026 è il mese iniziale. Dal 1 novembre 2026, ore 00:00 in `Europe/Rome`, viene usato il mese corrente.
- La carta rappresenta il giorno 15 alle 22:00 locali, con gestione dell'ora legale/solare. Il calendario comprende l'intero mese.
- La città selezionata viene ricordata sul dispositivo; coordinate di riferimento del centro urbano, orizzonte ideale. Ostacoli, meteo e inquinamento luminoso non sono calcolati.
- Il cambio di mese viene controllato all'apertura, al ritorno sulla pagina e con un timer mentre è aperta. Il PC del proprietario del sito può essere spento. Un browser sospeso aggiorna al risveglio.
- Mappa, scelta degli oggetti, didascalie, immagini e calendario vengono rigenerati insieme. Il catalogo descrittivo è locale e verificato: non vengono inventati testi o scaricati automaticamente contenuti da siti terzi.
- Senza JavaScript rimane disponibile la fotografia editoriale di ottobre 2026, dichiarata nell'avviso.

## Dati e selezione

Astronomy Engine calcola fasi lunari, posizioni topocentriche dei pianeti, opposizioni, congiunzioni, stagioni ed eclissi. Una congiunzione è definita dall'uguaglianza della longitudine eclittica; la separazione deve essere inferiore a 8 gradi per gli incontri Luna/pianeta e a 5 gradi fra pianeti. La visibilità viene verificata separatamente nelle ore buie. Il calendario è una selezione divulgativa, non un elenco completo di tutti i fenomeni astronomici.

Gli oggetti del cielo profondo provengono da un catalogo di 21 bersagli per binocolo/piccolo telescopio, con coordinate J2000 convertite all'epoca della carta. Si selezionano fino a cinque oggetti sopra 25 gradi alle 22:00 del giorno 15. La scelta privilegia l'altezza sull'orizzonte e limita le ripetizioni dei gruppi dell'Auriga e delle galassie M81/M82. Le descrizioni fisiche restano stabili; oggetto, direzione, condizioni lunari e riferimenti mensili vengono aggiornati. La reale facilità di osservazione dipende anche dal cielo e dallo strumento.

I quattro protagonisti sono due pianeti favorevoli (con priorità serale), un evento osservabile o una fase lunare, e una costellazione stagionale. Le immagini sono fotografie di archivio NASA, NOIRLab e Till Credner. Fonti e licenze sono riportate nelle schede e in `foto/provenienza.json`. Per le congiunzioni si affiancano due fotografie separate dei protagonisti, dichiarandolo: non rappresentano la configurazione del giorno. Le eclissi e le immagini della Luna sono fotografie di archivio, non riprese dell’evento mensile. Le fotografie vengono scelte insieme al protagonista mensile.

I massimi meteorici sono dati annuali: per ottobre 2026 sono inserite Draconidi e Orionidi da IMO. Non sono riciclati negli anni successivi. Per aggiungere futuri sciami, integrare un calendario annuale verificato; tutti i fenomeni calcolabili continuano ad aggiornarsi automaticamente.

## Provenienza e licenze

- Astronomy Engine: https://github.com/cosinekitty/astronomy — MIT, copia della licenza in `LICENSE-astronomy.txt`.
- Stelle fino alla magnitudine 6 e linee: https://github.com/ofrohn/d3-celestial — BSD, `LICENSE-celestial.txt`. Cataloghi convertiti in `catalogo-stelle.js` per funzionare anche da file locale.
- Schede Messier di riferimento: https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/
- Calendario meteorico: https://www.imo.net/files/meteor-shower/cal2026.pdf

Le dipendenze sono salvate localmente (acquisite il 2 ottobre 2026): il funzionamento non dipende dalla disponibilità di un CDN. Conservare licenze e attribuzioni. Il mese si basa sulla data del dispositivo del visitatore.

## Effemeridi — integrazione del 3 ottobre 2026

`astro-core.js` condivide città, conversione degli orari, mese attivo, posizioni e ricerca dei fenomeni fra le due pagine. `effemeridi.js` calcola alba e tramonto solari al primo e ultimo giorno, fasi e levata/tramonto della Luna al 15, e sette pianeti, compresi Urano e Nettuno. La città è salvata in `ad-astra-city`; anche schede già aperte sullo stesso sito ricevono il cambio tramite l'evento storage.

Le finestre dei pianeti riguardano la notte 15–16: campionamento ogni 10 minuti, altezza minima 10°, Sole sotto −6°. Gli intervalli sono indicativi, non tempi di levata/tramonto; posizione alle 22 del 15 e magnitudine allo stesso istante. Costellazione determinata dalle coordinate equatoriali J2000 mediante i confini IAU. Orizzonte libero, quota convenzionale zero e rifrazione standard.

I sei fenomeni sono selezionati dalle ricerche astronomiche condivise: priorità a eclissi locali, opposizioni e congiunzioni favorevoli, poi fasi lunari e stagioni. Se necessario si aggiungono perigeo/apogeo lunari calcolati. Calendario e schede usano lo stesso elenco ordinato. Gli sciami rimangono nel calendario del Cielo del mese; non sono illustrati nelle Effemeridi in assenza di una fotografia autentica specifica. Non inventare eventi per riempire sei schede.

Le ulteriori fotografie NASA di Terra, Urano e Nettuno sono documentate in `foto/provenienza-effemeridi.json`; le riprese elaborate nei colori o composte in mosaico sono indicate. Senza JavaScript Effemeridi conserva un'istantanea di ottobre 2026: per i dati correnti occorre JavaScript. L'aggiornamento è eseguito sul dispositivo del visitatore e non richiede un PC del proprietario acceso né un commit mensile.

## Fasi lunari e Luna oggi

`luna-fase.js` applica l'illuminazione calcolata con Astronomy Engine alla fotografia NASA PIA00405 mediante ritaglio SVG, usando l'angolo di fase e la frazione illuminata. La dicitura visibile distingue la ricostruzione dalla fotografia d'archivio originale. Crescente a destra, calante a sinistra: orientamento convenzionale, non simulazione della librazione o della rotazione locale del disco. Nessun elemento della superficie lunare è generato dall'IA.

Le schede delle fasi mensili rappresentano l'istante dell'evento. Il riquadro `Luna oggi` delle Effemeridi usa invece la data reale del dispositivo, con riferimento alle 22:00 Europe/Rome, indipendentemente dal mese editoriale iniziale di ottobre. Si aggiorna al cambio di giorno, al risveglio della pagina e alla selezione della città. Riporta fase, illuminazione, altezza alle 22, levata/tramonto giornalieri e indicazioni divulgative per osservazione e fotografia.

## Luminosità suburbana e guida Bortle

Fonte originale: David Lorenz, Light Pollution Atlas, dati satellitari 2025, https://djlorenz.github.io/astronomy/lp/ . La fonte distingue esplicitamente luminosità modellata allo zenit e classe Bortle osservativa: https://djlorenz.github.io/astronomy/lp/bortle.html . Non convertirne i colori in classi Bortle né inventare classi locali.

Per ogni città si campionano 16 direzioni a 5, 10 e 15 km dal centro. Natural Earth 1:10m (`ne_10m_land`, pubblico dominio) esclude i punti in mare; non classifica uso del suolo o quartieri. La mediana delle zone cromatiche su terraferma è un'approssimazione descrittiva dell'intorno suburbano, che può comprendere aree rurali o urbane. Un ago indica la zona dell'atlante sulla sua legenda a 15 colori; luminosità e indice luce artificiale/naturale sono riportati come intervalli della zona, non come una misurazione puntuale. Metodo, campioni e hash del file sorgente sono in `suburbano-provenienza.json`; dati browser in `suburbano-dati.js`.

La scala Bortle 1–9 è una guida separata, senza attribuzione automatica di una classe alla città. Le condizioni locali, il cielo all'orizzonte e le luci vicine possono differire molto dall'indicatore. La sorgente PNG originale non è inclusa nel sito: vengono conservati soltanto gli estratti statistici documentati. Il dataset 2025 non si aggiorna ogni mese: serve una nuova edizione verificata dell'atlante.
