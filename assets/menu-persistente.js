(() => {
  const menu = document.querySelector('.main-navigation') || document.querySelector('header:has(.navbar)');
  if (!menu) return;
  const navigation = menu.matches('.main-navigation') ? menu : menu.querySelector('.navbar nav');
  if (navigation) {
    const links = Array.from(navigation.querySelectorAll('a[href]'));
    const filename = value => {
      const url = new URL(value, window.location.href);
      return url.pathname.split('/').pop() || 'index.html';
    };
    const section = name => {
      if (name === 'pubblicazioni-fabio-rocca.html') return 'pubblicazioni-ad-astra.html';
      if (/^(lezione-|area-)/.test(name) || ['lezioni.html','glossario.html','laboratorio.html','quiz-astronomia.html'].includes(name)) return 'scuola-astronomia.html';
      if (/^(biblioteca|videoteca)/.test(name)) return 'biblioteca.html';
      if (/^poster/.test(name)) return 'poster.html';
      return name;
    };
    const activate = selected => links.forEach(link => {
      link.classList.toggle('active', link === selected);
      if (link === selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const markCurrent = () => {
      const current = section(filename(window.location.href));
      const selected = links.find(link => filename(link.href) === current)
        || links.find(link => link.classList.contains('active'));
      activate(selected);
    };
    const list=navigation.querySelector('ul');
    const mobile=window.matchMedia('(max-width: 1000px)');
    let toggle,currentLabel;
    if(list){
      menu.classList.add('site-mobile-menu');
      list.id='site-primary-menu';
      toggle=document.createElement('button');toggle.type='button';toggle.className='site-menu-toggle';toggle.setAttribute('aria-controls',list.id);toggle.setAttribute('aria-expanded','false');
      const caption=document.createElement('span');caption.textContent='☰ MENU';
      currentLabel=document.createElement('span');currentLabel.className='site-menu-current';toggle.append(caption,currentLabel);
      navigation.insertBefore(toggle,list);
      const close=()=>{menu.classList.remove('site-menu-open');toggle.setAttribute('aria-expanded','false');};
      toggle.addEventListener('click',()=>{const open=!menu.classList.contains('site-menu-open');menu.classList.toggle('site-menu-open',open);toggle.setAttribute('aria-expanded',String(open));});
      menu.addEventListener('keydown',event=>{if(event.key==='Escape'){close();toggle.focus();}});
      document.addEventListener('click',event=>{if(!menu.contains(event.target))close();});
      links.forEach(link=>link.addEventListener('click',close));
      const sync=()=>{close();const selected=links.find(a=>a.getAttribute('aria-current')==='page');currentLabel.textContent=selected?.textContent.trim()||'AD ASTRA';};
      mobile.addEventListener?.('change',sync);window.addEventListener('pageshow',sync);
      // Measurement concerns the collapsed menu bar: the list opens above the page.
      requestAnimationFrame(sync);
    }
    markCurrent();
    window.addEventListener('pageshow', markCurrent);
    links.forEach(link => link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      activate(link);
    }));
  }
  const measure = () => document.documentElement.style.setProperty('--site-menu-height', `${Math.ceil(menu.getBoundingClientRect().height)}px`);
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(menu);
  else window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
})();
