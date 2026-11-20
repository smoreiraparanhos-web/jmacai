# JM Açaí — site e loja

Site da JM Açaí (Eldorado do Sul, RS). HTML, CSS e JavaScript puros, sem build e sem dependências.

- **`index.html`:** site da marca. Carrossel de campanhas, açaí com tabela de tamanhos, hambúrgueres, bebidas, combos, o espaço da loja e como chegar.
- **`loja.html`:** loja online. Cardápio, personalização, sacola e checkout. O pedido é enviado pronto para o WhatsApp da loja.

Escopo completo do e-commerce, com fases seguintes e o que falta para ativar: [`docs/ESCOPO-ECOMMERCE.md`](docs/ESCOPO-ECOMMERCE.md).

## Páginas

O site tem uma página por item do menu: `index.html` (Início), `acai.html`, `burgers.html`, `bebidas.html`, `combos.html`, `espaco.html` e `loja.html`.
As seis primeiras são **geradas** por `ferramentas/gerar_paginas.py` (mesmo cabeçalho, menu e rodapé). Para mudar textos, menu ou fotos, edite o script e rode:

```bash
python3 ferramentas/gerar_paginas.py
```

**Fotos:** coloque em `assets/fotos/` como `<nome>-1600.webp` e `<nome>-800.webp`, registre autor e licença em `assets/fotos/creditos.json` e aponte o lugar no dicionário `FOTO` do script. Lugar sem foto vira um bloco de cor da marca automaticamente.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000 (vitrine) e http://localhost:8000/loja.html (loja). Para publicar, envie os arquivos para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages).

## Estrutura

```
jmacai/
├── index.html          vitrine da marca, SEO e Open Graph
├── loja.html           loja: cardápio, sacola e checkout
├── css/styles.css      estilos base (tokens de cor no :root)
├── css/loja.css        estilos da loja
├── js/config.js        ← DADOS DA LOJA: links, telefone, horário, regras da loja
├── js/catalogo.js      ← CARDÁPIO: produtos, preços e opções
├── js/main.js          interações da vitrine (menu, status aberto/fechado, animações)
├── js/loja.js          lógica da loja (sacola, checkout, mensagem do WhatsApp)
├── docs/ESCOPO-ECOMMERCE.md
└── assets/
    ├── favicon.svg
    ├── img/            burger.webp, og.jpg
    └── fotos/          fotos dos produtos (quando houver) + creditos.json
```

## O que editar

**`js/config.js`:** link do Anota.ai, Instagram, telefone, endereço e horário (usado no selo "Aberto agora" e no bloqueio de pedidos fora do horário). No bloco `loja` ficam o WhatsApp que recebe pedidos, as modalidades, as formas de pagamento, a taxa de entrega e o pedido mínimo.

**`js/catalogo.js`:** produtos e preços em centavos. Os preços da página inicial (anúncios, tabelas, combos, bebidas) também são lidos daqui: mudou no catálogo, muda no site inteiro. Cada produto pode ter grupos de opções (tamanho, cremes, adicionais), com mínimo, máximo e preço extra. O formato está explicado no topo do arquivo.

### Ativar o envio de pedidos

Hoje a loja funciona por completo, mas o botão final fica bloqueado (`loja.envioAtivo: false`) e um aviso direciona ao Anota.ai. Para ativar:

1. Confirme o número do WhatsApp em `loja.whatsapp`.
2. Mude `loja.envioAtivo` para `true`.
3. Faça um pedido de teste.

Com o envio ativo, os botões "pedir" da página inicial passam a levar para a loja, em vez do Anota.ai.

O HTML da vitrine também traz os dados da loja escritos no código, para SEO. Se mudar algo no `config.js`, atualize também o JSON-LD no `<head>` do `index.html`.

## Pendências (confirmar com a loja)

| Item | Situação |
| --- | --- |
| WhatsApp / telefone `(51) 9891-4468` | Tem 8 dígitos após o DDD. Celulares costumam ter 9. Confirmar antes de ativar o envio. |
| Horário 13h30–23h30 | Alguns canais indicam abertura às 13h. Confirmar. |
| Pagamento, modalidades e taxa de entrega | Valores provisórios no `config.js`. Confirmar. |
| Cremes, molhos e acompanhamentos | Não constam na captura do cardápio. Hoje o cliente informa na observação. Cadastrar como opções. |
| Descrições dos hambúrgueres | Algumas estavam cortadas na fonte. Completar. |
| Logotipo e fotos | Wordmark provisório e uma foto de banco livre (hambúrguer), marcada como ilustrativa. Substituir pelos originais. |

## Trocar as imagens

- **Produtos da loja:** troque o campo `imagem` de cada produto em `js/catalogo.js`. Funciona melhor com fotos quadradas de fundo transparente (PNG ou WebP, ~600×600).
- **Páginas:** veja a seção Páginas acima (pasta `assets/fotos/` + dicionário `FOTO` do gerador).
- **O espaço:** troque `assets/img/espaco.svg` por uma foto do salão (horizontal, 3:2, ~1800 px) e remova a legenda "Ilustração" da seção.
- Depois de trocar as fotos, ajuste a nota de crédito no rodapé (o gerador faz isso a partir de `creditos.json`).

## Créditos

- Foto do hambúrguer: Renee Comet, National Cancer Institute. Domínio público ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cheeseburger.jpg)). Recortada para fundo transparente.
- Fontes: Bricolage Grotesque e Instrument Serif (Google Fonts, licença OFL).

## Acessibilidade e desempenho

- Navegação por teclado, foco visível, link "Pular para o conteúdo", abas e diálogos acessíveis (`<dialog>` nativo).
- `prefers-reduced-motion` desliga as animações.
- Imagens abaixo da dobra com `loading="lazy"`. O mapa do Google só carrega quando chega perto da tela.
- A sacola e os dados do cliente ficam salvos só no navegador do próprio cliente (`localStorage`). Nada é enviado a servidores.
