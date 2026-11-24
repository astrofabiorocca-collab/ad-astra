# Corpus comune di AD ASTRA — anteprima locale, 25 novembre 2026

Galatea, Biblioteca e Glossario utilizzano `AdAstraSiteSearch` per trovare i contenuti interni. Le fonti federate restano distinte e hanno precedenza nella Biblioteca. Le definizioni esatte del Glossario conservano la precedenza nelle risposte di Galatea.

## Contenuti acquisiti

- 92 pagine pubbliche tracciate; 13.178 unità di ricerca complessive, incluse le unità seguenti. Provini non tracciati, menu, footer e script generici sono esclusi.
- Tutte le 1.019 schede del Glossario: definizioni, fatti e paragrafi delle sezioni; alias e relazioni esistenti sono riutilizzati.
- Tutte le nove schede software: contenuti dei pop-up, funzione e metadati; apertura diretta con `software.html?software=dss` e analoghi.
- Tutte le 101 tavole attuali: titolo, descrizione e indice degli argomenti effettivamente letti nei riquadri. Il file `assets/poster/testi-ricerca.json` registra metodo e SHA-256 dell'immagine. È un indice tematico, **non una trascrizione integrale né una nuova revisione scientifica delle tavole**. Apertura diretta con `?tavola=SA-16` e analoghi; originali PNG/PDF invariati.
- 695 titoli video e 617 finestre lessicali da 45 secondi delle 27 trascrizioni già acquisite. Si pubblicano parole indicizzabili ordinate e deduplicate, non il testo integrale dei sottotitoli. Ogni rimando conserva video, tempo, lingua e indicazione dei sottotitoli automatici. I sottotitoli non vengono usati come definizione scientifica.

La ricerca distingue corrispondenze testuali, alias e concetti collegati. Strumento e tecnica non sono dichiarati sinonimi. «Stalker fotografico» propone una correzione da scegliere; «stacker fotografico» trova programmi e spiegazioni dello stacking. Non viene imposta una quota artificiale di risultati per voce.

## Rigenerazione e controlli

Dal repository:

```text
python tools/ricerca-concetti/costruisci-passaggi.py
node tools/ricerca-concetti/verifica-corpus.cjs
```

Il manifesto dell'indice registra gli hash di 99 file sorgente. Il controllo fallisce se pagine o dati sono cambiati senza rigenerazione. Una modifica a un'immagine dei poster richiede anche la verifica del suo indice tematico: non aggiornare l'hash alla cieca.

Per nuove trascrizioni già acquisite e autorizzate, prima della rigenerazione:

```text
python tools/ricerca-concetti/prepara-trascrizioni.py --input PERCORSO_ARCHIVIO_TRASCRIZIONI
```

L'archivio locale deve contenere `trascrizioni-stato.json` e `trascrizioni/VIDEO_ID.json`. Questo comando non interroga YouTube e non aggira blocchi del servizio. I testi integrali rimangono nell'archivio locale.

## Verifiche eseguite e limiti

### Articoli, notizie e manutenzione

Prima di ogni pubblicazione autorizzata eseguire `python tools/ricerca-concetti/aggiorna-banca.py` e includere il file generato nel rilascio. Il comando rigenera e verifica; non esegue commit, push o deploy.

I nuovi articoli e le notizie HTML sono acquisiti nel corpo del testo. Metadati consigliati: `ad-astra-content-type` = `articolo` oppure `notizia`; `ad-astra-editorial-status` = `pubblicato`. Sono riconosciuti anche i percorsi `articoli/`, `notizie/`, i prefissi `articolo-`, `notizia-` e `og:type=article`. Stati `draft`, `bozza`, `inedito` e `in revisione` e file `provino-*` sono esclusi. Questo esclude anche tre provini HTML già tracciati.

Gli articoli dinamici del lettore `window.AdAstraPublicationPreview` entrano soltanto con `status: "pubblicato"` (oppure `published`) e senza `demo: true`. Si acquisiscono introduzione, sintesi e paragrafi delle sezioni. Il risultato apre `?articolo=ID#pub-reader`. I quattro articoli campione attuali restano esclusi; i rimandi alle riviste esterne non equivalgono all'acquisizione dei loro testi integrali.

Automazione Codex locale attiva `aggiornamento-quindicinale-banca-ad-astra`: venerdì alle 09:00 ogni due settimane. Rigenera e verifica esclusivamente in locale; non scrive o approva notizie e non effettua commit, push o pubblicazione. L'indice aggiornato va online nella successiva pubblicazione autorizzata.

Verificate automaticamente tutte le 1.019 voci, i 101 titoli delle tavole, le nove applicazioni e le destinazioni delle 13.178 unità. Test DOM: risposta Galatea, ricerca e azzeramento della Biblioteca, rimandi nel Glossario, nove pop-up software e 101 finestre dei poster. Controllo browser: Biblioteca → software, risposta Galatea e apertura di una tavola a 390 px; nessun overflow orizzontale nella nuova sezione dei rimandi. La tavola mantiene il proprio visualizzatore con scorrimento.

Non è una certificazione HTTP di tutte le fonti esterne, una revisione scientifica completa del corpus o una trascrizione delle 101 immagini. I video senza sottotitoli acquisiti rimangono ricercabili tramite i metadati disponibili. La ricerca lessicale non equivale alla comprensione di qualsiasi frase libera.

Rilascio autorizzato da Fabio il 25 novembre 2026: integrazione nel sito pubblico dopo i controlli. Il provino notizie e gli altri provini non approvati restano separati.
