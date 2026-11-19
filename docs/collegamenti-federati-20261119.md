# Collegamenti della Biblioteca Federata — 19 novembre 2026

## Comportamento implementato

La ricerca riconosce tutte le **1.011 voci** del glossario, gli alias registrati e gli equivalenti aggiuntivi acquisiti. Una corrispondenza univoca mostra prima la definizione italiana e un passaggio esplicativo della scheda, poi «Puoi approfondire qui». Gli omonimi richiedono la scelta della voce: non vengono fusi automaticamente.

Le fonti esterne precedono i percorsi interni. I PDF possono aprirsi alla pagina indicata; alcuni lettori esterni richiedono la selezione manuale. Il numero è quello della pagina del file PDF, non necessariamente della numerazione stampata. Sono distinti fonti sul termine, inquadramenti generali e concetti collegati. Le sezioni lunghe restano richiudibili.

Glossario e Biblioteca condividono l'indice; la Videoteca restituisce i collegamenti ai concetti riconosciuti. Anche i pop-up delle parole nelle lezioni offrono il collegamento diretto alla Biblioteca. Nessuna ricerca viene eseguita automaticamente all'apertura senza parametri; i collegamenti con una ricerca esplicita nell'URL restano operativi.

## Copertura misurata

| Controllo | Risultato |
|---|---:|
| Voci con almeno un riferimento specifico registrato | 1.011 / 1.011 |
| Associazioni termine–fonte conservate | 6,179 |
| URL esterni distinti nell'indice | 2,104 |
| Voci con almeno cinque fonti, inclusi gli inquadramenti | 475 |
| Voci con almeno cinque fonti escludendo gli inquadramenti generali | 448 |
| Voci associate a PDF o dispense | 669 |
| Voci con almeno un rimando a pagina PDF | 627 |
| Voci con percorso interno complementare | 1.011 |
| Voci con video pertinenti riconosciuti | 178 |
| Voci con occorrenze nelle trascrizioni acquisite | 77 |
| Video censiti e raggiungibili dalla Biblioteca | 695 |
| Video con almeno un concetto del glossario riconosciuto | 472 |
| Associazioni termine–video reciproche | 922 |

«Cinque fonti» indica cinque URL distinti, non cinque enti indipendenti. Non tutte le voci raggiungono tale soglia: non sono state aggiunte pagine generiche per simularne il raggiungimento. L'identificazione per titolo, descrizione o occorrenza testuale non equivale a una revisione scientifica completa del contenuto collegato.

## Materiali effettivamente elaborati

- Testo digitale di 2.288 pagine PDF dell'archivio con un indirizzo esterno originale disponibile. Sono esclusi i testi interni AD ASTRA e l'OCR precedente non verificato dal conteggio dei riscontri esterni.
- Acquisiti 16 PDF originali del Gruppo Astrofili Keplero e di ASI EXPLORA, 279 pagine: 256 con testo sostanziale indicizzato. Nove pagine prive di testo sono state sottoposte a OCR senza ottenere nuovo testo utilizzabile; non vengono dichiarate trascritte.
- 27 trascrizioni YouTube complete recuperate e analizzate per termini e finestre contigue di sottotitoli. Dopo tre risposte `IpBlocked` le richieste sono state fermate. Gli altri 665 video non sono stati interrogati dopo il blocco: non è dimostrato che siano privi di sottotitoli.
- Tutti i 695 video mantengono il rimando alla Biblioteca anche senza trascrizione. Dove il testo è disponibile, i collegamenti riconosciuti sono reciproci e includono il minuto. Senza un concetto riconosciuto, il collegamento cerca il titolo del video senza inventare una relazione scientifica.
- Sottotitoli automatici: possibili errori di riconoscimento, occorrenze candidate e avvio pochi secondi prima del passaggio. Non è dichiarata la visione integrale dei video né la verifica manuale di ogni minuto.
- Le 561 citazioni Wikipedia preesistenti rimangono disponibili localmente, con attribuzione e revisione identificata. Le associazioni basate sul titolo conservano l'etichetta di revisione editoriale pendente. Non sono state create citazioni Wikipedia per le restanti voci.
- Aggiunti 199 equivalenti inglesi dai collegamenti linguistici di Wikipedia, oltre agli alias già presenti e agli equivalenti selezionati. Il limite HTTP 429 ha interrotto l'acquisizione successiva: non si dichiara un repertorio inglese/francese integrale.
- Tredici voci prima sostenute soltanto da fonti generali hanno ricevuto un riferimento specifico selezionato: IUPAC, NASA, ESO, UCLA, Harvard/Smithsonian, Rubin Observatory, RSC, Hamamatsu e Sky-Watcher. Le descrizioni sono brevi sintesi italiane originali, non traduzioni integrali dei siti.

## Limiti delle fonti e degli accessi

Il testo estratto è utilizzato per riconoscere occorrenze con confini di parola, sinonimi espliciti e frasi equivalenti registrate. Non è un modello semantico generale e non certifica che ogni occorrenza costituisca una definizione. I concetti correlati sono mostrati separatamente. Fonti storiche e materiale tecnico conservano le avvertenze disponibili; le pagine non sono aggiornate automaticamente dalle fonti.

La verifica HTTP delle tredici nuove fonti ha restituito sette risposte 200; quattro pagine IUPAC hanno rifiutato le richieste automatiche con 403, UCLA ha prodotto un errore locale di certificato e Rubin un timeout. Sono indicate come accesso da verificare; la reperibilità nel motore web non è presentata come un controllo HTTP riuscito. Non è stato eseguito un nuovo audit HTTP globale di tutti gli URL esterni. Nessun aggiramento di blocchi, autenticazioni o certificati.

Non vengono pubblicati PDF integrali privati o trascrizioni YouTube: il sito contiene metadati, riferimenti e posizioni, mantenendo il collegamento alla provenienza originale.

## Verifiche

- Ricerca realmente eseguita nel browser per tutte le 1.011 denominazioni: definizione e fonti presenti.
- Generati e verificati i pannelli di approfondimento per tutte le 1.011 schede.
- Controllati i percorsi dei 695 video, le relazioni reciproche e l'avvio temporizzato del lettore.
- Verificate 500 destinazioni interne in 59 pagine, comprese le scene dinamiche dei laboratori; nessuna destinazione mancante.
- Verificati filtri NASA, azzeramento, ricerca inesistente, alias inglese e domanda formulata in linguaggio naturale.
- Controlli responsive della ricerca a 1.440, 820, 390 e 320 px: nessun overflow orizzontale della pagina o dei nuovi pannelli. Controllo visivo di un campione smartphone; nessuna certificazione di ogni schermata del sito.
- Nessun errore JavaScript nei percorsi browser verificati. Durante i test i servizi esterni erano intercettati: il controllo del lettore riguarda URL e minuto, non la riproduzione effettiva di YouTube.

Lavoro locale, senza push o pubblicazione. Le altre modifiche grafiche e le schede autore in lavorazione restano separate.
