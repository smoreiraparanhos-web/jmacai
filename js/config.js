/*
 * JM Açaí — dados editáveis do site.
 * Tudo que é informação comercial fica aqui. Alterou algo? Salve e recarregue a página.
 * Itens marcados com "CONFIRMAR" ainda precisam ser validados com a loja.
 */
window.JM = {
  pedidoUrl: 'https://pedido.anota.ai/loja/jm-acai',

  instagramUrl: 'https://www.instagram.com/jmacaieldoradodosul/',
  instagramHandle: '@jmacaieldoradodosul',

  // CONFIRMAR: o número informado tem 8 dígitos após o DDD. Celulares costumam ter 9 (ex.: 99891-4468).
  telefone: '(51) 9891-4468',
  telefoneLink: 'tel:+555198914468',

  endereco: {
    rua: 'Rua Argentina, 196',
    cidade: 'Eldorado do Sul — RS',
    pais: 'Brasil'
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=JM+A%C3%A7a%C3%AD%2C+Rua+Argentina+196%2C+Eldorado+do+Sul+RS',
  mapsEmbed: 'https://www.google.com/maps?q=Rua+Argentina,+196,+Eldorado+do+Sul+-+RS&output=embed',

  // CONFIRMAR: alguns canais indicam abertura às 13h.
  horario: {
    texto: 'Todos os dias, das 13h30 às 23h30',
    abre: '13:30',
    fecha: '23:30',
    dias: [0, 1, 2, 3, 4, 5, 6], // 0 = domingo
    fuso: 'America/Sao_Paulo'
  },

  atendimento: 'Delivery e presencial',

  /*
   * Seção "Encontre seu próximo favorito".
   * Hoje são sugestões por momento (sem preço, sem produto inventado).
   * Quando houver produtos reais, troque os textos e preencha "preco" (ex.: 'R$ 19,90');
   * o preço aparece automaticamente em destaque. Deixe null para não mostrar.
   */
  sugestoes: [
    {
      id: 'gelado',
      aba: 'Algo gelado',
      titulo: 'Calor pedindo açaí.',
      texto: 'Escolha a base, os acompanhamentos e deixe do seu jeito. Açaí e sorvete estão no cardápio.',
      imagem: 'assets/img/acai-bowl.svg',
      alt: 'Ilustração de tigela de açaí com frutas e granola',
      cta: 'Escolher meu açaí',
      preco: null
    },
    {
      id: 'fome',
      aba: 'Fome de verdade',
      titulo: 'Quando a fome é séria.',
      texto: 'Pão, carne e queijo. O hambúrguer resolve, e o cardápio completo está a um toque.',
      imagem: 'assets/img/burger.webp',
      alt: 'Hambúrguer com queijo e alface (foto ilustrativa)',
      cta: 'Ver hambúrgueres',
      preco: null
    },
    {
      id: 'dupla',
      aba: 'A dupla',
      titulo: 'Burger primeiro. Açaí depois.',
      texto: 'Uma combinação que combina com você: o salgado pra matar a fome e o gelado pra fechar a noite.',
      imagem: 'dupla',
      alt: 'Hambúrguer e tigela de açaí lado a lado',
      cta: 'Montar minha dupla',
      preco: null
    }
  ]
};
