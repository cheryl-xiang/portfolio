console.log('IT’S ALIVE!');

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

const IS_GITHUB_PAGES = location.hostname === 'cheryl-xiang.github.io';
const BASE_PATH = IS_GITHUB_PAGES ? '/portfolio' : '';
const ARE_WE_HOME = document.documentElement.classList.contains('home'); 

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !ARE_WE_HOME && !url.startsWith('http') ? BASE_PATH + '/' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  const currentPath = location.pathname.endsWith('/')
    ? location.pathname
    : location.pathname + '/';
  const linkPath = a.pathname.endsWith('/')
    ? a.pathname
    : a.pathname + '/';

  if (a.host === location.host && linkPath === currentPath) {
    a.classList.add('current');
  }

  if (p.url.startsWith('http')) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  nav.append(a);
}

/* Color scheme switcher */

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

function updateTheme(scheme) {
  document.documentElement.classList.remove('light', 'dark');

  if (scheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (scheme === 'light') {
    document.documentElement.classList.add('light');
  }
  document.documentElement.style.setProperty('color-scheme', scheme);
}

let select = document.querySelector('#theme-selector');

if ('colorScheme' in localStorage) {
  let scheme = localStorage.colorScheme;
  select.value = scheme;
  updateTheme(scheme);
}

select.addEventListener('input', function (event) {
  let scheme = event.target.value;
  localStorage.colorScheme = scheme;
  updateTheme(scheme);
});
