# Scuola attiva — revisione del 7 novembre 2026

Tre ingressi: `laboratorio.html`, `quiz-astronomia.html`, `glossario.html`.
Banner e footer derivano dalla pagina Scuola; nessun servizio remoto necessario
per esercizi, correzione o attestato. PDF-lib e fontkit sono già distribuiti
localmente in `assets/vendor`, con i rispettivi avvisi di licenza. Il carattere
Vera e la sua licenza sono in `assets/scheda-osservativa`.

## Contenuti

- 1.000 voci redatte, distribuite fra tutte le 26 lettere, con spiegazioni articolate, esempi, unità e riferimenti. Sigle e sinonimi sono chiavi di ricerca, non voci aggiuntive. Le sezioni esplicative comprendono 274.079 parole complessive, con un minimo di 220 per scheda.
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
La Polare usa coordinate J2000 esplicite, distinta dal polo geometrico. Il nuovo catalogo ridotto è in `assets/laboratorio-editoriale/cielo-geometrico.js`.

Pianeti: fotografie d'archivio già documentate nel catalogo del Cielo del mese,
con rimandi e crediti visibili. Orbite circolari e distanze solo didattiche,
nessuna posizione istantanea simulata. Le immagini non sono in scala.

Assemblaggi: immagini generate di componenti riconoscibili e puzzle in vista esplosa, non figure geometriche sostitutive degli oggetti. Interfacce illustrative, nessuna compatibilità commerciale certificata. Allineamento a 45° N; tolleranza didattica ±3°, carta ±5°. La vista di inclinazione non mostra l’azimut come una falsa rotazione tridimensionale. Circumpolarità a 45° N, declinazioni +60°, +20°, −60°, percorsi calcolati senza rifrazione e ostacoli.

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


Il caricamento della pagina usa esclusivamente il nuovo motore in
`assets/laboratorio-editoriale`; i vecchi file `laboratori.js` e
`laboratori-dati.js` restano conservati ma non sono caricati.

Verifica finale a 500 schede: tutte consultabili, riferimenti interni validi,
ricerca per nome e alias, 1.603 rimandi canonici nelle 58 pagine didattiche,
popup e parole ambigue; 20 attività con correzione e reset; soglie quiz
0/31/32/40. Controlli di dati e DOM simulato, senza dichiarare una verifica
grafica integrale in un browser o un audit HTTP globale delle fonti.
La successiva proposta di ampliamento a 1.000 termini non è conteggiata
come contenuto già prodotto. Nessuna pubblicazione automatica.

## Ampliamento verificato a 700 schede — 6 novembre 2026

700 schede reali (200 nuove rispetto a dcbc51b), 195.955 parole nelle sezioni e 26 lettere rappresentate. Sinonimi e sigle non contati come voci autonome. Testi originali con spiegazioni, esempi, termini correlati, fonte Treccani e riferimenti specifici pertinenti; eventuali fonti generali sono dichiarate.

Controlli dati/DOM: selezionabili tutte le schede, 58 pagine e 1651 rimandi canonici; ricerca/alias, quiz, foto e popup verificati; 20 attività con soluzioni, reset e controlli geometrici; 28 risorse locali. Nessuna verifica browser completa o verifica HTTP globale dichiarata. Aggiornati i rimandi alle lezioni per pertinenza editoriale. Il blocco si ferma a700 su richiesta dell'autore; nessun push o pubblicazione.

## Ampliamento a 800 schede — 7 novembre 2026

800 schede effettive, 100 nuove rispetto a f15e1b8 e tutte le 26 lettere rappresentate. Le nuove sezioni contengono 26.205 parole (minimo 241 per scheda). Alias e sinonimi non aumentano il conteggio. Ampliate fisica e chimica di base, astrochimica, geologia planetaria, processi stellari, cosmologia, fotografia, missioni e biografie; i rimandi sono alle lezioni pertinenti.

Testi originali: Treccani come riferimento terminologico, con distinzione delle pagine generali da quelle specifiche; confronti pertinenti con fonti istituzionali e manuali. La banca documentale privata è stata ampliata e deduplicata. I PDF forniti e le immagini delle slide non sono ripubblicati: l'indicizzazione non equivale a lettura integrale. Sei trascrizioni visive parziali restano separate dai testi originali e non sono presentate come OCR completo.

Il nuovo ordine dell'autore riprende il precedente stop a 700 e richiede un commit a 800. Nessun push o pubblicazione automatica. Le verifiche finali sono documentate nel registro privato; i controlli di dati/DOM non certificano rendering browser completo o validità HTTP di ogni fonte remota.

Verifica finale a 800: tutte le schede selezionabili; 58 pagine e 1.658 rimandi canonici; ricerca, nuovi alias e popup; quiz 0/31/32/40; 20 laboratori con reset e controlli geometrici, 28 risorse locali. Le 700 schede precedenti sono invariate. Controlli dati e DOM simulato, senza rendering browser completo.

## Ampliamento a 900 schede — 7 novembre 2026

900 schede effettive, 100 nuove rispetto a c36cdfa; 25,503 parole nelle nuove sezioni, minimo 241 per scheda. Le 800 precedenti restano invariate. Sinonimi e sigle non aumentano il conteggio. Aggiunti materiali e processi chimici, fisica, ambiente solare, strumentazione, missioni e mondi del Sistema solare. Fonti generali distinte dai riscontri specifici; nessuna lettura integrale del corpus è dichiarata.

La procedura `tools/integra-glossario-banca.py --banca PERCORSO` indicizza le schede nella banca privata come testi originali AD ASTRA, con versioni e hash. Non sono fonti indipendenti dalle lezioni. Le correlazioni FTS con documenti esterni sono candidati da verificare, non attribuzioni scientifiche automatiche. I 54 documenti esterni restano privati e non vengono copiati nel sito.

Verifiche dati e DOM: 900 schede consultabili, 58 pagine e 1.697 rimandi canonici, nomi/alias e riferimenti validi; quiz 0/31/32/40, popup, 20 laboratori con reset e geometrie, 28 risorse locali. Non è un rendering browser completo né un audit HTTP globale. Nessun push o pubblicazione. Il traguardo successivo autorizzato è 1.000, seguito dall’approfondimento accessibile delle lezioni più brevi.

## Traguardo di 1.000 schede — 7 novembre 2026

1.000 schede reali, 100 nuove rispetto a 5c32f32 e 200 rispetto a c36cdfa. Le nuove sezioni contengono 26,416 parole, minimo 253 per scheda; quattro sezioni per ciascuna delle100 nuove voci. Tutte le26 lettere sono rappresentate, senza inventare termini per imporre quote uguali. Sigle e sinonimi sono chiavi di ricerca e non voci aggiuntive. Le900 schede precedenti restano invariate.

Ampliati nomenclatura nucleare, famiglie e strutture chimiche, fasi della materia, vettori, statistica delle osservazioni, riferimenti celesti, storia della scienza, satelliti, missioni, cosmologia e rivelatori. Formule introdotte attraverso significato ed esempi; fonti Treccani generali esplicitamente distinte da riscontri specifici IUPAC, USNO e fonti istituzionali pertinenti. Testi originali, nessuna voce integrale o slide riprodotta. Il corpus non è dichiarato integralmente letto o verificato.

Banca privata:1.000 schede indicizzate con versione/hash e ricerca integrale, riconosciute come contenuto originale del progetto e non conferme indipendenti. Le correlazioni automatiche con documenti esterni sono candidati da verificare. Restano54 documenti esterni; PDF e trascrizioni parziali non vengono pubblicati.

Controlli finali dati/DOM:1.000 schede selezionabili,58 pagine e1.705 rimandi canonici; nomi/ID/alias, ricerca, popup e riferimenti interni; quiz0/31/32/40;20 laboratori con soluzioni/reset/geometrie e28 risorse locali. Sintassi e diff verificati. Nessuna verifica grafica completa in browser o audit HTTP globale dichiarati. Nessun push o pubblicazione.

Passaggio editoriale successivo concordato: approfondire le lezioni astronomiche più brevi sulla base della banca aggiornata, con esempi e spiegazioni accessibili. Il presente blocco conclude il glossario; non presenta quelle lezioni come già ampliate.
