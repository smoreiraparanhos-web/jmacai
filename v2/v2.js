/* JM Açaí — V2. Usa js/config.js e js/catalogo.js da raiz. */
(function () {
  'use strict';
  var C = window.JM || {};
  var CAT = window.JM_CATALOGO || { produtos: [] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var money = function (c) { return brl.format(c / 100).replace(/ /g, ' '); };
  var prod = function (id) { return CAT.produtos.filter(function (p) { return p.id === id; })[0]; };

  /* Links e textos do config */
  var lojaAtiva = !!(C.loja && C.loja.envioAtivo);
  var links = { pedido: lojaAtiva ? '../loja.html' : C.pedidoUrl, instagram: C.instagramUrl, maps: C.mapsUrl, tel: C.telefoneLink };
  $$('[data-link]').forEach(function (a) {
    var u = links[a.getAttribute('data-link')];
    if (u) a.href = u;
    if (a.getAttribute('data-link') === 'pedido' && lojaAtiva) { a.removeAttribute('target'); }
  });
  var textos = { horario: C.horario && C.horario.texto, telefone: C.telefone };
  $$('[data-jm]').forEach(function (el) { var v = textos[el.getAttribute('data-jm')]; if (v) el.textContent = v; });
  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  /* Preços */
  $$('[data-price]').forEach(function (el) { var p = prod(el.getAttribute('data-price')); if (p && p.preco) el.textContent = money(p.preco); });

  /* Aberto agora */
  function status() {
    var h = C.horario; if (!h) return;
    var o = {};
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: h.fuso || 'America/Sao_Paulo', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    } catch (e) { return; }
    var m = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
    var f = function (t) { var p = t.split(':'); return +p[0] + 'h' + (p[1] === '00' ? '' : p[1]); };
    var dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    var min = (+o.hour % 24) * 60 + +o.minute;
    var hoje = (h.dias || [0, 1, 2, 3, 4, 5, 6]).indexOf(dia) !== -1;
    var aberto = hoje && min >= m(h.abre) && min < m(h.fecha);
    var txt = aberto ? 'Aberto agora · até ' + f(h.fecha) : (hoje && min < m(h.abre) ? 'Fechado · abre às ' : 'Fechado · abre amanhã às ') + f(h.abre);
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', aberto); el.classList.toggle('is-closed', !aberto);
      $('[data-status-text]', el).textContent = txt;
    });
    var b = $('[data-bar-status]'); if (b) b.textContent = txt;
  }
  status(); setInterval(status, 60000);

  /* Copo medidor */
  var lab = $('[data-lab]');
  if (lab) {
    var LEVEL = { '250': 175, '300': 140, '400': 90, '500': 44 }; // y da marca no SVG
    var NOTES = {
      'acai-copo': 'O açaí no copo, sem creme.',
      'acai-trufado': 'Com o creme que você escolher em volta do copo.',
      'trufado-frutas': 'Com frutas e cremes grátis: 2 no de 250 ml, 3 no de 300 ml, 4 no de 400 ml.'
    };
    var NAMES = { 'acai-copo': 'açaí tradicional', 'acai-trufado': 'açaí trufado', 'trufado-frutas': 'trufado de frutas' };
    var fill = $('.cup__fill', lab), fruit = $('.cup__fruit', lab), cream = $('.cup__cream', lab);
    var tbody = $('[data-sizes]', lab), note = $('[data-type-note]', lab), pick = $('[data-pick]', lab);
    var tipo = 'acai-trufado', ml = '300';

    var opcoes = function (id) {
      var p = prod(id); if (!p) return [];
      var g = (p.grupos || []).filter(function (x) { return x.id === 'tamanho'; })[0];
      return g ? g.opcoes : [];
    };
    function setLevel() {
      var yv = LEVEL[ml] || 140;
      fill.style.transform = fruit.style.transform = 'translateY(' + yv + 'px)';
      cream.style.opacity = tipo === 'acai-copo' ? 0 : 1;
      fruit.style.opacity = tipo === 'trufado-frutas' ? .9 : 0;
      $$('.cup__marks text', lab).forEach(function (t) { t.classList.toggle('is-on', t.textContent === ml); });
      pick.textContent = NAMES[tipo] + ' ' + ml + ' ml';
    }
    function render() {
      var ops = opcoes(tipo);
      if (!ops.some(function (o) { return o.nome.indexOf(ml + ' ml') === 0; })) ml = ops.length ? ops[ops.length - 1].nome.slice(0, 3) : '300';
      tbody.innerHTML = ops.map(function (o) {
        var v = o.nome.slice(0, 3), extra = o.nome.split('·')[1];
        return '<tr><td colspan="2"><button type="button" class="size-btn" data-ml="' + v + '" aria-pressed="' + (v === ml) + '">' +
          '<span><b>' + v + ' ml</b>' + (extra ? '<small>' + extra.trim() + '</small>' : '') + '</span><span>' + money(o.preco) + '</span></button></td></tr>';
      }).join('');
      note.textContent = NOTES[tipo];
      setLevel();
    }
    tbody.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ml]'); if (!b) return;
      ml = b.getAttribute('data-ml');
      $$('[data-ml]', tbody).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      setLevel();
    });
    $$('[data-type]', lab).forEach(function (b) {
      b.addEventListener('click', function () {
        tipo = b.getAttribute('data-type');
        $$('[data-type]', lab).forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
        render();
      });
    });
    // setas no grupo de tipos (padrão radiogroup)
    $('[data-types]', lab).addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var bs = $$('[data-type]', lab), i = bs.indexOf(document.activeElement);
      var n = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length];
      n.focus(); n.click(); e.preventDefault();
    });
    render();
  }

  /* Fotos reais, quando configuradas */
  var fotos = C.fotos || {};
  $$('[data-photo]').forEach(function (slot) {
    var src = fotos[slot.getAttribute('data-photo')];
    if (!src) return;
    var img = new Image();
    img.className = 'real';
    img.alt = '';
    img.onload = function () {
      slot.innerHTML = ''; slot.appendChild(img);
      slot.classList.add('has-photo');
      var wrap = slot.closest('.cup, figure'); if (wrap) wrap.classList.add('has-photo');
      var cap = $('[data-photo-caption="' + slot.getAttribute('data-photo') + '"]'); if (cap) cap.remove();
    };
    img.src = '../' + src;
  });

  /* Barra de pedido no celular */
  var bar = $('[data-bar]');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('is-on', window.scrollY > 500); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* Ficha técnica dos burgers (desenho + dados a partir do catálogo) */
  var IL = window.JMIlustra;
  var diagram = $('[data-b-diagram]');
  if (IL && diagram) {
    var GRUPO = { 'pao-topo': 'Pão', 'molho': 'Molho', 'queijo': 'Queijo', 'cheddar': 'Queijo', 'bife': 'Carne', 'costela': 'Carne',
      'frango': 'Carne', 'bacon': 'Extra', 'mucarela': 'Queijo', 'alface': 'Salada', 'tomate': 'Salada', 'cebola': 'Salada' };
    var escH = function (t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var selecionar = function (id, animar) {
      var p = prod(id); if (!p || !p.camadas) return;
      diagram.innerHTML = IL.burger(p.camadas, p.extras);
      if (animar) diagram.firstChild.classList.add('is-in'); else requestAnimationFrame(function () { diagram.firstChild.classList.add('is-in'); });
      $('[data-b-name]').textContent = p.curto || p.nome;
      $('[data-b-pick]').textContent = p.curto || p.nome;
      $('[data-b-price]').textContent = money(p.preco);
      var linhas = {}, ordem = [];
      p.camadas.forEach(function (c) {
        if (!c.rotulo) return;
        var g = GRUPO[c.tipo] || 'Item';
        if (!linhas[g]) { linhas[g] = []; ordem.push(g); }
        if (linhas[g].indexOf(c.rotulo) === -1) linhas[g].push(c.rotulo);
      });
      (p.extras || []).forEach(function (e) {
        var t = { fritas: 'fritas', bebida: 'bebida', acai: 'açaí 300 ml' }[e];
        if (!linhas.Acompanha) { linhas.Acompanha = []; ordem.push('Acompanha'); }
        linhas.Acompanha.push(t);
      });
      $('[data-b-spec]').innerHTML = ordem.map(function (g) {
        return '<div><dt>' + g + '</dt><dd>' + escH(linhas[g].join(', ')) + '</dd></div>';
      }).join('');
      $$('[data-burger]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-burger') === id)); });
    };
    $$('[data-burger]').forEach(function (b) {
      b.addEventListener('click', function () {
        selecionar(b.getAttribute('data-burger'));
        var hero = $('.burgers__hero');
        if (hero.getBoundingClientRect().top < 0) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    selecionar('burger-mega-bacon', false);

    var combo = $('[data-combo-diagram]'), cp = prod('combo-burger-acai');
    if (combo && cp) combo.innerHTML = IL.burger(cp.camadas, cp.extras);

    var shelf = $('[data-shelf]');
    if (shelf) {
      var ids = [['coca-zero-2l', 'Zero 2 L'], ['coca-2l', 'Coca 2 L'], ['coca-lata', 'Coca lata'], ['coca-zero-lata', 'Zero lata'],
        ['guarana-lata', 'Guaraná'], ['monster', 'Monster'], ['h2o', 'H2O'], ['agua', 'Água']];
      shelf.innerHTML = IL.prateleira(ids.map(function (x) { var p = prod(x[0]); return { id: x[0], nome: x[1], preco: p ? money(p.preco) : '' }; }));
    }
    // desenhos entram quando aparecem na tela
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: .2 });
      $$('.shelf, .combo__diagram .diagram').forEach(function (el) { io.observe(el); });
    } else $$('.shelf, .diagram').forEach(function (el) { el.classList.add('is-in'); });
  }

  window.JM_OK = true;
})();
