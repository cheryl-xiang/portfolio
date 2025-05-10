import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const loadedData = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    return loadedData;
  }

function processCommits(inputData) {
    return d3
      .groups(inputData, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/cheryl/portfolio/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          configurable: false,
          writable: false,
          enumerable: false
        });
  
        return ret;
      });
  }

  function renderCommitInfo(data, commits) {
    const container = d3.select('#stats');

    function addStat(label, value) {
        const block = container.append('div').attr('class', 'stat-block');
        block.append('dt').text(label);
        block.append('dd').text(value);
    }
  
    // Add stats using helper
    addStat('Number of files', d3.group(data, d => d.file).size);
    addStat('Total LOC', data.length);
    addStat('Longest line', d3.max(data, d => d.length));
    addStat('Avg line length', d3.mean(data, d => d.length).toFixed(1));
    addStat('Max lines', d3.max(data, d => d.line));
    addStat('Total commits', commits.length);
  }
  

  loadData().then(data => {
    const commits = processCommits(data);
    renderCommitInfo(data, commits);
  });