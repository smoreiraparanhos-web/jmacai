#!/usr/bin/env python3
"""
Gera as páginas do site (index, acai, burgers, bebidas, combos, espaco) com o mesmo
cabeçalho, rodapé e menu. Rode a partir da raiz do repositório:

    python3 ferramentas/gerar_paginas.py

- Fotos: assets/fotos/<nome>-1600.webp e -800.webp, créditos em assets/fotos/creditos.json.
- Troque qual foto aparece em cada lugar no dicionário FOTO abaixo.
- Preços: os valores escritos aqui são reserva; o js/main.js atualiza a partir do js/catalogo.js.
"""
import json, os, html

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED = json.load(open(os.path.join(RAIZ, 'assets/fotos/creditos.json'), encoding='utf-8')) \
    if os.path.exists(os.path.join(RAIZ, 'assets/fotos/creditos.json')) else {}
# foto que já está no projeto: hambúrguer recortado (domínio público)
CRED.setdefault('burger-recorte', {'src': 'assets/img/burger.webp', 'recorte': True, 'w': 766, 'h': 587,
    'autor': 'Renee Comet / National Cancer Institute', 'licenca': 'Domínio público',
    'pagina': 'https://commons.wikimedia.org/wiki/File:Cheeseburger.jpg'})

# ---- qual foto vai em cada lugar (nomes de assets/fotos/creditos.json)
FOTO = {
    'inicio': 'acai-0',
    'porta-acai': 'acai-1',
    'porta-burger': 'burger-recorte',
    'porta-combo': 'sem-foto',
    'bebidas-destaque': 'coca-0',
    'acai-hero': 'acai-4',
    'acai-tradicional': 'acai-3',
    'acai-trufado': 'acai-1',
    'acai-frutas': 'acai-2',
    'burgers-hero': 'burger-recorte',
    'burgers-destaque': 'sem-foto',
    'bebidas-hero': 'coca-0',
    'bebidas-2': 'guarana-0',
    'bebidas-3': 'monster-0',
    'combos-hero': 'burger-recorte',
    'combo-acai': 'burger-recorte',
    'combo-fritas': 'sem-foto',
    'combo-2': 'sem-foto',
    'espaco-hero': 'acai-2',
}
PEDIDO = 'https://pedido.anota.ai/loja/jm-acai'
MAPS = 'https://www.google.com/maps/search/?api=1&amp;query=JM+A%C3%A7a%C3%AD%2C+Rua+Argentina+196%2C+Eldorado+do+Sul+RS'
NAV = [('index.html', 'Início'), ('acai.html', 'Açaí'), ('burgers.html', 'Burgers'), ('bebidas.html', 'Bebidas'),
       ('combos.html', 'Combos'), ('espaco.html', 'O espaço'), ('loja.html', 'Loja')]
SR_EXT = '<span class="sr"> (abre o cardápio oficial em nova aba)</span>'

usadas = []

def foto(lugar, alt, extra='', eager=False):
    nome = FOTO.get(lugar)
    c = CRED.get(nome)
    if not c:
        return ''
    if nome not in usadas:
        usadas.append(nome)
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    if c.get('recorte'):
        return ('<div class="ph ph--cutout %s"><img src="%s" alt="%s" width="%d" height="%d" %s decoding="async">'
                '</div>') % (extra, c['src'], html.escape(alt), c['w'], c['h'], load)
    return ('<div class="ph %s"><img src="assets/fotos/%s-1600.webp" srcset="assets/fotos/%s-800.webp 800w, assets/fotos/%s-1600.webp 1600w" '
            'sizes="(min-width: 768px) 60vw, 100vw" alt="%s" width="%d" height="%d" %s decoding="async">'
            '</div>') % (extra, nome, nome, nome, html.escape(alt), c['w'], c['h'], load)

def btn(txt, cls='btn--yellow btn--lg'):
    return '<a class="btn %s" data-link="pedido" href="%s" target="_blank" rel="noopener">%s%s</a>' % (cls, PEDIDO, txt, SR_EXT)

def plist(itens, cls=''):
    li = ''.join('<li><span class="plist__name">%s</span><i></i><b %s>%s</b></li>' % (n, a, p) for n, a, p in itens)
    return '<ul class="plist %s">%s</ul>' % (cls, li)

def proxima(arq, nome, ant=None):
    return ''
    a = '<a href="%s"><small>Anterior</small>%s</a>' % ant if ant else '<span></span>'
    return '<div class="wrap next">%s<a href="%s" style="text-align:right"><small>Próxima</small>%s</a></div>' % (a, arq, nome)

def pagina(arq, titulo, desc, corpo):
    nav = ''.join('<li><a href="%s" class="nav__link"%s>%s</a></li>' % (h, ' aria-current="page"' if h == arq else '', n) for h, n in NAV)
    creditos = '; '.join('%s, <a href="%s" rel="noopener">%s</a>' % (html.escape(CRED[n]['autor'] or 'autor desconhecido'), CRED[n]['pagina'], html.escape(CRED[n]['licenca']))
                         for n in usadas if n in CRED)
    return '''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>%(titulo)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#241038">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="JM Açaí">
<meta property="og:title" content="%(titulo)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:image" content="assets/img/og.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/paginas.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.JM_OK)document.documentElement.classList.remove('js')},2500)</script>
<script src="js/config.js" defer></script>
<script src="js/catalogo.js" defer></script>
<script src="js/main.js" defer></script>
</head>
<body class="pg%(bodycls)s">
<!-- Gerado por ferramentas/gerar_paginas.py. Edite o script, não este arquivo. -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-insta" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></symbol></svg>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>

<header class="header" data-header>
  <div class="header__inner">
    <a class="brand" href="index.html" aria-label="JM Açaí, página inicial"><span class="brand__jm">JM</span><span class="brand__acai">açaí</span></a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav__list" id="menu" data-menu>
        %(nav)s
        <li class="nav__mobile-extra">%(btnmenu)s<p class="nav__note">Você vai para o cardápio oficial no Anota.ai.</p></li>
      </ul>
    </nav>
    %(btnhead)s
    <button class="burger-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
      <span class="sr" data-menu-label>Abrir menu</span><span class="burger-btn__bars" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
</header>

<main id="conteudo">
%(corpo)s
</main>

<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <a class="brand brand--lg" href="index.html" aria-label="JM Açaí, página inicial"><span class="brand__jm">JM</span><span class="brand__acai">açaí</span></a>
      <p>Açaí, trufados e hambúrgueres na Rua Argentina, 196, em Eldorado do Sul.</p>
      <p class="footer__sign">JM agradece à preferência!</p>
    </div>
    <div class="footer__col">
      <h3>Visite</h3>
      <p><span data-jm="rua">Rua Argentina, 196</span><br><span data-jm="cidade">Eldorado do Sul — RS</span></p>
      <p data-jm="horario">Todos os dias, das 13h30 às 23h30</p>
    </div>
    <div class="footer__col">
      <h3>Fale com a gente</h3>
      <p><a data-link="tel" href="tel:+555198914468"><span data-jm="telefone">(51) 9891-4468</span></a></p>
      <p><a data-link="instagram" href="https://www.instagram.com/jmacaieldoradodosul/" target="_blank" rel="noopener">Instagram</a></p>
      <p><a href="loja.html">Loja</a></p>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <p>© <span data-year>2026</span> JM Açaí. Todos os direitos reservados.</p>
    <p class="footer__credits">Fotos ilustrativas, não são dos produtos da JM%(cred)s</p>
  </div>
</footer>

<div class="orderbar" data-orderbar>
  <span class="orderbar__info"><span class="status status--bar" data-status="curto"><span class="status__dot"></span><span data-status-text>13h30–23h30</span></span></span>
  <a class="btn btn--yellow orderbar__btn" data-link="pedido" href="%(pedido)s" target="_blank" rel="noopener" tabindex="-1">Pedir agora%(sr)s</a>
</div>
</body>
</html>
''' % {'titulo': titulo, 'desc': desc, 'nav': nav,
       'btnmenu': btn('Fazer pedido', 'btn--yellow btn--block'), 'btnhead': btn('Pedir agora', 'btn--yellow btn--sm header__cta'),
       'corpo': corpo, 'bodycls': ' pg--solid' if ('pg-hero--amarelo' in corpo or 'pg-hero--lilas' in corpo) else '', 'cred': (': ' + creditos + '.') if creditos else '.', 'pedido': PEDIDO, 'sr': SR_EXT}

def status_meta():
    return '<p class="pg-hero__meta"><span class="status" data-status><span class="status__dot"></span><span data-status-text>Todos os dias, 13h30–23h30</span></span><span>Rua Argentina, 196 · Eldorado do Sul</span></p>'

def hero(lugar, alt, eyebrow, h1, sub, acoes, curto=False, tema='roxo'):
    f = foto(lugar, alt, eager=True)
    modo = ' pg-hero--plain pg-hero--%s' % tema if not f else (' pg-hero--cutout' if 'ph--cutout' in f else '')
    return '''<section class="pg-hero%s%s">
  %s
  <div class="wrap pg-hero__inner">
    <p class="eyebrow">%s</p>
    <h1>%s</h1>
    <p class="pg-hero__sub">%s</p>
    <div class="pg-hero__actions">%s</div>
    %s
  </div>
</section>''' % (' pg-hero--short' if curto else '', modo, f, eyebrow, h1, sub, acoes, status_meta())

PAGINAS = {}

def porta(lugar, alt):
    f = foto(lugar, alt)
    return (' door--plain' if not f else (' door--cutout' if 'ph--cutout' in f else '')), f

def split_foto(lugar, alt, extra=''):
    return foto(lugar, alt, extra)

# ------------------------------------------------------------ INÍCIO
def p_inicio():
    return hero('inicio', 'Açaí servido com frutas', 'Rua Argentina, 196 · Eldorado do Sul', 'O açaí da Rua Argentina.',
                'Tradicional, trufado ou de frutas, de 250 a 500 ml. Hambúrguer de costela e bebida gelada. Todos os dias até 23h30.',
                btn('Pedir agora') + '<a class="link-arrow" href="acai.html" style="color:#fff">Ver o cardápio</a>', tema='roxo') + '''
<section class="blk blk--menu">
  <div class="wrap">
    <h2 class="sr">Cardápio em resumo</h2>
    <div class="menu4">
      <div class="menu4__col">
        <h3><a href="acai.html">Açaí</a></h3>
        <p class="menu4__sub">Copos de 250 a 500 ml</p>
        %s
        <a class="menu4__more" href="acai.html">Todos os tamanhos</a>
      </div>
      <div class="menu4__col">
        <h3><a href="burgers.html">Burgers</a></h3>
        <p class="menu4__sub">Bife bovino, costela ou frango</p>
        %s
        <a class="menu4__more" href="burgers.html">Todos os burgers</a>
      </div>
      <div class="menu4__col">
        <h3><a href="combos.html">Combos</a></h3>
        <p class="menu4__sub">Burger com bebida e açaí ou fritas</p>
        %s
        <a class="menu4__more" href="combos.html">Ver combos</a>
      </div>
      <div class="menu4__col">
        <h3><a href="bebidas.html">Bebidas</a></h3>
        <p class="menu4__sub">A mais pedida é a Coca Zero 2 L</p>
        %s
        <a class="menu4__more" href="bebidas.html">Todas as bebidas</a>
      </div>
    </div>
  </div>
</section>
<section class="infobar">
  <dl class="wrap infobar__inner">
    <div><dt>Endereço</dt><dd><a data-link="maps" href="%s" target="_blank" rel="noopener">Rua Argentina, 196</a></dd></div>
    <div><dt>Horário</dt><dd data-jm="horario">Todos os dias, das 13h30 às 23h30</dd></div>
    <div><dt>Telefone</dt><dd><a data-link="tel" href="tel:+555198914468" data-jm="telefone">(51) 9891-4468</a></dd></div>
    <div><dt>Atendimento</dt><dd>No salão ou por delivery</dd></div>
  </dl>
</section>
<section class="blk blk--purple">
  <div class="wrap">
    <p class="eyebrow eyebrow--yellow">O espaço</p>
    <h2>Um espaço grande pra comer um <em>açaizinho.</em></h2>
    <p class="lead">Mesas pra sentar com a família e os amigos, na Rua Argentina, 196.</p>
    <p style="margin-top:24px"><a class="btn btn--yellow btn--lg" href="espaco.html">Conhecer o espaço</a></p>
  </div>
</section>
<section class="final" aria-labelledby="final-title">
  <div class="wrap final__inner">
    <h2 class="final__title" id="final-title">Do copo de 250 ml ao <em>Mega Bacon 2.0.</em></h2>
    <p class="final__text">Todo o cardápio, com preços e opções, no pedido online. Pedido mínimo de R$ 10.</p>
    <div>%s<p class="final__note">Pedidos feitos pela plataforma oficial da loja, Anota.ai.</p></div>
  </div>
</section>''' % (
        plist([('Tradicional 250 ml', 'data-price-opt="acai-copo|250 ml"', 'R$ 15,00'),
               ('Trufado 300 ml', 'data-price-opt="acai-trufado|300 ml"', 'R$ 19,00'),
               ('Trufado de frutas 400 ml', 'data-price-opt="trufado-frutas|400 ml · 4 cremes grátis"', 'R$ 22,00'),
               ('Tradicional 500 ml', 'data-price-opt="acai-copo|500 ml"', 'R$ 25,00')]),
        plist([('Tradicional', 'data-price="burger-tradicional"', 'R$ 23,00'),
               ('Mega Bacon', 'data-price="burger-mega-bacon"', 'R$ 28,00'),
               ('Costela Crispy', 'data-price="burger-costela-crispy"', 'R$ 31,99'),
               ('Mega Bacon 2.0 com fritas', 'data-price="burger-mega-bacon-2"', 'R$ 42,00')]),
        plist([('Burger + bebida + açaí 300 ml', 'data-price="combo-burger-acai"', 'R$ 45,00'),
               ('Tradicional + bebida + fritas', 'data-price="combo-tradicional"', 'R$ 35,00')]),
        plist([('Coca Zero 2 L', 'data-price="coca-zero-2l"', 'R$ 15,00'),
               ('Coca lata', 'data-price="coca-lata"', 'R$ 7,00'),
               ('Monster latão', 'data-price="monster"', 'R$ 10,00'),
               ('Água', 'data-price="agua"', 'R$ 3,00')]),
        MAPS, btn('Ver o cardápio e pedir', 'btn--yellow btn--xl'))

# ------------------------------------------------------------ AÇAÍ
def p_acai():
    def tier(lugar, alt, nome, desc, pid, tamanhos):
        itens = [('%s ml%s' % (t, (' <small>%s</small>' % x) if x else ''), 'data-price-opt="%s|%s"' % (pid, opt), p) for t, x, opt, p in tamanhos]
        return '<article class="tier">%s<div class="tier__body"><h3>%s</h3><p>%s</p>%s</div></article>' % (foto(lugar, alt), nome, desc, plist(itens))
    padrao = [('250', '', '250 ml', 'R$ 15,00'), ('300', '', '300 ml', 'R$ 19,00'), ('400', '', '400 ml', 'R$ 22,00'), ('500', '', '500 ml', 'R$ 25,00')]
    frutas = [('250', '2 cremes grátis', '250 ml · 2 cremes grátis', 'R$ 15,00'), ('300', '3 cremes grátis', '300 ml · 3 cremes grátis', 'R$ 19,00'),
              ('400', '4 cremes grátis', '400 ml · 4 cremes grátis', 'R$ 22,00')]
    return hero('acai-hero', 'Açaí cremoso com frutas', 'Açaí · copos de 250 a 500 ml', 'Açaí',
                'Tradicional, trufado ou de frutas. No trufado, o creme que você escolhe vai em volta do copo.', btn('Pedir açaí')) + '''
<section class="blk">
  <div class="wrap">
    <h2>Três jeitos, quatro tamanhos, <em>a partir de R$ 15.</em></h2>
    <div class="tiers">%s%s%s</div>
    <p style="margin-top:28px">%s</p>
  </div>
</section>
%s''' % (tier('acai-tradicional', 'Açaí no copo', 'Tradicional', 'O açaí no copo.', 'acai-copo', padrao),
         tier('acai-trufado', 'Açaí com creme', 'Trufado', 'Com o creme que você escolher em volta do copo.', 'acai-trufado', padrao),
         tier('acai-frutas', 'Açaí com frutas', 'Trufado de frutas', 'Quanto maior o copo, mais cremes grátis.', 'trufado-frutas', frutas),
         btn('Escolher meu açaí', 'btn--purple btn--lg'), proxima('burgers.html', 'Burgers', ('index.html', 'Início')))

# ------------------------------------------------------------ BURGERS
def p_burgers():
    itens = [('Hambúrguer tradicional <small>Pão tradicional, bife bovino de 120 g e queijo</small>', 'data-price="burger-tradicional"', 'R$ 23,00'),
             ('Chicken Crispy <small>Frango crocante, alface, tomate e cebola roxa</small>', 'data-price="burger-chicken-crispy"', 'R$ 23,00'),
             ('Mega Bacon <small>Brioche, bife de costela de 120 g e 2 fatias de cheddar</small>', 'data-price="burger-mega-bacon"', 'R$ 28,00'),
             ('Costela Crispy <small>Brioche, costela artesanal de 120 g e muçarela empanada</small>', 'data-price="burger-costela-crispy"', 'R$ 31,99'),
             ('Mega Bacon 2.0 com fritas <small>2 bifes de costela de 120 g e 2 fatias de cheddar</small>', 'data-price="burger-mega-bacon-2"', 'R$ 42,00')]
    return hero('burgers-hero', 'Hambúrguer com queijo', 'Hambúrgueres · de R$ 23 a R$ 42', 'Burgers',
                'Bife bovino, costela artesanal ou frango crocante. Do tradicional ao Mega Bacon 2.0 com fritas.', btn('Pedir burger')) + '''
<section class="blk blk--dark">
  <div class="wrap split">
    <div>
      <h2>Costela, cheddar e <em>pão brioche.</em></h2>
      %s
      <p style="margin-top:28px">%s</p>
    </div>
    %s
  </div>
</section>
%s''' % (plist(itens), btn('Ver hambúrgueres'), split_foto('burgers-destaque', 'Hambúrguer de perto', 'ph--wide'),
         proxima('bebidas.html', 'Bebidas', ('acai.html', 'Açaí')))

# ------------------------------------------------------------ BEBIDAS
def p_bebidas():
    itens = [('Coca-Cola Zero 2 L <span class="chip">Mais pedido</span>', 'data-price="coca-zero-2l"', 'R$ 15,00'),
             ('Coca-Cola 2 L', 'data-price="coca-2l"', 'R$ 15,00'), ('Coca-Cola lata', 'data-price="coca-lata"', 'R$ 7,00'),
             ('Coca-Cola Zero lata', 'data-price="coca-zero-lata"', 'R$ 7,00'), ('Guaraná lata', 'data-price="guarana-lata"', 'R$ 6,00'),
             ('Monster latão', 'data-price="monster"', 'R$ 10,00'), ('H2O', 'data-price="h2o"', 'R$ 8,00'),
             ('Água com gás', 'data-price="agua-gas"', 'R$ 3,00'), ('Água sem gás', 'data-price="agua"', 'R$ 3,00')]
    return hero('bebidas-hero', 'Refrigerante gelado', 'Bebidas geladas', 'Bebidas',
                'A mais pedida da loja é a Coca Zero 2 L. Do latão ao 2 litros, pra acompanhar o pedido.', btn('Pedir bebidas', 'btn--purple btn--lg'), curto=True, tema='amarelo') + '''
<section class="blk">
  <div class="wrap split split--rev">
    %s
    <div>
      <h2>Do latão <em>ao 2 litros.</em></h2>
      %s
    </div>
  </div>
</section>
%s''' % (split_foto('bebidas-2', 'Lata de refrigerante', 'ph--wide'), plist(itens), proxima('combos.html', 'Combos', ('burgers.html', 'Burgers')))

# ------------------------------------------------------------ COMBOS
def p_combos():
    def deal(lugar, alt, tag, nome, desc, pid, preco, cta, cls=''):
        return '''<article class="deal %s">%s<div class="deal__body"><p class="deal__tag">%s</p><h3>%s</h3><p>%s</p><p class="deal__price" data-price="%s">%s</p>%s</div></article>''' % (
            cls, foto(lugar, alt), tag, nome, desc, pid, preco, btn(cta, 'btn--yellow' if not cls else 'btn--purple'))
    return hero('combos-hero', 'Hambúrguer com fritas', 'Combos', 'Combos', 'Burger, bebida e açaí por R$ 45. Ou burger com fritas e bebida por R$ 35.',
                btn('Pedir combo'), curto=True) + '''
<section class="blk">
  <div class="wrap">
    <h2>Pra quem quer <em>tudo de uma vez.</em></h2>
    <div class="deals">%s%s%s</div>
  </div>
</section>
%s''' % (deal('combo-acai', 'Hambúrguer', 'Com açaí de 300 ml', 'Burger + bebida + açaí', 'Hambúrguer clássico, bebida e um açaí de 300 ml.', 'combo-burger-acai', 'R$ 45,00', 'Pedir o combo com açaí'),
         deal('combo-fritas', 'Hambúrguer com fritas', 'Com fritas e bebida', 'Hambúrguer tradicional, bebida e fritas', 'Bife bovino de 150 g e 2 fatias de cheddar.', 'combo-tradicional', 'R$ 35,00', 'Pedir o combo com fritas', 'deal--yellow'),
         deal('combo-2', 'Hambúrguer duplo', '2 carnes + fritas', 'Mega Bacon 2.0 com fritas', '2 bifes de costela de 120 g e 2 fatias de cheddar.', 'burger-mega-bacon-2', 'R$ 42,00', 'Pedir o Mega Bacon 2.0'),
         proxima('espaco.html', 'O espaço', ('bebidas.html', 'Bebidas')))

# ------------------------------------------------------------ ESPAÇO
def p_espaco():
    return hero('espaco-hero', 'Açaí servido na mesa', 'Rua Argentina, 196', 'Um espaço grande pra comer um açaizinho.',
                'Mesas pra sentar com a família e os amigos e comer com calma. Ou peça e receba em casa.', tema='lilas', acoes=
                '<a class="btn btn--yellow btn--lg" data-link="maps" href="%s" target="_blank" rel="noopener">Como chegar<span class="sr"> (abre o Google Maps em nova aba)</span></a>' % MAPS) + '''
<section class="blk">
  <div class="wrap split">
    <div>
      <h2>Rua Argentina, 196. <em>Eldorado do Sul.</em></h2>
      <dl class="info" style="margin-top:28px">
        <div class="info__row"><dt>Horário</dt><dd><span data-jm="horario">Todos os dias, das 13h30 às 23h30</span><span class="status status--dark" data-status><span class="status__dot"></span><span data-status-text>Consulte o horário</span></span></dd></div>
        <div class="info__row"><dt>Telefone</dt><dd><a class="tel" data-link="tel" href="tel:+555198914468"><span data-jm="telefone">(51) 9891-4468</span></a></dd></div>
        <div class="info__row"><dt>Atendimento</dt><dd>No salão ou por delivery</dd></div>
      </dl>
      <a class="insta" data-link="instagram" href="https://www.instagram.com/jmacaieldoradodosul/" target="_blank" rel="noopener" style="margin-top:20px">
        <span class="insta__txt"><small>Siga a JM no Instagram</small><strong>@jmacaieldoradodosul</strong></span>
      </a>
    </div>
    <div class="bigmap"><iframe data-map title="Mapa: JM Açaí, Rua Argentina, 196, Eldorado do Sul" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-src="https://www.google.com/maps?q=Rua+Argentina,+196,+Eldorado+do+Sul+-+RS&amp;output=embed"></iframe></div>
  </div>
</section>
%s''' % proxima('loja.html', 'Loja', ('combos.html', 'Combos'))

DEF = [
    ('index.html', 'JM Açaí | Açaí, Hambúrgueres e Delivery em Eldorado do Sul', 'Açaí tradicional, trufado e de frutas, hambúrgueres e bebidas geladas na Rua Argentina, 196, Eldorado do Sul. Delivery e salão, todos os dias.', p_inicio),
    ('acai.html', 'Açaí | JM Açaí, Eldorado do Sul', 'Açaí tradicional, trufado e de frutas em copos de 250 a 500 ml, a partir de R$ 15. Rua Argentina, 196, Eldorado do Sul.', p_acai),
    ('burgers.html', 'Hambúrgueres | JM Açaí, Eldorado do Sul', 'Hambúrguer tradicional, Chicken Crispy, Mega Bacon, Costela Crispy e Mega Bacon 2.0. De R$ 23 a R$ 42.', p_burgers),
    ('bebidas.html', 'Bebidas geladas | JM Açaí, Eldorado do Sul', 'Coca-Cola 2 L e lata, Guaraná, Monster, H2O e água. A mais pedida é a Coca Zero 2 L.', p_bebidas),
    ('combos.html', 'Combos | JM Açaí, Eldorado do Sul', 'Burger + bebida + açaí 300 ml por R$ 45. Combo tradicional com fritas e bebida por R$ 35.', p_combos),
    ('espaco.html', 'O espaço | JM Açaí, Rua Argentina, 196', 'Espaço grande pra comer no salão, na Rua Argentina, 196, Eldorado do Sul. Todos os dias, das 13h30 às 23h30.', p_espaco),
]
for arq, titulo, desc, fn in DEF:
    usadas.clear()
    corpo = fn()
    open(os.path.join(RAIZ, arq), 'w', encoding='utf-8').write(pagina(arq, titulo, desc, corpo))
    print('gerado', arq, '· fotos:', ', '.join(usadas) or '-')
