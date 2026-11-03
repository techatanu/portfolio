/* A little motion, useful navigation, and room to play. No dependencies. */
(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('nav')) closeMenu();
  });
  const projects = [...document.querySelectorAll('.project-card')];
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    projects.forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    });
    document.getElementById('filter-status').textContent = `${count} projects on the wall`;
  }));

  const stickers = [...document.querySelectorAll('.skill-sticker')];
  stickers.forEach(sticker => {
    let drag = null;
    sticker.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      drag = {startX: event.clientX, startY: event.clientY,
        x: parseFloat(sticker.style.getPropertyValue('--x')) || 0,
        y: parseFloat(sticker.style.getPropertyValue('--y')) || 0};
      sticker.setPointerCapture(event.pointerId);
      sticker.classList.add('dragging');
    });
    sticker.addEventListener('pointermove', event => {
      if (!drag) return;
      const wall = sticker.parentElement.getBoundingClientRect();
      const rect = sticker.getBoundingClientRect();
      const currentX = parseFloat(sticker.style.getPropertyValue('--x')) || 0;
      const currentY = parseFloat(sticker.style.getPropertyValue('--y')) || 0;
      const dx = drag.x + event.clientX - drag.startX - currentX;
      const dy = drag.y + event.clientY - drag.startY - currentY;
      sticker.style.setProperty('--x', `${currentX + Math.max(wall.left - rect.left + 5, Math.min(dx, wall.right - rect.right - 5))}px`);
      sticker.style.setProperty('--y', `${currentY + Math.max(wall.top - rect.top + 5, Math.min(dy, wall.bottom - rect.bottom - 5))}px`);
    });
    const endDrag = () => { drag = null; sticker.classList.remove('dragging'); };
    sticker.addEventListener('pointerup', endDrag);
    sticker.addEventListener('pointercancel', endDrag);
    sticker.addEventListener('lostpointercapture', endDrag);
  });
  document.querySelector('.reset-stickers').addEventListener('click', () => {
    stickers.forEach(sticker => {sticker.style.removeProperty('--x'); sticker.style.removeProperty('--y');});
  });
  const tracks = [
    ['AUG 2024 — AUG 2028', 'The foundations', 'B.Tech in Computer Science & AI at Newton School of Technology. Building the foundations in programming, algorithms, and machine learning — and putting them to work in real projects.', 'PYTHON / DSA / GIT / COMPUTER SCIENCE'],
    ['NOV 2025 — PRESENT', 'From code to product', 'Self-directed full-stack projects, from a React storefront to MediTrack’s secure health records. Co-built Cognify at Construct Hackathon in December 2025 and launched it on Product Hunt.', 'REACT / NODE.JS / EXPRESS / MONGODB / JWT'],
    ['PROJECTS & EXPERIMENTS', 'Building with AI', 'A LangGraph agent powered by Llama 3.1. Infant cry classification with librosa and Random Forest. Flight delay prediction with calibrated XGBoost. Learning to build useful models — and evaluate them honestly.', 'LANGGRAPH / FASTAPI / SCIKIT-LEARN / XGBOOST'],
    ['UP NEXT', 'A team. A problem. A chance to build.', 'Looking for a remote AI/ML or full-stack internship where I can ship real features, learn from experienced engineers, and contribute to something useful. Have a challenge in mind? Let’s talk.', 'OPEN TO REMOTE INTERNSHIPS / LET’S BUILD TOGETHER']
  ];
  const tabs = [...document.querySelectorAll('[data-track]')];
  function selectTrack(index) {
    tabs.forEach((tab, i) => {tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;});
    ['track-date','track-title','track-description','track-tools'].forEach((id, i) => {
      document.getElementById(id).textContent = tracks[index][i];
    });
    document.getElementById('track-detail').setAttribute('aria-labelledby', tabs[index].id);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTrack(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {event.preventDefault(); selectTrack(next); tabs[next].focus();}
    });
  });
  const recordButton = document.querySelector('.record-toggle');
  recordButton.addEventListener('click', () => {
    const paused = document.querySelector('.turntable').classList.toggle('record-paused');
    recordButton.setAttribute('aria-pressed', String(!paused));
    recordButton.textContent = paused ? '▶ PLAY' : 'Ⅱ PAUSE';
  });
  let toastTimer;
  function notify(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }
  document.querySelector('.copy-email').addEventListener('click', async () => {
    try {await navigator.clipboard.writeText('atanuadhikari5@gmail.com'); notify('Email copied. Let’s build something.');}
    catch {notify('Select the email address to copy it, or click it to send a message.');}
  });
  function updateTime() {
    document.querySelector('.local-time').textContent = new Intl.DateTimeFormat('en-IN', {hour:'2-digit', minute:'2-digit',timeZone:'Asia/Kolkata'}).format(new Date()) + ' IST';
  }
  updateTime(); setInterval(updateTime, 60000);
  const labels = {about:'The intro', projects:'The work', skills:'The toolkit', journey:'The journey', contact:'Let’s talk'};
  const sectionLinks = [...nav.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        document.getElementById('current-section').textContent = labels[id];
        document.querySelector('.now-playing').href = '#' + id;
        sectionLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-10% 0px -65% 0px', threshold:0});
    Object.keys(labels).forEach(id => observer.observe(document.getElementById(id)));
  }
})();
