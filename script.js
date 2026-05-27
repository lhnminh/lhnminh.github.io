const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar a');

function show(id) {
  const update = () => {
    sections.forEach(s => s.classList.toggle('active', s.id === id));
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    document.querySelector('.intro').classList.toggle('hidden', id !== 'about');
    history.replaceState(null, '', '#' + id);
  };
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

// Cursor spotlight on experience cards
document.querySelectorAll('.exp-item').forEach(card => {
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
