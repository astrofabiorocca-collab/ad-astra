# Biblioteca AD ASTRA

La pagina `biblioteca.html` presenta dodici libri italiani. `biblioteca-online.html` offre il catalogo pubblico derivato dall'archivio personale, con schede e collegamenti esterni.

## Catalogo online — 15 ottobre 2026

991 schede: 21 PDF/dispense, 24 lezioni INAF Torino, 200 approfondimenti istituzionali, 44 playlist, 682 video e 20 portali/strumenti. Sono riferimenti, non 991 documenti revisionati integralmente. Video e playlist sono catalogati da metadati: non è dichiarata la visione delle lezioni.

`catalogo-online.json` conserva esclusivamente campi pubblici. `catalogo-online.js` contiene gli stessi dati per consentire la consultazione anche da file locale, senza server. `catalogo-ui.js` cerca nelle schede, non nei PDF. Filtri e ricerca rimangono nell'URL; l'esportazione CSV include i risultati filtrati. Si mostrano 24 schede alla volta per contenere il carico della pagina. Non vengono caricati player, cookie o miniature di YouTube.

Non sono distribuiti PDF, EPUB, filmati, testi estratti o percorsi dell'archivio privato. I documenti senza fonte pubblica e i libri commerciali non entrano nella raccolta gratuita. Per il corso INAF sono disponibili rimandi al programma e alle risorse ufficiali, non copie delle presentazioni o registrazioni. L'autorizzazione a ospitarle non è ancora pervenuta.

Verificati 281 indirizzi non YouTube: 279 risposte positive, due accessi automatici limitati (Angeletti e Skies & Scopes), dichiarati nelle schede. La verifica HTTP non certifica accuratezza, licenza o riproduzione dei contenuti. Per YouTube rimane esplicita la necessità di verificare disponibilità sulla piattaforma. Non è attivo un aggiornamento automatico.

## Manutenzione

I generatori e la banca SQLite risiedono nella cartella privata AD ASTRA, fuori dal checkout pubblico. Sequenza: `esporta-catalogo-pubblico.py`, verifica delle fonti e del programma, `rifinisci-catalogo-pubblico.py`, `costruisci-catalogo-online.py`. Prima di rigenerare, aggiornare metadati e controlli nell'archivio e conservare le correzioni editoriali. Per il banner: `inserisci-banner-biblioteca.py` crea l'ingresso iniziale; non rieseguirlo sulla sottopagina completa senza rigenerare poi il catalogo.

Il banner usa un'illustrazione concettuale approvata, non una carta scientifica. Testi e pulsante sono HTML; l'immagine è decorativa. Provenienza in `banner-provenienza.json`. Le copertine dei libri hanno registri e crediti separati.
