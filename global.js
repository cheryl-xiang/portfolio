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

/* import projects json */
export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  project.forEach(project => {
        const article = document.createElement('article');

        // Ensure valid heading level
        const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const headingTag = validHeadingLevels.includes(headingLevel) ? headingLevel : 'h2';

        article.innerHTML = `
            <${headingTag}>${project.title}</${headingTag}>
            <img src="${project.image || 'default.png'}" alt="${project.title}">

            <div class="project-details">
              <p>${project.description || 'No description available.'}</p>
              <p class="project-year">C. ${project.year}</p>
            </div>
        `;

        article.classList.add("centered-content");

        containerElement.appendChild(article);
    });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}