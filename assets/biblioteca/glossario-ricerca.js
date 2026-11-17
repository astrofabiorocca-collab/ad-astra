(() => {
 const normalize = value => String(value ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/\bsupernov(?:ae|as|e)\b/g, 'supernova')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
 const index = window.AdAstraGlossaryIndex || [];
 const names = new Map();
 const aliases = {'stelle di neutroni':'stella-di-neutroni','neutron star':'stella-di-neutroni','nane bianche':'nana-bianca','white dwarf':'nana-bianca','nuclear fusion':'fusione-nucleare','moon':'luna'};
 for (const [id, name, ...labels] of index) {
  for (const label of [name, ...labels, ...Object.keys(aliases).filter(alias => aliases[alias] === id)]) {
   const key = normalize(label);
   if (!key) continue;
   const matches = names.get(key) || new Map();
   matches.set(id, {id, name});
   names.set(key, matches);
  }
 }
 function lookup(value) {
  const query = normalize(value).replace(/^(?:cos e|che cos e|cosa e|che cosa e|cosa sono|che cosa sono|definisci|definizione di|spiegami)\s+(?:(?:il|lo|la|i|gli|le|un|uno|una|l)\s+)?/, '');
  const candidates = names.get(query);
  if (!candidates) return [];
  const exact = [...candidates.values()].find(item => normalize(item.name) === query);
  return exact ? [exact] : [...candidates.values()];
 }
 window.AdAstraGlossarySearch = {normalize, lookup};
})();
