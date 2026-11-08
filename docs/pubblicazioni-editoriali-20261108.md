# Pubblicazioni — impianto editoriale, 8 novembre 2026

Pagina operativa locale: `pubblicazioni-ad-astra.html`, già destinazione di menu e footer del sito. Il provino separato rimane disponibile. Non è stato eseguito un push o un deploy.

## Struttura

Titolo e sottotitolo approvati; quattro monografie dimostrative attribuite al nome di esempio Mario Rossi, non ad autori reali. Dieci pagine complessive (4 + 2 + 2 + 2), quattro PDF con testo vettoriale e font incorporati, anteprime WebP e pagine PNG a 300 dpi. I 300 dpi descrivono l’esportazione della pagina: non aumentano il dettaglio delle fotografie originali.

Il modello riprende la gerarchia del riferimento fornito da Fabio: apertura fotografica, firma, titolo e sommario; testo su colonne, titoletti evidenziati, fotografie commentate, In breve, fonti e crediti. Non riproduce né certifica i contenuti scientifici della copertina di riferimento.

Leggio con scrivania illustrativa generata, spessore di carta, rotazione del foglio in avanti/indietro, pagina singola/doppia, zoom proporzionale 100–300%, scorrimento e schermo intero nativo con alternativa espansa se il browser non lo consente. Movimento ridotto rispettato.

Archivio subito dopo le schede, ricerca locale per titolo/argomento/autore e filtri. Nessuna libreria esterna o richiesta a servizi per la ricerca. Rimandi verificati alle lezioni 4-1, 4-3, 2-4 e 3-6.

Banner autore compatto con cameo derivato dall’immagine approvata, senza rigenerazione del volto. Il pulsante cambia la raccolta nella stessa pagina; il ritorno ripristina le quattro schede. Non sono stati inventati articoli pubblicati su riviste: la raccolta personale resta esplicitamente in preparazione finché Fabio fornisce i documenti e i riferimenti.

## Asset e provenienza

Le fotografie HH24, HL Tauri, spettro solare, LRO/Tycho e Blue Marble sono risorse già documentate in `assets/lezioni`; fonte e crediti specifici sono conservati nei dati degli articoli e nei PDF. HL Tauri è rappresentazione di dati millimetrici; HH24 usa colori assegnati all’infrarosso; Blue Marble è composita. Nessuna nuova fotografia scientifica generata.

Scrivania: immagine generativa decorativa, non carta quantitativa. Cameo: illustrazione fornita e approvata da Fabio. Sorgenti editoriali in `tools/pubblicazioni`.

## Verifica

Render esaminati delle dieci pagine; estrazione testo e limiti geometrici controllati dal generatore. Test DOM: quattro articoli, dieci pagine, risorse locali, animazione, zoom A4, selezione delle raccolte, ricerca e filtri, ritorno e rimandi alle lezioni. Verifica browser: ingresso dalla Home attraverso Pubblicazioni; lettura desktop 1440 px e mobile 390 px, zoom al 300%, sfogliamento, ricerca Mario Rossi e filtro Osservare, apertura risultato, banner e ritorno; nessun overflow a 390 px. Il browser incorporato usa la modalità espansa se non offre il fullscreen nativo; non si dichiara una matrice completa di tutti i browser.

## Riproduzione

Dalla radice del repository: `node tools/pubblicazioni/crea-pagina.cjs --install`. Senza `--install` aggiorna il solo provino. Generazione PDF: Python con reportlab, Pillow e pypdfium2, `python tools/pubblicazioni/crea-articoli.py`; i font Georgia/Arial sono letti dai font di Windows. È un generatore locale, non una dipendenza runtime del sito. Per nuovi autori/contributi: sostituire i campioni con testi verificati, crediti, materiali autorizzati e metadati reali.
