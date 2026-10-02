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

I quattro protagonisti sono due pianeti favorevoli (con priorità serale), un evento osservabile o una fase lunare, e una costellazione stagionale. Le immagini sono illustrazioni SVG AD ASTRA; i tracciati delle costellazioni derivano dal catalogo, le illustrazioni dei pianeti e degli incontri sono schematiche.

I massimi meteorici sono dati annuali: per ottobre 2026 sono inserite Draconidi e Orionidi da IMO. Non sono riciclati negli anni successivi. Per aggiungere futuri sciami, integrare un calendario annuale verificato; tutti i fenomeni calcolabili continuano ad aggiornarsi automaticamente.

## Provenienza e licenze

- Astronomy Engine: https://github.com/cosinekitty/astronomy — MIT, copia della licenza in `LICENSE-astronomy.txt`.
- Stelle fino alla magnitudine 6 e linee: https://github.com/ofrohn/d3-celestial — BSD, `LICENSE-celestial.txt`. Cataloghi convertiti in `catalogo-stelle.js` per funzionare anche da file locale.
- Schede Messier di riferimento: https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/
- Calendario meteorico: https://www.imo.net/files/meteor-shower/cal2026.pdf

Le dipendenze sono salvate localmente (acquisite il 2 ottobre 2026): il funzionamento non dipende dalla disponibilità di un CDN. Conservare licenze e attribuzioni. Il mese si basa sulla data del dispositivo del visitatore.
