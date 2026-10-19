(() => {
  'use strict';
  const slider = document.getElementById('young-altitude');
  if (!slider) return;
  const update = () => {
    const altitude = Number(slider.value);
    const ratio = 1 / Math.tan(altitude * Math.PI / 180);
    const end = 110 + 90 * ratio;
    const tangent = Math.tan(altitude * Math.PI / 180);
    const startX = 110 - Math.min(90, 80 / tangent);
    const startY = 102 - (110 - startX) * tangent;
    document.getElementById('young-altitude-value').textContent = altitude + '°';
    document.getElementById('young-shadow').setAttribute('d', `M110 192H${end}`);
    document.getElementById('young-light-ray').setAttribute('d', `M${startX} ${startY}L${end} 192`);
    document.getElementById('young-light').setAttribute('cx', startX);
    document.getElementById('young-light').setAttribute('cy', startY);
    document.getElementById('young-shadow-label').setAttribute('x', Math.min(end + 12, 460));
    const relation = altitude === 45 ? 'uguale all’altezza' : altitude < 45 ? 'più lunga dell’altezza' : 'più corta dell’altezza';
    document.getElementById('young-shadow-result').textContent = `A ${altitude}° l’ombra è ${relation} del bastoncino: circa ${ratio.toLocaleString('it-IT', { maximumFractionDigits: 2 })} volte la sua altezza.`;
  };
  slider.addEventListener('input', update);
  update();
  document.querySelectorAll('.young-star-reveal button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
      button.textContent = panel.hidden ? 'Mostra il percorso di riconoscimento' : 'Nascondi il percorso';
    });
  });
})();
