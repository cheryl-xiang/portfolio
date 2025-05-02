import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


/* project boxes*/
const base = location.hostname.includes('github.io') ? '/portfolio/' : '/';
const projects = await fetchJSON(`${base}lib/projects.json?v=${Date.now()}`);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
let selectedIndex = -1;

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
  const colors = d3.scaleOrdinal(d3.schemePaired);

  const svg = d3.select('svg');
  svg.selectAll('path').remove();

  const legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Render pie wedges
  const slices = svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) =>
      i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i)
    )
    .attr('class', (d, i) => i === selectedIndex ? 'selected' : null)
    .style('cursor', 'pointer')

    .on('click', (event, d) => {
      const i = arcData.indexOf(d);
      selectedIndex = selectedIndex === i ? -1 : i;

      const selected = selectedIndex === -1
        ? projectsGiven
        : projectsGiven.filter(p => p.year === data[selectedIndex].label);

      renderProjects(selected, projectsContainer, 'h2');

      // Update pie fills
      slices.attr('fill', (d, i) => i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i));
      // Update legend highlighting
      legend.selectAll('li')
        .attr('class', (d, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item')
        .attr('style', (d, i) => `--color:${i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i)}`);
    });

  // Render legend
  legend.selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item')
    .attr('style', (d, i) => `--color:${i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i)}`)
    .html((d) =>
      `<span class="swatch"></span>
       <div class="legend-text">
         <span class="label-text">${d.label}</span>
         <span class="label-count">(${d.value})</span>
       </div>`
    )
    .on('click', (event, d) => {
      const i = data.indexOf(d);
      selectedIndex = selectedIndex === i ? -1 : i;

      const selected = selectedIndex === -1
        ? projectsGiven
        : projectsGiven.filter(p => p.year === d.label);

      renderProjects(selected, projectsContainer, 'h2');

      // Update pie and legend coloring
      slices.attr('fill', (d, i) => i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i));
      legend.selectAll('li')
        .attr('class', (d, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item')
        .attr('style', (d, i) => `--color:${i === selectedIndex ? 'oklch(50% 0.15 300)' : colors(i)}`);
    });
}
