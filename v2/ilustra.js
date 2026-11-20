/*
 * JM Açaí — ilustrações técnicas geradas a partir do cardápio (sem fotos, sem marcas de terceiros).
 * JMIlustra.burger(camadas, extras) -> SVG "explodido" com cada camada rotulada.
 * JMIlustra.prateleira(itens)       -> bebidas lado a lado, em escala real aproximada.
 */
(function () {
  'use strict';
  var X0 = 40, W = 300, CX = X0 + W / 2;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function wave(y, amp, n, x0, x1) {
    var d = 'M' + x0 + ' ' + y, step = (x1 - x0) / n;
    for (var i = 0; i < n; i++) d += ' q' + step / 2 + ' ' + (i % 2 ? -amp : amp) + ' ' + step + ' 0';
    return d;
  }

  /* cada camada: altura e desenho a partir do topo y */
  var L = {
    'pao-topo': function (y, v) {
      var brioche = v === 'brioche';
      var c1 = brioche ? '#B9621F' : '#D9A05B', c2 = brioche ? '#7E3B10' : '#B47835';
      var s = '<defs><linearGradient id="pt' + y + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
        '<path d="M' + X0 + ' ' + (y + 86) + ' Q' + X0 + ' ' + y + ' ' + CX + ' ' + y + ' Q' + (X0 + W) + ' ' + y + ' ' + (X0 + W) + ' ' + (y + 86) + ' Z" fill="url(#pt' + y + ')"/>' +
        '<ellipse cx="' + (CX - 50) + '" cy="' + (y + 26) + '" rx="60" ry="12" fill="#fff" opacity="' + (brioche ? .28 : .18) + '"/>';
      if (!brioche) for (var i = 0; i < 16; i++) s += '<ellipse cx="' + (X0 + 50 + (i * 37) % 200) + '" cy="' + (y + 22 + (i * 23) % 50) + '" rx="4" ry="2" transform="rotate(' + (i * 40) + ' ' + (X0 + 50 + (i * 37) % 200) + ' ' + (y + 22 + (i * 23) % 50) + ')" fill="#FFF3D6"/>';
      return { h: 86, svg: s };
    },
    'pao-base': function (y, v) {
      var c = v === 'brioche' ? '#A9581C' : '#C98E4C';
      return { h: 34, svg: '<path d="M' + X0 + ' ' + y + ' H' + (X0 + W) + ' V' + (y + 14) + ' Q' + (X0 + W) + ' ' + (y + 34) + ' ' + (X0 + W - 30) + ' ' + (y + 34) + ' H' + (X0 + 30) + ' Q' + X0 + ' ' + (y + 34) + ' ' + X0 + ' ' + (y + 14) + ' Z" fill="' + c + '"/>' +
        '<rect x="' + X0 + '" y="' + y + '" width="' + W + '" height="7" fill="#F1D3A2" opacity=".55"/>' };
    },
    'molho': function (y) {
      return { h: 10, svg: '<path d="' + wave(y + 5, 5, 10, X0 + 6, X0 + W - 6) + '" fill="none" stroke="#D9542B" stroke-width="7" stroke-linecap="round"/>' };
    },
    'cheddar': function (y) {
      return { h: 14, svg: '<path d="M' + (X0 - 8) + ' ' + y + ' H' + (X0 + W + 8) + ' L' + (X0 + W + 22) + ' ' + (y + 22) + ' L' + (X0 + W - 6) + ' ' + (y + 14) + ' H' + (X0 + 40) + ' L' + (X0 + 18) + ' ' + (y + 26) + ' L' + (X0 + 6) + ' ' + (y + 14) + ' H' + (X0 - 8) + ' Z" fill="#F4A21E"/>' };
    },
    'queijo': function (y) {
      return { h: 14, svg: '<path d="M' + (X0 - 6) + ' ' + y + ' H' + (X0 + W + 6) + ' V' + (y + 14) + ' H' + (X0 - 6) + ' Z" fill="#F2C14E"/>' };
    },
    'bife': function (y) {
      var s = '<rect x="' + (X0 - 4) + '" y="' + y + '" width="' + (W + 8) + '" height="40" rx="18" fill="#5A2E1A"/>';
      for (var i = 0; i < 6; i++) s += '<path d="M' + (X0 + 30 + i * 46) + ' ' + (y + 8) + ' l20 24" stroke="#3A1B0E" stroke-width="5" stroke-linecap="round"/>';
      return { h: 40, svg: s };
    },
    'costela': function (y) {
      var s = '<rect x="' + (X0 - 6) + '" y="' + y + '" width="' + (W + 12) + '" height="42" rx="16" fill="#4A2313"/>';
      for (var i = 0; i < 5; i++) s += '<path d="' + wave(y + 10 + i * 6, 2, 12, X0 + 10, X0 + W - 10) + '" fill="none" stroke="#7A3E22" stroke-width="2"/>';
      return { h: 42, svg: s };
    },
    'bacon': function (y) {
      return { h: 16, svg: '<path d="' + wave(y + 6, 6, 8, X0 - 4, X0 + W + 4) + '" fill="none" stroke="#A8352E" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="' + wave(y + 6, 6, 8, X0 - 4, X0 + W + 4) + '" fill="none" stroke="#F0A090" stroke-width="3" stroke-linecap="round"/>' };
    },
    'frango': function (y) {
      var d = 'M' + (X0 - 4) + ' ' + (y + 20);
      for (var i = 0; i <= 16; i++) d += ' L' + (X0 + i * (W / 16)) + ' ' + (y + (i % 2 ? 0 : 6));
      d += ' L' + (X0 + W + 4) + ' ' + (y + 20);
      for (var j = 16; j >= 0; j--) d += ' L' + (X0 + j * (W / 16)) + ' ' + (y + (j % 2 ? 44 : 38));
      var s = '<path d="' + d + ' Z" fill="#D18A2C"/>';
      for (var k = 0; k < 14; k++) s += '<circle cx="' + (X0 + 18 + (k * 41) % 270) + '" cy="' + (y + 12 + (k * 17) % 22) + '" r="3" fill="#F2C46B"/>';
      return { h: 44, svg: s };
    },
    'mucarela': function (y) {
      var s = '<rect x="' + (X0 + 4) + '" y="' + y + '" width="' + (W - 8) + '" height="28" rx="12" fill="#DE9A3A"/><rect x="' + (X0 + 20) + '" y="' + (y + 11) + '" width="' + (W - 40) + '" height="6" rx="3" fill="#FFF4D8"/>';
      for (var k = 0; k < 12; k++) s += '<circle cx="' + (X0 + 20 + (k * 47) % 260) + '" cy="' + (y + 5 + (k * 13) % 18) + '" r="2.5" fill="#F7CD7E"/>';
      return { h: 28, svg: s };
    },
    'alface': function (y) {
      return { h: 18, svg: '<path d="' + wave(y + 8, 8, 14, X0 - 10, X0 + W + 10) + ' V' + (y + 18) + ' H' + (X0 - 10) + ' Z" fill="#5DAE3E"/>' };
    },
    'tomate': function (y) {
      var s = '';
      for (var i = 0; i < 3; i++) s += '<ellipse cx="' + (X0 + 50 + i * 100) + '" cy="' + (y + 7) + '" rx="56" ry="7" fill="#D9362B"/><ellipse cx="' + (X0 + 50 + i * 100) + '" cy="' + (y + 6) + '" rx="40" ry="3" fill="#F06A5C"/>';
      return { h: 14, svg: s };
    },
    'cebola': function (y) {
      var s = '';
      for (var i = 0; i < 4; i++) s += '<ellipse cx="' + (X0 + 40 + i * 74) + '" cy="' + (y + 5) + '" rx="34" ry="5" fill="none" stroke="#8E3B8F" stroke-width="4"/>';
      return { h: 10, svg: s };
    }
  };

  function fritas(x, y) {
    var s = '<path d="M' + x + ' ' + (y + 40) + ' h80 l-10 70 h-60 Z" fill="#D7261E"/>';
    for (var i = 0; i < 7; i++) s += '<rect x="' + (x + 6 + i * 10) + '" y="' + (y + (i % 3) * 8) + '" width="8" height="54" rx="2" fill="#F3C24A" transform="rotate(' + ((i - 3) * 4) + ' ' + (x + 10 + i * 10) + ' ' + (y + 40) + ')"/>';
    return s + '<path d="M' + x + ' ' + (y + 40) + ' h80 l-10 70 h-60 Z" fill="none" stroke="#141014" stroke-width="0"/>';
  }

  /* camadas: [{ tipo, variante, rotulo }] de cima para baixo. extras: ['fritas', 'bebida', 'acai'] */
  function burger(camadas, extras) {
    extras = extras || [];
    var gap = 14, y = 20, partes = [], labelsY = [];
    camadas.forEach(function (c, i) {
      var f = L[c.tipo]; if (!f) return;
      var r = f(y, c.variante);
      partes.push('<g class="layer" style="--i:' + i + '">' + r.svg + '</g>');
      if (c.rotulo) labelsY.push({ y: y + r.h / 2, t: c.rotulo, i: i });
      y += r.h + gap;
    });
    var H = y + 10, extrasSvg = '', ex = 0;
    if (extras.length) {
      H += 140;
      extras.forEach(function (e) {
        var x = X0 + ex * 150, yy = y + 10;
        if (e === 'fritas') extrasSvg += '<g class="layer" style="--i:' + (camadas.length + ex) + '">' + fritas(x, yy) + '<text x="' + (x + 40) + '" y="' + (yy + 134) + '" text-anchor="middle" class="lbl">+ fritas</text></g>';
        if (e === 'bebida') extrasSvg += '<g class="layer" style="--i:' + (camadas.length + ex) + '">' + lata(x + 10, yy, '#F8D900', '#141014', '', 1.0) + '<text x="' + (x + 40) + '" y="' + (yy + 134) + '" text-anchor="middle" class="lbl">+ bebida</text></g>';
        if (e === 'acai') extrasSvg += '<g class="layer" style="--i:' + (camadas.length + ex) + '"><path d="M' + (x + 8) + ' ' + (yy + 4) + ' h70 l-9 100 h-52 Z" fill="#F3E3C3"/><path d="M' + (x + 14) + ' ' + (yy + 24) + ' h58 l-7 76 h-44 Z" fill="#3B1650"/><text x="' + (x + 43) + '" y="' + (yy + 134) + '" text-anchor="middle" class="lbl">+ açaí 300 ml</text></g>';
        ex++;
      });
    }
    var labels = labelsY.map(function (l) {
      return '<g class="tag" style="--i:' + l.i + '"><line x1="' + (X0 + W + 14) + '" y1="' + l.y + '" x2="' + (X0 + W + 44) + '" y2="' + l.y + '"/><circle cx="' + (X0 + W + 14) + '" cy="' + l.y + '" r="3"/><text x="' + (X0 + W + 52) + '" y="' + (l.y + 6) + '" class="lbl">' + esc(l.t) + '</text></g>';
    }).join('');
    return '<svg class="diagram" viewBox="0 0 700 ' + H + '" role="img" aria-label="Montagem do hambúrguer, camada por camada">' + partes.join('') + labels + extrasSvg + '</svg>';
  }

  /* ---------- Bebidas ---------- */
  var PX = 9; // px por cm
  function lata(x, y, corpo, faixa, texto, escala, alto) {
    var w = 6.6 * PX * (escala || 1), h = (alto || 12.2) * PX * (escala || 1);
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<rect x="0" y="6" width="' + w + '" height="' + (h - 12) + '" rx="6" fill="' + corpo + '"/>' +
      '<rect x="3" y="0" width="' + (w - 6) + '" height="10" rx="4" fill="#BDB6C0"/><rect x="3" y="' + (h - 10) + '" width="' + (w - 6) + '" height="10" rx="4" fill="#9E97A2"/>' +
      '<rect x="0" y="' + (h * .42) + '" width="' + w + '" height="' + (h * .2) + '" fill="' + faixa + '"/>' +
      '<rect x="6" y="14" width="6" height="' + (h - 30) + '" rx="3" fill="#fff" opacity=".25"/>' +
      (texto ? '<text x="' + w / 2 + '" y="' + (h * .54) + '" text-anchor="middle" class="can-t" fill="' + corpo + '">' + esc(texto) + '</text>' : '') + '</g>';
  }
  function garrafa(x, y, liquido, rotulo, texto, cm, larg) {
    var h = cm * PX, w = larg * PX, n = w * .34;
    var d = 'M' + (w / 2 - n / 2) + ' 0 h' + n + ' v' + (h * .1) + ' C' + (w / 2 + n / 2) + ' ' + (h * .2) + ' ' + w + ' ' + (h * .22) + ' ' + w + ' ' + (h * .34) +
      ' V' + (h - 12) + ' Q' + w + ' ' + h + ' ' + (w - 12) + ' ' + h + ' H12 Q0 ' + h + ' 0 ' + (h - 12) + ' V' + (h * .34) + ' C0 ' + (h * .22) + ' ' + (w / 2 - n / 2) + ' ' + (h * .2) + ' ' + (w / 2 - n / 2) + ' ' + (h * .1) + ' Z';
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<path d="' + d + '" fill="' + liquido + '"/>' +
      '<rect x="' + (w / 2 - n / 2 - 2) + '" y="-8" width="' + (n + 4) + '" height="12" rx="3" fill="' + (rotulo === 'none' ? '#3B8FD9' : '#D7261E') + '"/>' +
      (rotulo !== 'none' ? '<rect x="0" y="' + (h * .48) + '" width="' + w + '" height="' + (h * .2) + '" fill="' + rotulo + '"/>' : '') +
      '<rect x="8" y="' + (h * .36) + '" width="6" height="' + (h * .55) + '" rx="3" fill="#fff" opacity=".3"/>' +
      (texto ? '<text x="' + w / 2 + '" y="' + (h * .6) + '" text-anchor="middle" class="can-t" fill="#fff">' + esc(texto) + '</text>' : '') + '</g>';
  }
  var BEBIDAS = {
    'coca-zero-2l': function (x, b) { return garrafa(x, b - 33 * PX, '#2A1A12', '#141014', 'ZERO', 33, 10.5); },
    'coca-2l': function (x, b) { return garrafa(x, b - 33 * PX, '#2A1A12', '#D7261E', '2 L', 33, 10.5); },
    'coca-lata': function (x, b) { return lata(x, b - 12.2 * PX, '#D7261E', '#F3EEE4', 'LATA'); },
    'coca-zero-lata': function (x, b) { return lata(x, b - 12.2 * PX, '#141014', '#D7261E', 'ZERO'); },
    'guarana-lata': function (x, b) { return lata(x, b - 12.2 * PX, '#1E8E3E', '#F3EEE4', 'LATA'); },
    'monster': function (x, b) { return lata(x, b - 15.7 * PX, '#141014', '#7AC943', 'LATÃO', 1, 15.7); },
    'h2o': function (x, b) { return garrafa(x, b - 22 * PX, '#DDEFD3', '#7AC943', 'H2O', 22, 6.5); },
    'agua': function (x, b) { return garrafa(x, b - 22 * PX, '#D6ECF7', 'none', '', 22, 6.5); }
  };
  var LARG = { 'coca-zero-2l': 10.5, 'coca-2l': 10.5, 'h2o': 6.5, 'agua': 6.5 };

  /* itens: [{ id, nome, preco }] */
  function prateleira(itens) {
    var x = 20, base = 33 * PX + 30, gap = 48, out = '';
    itens.forEach(function (it, i) {
      var f = BEBIDAS[it.id]; if (!f) return;
      var w = (LARG[it.id] || 6.6) * PX;
      out += '<g class="drink" style="--i:' + i + '">' + f(x, base) +
        '<text x="' + (x + w / 2) + '" y="' + (base + 30) + '" text-anchor="middle" class="lbl lbl--s">' + esc(it.nome) + '</text>' +
        '<text x="' + (x + w / 2) + '" y="' + (base + 52) + '" text-anchor="middle" class="lbl lbl--p">' + esc(it.preco) + '</text></g>';
      x += w + gap;
    });
    return '<svg class="shelf" viewBox="0 0 ' + (x - gap + 20) + ' ' + (base + 64) + '" role="img" aria-label="Bebidas lado a lado, em escala"><line x1="0" x2="' + (x - gap + 20) + '" y1="' + (base + 2) + '" y2="' + (base + 2) + '" class="shelf__line"/>' + out + '</svg>';
  }

  window.JMIlustra = { burger: burger, prateleira: prateleira };
})();
