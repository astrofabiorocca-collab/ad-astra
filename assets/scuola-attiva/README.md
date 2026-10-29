# Scuola attiva — 29 ottobre 2026

Tre ingressi: `laboratorio.html`, `quiz-astronomia.html`, `glossario.html`.
Banner e footer derivano dalla pagina Scuola; nessun servizio remoto necessario
per esercizi, correzione o attestato. PDF-lib e fontkit sono già distribuiti
localmente in `assets/vendor`, con i rispettivi avvisi di licenza. Il carattere
Vera e la sua licenza sono in `assets/scheda-osservativa`.

## Contenuti

- 40 voci originali rielaborate sulla base di 28 risorse Treccani consultate.
  Ogni record contiene URL della fonte, data, esempio AD ASTRA e rimando didattico.
  Nessuna immagine o voce integrale Treccani riprodotta. Le fonti storiche non
  sono usate per aggiornamenti numerici; le convenzioni sono esplicitate.
- Prima occorrenza dei termini presenti nella banca collegata nelle 55 lezioni
  e nelle tre pagine pratiche. Non è un glossario esaustivo di ogni parola del sito.
- 20 attività: punti cardinali, sei costellazioni, Polare, due reticoli,
  eclissi lunare, otto pianeti, percorso stellare di massa solare, tre tipi
  di nebulosa, sistemi stellari, quattro configurazioni strumentali,
  allineamento/puntamento, meteore, pianificazione, transiti, circumpolarità
  e orientamento della carta.
- 40 domande, quattro per macroarea. I ripassi tematici e la prova finale usano
  la stessa banca; vengono mescolati ordine delle domande e delle alternative.
  Una banca casuale più ampia non è dichiarata come già disponibile.
- Soglia attestato 32/40. Documento personale non abilitante, senza verifica
  dell'identità, firma digitale, registro remoto o qualifica riconosciuta.

## Geometrie e figure

Sagome di costellazioni da `assets/cielo/catalogo-stelle.js` (d3-celestial,
licenza BSD in `assets/cielo/LICENSE-celestial.txt`), proiettate su una carta
equatoriale fissa. La carta non rappresenta il cielo del momento. Un pezzo
errato conserva la propria sagoma, non assume quella della sede sbagliata.
La Polare è il vertice a massima declinazione del tracciato dell'Orsa Minore.

Pianeti: fotografie d'archivio già documentate nel catalogo del Cielo del mese,
con rimandi e crediti visibili. Orbite circolari e distanze solo didattiche,
nessuna posizione istantanea simulata. Le immagini non sono in scala.

Assemblaggi: figure vettoriali di principio, non procedure operative reali
né dichiarazioni di compatibilità commerciale. Orientamento a 42° N:
bolla e direzione nord separate dalla vista laterale; puntamento separato
dall'allineamento dell'asse. Tolleranza didattica ±2°, carta ±5°.
Circumpolarità: stelle ideali a 45° N, declinazioni +60°, +20°, −60°;
senza rifrazione, ostacoli o condizioni di visibilità.

## Interazione e dati

Clic/clic, trascinamento HTML, tastiera e cursori. Il clic è l'alternativa
al trascinamento sui dispositivi tattili. Rosso/verde sempre accompagnati
da testo. Progressi dei soli laboratori in localStorage, con recupero se
indisponibile; nessun nome dell'attestato memorizzato o trasmesso.

Controllati in DOM simulato: risoluzione dei 20 esercizi, errore/riprova,
allineamento prima del puntamento, 40/40 e 0/40, soglia 31/32, quiz tematici,
ricerca glossario e collegamenti nelle 55 lezioni. Figure SVG rasterizzate
e ispezionate; PDF campione generato, riaperto, estratto e verificato
visivamente. Nessuna verifica visuale automatica in un browser reale.
