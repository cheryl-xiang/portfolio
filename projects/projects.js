import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON(`./lib/projects.json?v=${Date.now()}`);
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && projects) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}