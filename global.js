console.log('IT’S ALIVE!');

const BASE_PATH = '/portfolio';

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/cheryl-xiang', title: 'GitHub' }
];
 
const ARE_WE_HOME = document.documentElement.classList.contains('home');

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  a.toggleAttribute('target', a.host !== location.host);

  if (a.target) {
    a.target = '_blank';
  }

  nav.append(a);
}

/*Color scheme */

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-selector">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

let select = document.querySelector('select');

if ('colorScheme' in localStorage) {
    let scheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', scheme);
    select.value = scheme;

    if (scheme === 'dark') {
      document.documentElement.style.setProperty('--color-accent', 'oklch(80% 0.1 300)');
    } else {
      document.documentElement.style.setProperty('--color-accent', 'oklch(50% 0.15 300)');
    }
}

select.addEventListener('input', function (event) {
    let scheme = event.target.value;
    document.documentElement.style.setProperty('color-scheme', scheme);

    localStorage.colorScheme = scheme;

    if (scheme === 'dark') {
      document.documentElement.style.setProperty('--color-accent', 'oklch(80% 0.1 300)');
    } else {
      document.documentElement.style.setProperty('--color-accent', 'oklch(50% 0.15 300)');
    }
});