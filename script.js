/* Atanu Adhikari, portfolio interactions (vanilla JS; Lenis is optional for smooth scrolling) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function onChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reducedQuery.matches) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    var lenisRaf = function (t) { lenis.raf(t); requestAnimationFrame(lenisRaf); };
    requestAnimationFrame(lenisRaf);
  }

  /* ---------- Boot screen (once per visit) ---------- */
  (function () {
    var boot = document.querySelector('.boot');
    if (!boot || !root.classList.contains('booting')) return;
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem('booted', '1'); } catch (e) { /* storage unavailable */ }
      boot.classList.add('is-leaving');
      root.classList.remove('booting');
      setTimeout(function () { boot.classList.remove('is-leaving'); }, 520);
      document.removeEventListener('keydown', finish);
      document.removeEventListener('pointerdown', finish);
    }
    setTimeout(finish, 1300);
    document.addEventListener('keydown', finish);
    document.addEventListener('pointerdown', finish);
  })();

  /* ---------- Player card stats (counted from the page and from real dates) ---------- */
  (function () {
    var quests = document.querySelector('[data-stat="quests"]');
    if (quests) quests.textContent = document.querySelectorAll('#projects .card').length;
    var live = document.querySelector('[data-stat="live"]');
    if (live) {
      live.textContent = Array.prototype.filter.call(document.querySelectorAll('#projects .card'), function (card) {
        return Array.prototype.some.call(card.querySelectorAll('.card-links a'), function (a) { return /^\s*Live/.test(a.textContent); });
      }).length;
    }
    var xp = document.querySelector('.xp');
    if (xp) {
      var start = new Date(xp.dataset.start + '-01').getTime();
      var end = new Date(xp.dataset.end + '-01').getTime();
      var frac = Math.max(0, Math.min(1, (Date.now() - start) / (end - start)));
      xp.querySelector('.xp-bar span').style.setProperty('--xp', frac.toFixed(3));
      xp.querySelector('.xp-val').textContent = xp.querySelector('.xp-val').textContent + ' · ' + Math.round(frac * 100) + '%';
    }
  })();

  // In-page links: route through Lenis when it is active, and move focus to the target.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    var id = a.getAttribute('href').slice(1);
    var target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(id === 'top' ? 0 : target, { offset: id === 'top' ? 0 : -88 });
    else if (id === 'top') window.scrollTo({ top: 0, behavior: reducedQuery.matches ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reducedQuery.matches ? 'auto' : 'smooth' });
    if (id !== 'top') {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + id);
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
  });

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');

  function currentTheme() {
    return root.dataset.theme || 'dark';
  }

  function syncThemeButton() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  // Switch theme; where View Transitions exist, reveal the new theme as a circle growing from (x, y).
  function toggleTheme(x, y) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    var apply = function () {
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      syncThemeButton();
      net.refreshColors();
    };
    if (!document.startViewTransition || reducedQuery.matches) { apply(); return; }
    if (x == null) { x = window.innerWidth / 2; y = window.innerHeight / 2; }
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(apply).ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 650, easing: 'cubic-bezier(.2, .8, .2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  themeBtn.addEventListener('click', function () {
    var r = themeBtn.getBoundingClientRect();
    toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
  });


  /* ---------- Header: floating pill, hides on scroll down ---------- */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var toTop = document.querySelector('.to-top');
  var journey = document.querySelector('.journey');
  var lastY = window.scrollY;
  var scrollQueued = false;

  function onScroll() {
    scrollQueued = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var navOpen = navLinks.classList.contains('is-open');
    var headerFocused = header.contains(document.activeElement);

    header.classList.toggle('is-scrolled', y > 24);
    if (!navOpen && !headerFocused && y > 320 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 320) header.classList.remove('is-hidden');
    lastY = y;

    toTop.classList.toggle('is-visible', y > 600);
    toTop.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);

    if (journey) {
      var r = journey.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - r.top) / r.height;
      journey.style.setProperty('--tl', Math.max(0, Math.min(1, p)).toFixed(4));
    }
  }
  window.addEventListener('scroll', function () {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
  onScroll();

  /* ---------- Mobile nav ---------- */
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

  /* ---------- Active nav link + sliding indicator ---------- */
  var nav = document.querySelector('.site-nav');
  var indicator = document.querySelector('.nav-indicator');
  var activeLink = null;
  var linkFor = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });

  function moveIndicator(link) {
    if (!link) { indicator.classList.remove('is-on'); return; }
    var nr = nav.getBoundingClientRect();
    var lr = link.getBoundingClientRect();
    indicator.style.setProperty('--ind-x', (lr.left - nr.left) + 'px');
    indicator.style.setProperty('--ind-w', lr.width + 'px');
    indicator.classList.add('is-on');
  }

  function setActive(link) {
    activeLink = link;
    Object.keys(linkFor).forEach(function (id) {
      linkFor[id].classList.toggle('is-active', linkFor[id] === link);
      if (linkFor[id] === link) linkFor[id].setAttribute('aria-current', 'location');
      else linkFor[id].removeAttribute('aria-current');
    });
    moveIndicator(link);
  }

  navLinks.addEventListener('mouseover', function (e) {
    var a = e.target.closest('a');
    if (a) moveIndicator(a);
  });
  navLinks.addEventListener('mouseleave', function () { moveIndicator(activeLink); });
  window.addEventListener('resize', function () { moveIndicator(activeLink); });

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(linkFor[entry.target.id] || null);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
    var heroEl = document.querySelector('.hero');
    if (heroEl) sectionObserver.observe(heroEl);
  }

  /* ---------- Scroll reveal (staggered) ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * 80) + 'ms');
    });
  });
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedQuery.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Count a real metric up from 0 to the value already written in the HTML. */
  function countUp(el) {
    var end = parseFloat(el.dataset.count);
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = (end * eased).toFixed(decimals) + (el.dataset.suffix || '');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Hero role: text scramble ---------- */
  var scrambleEl = document.querySelector('.scramble');
  if (scrambleEl) {
    var words = scrambleEl.dataset.words.split('|');
    var glyphs = '!<>-_\\/[]{}=+*^?#01';
    var wordIndex = 0, frameReq = 0, queue = [], frame = 0;

    var render = function () {
      var out = '', done = 0;
      for (var i = 0; i < queue.length; i++) {
        var q = queue[i];
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) {
          if (!q.ch || Math.random() < 0.28) q.ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          out += '<span class="dud">' + q.ch + '</span>';
        } else out += q.from;
      }
      scrambleEl.innerHTML = out;
      if (done < queue.length) { frame++; frameReq = requestAnimationFrame(render); }
    };

    var scrambleTo = function (text) {
      var from = scrambleEl.textContent;
      var len = Math.max(from.length, text.length);
      queue = [];
      for (var i = 0; i < len; i++) {
        var s = Math.floor(Math.random() * 24);
        queue.push({ from: from[i] || '', to: text[i] || '', start: s, end: s + Math.floor(Math.random() * 24) + 6 });
      }
      cancelAnimationFrame(frameReq);
      frame = 0;
      render();
    };

    setInterval(function () {
      if (document.hidden) return;
      wordIndex = (wordIndex + 1) % words.length;
      if (reducedQuery.matches) scrambleEl.textContent = words[wordIndex];
      else scrambleTo(words[wordIndex]);
    }, 3000);
  }

  /* ---------- Local time (Kolkata) ---------- */
  var timeEls = document.querySelectorAll('.local-time');
  if (timeEls.length && window.Intl) {
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
    var tick = function () {
      var s = fmt.format(new Date()) + ' IST';
      timeEls.forEach(function (el) { el.textContent = s; });
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Pointer effects: spotlight, glow borders, magnetic buttons ---------- */
  (function () {
    var spotlight = document.querySelector('.spotlight');
    var glows = Array.prototype.slice.call(document.querySelectorAll('.glow'));
    var magnets = Array.prototype.slice.call(document.querySelectorAll('.magnetic'));
    var px = 0, py = 0, queued = false;

    function enabled() { return finePointer.matches && !reducedQuery.matches; }

    function paint() {
      queued = false;
      spotlight.style.setProperty('--sx', px + 'px');
      spotlight.style.setProperty('--sy', py + 'px');
      for (var i = 0; i < glows.length; i++) {
        var r = glows[i].getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
        glows[i].style.setProperty('--gx', (px - r.left) + 'px');
        glows[i].style.setProperty('--gy', (py - r.top) + 'px');
      }
    }

    document.addEventListener('pointermove', function (e) {
      if (!enabled() || e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY;
      spotlight.classList.add('is-on');
      root.classList.add('glow-on');
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    document.addEventListener('mouseout', function (e) {
      if (e.relatedTarget) return; // still inside the page
      spotlight.classList.remove('is-on');
      root.classList.remove('glow-on');
    });

    magnets.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (!enabled()) return;
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.classList.add('is-pulling');
        el.style.transform = 'translate(' + (dx * 0.25).toFixed(1) + 'px,' + (dy * 0.35).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-pulling');
        el.style.transform = '';
      });
    });
  })();

  /* ---------- Project filters ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var filterPill = document.querySelector('.filter-indicator');
  var groups = document.querySelectorAll('.project-group');
  var filterStatus = document.getElementById('filter-status');

  function movePill() {
    var btn = filterBtns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
    if (!btn || !filterPill) return;
    filterPill.style.setProperty('--fx', (btn.offsetLeft) + 'px');
    filterPill.style.setProperty('--fw', btn.offsetWidth + 'px');
    filterPill.style.top = btn.offsetTop + 'px';
  }

  function applyFilter(value) {
    var shown = 0;
    filterBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filter === value));
    });
    movePill();
    groups.forEach(function (g) {
      var match = value === 'all' || g.dataset.category === value;
      var wasHidden = g.hidden;
      g.hidden = !match;
      if (match) {
        shown += g.querySelectorAll('.card').length;
        g.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
        if (wasHidden || value !== 'all') {
          g.classList.remove('is-entering');
          void g.offsetWidth; // restart the entrance animation
          g.classList.add('is-entering');
        }
      }
    });
    var label = filterBtns.filter(function (b) { return b.dataset.filter === value; })[0].textContent;
    filterStatus.textContent = 'Showing ' + (value === 'all' ? 'all' : label) + ' projects: ' + shown + '.';
    if (lenis) lenis.resize();
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
  movePill();
  window.addEventListener('resize', movePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(); moveIndicator(activeLink); });

  /* ---------- Copy email ---------- */
  var toast = document.querySelector('.toast');
  var toastTimer = 0;
  function showToast(msg, label) {
    clearTimeout(toastTimer);
    toast.textContent = '';
    toast.classList.toggle('is-achievement', !!label);
    if (label) {
      var tag = document.createElement('span');
      tag.className = 'toast-label';
      tag.textContent = label;
      toast.appendChild(tag);
    }
    toast.appendChild(document.createTextNode(msg));
    requestAnimationFrame(function () { toast.classList.add('is-on'); });
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
      toastTimer = setTimeout(function () { toast.textContent = ''; }, 400);
    }, label ? 3200 : 2000);
  }

  function copyText(text, done, fail) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail);
    else fail();
  }

  // Placeholder buttons (e.g. the resume) show a short message instead of a broken link.
  document.querySelectorAll('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function () { showToast(btn.dataset.toast); });
  });

  var copyBtn = document.querySelector('.copy-email');
  var copyStatus = document.querySelector('.copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyText(copyBtn.dataset.email,
        function () { copyStatus.textContent = 'Copied!'; setTimeout(function () { copyStatus.textContent = ''; }, 2000); },
        function () { copyStatus.textContent = 'Copy failed, select the address instead.'; });
    });
  }

  // Small reward for scrolling all the way: once per visit.
  var contactEl = document.getElementById('contact');
  if (contactEl && 'IntersectionObserver' in window) {
    var seen = false;
    try { seen = !!sessionStorage.getItem('explorer'); } catch (e) { /* storage unavailable */ }
    if (!seen) {
      var explorer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        explorer.disconnect();
        try { sessionStorage.setItem('explorer', '1'); } catch (e) { /* storage unavailable */ }
        setTimeout(function () { showToast('Explorer: you reached the end of the map', 'Achievement unlocked'); }, 600);
      }, { threshold: 0.4 });
      explorer.observe(contactEl);
    }
  }

  /* ---------- Command menu (⌘K / Ctrl+K) ---------- */
  (function () {
    var dialog = document.getElementById('cmdk');
    var openBtn = document.querySelector('.cmdk-btn');
    if (!dialog || !dialog.showModal) { if (openBtn) openBtn.hidden = true; return; }

    var input = document.getElementById('cmdk-input');
    var list = document.getElementById('cmdk-list');
    var empty = dialog.querySelector('.cmdk-empty');
    var options = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
    var headers = Array.prototype.slice.call(list.querySelectorAll('.cmdk-group'));
    var visible = options, active = 0;

    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (!isMac) document.querySelectorAll('.cmdk-mod').forEach(function (el) { el.textContent = 'Ctrl '; });

    function select(i) {
      if (!visible.length) { input.removeAttribute('aria-activedescendant'); return; }
      active = (i + visible.length) % visible.length;
      options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      var opt = visible[active];
      opt.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', opt.id);
      opt.scrollIntoView({ block: 'nearest' });
    }

    function filter() {
      var q = input.value.trim().toLowerCase();
      visible = options.filter(function (o) {
        var hay = (o.textContent + ' ' + (o.dataset.keys || '')).toLowerCase();
        var match = !q || q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
        o.hidden = !match;
        return match;
      });
      headers.forEach(function (h) {
        h.hidden = !visible.some(function (o) { return o.dataset.group === h.dataset.group; });
      });
      empty.hidden = visible.length > 0;
      select(0);
    }

    function open() {
      if (dialog.open) return;
      input.value = '';
      filter();
      dialog.showModal();
      input.focus();
      if (lenis) lenis.stop();
    }

    function close(after) {
      if (!dialog.open) { if (after) after(); return; }
      var finish = function () {
        dialog.classList.remove('is-closing');
        dialog.close();
        if (lenis) lenis.start(); // resume before `after` scrolls; the close event fires too late
        if (after) after();
      };
      if (reducedQuery.matches) { finish(); return; }
      dialog.classList.add('is-closing');
      setTimeout(finish, 180);
    }

    function run(opt) {
      if (!opt) return;
      var d = opt.dataset;
      if (d.go) {
        close(function () {
          var link = document.querySelector('a[href="#' + d.go + '"]');
          if (link) link.click();
        });
      } else if (d.action === 'theme') {
        close(function () { toggleTheme(); });
      } else if (d.action === 'copy') {
        close(function () {
          copyText('atanuadhikari5@gmail.com',
            function () { showToast('Email copied to clipboard'); },
            function () { showToast('Copy failed. Email: atanuadhikari5@gmail.com'); });
        });
      } else if (d.href) {
        close(function () {
          if (d.href.indexOf('mailto:') === 0) window.location.href = d.href;
          else window.open(d.href, '_blank', 'noopener');
        });
      }
    }

    dialog.addEventListener('close', function () { if (lenis) lenis.start(); });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) { close(); return; } // backdrop
      var opt = e.target.closest('[role="option"]');
      if (opt) run(opt);
    });
    list.addEventListener('mousemove', function (e) {
      var opt = e.target.closest('[role="option"]');
      var i = visible.indexOf(opt);
      if (opt && i !== active) select(i);
    });
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(active - 1); }
      else if (e.key === 'Home') { e.preventDefault(); select(0); }
      else if (e.key === 'End') { e.preventDefault(); select(visible.length - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); run(visible[active]); }
    });

    openBtn.addEventListener('click', open);
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.open) close(); else open();
      } else if (e.key === '/' && !dialog.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        open();
      }
    });
  })();

  /* ---------- Hero neural-network canvas (reacts to the cursor) ---------- */
  var net = (function () {
    var hero = document.querySelector('.hero');
    var canvas = document.querySelector('.hero-net');
    var noop = { refreshColors: function () {} };
    if (!hero || !canvas || !canvas.getContext) return noop;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, pts = [];
    var lineRGB = '124, 156, 255', dotRGB = '94, 234, 212';
    var inView = true, rafId = 0;
    var LINK = 140, MOUSE = 180;
    var mouse = { x: -9999, y: -9999 };

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });

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
      var i, j, a, b, d, dx, dy;
      if (move) {
        for (i = 0; i < pts.length; i++) {
          a = pts[i];
          // gently push points away from the cursor
          dx = a.x - mouse.x; dy = a.y - mouse.y;
          d = Math.hypot(dx, dy);
          if (d < MOUSE && d > 0) {
            a.x += (dx / d) * (1 - d / MOUSE) * 1.2;
            a.y += (dy / d) * (1 - d / MOUSE) * 1.2;
          }
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
        // links to the cursor
        a = pts[i];
        d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (d < MOUSE) {
          ctx.strokeStyle = 'rgba(' + dotRGB + ',' + ((1 - d / MOUSE) * 0.5).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
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
