/* JM Açaí — interações. Sem dependências. */
(function () {
  'use strict';

  var C = window.JM || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Dados do config.js ---------- */
  // Com o envio da loja ativo, os botões de pedido da home levam à loja.
  var lojaAtiva = !!(C.loja && C.loja.envioAtivo === true);
  var naLoja = document.body.classList.contains('page-loja');
  var links = {
    pedido: C.pedidoUrl,
    instagram: C.instagramUrl,
    maps: C.mapsUrl,
    tel: C.telefoneLink
  };
  $$('[data-link]').forEach(function (a) {
    var tipo = a.getAttribute('data-link');
    if (tipo === 'pedido' && lojaAtiva && !naLoja) {
      a.setAttribute('href', 'loja.html');
      a.removeAttribute('target');
      $$('.sr', a).forEach(function (s) { s.remove(); });
      return;
    }
    var url = links[tipo];
    if (url) a.setAttribute('href', url);
  });

  var textos = {
    rua: C.endereco && C.endereco.rua,
    cidade: C.endereco && C.endereco.cidade,
    pais: C.endereco && C.endereco.pais,
    telefone: C.telefone,
    horario: C.horario && C.horario.texto,
    atendimento: C.atendimento,
    instagramHandle: C.instagramHandle
  };
  $$('[data-jm]').forEach(function (el) {
    var v = textos[el.getAttribute('data-jm')];
    if (v) el.textContent = v;
  });

  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 2. Aberto agora / fechado ---------- */
  function minutos(hhmm) { var p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function fmt(hhmm) { var p = hhmm.split(':'); return p[1] === '00' ? (+p[0]) + 'h' : (+p[0]) + 'h' + p[1]; }

  function agoraNoFuso(fuso) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: fuso, hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit'
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { dia: dias[o.weekday], min: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function atualizaStatus() {
    var h = C.horario;
    if (!h || !h.abre || !h.fecha) return;
    var now = agoraNoFuso(h.fuso || 'America/Sao_Paulo');
    var abre = minutos(h.abre), fecha = minutos(h.fecha);
    var hojeAbre = (h.dias || [0, 1, 2, 3, 4, 5, 6]).indexOf(now.dia) !== -1;
    var aberto = hojeAbre && now.min >= abre && now.min < fecha;
    var txt;
    if (aberto) txt = 'Aberto agora · até ' + fmt(h.fecha);
    else if (hojeAbre && now.min < abre) txt = 'Fechado · abre às ' + fmt(h.abre);
    else txt = 'Fechado · abre ' + (hojeAbre ? 'amanhã' : '') + ' às ' + fmt(h.abre);
    txt = txt.replace('  ', ' ');
    var curto = aberto ? 'Aberto · até ' + fmt(h.fecha) : 'Abre às ' + fmt(h.abre);
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', aberto);
      el.classList.toggle('is-closed', !aberto);
      var t = $('[data-status-text]', el);
      if (t) t.textContent = el.getAttribute('data-status') === 'curto' ? curto : txt;
    });
  }
  atualizaStatus();
  setInterval(atualizaStatus, 60000);

  /* ---------- 3. Header + menu mobile ---------- */
  var header = $('[data-header]');
  var menu = $('[data-menu]');
  var menuBtn = $('[data-menu-btn]');
  var menuLabel = $('[data-menu-label]');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('is-solid', open || naLoja || window.scrollY > 24);
    if (open) { var first = $('a', menu); if (first) setTimeout(function () { first.focus(); }, 200); }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 1000px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* Link ativo conforme a seção visível */
  var navLinks = $$('.nav__link');
  var secoes = navLinks.map(function (a) { var h = a.getAttribute('href'); return h.charAt(0) === '#' ? $(h) : null; }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- 4. Barra de pedido mobile ---------- */
  var orderbar = $('[data-orderbar]');
  var orderBtn = orderbar && $('a', orderbar);
  var heroCta = $('.hero__actions .btn');
  var finalSec = $('.final');
  var heroVisivel = true, finalVisivel = false;

  function atualizaBarra() {
    if (!orderbar) return;
    var show = !heroVisivel && !finalVisivel;
    orderbar.classList.toggle('is-visible', show);
    orderBtn.tabIndex = show ? 0 : -1;
    orderbar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }
  if ('IntersectionObserver' in window && orderbar) {
    new IntersectionObserver(function (e) { heroVisivel = e[0].isIntersecting; atualizaBarra(); }).observe(heroCta);
    new IntersectionObserver(function (e) { finalVisivel = e[0].isIntersecting; atualizaBarra(); }, { rootMargin: '0px 0px 200px 0px' }).observe(finalSec);
  }

  /* ---------- 5. Reveal ao rolar ---------- */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var rIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    reveals.forEach(function (el) { rIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 6. Movimento: parallax e scroll ---------- */
  var burgerImg = $('[data-burger]');
  var burgersSec = $('#burgers');
  var bigword = $('[data-bigword]');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (!menu.classList.contains('is-open')) header.classList.toggle('is-solid', naLoja || y > 24);
    if (!reduceMotion && burgersSec) {
      var r = burgersSec.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        var p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1); // 0 → 1
        burgerImg.style.setProperty('--br', (-10 + p * 16).toFixed(2) + 'deg');
        burgerImg.style.setProperty('--bs', (.86 + Math.sin(p * Math.PI) * .16).toFixed(3));
        bigword.style.setProperty('--bx', (-p * 40).toFixed(1) + '%');
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Parallax por ponteiro no hero (só mouse) */
  var root = $('[data-parallax-root]');
  if (root && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var layers = $$('[data-depth]', root);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var hero = $('.hero');
    hero.addEventListener('pointermove', function (e) {
      var b = hero.getBoundingClientRect();
      tx = (e.clientX - b.left) / b.width - .5;
      ty = (e.clientY - b.top) / b.height - .5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    function loop() {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      layers.forEach(function (l) {
        var d = +l.getAttribute('data-depth');
        l.style.transform = 'translate3d(' + (cx * d * -22).toFixed(2) + 'px,' + (cy * d * -22).toFixed(2) + 'px,0)';
      });
      raf = (Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) ? requestAnimationFrame(loop) : null;
    }
  }

  /* ---------- 7. Combinações (abas) ---------- */
  var tabsEl = $('[data-picker-tabs]');
  var panelsEl = $('[data-picker-panels]');
  var sug = C.sugestoes || [];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  if (tabsEl && panelsEl && sug.length) {
    sug.forEach(function (s, i) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.id = 'tab-' + s.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'panel-' + s.id);
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.tabIndex = i === 0 ? 0 : -1;
      tab.textContent = s.aba;
      tabsEl.appendChild(tab);

      var media = s.imagem === 'dupla'
        ? '<div class="panel__media panel__media--dupla"><img src="assets/img/acai-bowl.svg" alt="" loading="lazy" width="600" height="600"><img src="assets/img/burger.webp" alt="" loading="lazy" width="766" height="587"></div>'
        : '<div class="panel__media"><img src="' + esc(s.imagem) + '" alt="' + esc(s.alt || '') + '" loading="lazy"></div>';

      var panel = document.createElement('div');
      panel.className = 'panel';
      panel.id = 'panel-' + s.id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      if (i !== 0) panel.hidden = true;
      panel.innerHTML = media +
        '<div class="panel__body">' +
          '<h3>' + esc(s.titulo) + '</h3>' +
          '<p>' + esc(s.texto) + '</p>' +
          (s.preco ? '<p class="panel__price">' + esc(s.preco) + '</p>' : '') +
          '<a class="btn btn--yellow btn--lg" href="' + esc(C.pedidoUrl) + '" target="_blank" rel="noopener">' + esc(s.cta) +
            ' <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg><span class="sr">(abre o cardápio oficial em nova aba)</span></a>' +
          '<small>Imagem ilustrativa · opções e preços no cardápio oficial</small>' +
        '</div>';
      panelsEl.appendChild(panel);
    });

    var tabs = $$('.tab', tabsEl);
    function selecionar(i, foco) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        p.hidden = !on;
        if (on && !reduceMotion) {
          p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering');
        }
      });
      if (foco) tabs[i].focus();
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selecionar(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); selecionar(n, true); }
      });
    });
  }

  /* ---------- 8. Mapa carregado só quando perto da tela ---------- */
  var map = $('[data-map]');
  if (map) {
    var carregaMapa = function () { if (!map.src) map.src = C.mapsEmbed || map.getAttribute('data-src'); };
    if ('IntersectionObserver' in window) {
      var mIO = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { carregaMapa(); mIO.disconnect(); } }, { rootMargin: '400px' });
      mIO.observe(map);
    } else carregaMapa();
  }
})();
