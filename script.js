/* Atanu Adhikari, portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var lightQuery = window.matchMedia('(prefers-color-scheme: light)');
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function onChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');

  function currentTheme() {
    return root.dataset.theme || (lightQuery.matches ? 'light' : 'dark');
  }

  function syncThemeButton() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeButton();
    net.refreshColors();
  });

  onChange(lightQuery, function () {
    if (!root.dataset.theme) { syncThemeButton(); net.refreshColors(); }
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');

  function setNav(open) {
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setNav(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setNav(false);
      navToggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('is-open') && !e.target.closest('.site-nav')) setNav(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) setNav(false);
  });

  /* ---------- Active nav link ---------- */
  var linkFor = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(linkFor).forEach(function (id) {
            linkFor[id].classList.remove('is-active');
            linkFor[id].removeAttribute('aria-current');
          });
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ---------- Project filters ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var groups = document.querySelectorAll('.project-group');
  var filterStatus = document.getElementById('filter-status');

  function applyFilter(value) {
    var shown = 0;
    filterBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filter === value));
    });
    groups.forEach(function (g) {
      var match = value === 'all' || g.dataset.category === value;
      g.hidden = !match;
      if (match) shown += g.querySelectorAll('.card').length;
    });
    var label = filterBtns.filter(function (b) { return b.dataset.filter === value; })[0].textContent;
    filterStatus.textContent = 'Showing ' + (value === 'all' ? 'all' : label) + ' projects: ' + shown + '.';
  }

  filterBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { applyFilter(btn.dataset.filter); });
    // Arrow keys move between filter buttons (Tab, Enter and Space work natively).
    btn.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
              : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); filterBtns[0].focus(); return; }
      if (e.key === 'End') { e.preventDefault(); filterBtns[filterBtns.length - 1].focus(); return; }
      if (!dir) return;
      e.preventDefault();
      filterBtns[(i + dir + filterBtns.length) % filterBtns.length].focus();
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector('.copy-email');
  var copyStatus = document.querySelector('.copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      var done = function () { copyStatus.textContent = 'Copied!'; setTimeout(function () { copyStatus.textContent = ''; }, 2000); };
      var fail = function () { copyStatus.textContent = 'Copy failed, select the address instead.'; };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, fail);
      } else {
        fail();
      }
    });
  }

  /* ---------- Hero neural-network canvas ---------- */
  var net = (function () {
    var hero = document.querySelector('.hero');
    var canvas = document.querySelector('.hero-net');
    var noop = { refreshColors: function () {} };
    if (!hero || !canvas || !canvas.getContext) return noop;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, pts = [];
    var lineRGB = '124, 156, 255', dotRGB = '94, 234, 212';
    var inView = true, rafId = 0;
    var LINK = 140;

    function refreshColors() {
      var cs = getComputedStyle(root);
      lineRGB = cs.getPropertyValue('--net-line').trim() || lineRGB;
      dotRGB = cs.getPropertyValue('--net-dot').trim() || dotRGB;
      if (!rafId) drawFrame(false);
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(70, Math.floor(W * H / 18000)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H,
                   vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 });
      }
      if (!rafId) drawFrame(false);
    }

    function drawFrame(move) {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, d;
      if (move) {
        for (i = 0; i < pts.length; i++) {
          a = pts[i];
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }
      }
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        for (j = i + 1; j < pts.length; j++) {
          a = pts[i]; b = pts[j];
          d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + lineRGB + ',' + ((1 - d / LINK) * 0.35).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = 'rgba(' + dotRGB + ', .8)';
      for (i = 0; i < pts.length; i++) {
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop() {
      drawFrame(true);
      rafId = requestAnimationFrame(loop);
    }

    function shouldRun() {
      return inView && !document.hidden && !reducedQuery.matches;
    }

    function update() {
      if (shouldRun()) {
        if (!rafId) rafId = requestAnimationFrame(loop);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        update();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', update);
    onChange(reducedQuery, function () { update(); if (!rafId) drawFrame(false); });

    var resizeQueued = false;
    function queueResize() {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () { resizeQueued = false; resize(); });
    }
    if ('ResizeObserver' in window) new ResizeObserver(queueResize).observe(hero);
    else window.addEventListener('resize', queueResize);

    refreshColors();
    resize();
    update();

    return { refreshColors: refreshColors };
  })();

  syncThemeButton();
})();
