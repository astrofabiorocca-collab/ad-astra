(() => {
 'use strict';
 const entries = {
  'nube-molecolare': {
   title: 'Nube molecolare',
   revision: '152593111',
   quote: 'Le nubi molecolari costituiscono il luogo d’elezione per la nascita di nuove stelle.',
   paragraphs: [
    'Come si trova una nube molecolare se il suo ingrediente principale è difficile da osservare? Nel gas freddo le righe dell’idrogeno molecolare sono molto deboli. I radioastronomi misurano quindi spesso le righe del monossido di carbonio. Una mappa del CO aiuta a seguire la distribuzione del gas molecolare, mentre per stimare la massa occorre tenere conto delle condizioni della nube.',
    'Una nube può contenere filamenti, addensamenti e nuclei più densi del gas che li circonda. In alcuni nuclei la gravità riesce a comprimere il gas fino ad avviare la formazione di una stella. Nelle immagini in luce visibile, la polvere può invece rivelare la nube per contrasto, oscurando le stelle sullo sfondo.'
   ]
  }
 };
 window.AdAstraWikipediaNote = id => {
  if (!Object.hasOwn(entries, id)) return null;
  const entry = entries[id];
  const make = (tag, text) => {
   const node = document.createElement(tag);
   node.textContent = text;
   return node;
  };
  const details = make('details', '');
  details.className = 'catalog-criteria';
  details.append(make('summary', 'Citazione da Wikipedia'), make('blockquote', entry.quote));
  for (const paragraph of entry.paragraphs) details.append(make('p', paragraph));
  const credit = make('p', '');
  const source = make('a', 'Wikipedia · ' + entry.title);
  source.href = 'https://it.wikipedia.org/w/index.php?oldid=' + entry.revision;
  const license = make('a', 'CC BY-SA 4.0');
  license.href = 'https://creativecommons.org/licenses/by-sa/4.0/';
  credit.append(source, document.createTextNode(' · '), license);
  details.append(credit);
  return details;
 };
})();
