/* JM Açaí — loja: cardápio, sacola e envio do pedido pelo WhatsApp. Sem dependências. */
(function () {
  'use strict';

  var C = window.JM || {};
  var L = C.loja || {};
  var CAT = window.JM_CATALOGO || { categorias: [], produtos: [] };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function money(c) { return brl.format((c || 0) / 100).replace(/ /g, ' '); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function porId(id) { return CAT.produtos.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- Armazenamento (só conveniência deste navegador) ---------- */
  var KEY_CART = 'jm-sacola-v1', KEY_CLIENTE = 'jm-cliente-v1';
  function ler(k, padrao) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue em memória */ } }

  var cart = ler(KEY_CART, []).filter(function (it) { return it && porId(it.id); });

  /* ---------- Horário ---------- */
  function lojaAberta() {
    var h = C.horario;
    if (!h || !h.abre || !h.fecha) return true;
    try {
      var o = {};
      new Intl.DateTimeFormat('en-US', { timeZone: h.fuso || 'America/Sao_Paulo', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      var dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
      var min = (+o.hour % 24) * 60 + (+o.minute);
      var m = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
      return (h.dias || [0, 1, 2, 3, 4, 5, 6]).indexOf(dia) !== -1 && min >= m(h.abre) && min < m(h.fecha);
    } catch (e) { return true; }
  }

  /* ---------- Preços ---------- */
  function precoAPartir(p) {
    var base = p.preco || 0;
    (p.grupos || []).forEach(function (g) {
      if (g.tipo === 'unico' && g.min >= 1 && g.opcoes.length) {
        base += Math.min.apply(null, g.opcoes.map(function (o) { return o.preco || 0; }));
      }
    });
    return base;
  }
  function temVariacao(p) {
    return (p.grupos || []).some(function (g) { return g.tipo === 'unico' && g.min >= 1 && g.opcoes.length > 1; });
  }

  /* ==========================================================
     1. CARDÁPIO
     ========================================================== */
  var shop = $('[data-shop]');
  var catsList = $('[data-cats-list]');

  CAT.categorias.forEach(function (cat) {
    var itens = CAT.produtos.filter(function (p) { return p.categoria === cat.id; });
    if (!itens.length) return;

    var chip = document.createElement('a');
    chip.className = 'cats__chip';
    chip.href = '#cat-' + cat.id;
    chip.textContent = cat.nome;
    catsList.appendChild(chip);

    var sec = document.createElement('section');
    sec.className = 'cat';
    sec.id = 'cat-' + cat.id;
    sec.setAttribute('aria-labelledby', 'cat-t-' + cat.id);
    sec.innerHTML = '<h2 class="cat__title" id="cat-t-' + cat.id + '">' + esc(cat.nome) + '<span>' + itens.length + (itens.length > 1 ? ' itens' : ' item') + '</span></h2>';

    var ul = document.createElement('ul');
    ul.className = 'products';
    itens.forEach(function (p) {
      var li = document.createElement('li');
      var off = p.disponivel === false;
      li.innerHTML =
        '<button type="button" class="product' + (p.imagem ? '' : ' product--noimg') + (off ? ' is-off' : '') + '" data-open-product="' + esc(p.id) + '"' + (off ? ' disabled' : '') + '>' +
          (p.imagem ? '<span class="product__media"><img src="' + esc(p.imagem) + '" alt="" loading="lazy" width="200" height="200"></span>' : '') +
          '<span class="product__info">' +
            (p.selo ? '<span class="product__badge">' + esc(p.selo) + '</span>' : '') +
            '<span class="product__name">' + esc(p.nome) + '</span>' +
            (p.descricao ? '<span class="product__desc">' + esc(p.descricao) + '</span>' : '') +
            '<span class="product__price">' + (off ? 'Indisponível' : (temVariacao(p) ? '<small>a partir de</small> ' : '') + money(precoAPartir(p))) + '</span>' +
          '</span>' +
          (off ? '' : '<span class="product__add" aria-hidden="true"><svg class="ico"><use href="#i-plus"/></svg></span>') +
          '<span class="sr">' + (off ? '' : ', personalizar e adicionar à sacola') + '</span>' +
        '</button>';
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    shop.appendChild(sec);
  });

  if (!L.envioAtivo) {
    var note = $('[data-demo-note]');
    if (note) note.hidden = false;
  }

  /* Chip ativo conforme a categoria visível */
  var chips = $$('.cats__chip');
  if ('IntersectionObserver' in window && chips.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chips.forEach(function (c) {
          var on = c.getAttribute('href') === '#' + en.target.id;
          c.classList.toggle('is-active', on);
          if (on) {
            c.setAttribute('aria-current', 'true');
            var bar = c.parentNode;
            bar.scrollTo({ left: c.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
          } else c.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.cat').forEach(function (s) { cio.observe(s); });
  }

  /* ==========================================================
     2. DIALOGS (abrir/fechar, clique fora)
     ========================================================== */
  function abrir(dlg) {
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add('has-sheet');
  }
  function fechar(dlg) {
    if (!dlg.open) return;
    if (reduceMotion) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    setTimeout(function () { dlg.classList.remove('is-closing'); dlg.close(); }, 260);
  }
  $$('dialog.sheet').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) fechar(dlg); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); fechar(dlg); });
    dlg.addEventListener('close', function () {
      if (!$$('dialog.sheet').some(function (d) { return d.open; })) document.documentElement.classList.remove('has-sheet');
    });
    $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { fechar(dlg); }); });
  });

  /* ==========================================================
     3. PRODUTO (personalização)
     ========================================================== */
  var pdDlg = $('[data-product-dialog]');
  var pdForm = $('[data-product-form]');
  var pdGroups = $('[data-pd-groups]');
  var atual = null, qtd = 1, editKey = null;

  function hintGrupo(g) {
    if (g.tipo === 'unico' || g.max === 1) return g.min >= 1 ? 'Obrigatório · escolha 1' : 'Opcional · escolha 1';
    if (g.min >= 1) return 'Escolha de ' + g.min + ' a ' + g.max;
    return 'Opcional · até ' + g.max;
  }

  function abrirProduto(id, item) {
    atual = porId(id);
    if (!atual) return;
    editKey = item ? item.key : null;
    qtd = item ? item.qty : 1;

    $('.pd__media', pdDlg).hidden = !atual.imagem;
    if (atual.imagem) { $('[data-pd-img]').src = atual.imagem; $('[data-pd-img]').alt = atual.alt || ''; }
    $('[data-pd-name]').textContent = atual.nome;
    $('[data-pd-desc]').textContent = atual.descricao || '';
    $('[data-pd-tag]').hidden = !atual.selo;
    $('[data-pd-tag]').textContent = atual.selo || '';
    $('[data-pd-desc]').hidden = !atual.descricao;
    $('[data-pd-obs-label]').textContent = atual.obsLabel || 'Alguma observação?';
    $('[data-pd-obs]').placeholder = atual.obsPlaceholder || 'Ex.: retirar algum ingrediente';
    $('[data-pd-obs]').value = item ? item.obs || '' : '';
    $('[data-pd-add-label]').textContent = item ? 'Atualizar' : 'Adicionar';

    pdGroups.innerHTML = '';
    (atual.grupos || []).forEach(function (g, gi) {
      var radio = g.tipo === 'unico' && g.min >= 1;
      var marcadas = item ? (item.escolhas[g.id] || []) : [];
      var fs = document.createElement('fieldset');
      fs.className = 'opt-group';
      fs.setAttribute('data-group', g.id);
      fs.innerHTML = '<legend><span class="opt-group__name">' + esc(g.nome) + '</span><span class="opt-group__hint">' + hintGrupo(g) + '</span></legend>' +
        '<p class="opt-group__error" data-group-error hidden></p>' +
        g.opcoes.map(function (o, oi) {
          var idIn = 'o-' + gi + '-' + oi;
          var checked = marcadas.indexOf(o.nome) !== -1 || (radio && !item && oi === 0 && g.opcoes.length === 1);
          return '<label class="opt" for="' + idIn + '">' +
            '<input id="' + idIn + '" type="' + (radio ? 'radio' : 'checkbox') + '" name="g-' + esc(g.id) + '" value="' + esc(o.nome) + '"' + (checked ? ' checked' : '') + '>' +
            '<span class="opt__mark" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>' +
            '<span class="opt__name">' + esc(o.nome) + '</span>' +
            '<span class="opt__price">' + (o.preco ? (radio && !atual.preco ? '' : '+ ') + money(o.preco) : (radio ? '' : 'grátis')) + '</span>' +
          '</label>';
        }).join('');
      pdGroups.appendChild(fs);
    });

    atualizaProduto();
    abrir(pdDlg);
    pdForm.scrollTop = 0;
    var corpo = $('.pd__body', pdDlg); if (corpo) corpo.scrollTop = 0;
  }

  function escolhasAtuais() {
    var out = {};
    (atual.grupos || []).forEach(function (g) {
      out[g.id] = $$('[data-group="' + g.id + '"] input:checked', pdGroups).map(function (i) { return i.value; });
    });
    return out;
  }
  function precoUnit(p, escolhas) {
    var t = p.preco || 0;
    (p.grupos || []).forEach(function (g) {
      (escolhas[g.id] || []).forEach(function (nome) {
        var o = g.opcoes.filter(function (x) { return x.nome === nome; })[0];
        if (o) t += o.preco || 0;
      });
    });
    return t;
  }

  function atualizaProduto() {
    var esc_ = escolhasAtuais();
    (atual.grupos || []).forEach(function (g) {
      var fs = $('[data-group="' + g.id + '"]', pdGroups);
      var n = esc_[g.id].length;
      var limite = g.tipo === 'unico' ? 1 : g.max;
      $$('input[type="checkbox"]', fs).forEach(function (i) { i.disabled = !i.checked && n >= limite; });
      if (n >= g.min) { $('[data-group-error]', fs).hidden = true; fs.classList.remove('has-error'); }
    });
    $('[data-pd-qty]').textContent = qtd;
    // enquanto um tamanho obrigatório não foi escolhido, mostra o preço mínimo
    var unit = precoUnit(atual, esc_);
    (atual.grupos || []).forEach(function (g) {
      if (g.tipo === 'unico' && g.min >= 1 && !esc_[g.id].length && g.opcoes.length) {
        unit += Math.min.apply(null, g.opcoes.map(function (o) { return o.preco || 0; }));
      }
    });
    $('[data-pd-price]').textContent = money(unit * qtd);
  }

  pdGroups.addEventListener('change', function (e) {
    var inp = e.target;
    var fs = inp.closest('[data-group]');
    var g = (atual.grupos || []).filter(function (x) { return x.id === fs.getAttribute('data-group'); })[0];
    // grupo "único" opcional usa checkbox que se comporta como escolha única
    if (g && g.tipo === 'unico' && inp.type === 'checkbox' && inp.checked) {
      $$('input', fs).forEach(function (o) { if (o !== inp) o.checked = false; });
    }
    atualizaProduto();
  });
  $$('[data-qty]', pdDlg).forEach(function (b) {
    b.addEventListener('click', function () {
      qtd = Math.min(20, Math.max(1, qtd + +b.getAttribute('data-qty')));
      atualizaProduto();
    });
  });

  pdForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var escolhas = escolhasAtuais();
    var primeiroErro = null;
    (atual.grupos || []).forEach(function (g) {
      if (escolhas[g.id].length < g.min) {
        var fs = $('[data-group="' + g.id + '"]', pdGroups);
        var er = $('[data-group-error]', fs);
        er.textContent = g.min === 1 ? 'Escolha uma opção de ' + g.nome.toLowerCase() + '.' : 'Escolha pelo menos ' + g.min + ' opções.';
        er.hidden = false;
        fs.classList.add('has-error');
        if (!primeiroErro) primeiroErro = fs;
      }
    });
    if (primeiroErro) {
      primeiroErro.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      var inp = $('input', primeiroErro); if (inp) inp.focus({ preventScroll: true });
      return;
    }
    var item = {
      key: editKey || (atual.id + '-' + Date.now().toString(36)),
      id: atual.id,
      escolhas: escolhas,
      obs: $('[data-pd-obs]').value.trim(),
      qty: qtd
    };
    if (editKey) cart = cart.map(function (it) { return it.key === editKey ? item : it; });
    else cart.push(item);
    salvaCart();
    fechar(pdDlg);
    toast(editKey ? 'Item atualizado' : atual.nome + ' na sacola');
    if (editKey) setTimeout(function () { abrirSacola(); }, 280);
  });

  shop.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open-product]');
    if (b) abrirProduto(b.getAttribute('data-open-product'));
  });

  /* ==========================================================
     4. SACOLA
     ========================================================== */
  var cartDlg = $('[data-cart-dialog]');
  var step = 1;

  function linhaItem(it) {
    var p = porId(it.id);
    var unit = precoUnit(p, it.escolhas);
    var det = [];
    (p.grupos || []).forEach(function (g) { var v = it.escolhas[g.id] || []; if (v.length) det.push(v.join(', ')); });
    return { p: p, unit: unit, total: unit * it.qty, detalhes: det.join(' · ') };
  }
  function subtotal() { return cart.reduce(function (s, it) { return s + linhaItem(it).total; }, 0); }
  function contagem() { return cart.reduce(function (s, it) { return s + it.qty; }, 0); }

  function salvaCart() { gravar(KEY_CART, cart); renderCart(); }

  function renderCart() {
    var n = contagem(), st = subtotal();
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    $$('[data-cart-total]').forEach(function (el) { el.textContent = money(st); });
    var btn = $('.cart-btn');
    btn.setAttribute('aria-label', 'Abrir sacola, ' + n + (n === 1 ? ' item' : ' itens'));
    btn.classList.toggle('has-items', n > 0);
    $('[data-cartbar]').hidden = n === 0;

    var ul = $('[data-cart-items]');
    ul.innerHTML = cart.map(function (it) {
      var l = linhaItem(it);
      return '<li class="ci" data-key="' + esc(it.key) + '">' +
        (l.p.imagem ? '<img class="ci__img" src="' + esc(l.p.imagem) + '" alt="" width="64" height="64">' : '<span class="ci__img ci__img--none" aria-hidden="true"></span>') +
        '<div class="ci__info">' +
          '<p class="ci__name">' + esc(l.p.nome) + '</p>' +
          (l.detalhes ? '<p class="ci__det">' + esc(l.detalhes) + '</p>' : '') +
          (it.obs ? '<p class="ci__det ci__obs">“' + esc(it.obs) + '”</p>' : '') +
          '<button class="ci__edit" type="button" data-edit>Editar</button>' +
        '</div>' +
        '<div class="ci__side">' +
          '<p class="ci__price">' + money(l.total) + '</p>' +
          '<div class="stepper stepper--sm" aria-label="Quantidade de ' + esc(l.p.nome) + '">' +
            '<button type="button" data-ci-qty="-1" aria-label="' + (it.qty === 1 ? 'Remover ' : 'Diminuir ') + esc(l.p.nome) + '"><svg class="ico"><use href="#' + (it.qty === 1 ? 'i-trash' : 'i-minus') + '"/></svg></button>' +
            '<output>' + it.qty + '</output>' +
            '<button type="button" data-ci-qty="1" aria-label="Aumentar ' + esc(l.p.nome) + '"><svg class="ico"><use href="#i-plus"/></svg></button>' +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('');
    $('[data-cart-empty]').hidden = n > 0;
    renderFoot();
  }

  $('[data-cart-items]').addEventListener('click', function (e) {
    var li = e.target.closest('.ci'); if (!li) return;
    var key = li.getAttribute('data-key');
    var it = cart.filter(function (x) { return x.key === key; })[0]; if (!it) return;
    var q = e.target.closest('[data-ci-qty]');
    if (q) {
      it.qty += +q.getAttribute('data-ci-qty');
      if (it.qty < 1) cart = cart.filter(function (x) { return x.key !== key; });
      it.qty = Math.min(it.qty, 20);
      salvaCart();
      var again = $('.ci[data-key="' + key + '"] [data-ci-qty="' + q.getAttribute('data-ci-qty') + '"]');
      if (again) again.focus(); else $('[data-cart-title]').focus();
      return;
    }
    if (e.target.closest('[data-edit]')) {
      fechar(cartDlg);
      setTimeout(function () { abrirProduto(it.id, it); }, 280);
    }
  });

  /* ---------- Checkout ---------- */
  var form = $('[data-checkout]');
  var cliente = ler(KEY_CLIENTE, {});
  var modalidades = L.modalidades && L.modalidades.length ? L.modalidades : [{ id: 'entrega', nome: 'Entrega' }];
  var pagamentos = L.pagamentos && L.pagamentos.length ? L.pagamentos : ['A combinar'];

  $('[data-modalidades]').innerHTML = modalidades.map(function (m, i) {
    return '<label class="seg__opt"><input type="radio" name="modalidade" value="' + esc(m.id) + '"' +
      ((cliente.modalidade ? cliente.modalidade === m.id : i === 0) ? ' checked' : '') + '><span>' + esc(m.nome) + '</span></label>';
  }).join('');
  $('[data-pagamentos]').innerHTML = pagamentos.map(function (p) {
    return '<label class="seg__opt"><input type="radio" name="pagamento" value="' + esc(p) + '"' +
      (cliente.pagamento === p ? ' checked' : '') + ' required><span>' + esc(p) + '</span></label>';
  }).join('');
  ['nome', 'telefone', 'rua', 'bairro', 'complemento', 'referencia'].forEach(function (k) {
    if (cliente[k] && form.elements[k]) form.elements[k].value = cliente[k];
  });

  function modalidadeAtual() { var r = form.querySelector('input[name="modalidade"]:checked'); return r ? r.value : modalidades[0].id; }
  function ehEntrega() { return modalidadeAtual() === 'entrega'; }
  function syncForm() {
    var ent = ehEntrega();
    $('[data-address]').hidden = !ent;
    $$('[data-address] [required]').forEach(function (i) { i.disabled = !ent; });
    var pg = form.querySelector('input[name="pagamento"]:checked');
    var dinheiro = pg && /dinheiro/i.test(pg.value);
    $('[data-troco]').hidden = !dinheiro;
    renderFoot();
  }
  form.addEventListener('change', syncForm);
  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field'); if (f) f.classList.remove('has-error');
  });
  syncForm();

  function dadosCliente() {
    var d = {};
    ['nome', 'telefone', 'rua', 'bairro', 'complemento', 'referencia', 'troco'].forEach(function (k) {
      d[k] = (form.elements[k] && form.elements[k].value || '').trim();
    });
    d.modalidade = modalidadeAtual();
    var pg = form.querySelector('input[name="pagamento"]:checked');
    d.pagamento = pg ? pg.value : '';
    return d;
  }

  function validaForm() {
    var erros = [];
    $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
    $$('input[required]:not(:disabled)', form).forEach(function (i) {
      if (i.type === 'radio') return;
      var ok = i.value.trim().length > 0;
      if (i.name === 'telefone') ok = i.value.replace(/\D/g, '').length >= 10;
      if (!ok) { erros.push(i); i.closest('.field').classList.add('has-error'); }
    });
    if (!form.querySelector('input[name="pagamento"]:checked')) {
      var fs = $('[data-pagamentos]').closest('.field'); fs.classList.add('has-error'); erros.push($('input[name="pagamento"]', fs));
    }
    if (erros.length) {
      erros[0].focus();
      erros[0].closest('.field').scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return false;
    }
    return true;
  }

  /* ---------- Mensagem do pedido ---------- */
  function taxaTexto() {
    if (!ehEntrega()) return null;
    return L.taxaEntrega == null ? 'a confirmar pela loja' : money(L.taxaEntrega);
  }
  function total() { return subtotal() + (ehEntrega() && L.taxaEntrega ? L.taxaEntrega : 0); }

  function mensagem() {
    var d = dadosCliente();
    var nomeMod = (modalidades.filter(function (m) { return m.id === d.modalidade; })[0] || {}).nome || d.modalidade;
    var linhas = ['*Novo pedido pelo site — JM Açaí*', ''];
    cart.forEach(function (it) {
      var l = linhaItem(it);
      linhas.push('*' + it.qty + 'x ' + l.p.nome + '* — ' + money(l.total));
      (l.p.grupos || []).forEach(function (g) {
        var v = it.escolhas[g.id] || [];
        if (v.length) linhas.push('   ' + g.nome + ': ' + v.join(', '));
      });
      if (it.obs) linhas.push('   Obs.: ' + it.obs);
    });
    linhas.push('', 'Subtotal: ' + money(subtotal()));
    if (ehEntrega()) linhas.push('Entrega: ' + taxaTexto());
    linhas.push('*Total: ' + money(total()) + (ehEntrega() && L.taxaEntrega == null ? ' + entrega' : '') + '*', '');
    linhas.push('*' + nomeMod + '*');
    linhas.push('Nome: ' + d.nome);
    linhas.push('Telefone: ' + d.telefone);
    if (ehEntrega()) {
      linhas.push('Endereço: ' + d.rua + (d.complemento ? ', ' + d.complemento : '') + ' — ' + d.bairro);
      if (d.referencia) linhas.push('Referência: ' + d.referencia);
    }
    linhas.push('Pagamento: ' + d.pagamento + (/dinheiro/i.test(d.pagamento) && d.troco ? ' (troco para R$ ' + d.troco + ')' : ''));
    return linhas.join('\n');
  }

  function renderReview() {
    $('[data-review]').innerHTML =
      '<p class="review__lead">Confira o pedido. Ao enviar, o WhatsApp abre com esta mensagem pronta para a loja:</p>' +
      '<pre class="review__msg">' + esc(mensagem()).replace(/\*(.+?)\*/g, '<b>$1</b>') + '</pre>' +
      '<p class="review__note">O pedido só é confirmado quando a loja responder no WhatsApp' + (ehEntrega() && L.taxaEntrega == null ? ', informando a taxa de entrega' : '') + '.</p>';
  }

  /* ---------- Rodapé da sacola (totais + botão) ---------- */
  function renderFoot() {
    var vazio = cart.length === 0;
    var st = subtotal();
    var dl = $('[data-totals]');
    var rows = '<div><dt>Subtotal</dt><dd>' + money(st) + '</dd></div>';
    if (step > 1 && ehEntrega()) rows += '<div><dt>Entrega</dt><dd>' + taxaTexto() + '</dd></div>';
    if (step > 1) rows += '<div class="totals__total"><dt>Total</dt><dd>' + money(total()) + (ehEntrega() && L.taxaEntrega == null ? '<small> + entrega</small>' : '') + '</dd></div>';
    dl.innerHTML = rows;

    var next = $('[data-step-next]');
    var alerta = '';
    var desab = false;
    if (step === 1) {
      next.innerHTML = 'Continuar';
      desab = vazio;
      if (!vazio && L.pedidoMinimo && st < L.pedidoMinimo) { desab = true; alerta = 'Pedido mínimo de ' + money(L.pedidoMinimo) + '.'; }
    } else if (step === 2) {
      next.innerHTML = 'Revisar pedido';
    } else {
      next.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg> Enviar pelo WhatsApp';
      if (!L.envioAtivo) { desab = true; alerta = 'Os pedidos por aqui começam em breve. Por enquanto, finalize no cardápio oficial da JM no Anota.ai.'; }
      else if (!L.aceitarForaDoHorario && !lojaAberta()) { desab = true; alerta = 'A loja está fechada agora. Abre às ' + (C.horario ? C.horario.abre.replace(':', 'h') : '') + '.'; }
    }
    next.disabled = desab;
    var al = $('[data-cart-alert]');
    al.hidden = !alerta;
    al.textContent = alerta;
    $('[data-cart-foot]').hidden = vazio && step === 1;
  }

  function irPara(n) {
    step = n;
    $$('[data-step]', cartDlg).forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
    $$('[data-step-dot]', cartDlg).forEach(function (d) {
      var k = +d.getAttribute('data-step-dot');
      d.classList.toggle('is-current', k === n);
      d.classList.toggle('is-done', k < n);
    });
    $('[data-step-back]').hidden = n === 1;
    $('[data-cart-title]').textContent = ['Sua sacola', 'Seus dados', 'Revisão'][n - 1];
    if (n === 3) renderReview();
    renderFoot();
    var body = $('.cart', cartDlg); if (body) body.scrollTop = 0;
    $('[data-cart-title]').focus();
  }

  $('[data-step-next]').addEventListener('click', function () {
    if (step === 1) irPara(2);
    else if (step === 2) {
      if (!validaForm()) return;
      var d = dadosCliente(); delete d.troco;
      gravar(KEY_CLIENTE, d);
      irPara(3);
    } else enviar();
  });
  $('[data-step-back]').addEventListener('click', function () { irPara(step - 1); });

  function enviar() {
    if (!L.envioAtivo) return;
    var numero = String(L.whatsapp || '').replace(/\D/g, '');
    var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem());
    window.open(url, '_blank', 'noopener');
    if ($('.sent')) return;
    $('[data-review]').insertAdjacentHTML('afterbegin',
      '<div class="sent" role="status"><strong>Abrimos o WhatsApp com o seu pedido.</strong> Toque em enviar por lá para a loja receber. ' +
      '<button type="button" class="link-btn" data-clear>Esvaziar sacola</button></div>');
    var clr = $('[data-clear]');
    clr.addEventListener('click', function () { cart = []; salvaCart(); irPara(1); fechar(cartDlg); toast('Sacola esvaziada'); });
  }

  function abrirSacola() {
    irPara(1);
    abrir(cartDlg);
    $('[data-cart-title]').focus();
  }
  $$('[data-cart-open]').forEach(function (b) { b.addEventListener('click', abrirSacola); });
  $('[data-cart-title]').tabIndex = -1;

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(txt) {
    toastEl.textContent = txt;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
    var b = $('.cart-btn');
    if (!reduceMotion) { b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); }
  }

  renderCart();
})();
