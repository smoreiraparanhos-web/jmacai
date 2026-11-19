/*
 * JM Açaí — cardápio da loja (loja.html).
 *
 * Fonte: cardápio oficial da loja no Anota.ai (captura de tela de 19/11/2026).
 * Algumas descrições aparecem cortadas na fonte; aqui está só o trecho visível.
 * Cremes, molhos e outras opções não aparecem na captura: o cliente informa na observação.
 * Quando tiver as listas, cadastre como "grupos" (veja o formato abaixo).
 *
 * Preços sempre em CENTAVOS (1990 = R$ 19,90).
 *
 * Produto:
 *   id, categoria, nome, descricao, imagem, alt
 *   preco          preço base em centavos (0 se o preço vem do tamanho)
 *   selo           texto de destaque opcional (ex.: 'Mais pedido')
 *   disponivel     false mostra "Indisponível"
 *   obsLabel       pergunta do campo de observação (opcional)
 *   obsPlaceholder exemplo dentro do campo (opcional)
 *   grupos         opções:
 *     id, nome, tipo ('unico' | 'multiplo'), min, max,
 *     opcoes [{ nome, preco }]   preco extra em centavos (0 = grátis)
 */
(function () {
  var IMG_ACAI = 'assets/img/acai-bowl.svg';
  var IMG_FRUTAS = 'assets/img/trufado-frutas.svg';
  var IMG_BURGER = 'assets/img/burger.webp';
  var IMG_BEBIDA = 'assets/img/bebida.svg';

  function tamanhos(lista) {
    return { id: 'tamanho', nome: 'Tamanho', tipo: 'unico', min: 1, max: 1, opcoes: lista };
  }
  function bebida(id, nome, preco, selo) {
    return { id: id, categoria: 'bebidas', nome: nome, descricao: '', imagem: IMG_BEBIDA, alt: '', preco: preco, selo: selo };
  }

  window.JM_CATALOGO = {
    categorias: [
      { id: 'acai', nome: 'Açaí' },
      { id: 'burgers', nome: 'Hambúrgueres' },
      { id: 'bebidas', nome: 'Bebidas geladas' }
    ],

    produtos: [
      /* ---------- Açaí tradicional ---------- */
      {
        id: 'acai-copo',
        categoria: 'acai',
        nome: 'Açaí tradicional',
        descricao: 'Açaí no copo. Escolha o tamanho.',
        imagem: IMG_ACAI, alt: 'Ilustração de açaí',
        preco: 0,
        obsLabel: 'Alguma observação?',
        grupos: [tamanhos([
          { nome: '250 ml', preco: 1500 },
          { nome: '300 ml', preco: 1900 },
          { nome: '400 ml', preco: 2200 },
          { nome: '500 ml', preco: 2500 }
        ])]
      },

      /* ---------- Açaí trufado ---------- */
      {
        id: 'acai-trufado',
        categoria: 'acai',
        nome: 'Açaí trufado',
        descricao: 'Nosso açaí trufado acompanha o creme selecionado em volta do copo.',
        imagem: IMG_ACAI, alt: 'Ilustração de açaí',
        preco: 0,
        obsLabel: 'Qual creme você quer em volta do copo?',
        obsPlaceholder: 'Ex.: creme de ninho',
        grupos: [tamanhos([
          { nome: '250 ml', preco: 1500 },
          { nome: '300 ml', preco: 1900 },
          { nome: '400 ml', preco: 2200 },
          { nome: '500 ml', preco: 2500 }
        ])]
      },

      /* ---------- Trufado de frutas ---------- */
      {
        id: 'trufado-frutas',
        categoria: 'acai',
        nome: 'Trufado de frutas',
        descricao: 'Cremes gratuitos de acordo com o tamanho.',
        imagem: IMG_FRUTAS, alt: 'Ilustração de copo com frutas e creme',
        preco: 0,
        obsLabel: 'Quais cremes você quer?',
        obsPlaceholder: 'Ex.: ninho e morango',
        grupos: [tamanhos([
          { nome: '250 ml · 2 cremes grátis', preco: 1500 },
          { nome: '300 ml · 3 cremes grátis', preco: 1900 },
          { nome: '400 ml · 4 cremes grátis', preco: 2200 }
        ])]
      },

      /* ---------- Hambúrgueres ---------- */
      {
        id: 'burger-tradicional',
        categoria: 'burgers',
        nome: 'Hambúrguer tradicional',
        descricao: 'Pão tipo tradicional, molho de sua preferência e bife bovino de 120 g, com queijo.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 2300,
        obsLabel: 'Qual molho você prefere?',
        obsPlaceholder: 'Molho, ponto, retirar algum ingrediente…'
      },
      {
        id: 'burger-chicken-crispy',
        categoria: 'burgers',
        nome: 'Hambúrguer Chicken Crispy',
        descricao: 'Frango crocante, alface, tomate e cebola roxa, com molho à sua escolha.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 2300,
        obsLabel: 'Qual molho você prefere?',
        obsPlaceholder: 'Molho, retirar algum ingrediente…'
      },
      {
        id: 'burger-costela-crispy',
        categoria: 'burgers',
        nome: 'Hambúrguer Costela Crispy',
        descricao: 'Pão brioche, bife de costela artesanal de 120 g e muçarela empanada crocante.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 3199,
        obsLabel: 'Alguma observação?',
        obsPlaceholder: 'Molho, retirar algum ingrediente…'
      },
      {
        id: 'burger-mega-bacon',
        categoria: 'burgers',
        nome: 'Hambúrguer Mega Bacon',
        descricao: 'Pão de brioche, molho de seu gosto, 1 bife de costela de 120 g e 2 fatias de queijo cheddar.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 2800,
        obsLabel: 'Qual molho você prefere?',
        obsPlaceholder: 'Molho, retirar algum ingrediente…'
      },
      {
        id: 'burger-mega-bacon-2',
        categoria: 'burgers',
        nome: 'Hambúrguer Mega Bacon 2.0 com fritas',
        descricao: 'Pão de brioche, 2 molhos de seu gosto, 2 bifes de costela de 120 g e 2 fatias de queijo cheddar. Com fritas.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 4200,
        obsLabel: 'Quais molhos você prefere?',
        obsPlaceholder: 'Molhos, retirar algum ingrediente…'
      },
      {
        id: 'combo-tradicional',
        categoria: 'burgers',
        nome: 'Combo hambúrguer tradicional, bebida e fritas',
        descricao: 'Pão tipo tradicional, molho de sua preferência, bife bovino de 150 g e 2 fatias de queijo cheddar. Com bebida e fritas.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 3500,
        obsLabel: 'Molho e bebida',
        obsPlaceholder: 'Ex.: molho barbecue, Coca lata'
      },
      {
        id: 'combo-burger-acai',
        categoria: 'burgers',
        nome: 'Combo burger + bebida + açaí',
        descricao: 'Hambúrguer clássico + bebida + açaí 300 ml.',
        imagem: IMG_BURGER, alt: 'Hambúrguer (foto ilustrativa)',
        preco: 4500,
        obsLabel: 'Bebida e observações',
        obsPlaceholder: 'Ex.: Guaraná lata'
      },

      /* ---------- Bebidas geladas ---------- */
      bebida('coca-zero-2l', 'Coca-Cola Zero 2 litros', 1500, 'Mais pedido'),
      bebida('coca-2l', 'Coca-Cola 2 litros', 1500),
      bebida('coca-lata', 'Coca-Cola lata original', 700),
      bebida('coca-zero-lata', 'Coca-Cola Zero lata', 700),
      bebida('guarana-lata', 'Guaraná lata', 600),
      bebida('monster', 'Monster latão', 1000),
      bebida('h2o', 'H2O', 800),
      bebida('agua-gas', 'Água com gás', 300),
      bebida('agua', 'Água sem gás', 300)
    ]
  };
})();
