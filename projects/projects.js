import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

/* Load data */
const base = location.hostname.includes('github.io') ? '/portfolio/' : '/';
const projects = await fetchJSON(`${base}lib/projects.json?v=${Date.now()}`);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

let selectedIndex = -1;

// Title update
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && projects) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}

// Define consistent color mapping using ALL years
const allYears = [...new Set(projects.map(p => p.year))].sort();
const colors = d3.scaleOrdinal()
  .domain(allYears)
  .range(d3.schemePaired.slice(0, allYears.length));

// Initial render
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

// Filter function for search bar
function filterProjects(query) {
  const lowerQuery = query.toLowerCase();
  return projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(lowerQuery);
  });
}

// Search bar listener
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  const filteredProjects = filterProjects(query);
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

/* Pie chart + legend rendering */
function renderPieChart(projectsGiven) {
  if (!projectsGiven || projectsGiven.length === 0) {
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
    return;
  }

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);
  const arc = d3.arc().innerRadius(0).outerRadius(50);

  const svg = d3.select('svg');
  svg.selectAll('path').remove();

  const legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Draw pie wedges
  const slices = svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d =>
      d.index === selectedIndex ? 'oklch(50% 0.15 300)' : colors(d.data.label)
    )
    .attr('class', d => d.index === selectedIndex ? 'selected' : null)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      const i = d.index;
      selectedIndex = selectedIndex === i ? -1 : i;
      renderPieChart(projectsGiven);
    });

  // Draw legend
  legend.selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('class', (d, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item')
    .attr('style', (d, i) =>
      `--color: ${i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(d.label)}`
    )
    .html(d => `
      <span class="swatch"></span>
      <div class="legend-text">
        <span class="label-text">${d.label}</span>
        <span class="label-count">(${d.value})</span>
      </div>
    `)
    .on('click', (event, d) => {
      const i = data.findIndex(item => item.label === d.label);
      selectedIndex = selectedIndex === i ? -1 : i;
      renderPieChart(projectsGiven);
    });
}
