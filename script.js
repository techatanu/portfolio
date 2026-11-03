/* Portfolio navigation, project filtering, and accessible journey tabs. */
(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const runningAnimations = new Set();
  function animateEntrance(element, delay = 0) {
    if (motionPreference.matches || !element.animate) return;
    const animation = element.animate([
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 650, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards'});
    runningAnimations.add(animation);
    const cleanUp = () => runningAnimations.delete(animation);
    animation.addEventListener('finish', cleanUp, {once: true});
    animation.addEventListener('cancel', cleanUp, {once: true});
  }
  motionPreference.addEventListener('change', event => {
    if (event.matches) runningAnimations.forEach(animation => animation.cancel());
  });

  document.querySelectorAll('.hero-copy > *, .hero-art, .hero-stats').forEach((element, index) => {
    animateEntrance(element, Math.min(index * 65, 390));
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateEntrance(entry.target, Number(entry.target.dataset.revealDelay) || 0);
        revealObserver.unobserve(entry.target);
      });
    }, {threshold: 0.08});
    document.querySelectorAll('.section-heading, .about-grid > *, .project-card, .skill-group, .journey-intro, .track-content, .milestone-grid > *, .contact > .container').forEach(element => {
      if (element.matches('.project-card, .skill-group, .milestone-grid > *')) {
        const index = [...element.parentElement.children].indexOf(element);
        element.dataset.revealDelay = (index % 3) * 70;
      }
      revealObserver.observe(element);
    });
  }
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
    document.getElementById('filter-status').textContent = button.dataset.filter === 'all' ? 'Showing all 10 projects' : `Showing ${count} projects`;
  }));

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
    runningAnimations.forEach(animation => {
      if (animation.effect?.target === document.getElementById('track-detail')) animation.cancel();
    });
    animateEntrance(document.getElementById('track-detail'));
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
  const sections = ['about', 'projects', 'skills', 'journey', 'contact'];
  const sectionLinks = [...nav.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        sectionLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-10% 0px -65% 0px', threshold:0});
    sections.forEach(id => observer.observe(document.getElementById(id)));
  }
})();
