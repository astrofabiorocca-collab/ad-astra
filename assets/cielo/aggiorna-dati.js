(() => {
  const select = document.querySelector('#eff-city, #sky-city');
  if (!select) return;
  const eff = select.id === 'eff-city', box = document.createElement('div');
  box.className = 'astro-refresh';
  const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Aggiorna tutti i dati';
  const note = document.createElement('p'); note.id = 'astro-refresh-help';
  note.textContent = eff ? 'Aggiornamento automatico alla mezzanotte italiana. Seleziona una città e applicala con questo pulsante.' : 'Il cielo segue giorno, ora e città scelti. Il mese cambia automaticamente il primo giorno.';
  button.setAttribute('aria-describedby', note.id);
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  button.addEventListener('click', () => {
    button.disabled = true;
    try {
      window.dispatchEvent(new Event('ad-astra:refresh'));
      const ready = eff ? window.Effemeridi?.ready && window.LunaOggi?.ready : window.CieloMese?.ready;
      status.textContent = eff && ready ? 'Tutte le sezioni aggiornate; vedi il riferimento temporale dei pianeti.' : ready ? 'Dati ricalcolati per ' + select.value + ' alle ' + new Intl.DateTimeFormat('it-IT', {timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit'}).format(new Date()) + '.' : 'Calcolo non completato. Riprova tra poco.';
    } finally { button.disabled = false; }
  });
  box.append(button, note, status);
  if(eff)document.querySelector('.reference-card').append(box);else (select.closest('.city-selector')||select.parentElement).after(box);
})();
