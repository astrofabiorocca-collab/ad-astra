# Galatea: risposte dai testi del sito — 24 novembre 2026

Corretto il limite segnalato da Fabio con la ricerca «reflex»: il vecchio indice conservava solo parole uniche di 58 percorsi e il pannello privilegiava i suggerimenti generici del Glossario. Non erano disponibili passaggi di testo da citare né ricerca nei titoli della Videoteca.

Aggiunto un indice separato caricato su richiesta: 3.810 passaggi da 94 pagine HTML pubbliche (il Glossario continua a usare le sue schede) e 695 titoli video già presenti nella Videoteca. Esclusi script, stili, menu e footer, senza importare provini locali. I titoli video non sono dichiarati trascrizioni o spiegazioni verificate.

Ordine: definizione esatta del Glossario; passaggio pertinente dei testi del sito; suggerimenti concettuali; collegamenti video/metadati e Biblioteca. Refusi e varianti rimangono suggerimenti da scegliere. La ricerca dei passaggi è lessicale, con normalizzazione e varianti morfologiche, non comprensione generativa universale. Una spiegazione tratta dal sito è accompagnata dal collegamento alla sezione reale; se sono disponibili soltanto titoli video non viene inventata una definizione.

Aggiunte in Strumentazione le spiegazioni originali di reflex/DSLR e mirrorless, con fonti Canon e Nikon e ancore dedicate. Non sono sinonimi; DSLR indica specificamente una reflex digitale. Fonti tecniche: https://global.canon/en/technology/canon-tech/tech/dslr/ e https://www.nikonusa.com/learn-and-explore/c/products-and-innovation/mirrorless-versus-dslr-exploring-key-differences .

## Rigenerazione

Dopo modifiche ai testi pubblici: `python tools/ricerca-concetti/costruisci-passaggi.py` dalla radice del repository. Aggiornare la versione degli asset quando si pubblica un nuovo indice. Generazione ripetibile, hash invariato fra due esecuzioni senza modifiche. L’indice non esegue scraping automatico e non scarica o trascrive nuovi video.

## Verifiche

Test dati/DOM: reflex, DSLR, fotocamera reflex, plurali, mirrorless distinta, priorità delle definizioni del Glossario, suggerimento per inferferometro, query assente senza estratti inventati, percorsi compatibili con /ad-astra/. Tutte le ancore dei 3.810 passaggi presenti, tutti i 695 ID video presenti nella pagina Videoteca. Browser locale: domanda, risposta, collegamenti video e navigazione all’ancora di Strumentazione verificati. Non audit scientifico globale o trascrizione integrale dei video. Provini delle Notizie esclusi dalla modifica.
