// Local time
const timeEl = document.getElementById('timeText');

function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  }).toLowerCase();
  timeEl.innerHTML = time.replace(':', '<span class="colon">:</span>') + ' in New York';
}

updateTime();
setInterval(updateTime, 10000);

// GitHub contributions
const contribEl = document.getElementById('githubContribChart');
const contribDetailEl = document.getElementById('githubContribDetail');
const contribStatsEl = document.getElementById('githubContribStats');
const contribHelpText = 'hover to inspect activity';

function contributionLevel(count) {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatContributionDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function contributionText(count, dateString) {
  return `${count} contribution${count === 1 ? '' : 's'} on ${formatContributionDate(dateString)}`;
}

async function renderGithubContributions() {
  if (!contribEl) return;

  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/lhnminh');
    if (!res.ok) throw new Error('GitHub contribution data unavailable');

    const data = await res.json();
    const countsByDate = new Map(
      data.contributions.map(day => [day.date, day.count])
    );
    const today = new Date();
    const start = new Date(today);
    start.setMonth(start.getMonth() - 3);
    const days = [];

    const grid = document.createElement('div');
    grid.className = 'github-contrib-grid';
    grid.setAttribute('aria-label', 'GitHub contributions over the last 3 months');
    grid.addEventListener('mouseleave', () => {
      if (contribDetailEl) contribDetailEl.textContent = contribHelpText;
    });

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = dateKey(d);
      const count = countsByDate.get(key) || 0;
      days.push({ date: new Date(d), key, count });
      const cell = document.createElement('span');
      cell.className = 'github-contrib-day';
      cell.tabIndex = 0;
      cell.dataset.level = contributionLevel(count);
      cell.dataset.detail = contributionText(count, key);
      cell.title = cell.dataset.detail;
      cell.setAttribute('aria-label', cell.dataset.detail);
      cell.addEventListener('mouseenter', () => {
        if (contribDetailEl) contribDetailEl.textContent = cell.dataset.detail;
      });
      cell.addEventListener('focus', () => {
        if (contribDetailEl) contribDetailEl.textContent = cell.dataset.detail;
      });
      cell.addEventListener('blur', () => {
        if (contribDetailEl) contribDetailEl.textContent = contribHelpText;
      });
      grid.appendChild(cell);
    }

    const total = days.reduce((sum, day) => sum + day.count, 0);
    const activeDays = days.filter(day => day.count > 0).length;

    if (contribStatsEl) {
      contribStatsEl.textContent = `last 3 months · ${total} contributions · ${activeDays} active days`;
    }

    contribEl.replaceChildren(grid);
  } catch {
    const fallback = document.createElement('p');
    fallback.className = 'github-contrib-status';
    fallback.textContent = 'github activity is temporarily unavailable';
    contribEl.replaceChildren(fallback);
    if (contribStatsEl) contribStatsEl.textContent = '';
    if (contribDetailEl) contribDetailEl.textContent = '';
  }
}

renderGithubContributions();

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar a');

function show(id) {
  transition(() => {
    if (id === 'writing') {
      closeWriting();
    }
    sections.forEach(s => s.classList.toggle('active', s.id === id));
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    document.querySelector('.intro').classList.toggle('hidden', id !== 'about');
    history.replaceState(null, '', '#' + id);
  });
}

function transition(update) {
  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    show(a.getAttribute('href').slice(1));
  });
});

// Expandable writing drafts
const writingList = document.querySelector('.writing-list');
const writingReader = document.querySelector('.writing-reader');
const writingPanels = document.querySelectorAll('[data-writing-panel]');
const writingBack = document.querySelector('.writing-back');

function closeWriting() {
  if (!writingList || !writingReader || !writingBack) return;
  writingReader.classList.remove('open');
  writingPanels.forEach(panel => panel.classList.remove('active'));
  writingList.classList.remove('hidden');
  writingBack.classList.remove('active');
}

document.querySelectorAll('[data-writing-target]').forEach(item => {
  item.addEventListener('click', () => {
    if (!writingList || !writingReader || !writingBack) return;
    const target = item.dataset.writingTarget;
    transition(() => {
      writingPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.writingPanel === target);
      });
      writingList.classList.add('hidden');
      writingReader.classList.add('open');
      writingBack.classList.add('active');
    });
  });
});

if (writingBack && writingReader) {
  writingBack.addEventListener('click', () => {
    if (!writingReader.classList.contains('open')) return;
    transition(closeWriting);
  });
}

// Show section from URL hash, or default to about
const initial = location.hash.slice(1);
show(initial && document.getElementById(initial) ? initial : 'about');

// Expandable experience items
document.querySelectorAll('.exp-summary').forEach(summary => {
  summary.addEventListener('click', () => {
    const item = summary.closest('.exp-item');
    item.classList.toggle('open');
  });
});

// Cursor spotlight on bordered cards
document.querySelectorAll('.exp-item, .writing-item').forEach(card => {
  let glow = 0, target = 0, raf;

  function animate() {
    glow += (target - glow) * 0.1;
    card.style.setProperty('--glow', glow.toFixed(3));
    if (Math.abs(target - glow) > 0.001) {
      raf = requestAnimationFrame(animate);
    } else {
      card.style.setProperty('--glow', target);
    }
  }

  card.addEventListener('mouseenter', () => {
    target = 1;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(animate);
  });

  card.addEventListener('mouseleave', () => {
    target = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(animate);
  });

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});
