# Ripristino del blog — 21 novembre 2026

Ripristinato il corpo editoriale di Pubblicazioni dalla revisione precedente a d176f1f, conservando testata, menu e banner inferiore attuali. I quattro articoli e il nome Mario Rossi rimangono esplicitamente dimostrativi; nessun inedito dell’autore è stato inserito.

- `pubblicazioni-ad-astra.html`: ingresso generale al blog, lettore, archivio e collaborazione.
- `pubblicazioni-fabio-rocca.html`: pagina personale approvata con Urania, leggio e calendario, invariati.
- Rimandi reciproci, collegamento personale in apertura e nel banner autore.
- `assets/pubblicazioni-blog.js`: lettore precedente con rimozione del cambio alla raccolta personale vuota; il banner usa un vero collegamento alla pagina separata.

Verificati sintassi JavaScript, selettori richiesti dal lettore, unicità degli ID, risorse locali, ancore statiche, quattro PDF e dieci pagine illustrate, collegamenti reciproci e conservazione del footer. L’anteprima browser non è stata verificata: il servizio browser incorporato ha restituito timeout due volte. Il controllo delle ancore dinamiche del glossario rimane distinto da quello statico.
