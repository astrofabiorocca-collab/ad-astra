# Cielo del mese ed Effemeridi — aggiornamento locale 29 ottobre 2026

Questo riepilogo supera le regole precedenti sul riferimento fisso al giorno 15.

- Il cielo è calcolato nel browser per città, serata del mese e ora 18–06. La mattina appartiene al giorno successivo, anche nell’ultima notte del mese. Non c’è navigazione fra mesi o anni.
- Prima del primo novembre 2026 è mostrata esplicitamente l’anteprima di novembre. Dal primo novembre viene usato il mese reale Europe/Rome. Le Effemeridi usano sempre la data reale.
- I dati e i testi editoriali sono locali; niente download automatico di nuovi articoli o immagini. Il proprietario non deve tenere acceso il PC perché il sito pubblico funzioni.
- Vista stereografica interna: campo orizzontale iniziale 110°, zoom 25–220°, rotazione a 360°. Mouse, tastiera, tocco, pinch, schermo intero e alternativa circolare. I bordi si deformano ai grandi campi: non è la riproduzione fisiologica esatta dell’occhio.
- Reticolo J2000 trasformato alla data, stelle dal catalogo BSD d3-celestial, colori indicativi derivati dagli indici B−V. Nessuna texture stellare inventata o cielo fotografico spostato arbitrariamente.
- Posizioni di Sole, Luna e pianeti con Astronomy Engine; pianura disegnata originale, non fotografia della città. Atmosfera, estinzione e limite visuale sono modelli indicativi, non misura Bortle o previsione meteo. I simboli dei bersagli non garantiscono visibilità. I dischi sono ingranditi per riconoscerli.
- Le schede fotografiche conservano fotografie autentiche d’archivio e crediti. I pulsanti di ricerca indicano la posizione alla data scelta, non pretendono che la foto rappresenti quell’istante.
- Cielo: cambio mese automatico, controllo a mezzanotte/apertura/ripresa; se non è stata scelta una data manualmente, la serata segue il giorno corrente. Una data esplicitamente scelta resta in esame fino al cambio mese.
- Effemeridi: tutte le sezioni ricalcolate alla mezzanotte italiana e alla ripresa. Posizioni planetarie riferite all’istante di aggiornamento; finestre della serata civile corrente fino al mattino successivo. Campionamento 10 minuti e soglie esplicite. Calendario e fenomeni restano mensili.
- Il pulsante nel riquadro Dati di riferimento applica la città selezionata e ricalcola tutta la pagina. Se i valori arrotondati non cambiano, compare la conferma senza inventare variazioni.
- Le ore mancanti al cambio primaverile sono disabilitate; le ore ripetute in autunno hanno due scelte con offset distinto. Timer e conversioni usano Europe/Rome, non il fuso del computer.

## Validazione e limiti

Prove e rapporto in `lavoro-cielo-effemeridi-20261029` fuori dal repository pubblico. Confronto indipendente con Astropy/ERFA: 1152 direzioni stellari (massimo scarto circa 0,0064°) e 144 posizioni topocentriche dei corpi (massimo circa 0,0098° nei casi esaminati, senza rifrazione). Il confronto numerico non è stato effettuato eseguendo Stellarium: la sua guida pubblica è riferimento per proiezione e atmosfera, non una fonte di risultati falsamente dichiarati verificati.

Verifica comportamenti in DOM simulato e rendering canvas nativo offline; nessun browser avviato e nessun aggiramento del precedente blocco. La resa CSS e lo schermo intero nativo richiedono ancora la supervisione nel browser dell’utente. Nessun commit o pubblicazione automatica.

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
