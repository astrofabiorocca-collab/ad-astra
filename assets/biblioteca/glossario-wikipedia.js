(() => {
 'use strict';
 const entries = {
  'fusione-nucleare': {
   title: 'Fusione nucleare',
   revision: '152519999',
   quote: 'gli stadi del ciclo principale della fusione nucleare nelle stelle furono ricavati da Hans Bethe',
   paragraphs: [
    'Nel Sole, il passaggio dall’idrogeno all’elio avviene attraverso una sequenza di reazioni chiamata catena protone-protone. La massa a riposo dei prodotti finali è minore di quella dei reagenti. La differenza corrisponde all’energia liberata, che contribuisce a mantenere caldo l’interno della stella.',
    'Parte dell’energia esce dal nucleo sotto forma di neutrini. Queste particelle interagiscono poco con la materia solare e conservano informazioni sulle reazioni che le hanno prodotte. Misurare i neutrini solari permette quindi di mettere alla prova i modelli della fusione nel nucleo.'
   ]
  },

  'nana-bianca': {
   title: 'Nana bianca',
   revision: '152799311',
   quote: 'la cui pressione è sostenuta dalla materia degenere, nella fattispecie dagli elettroni',
   paragraphs: [
    'Quando il nucleo residuo si comprime, gli elettroni sono costretti a occupare stati quantistici via via più energetici. La pressione che ne risulta può bilanciare la gravità anche quando il residuo si raffredda e ha ormai esaurito le reazioni di fusione che alimentavano la stella.',
    'La massa fa la differenza. In una famiglia di nane bianche di composizione simile, quelle più massicce tendono a essere più piccole. Se la massa cresce troppo, la pressione degli elettroni non basta più a sostenere il residuo. Il limite di Chandrasekhar esprime questa condizione e dipende dalla composizione della materia.'
   ]
  },

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
  const curated = Object.hasOwn(entries, id);
  const excerpts = window.AdAstraWikipediaExcerpts || {};
  const entry = curated ? entries[id] : Object.hasOwn(excerpts, id) ? excerpts[id] : null;
  if (!entry) return null;
  const make = (tag, text) => {
   const node = document.createElement(tag);
   node.textContent = text;
   return node;
  };
  const details = make('details', '');
  details.className = 'catalog-criteria';
  details.append(make('summary', 'Citazione da Wikipedia'), make('blockquote', entry.quote));
  if (!curated) details.append(make('p', 'Estratto associato in base al titolo della voce, in attesa di revisione editoriale.'));
  for (const paragraph of entry.paragraphs || []) details.append(make('p', paragraph));
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
