import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


/* project boxes*/
const base = location.hostname.includes('github.io') ? '/portfolio/' : '/';
const projects = await fetchJSON(`${base}lib/projects.json?v=${Date.now()}`);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && projects) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}

const allYears = [...new Set(projects.map(p => p.year))]; 
const colors = d3.scaleOrdinal()
  .domain(allYears)
  .range(d3.schemePaired);

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

function filterProjects(query) {
  const lowerQuery = query.toLowerCase();
  return projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(lowerQuery);
  });
}

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  
  // update query value
  query = event.target.value;
  
  // filter projects
  let filteredProjects = filterProjects(query);
  
  // render filtered projects and pie chart
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

/* projects pie chart*/
function renderPieChart(projectsGiven) {
  // Roll up data by year
  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  // Clear old chart + legend
  const svg = d3.select('svg');
  svg.selectAll('path').remove();

  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  // Arc and pie setup
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);

  // Draw pie chart
  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(d.data.label));
  });

  // Draw legend
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(d.label)}`)
      .html(`
        <span class="swatch"></span>
        <div class="legend-text">
          <span class="label-text">${d.label}</span>
          <span class="label-count">(${d.value})</span>
        </div>
      `);
  });
}