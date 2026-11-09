(() => {
  const opener = document.getElementById('join-open');
  if (opener) {
    const panel = document.getElementById('join-proposal');
    opener.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      opener.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) document.getElementById('join-form-title').focus();
    });
  }

  for (const form of document.querySelectorAll('[data-editorial-email]')) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const fields = new FormData(form);
      const article = form.dataset.editorialEmail === 'article';
      const subject = article ? 'Proposta per AD ASTRA: ' + fields.get('titolo') : fields.get('oggetto');
      const body = [
        'Nome: ' + fields.get(article ? 'autore' : 'nome'),
        'Email: ' + fields.get('email'),
        '',
        fields.get(article ? 'proposta' : 'messaggio')
      ];
      if (article && fields.get('revisione')) body.push('', 'IA nella revisione: ' + fields.get('revisione'));
      if (article && fields.get('note')) body.push('', 'Note: ' + fields.get('note'));
      window.location.href = 'mailto:adastra.redazione@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.join('\n'));
    });
  }
})();
