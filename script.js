
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}


// Helper to fetch JSON
async function getJSON(path){ const r = await fetch(path); return r.json(); }

// TEAMS
(async function renderTeams(){
  const grid = document.getElementById('teams-grid');
  if(!grid) return;
  const teams = await getJSON('assets/data/teams.json');
  grid.innerHTML = teams.map(t => `
    <article class="team-card">
      <div class="badge">${t.code.slice(0,2)}</div>
      <div class="team-name">${t.name}</div>
      <div class="team-meta">${t.city} • Coach ${t.coach}</div>
      <div class="team-chip">#${t.code}</div>
    </article>
  `).join('');
})();

// SCHEDULE
(async function renderSchedule(){
  const table = document.getElementById('schedule-table');
  if(!table) return;
  const data = await getJSON('assets/data/schedule.json');
  const weekFilter = document.getElementById('weekFilter');
  const weeks = [...new Set(data.map(g=>g.week))].sort((a,b)=>a-b);
  weekFilter.innerHTML = `<option value="all">All weeks</option>` + weeks.map(w=>`<option value="${w}">Week ${w}</option>`).join('');
  const draw = () => {
    const sel = weekFilter.value;
    const rows = data.filter(g => sel==='all' || g.week==sel);
    table.innerHTML = `
      <div class="tr th"><div>Matchup</div><div>Date</div><div>Time</div><div>Venue</div><div>Status</div></div>
      ${rows.map(g => `
        <div class="tr">
          <div><b>${g.away}</b> @ <b>${g.home}</b></div>
          <div class="mono">${g.date}</div>
          <div class="mono">${g.time}</div>
          <div>${g.venue}</div>
          <div>${g.status}</div>
        </div>`).join('')}
    `;
  };
  weekFilter.addEventListener('change', draw);
  draw();
})();

// STANDINGS
(async function renderStandings(){
  const table = document.getElementById('standings-table');
  if(!table) return;
  const rows = await getJSON('assets/data/standings.json');
  const withPct = rows.map(r => ({...r, pct: (r.wins + r.losses) ? (r.wins/(r.wins+r.losses)) : 0}))
                      .sort((a,b)=> b.pct - a.pct || (b.pf-b.pa) - (a.pf-a.pa));
  table.innerHTML = `
    <div class="tr th"><div>Team</div><div>W</div><div>L</div><div>PF</div><div>PA</div></div>
    ${withPct.map(r => `
      <div class="tr">
        <div><span class="rank">${withPct.indexOf(r)+1}</span> ${r.code}</div>
        <div class="mono">${r.wins}</div>
        <div class="mono">${r.losses}</div>
        <div class="mono">${r.pf}</div>
        <div class="mono">${r.pa}</div>
      </div>`).join('')}
  `;
})();
