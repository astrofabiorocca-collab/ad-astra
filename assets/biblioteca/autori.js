(() => {
 const profiles = window.AdAstraAuthorProfiles;
 const dialog = document.querySelector('#author-profile');
 if (!profiles || !dialog) return;
 const title = dialog.querySelector('h2');
 const role = dialog.querySelector('.author-profile-role');
 const portrait = dialog.querySelector('img');
 const bio = dialog.querySelector('.author-profile-bio');
 const books = dialog.querySelector('ul');
 let opener;
 for (const byline of document.querySelectorAll('.book-author')) {
  const names = byline.textContent.trim().split(' e ');
  if (!names.every(name => Object.hasOwn(profiles, name))) continue;
  byline.replaceChildren();
  names.forEach((name, index) => {
   if (index) byline.append(' e ');
   const button = document.createElement('button');
   button.type = 'button';
   button.className = 'author-profile-trigger';
   button.textContent = name;
   button.setAttribute('aria-haspopup', 'dialog');
   button.addEventListener('click', () => {
    const profile = profiles[name];
    opener = button;
    title.textContent = profile.title || name;
    dialog.querySelector('h3').textContent = profile.booksHeading || 'Bibliografia essenziale';
    role.textContent = profile.role;
    bio.textContent = profile.bio;
    portrait.hidden = !profile.image;
    if (profile.image) {
     portrait.src = profile.image;
     portrait.alt = profile.imageAlt || 'Ritratto di ' + name;
    } else {
     portrait.removeAttribute('src');
     portrait.alt = '';
    }
    books.replaceChildren(...profile.books.map(text => {
     const entry = document.createElement('li');
     entry.textContent = text;
     return entry;
    }));
    dialog.showModal();
   });
   byline.append(button);
  });
 }
 dialog.addEventListener('close', () => opener?.focus());
})();
