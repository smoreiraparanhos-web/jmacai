# JM Açaí — site e loja

Site da JM Açaí (Eldorado do Sul, RS). HTML, CSS e JavaScript puros, sem build e sem dependências.

- **`index.html`:** vitrine da marca (açaí, hambúrgueres, combinações, localização).
- **`loja.html`:** loja online. Cardápio, personalização, sacola e checkout. O pedido é enviado pronto para o WhatsApp da loja.

Escopo completo do e-commerce, com fases seguintes e o que falta para ativar: [`docs/ESCOPO-ECOMMERCE.md`](docs/ESCOPO-ECOMMERCE.md).

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
    └── img/            acai-bowl.svg, trufado-frutas.svg, bebida.svg, burger.webp, og.jpg
```

## O que editar

**`js/config.js`:** link do Anota.ai, Instagram, telefone, endereço e horário (usado no selo "Aberto agora" e no bloqueio de pedidos fora do horário). No bloco `loja` ficam o WhatsApp que recebe pedidos, as modalidades, as formas de pagamento, a taxa de entrega e o pedido mínimo.

**`js/catalogo.js`:** produtos e preços em centavos. Cada produto pode ter grupos de opções (tamanho, cremes, adicionais), com mínimo, máximo e preço extra. O formato está explicado no topo do arquivo.

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
| Logotipo e fotos | Wordmark provisório, ilustrações e foto de banco livre, marcados como ilustrativos. Substituir pelos originais. |

## Trocar as imagens

- **Produtos da loja:** troque o campo `imagem` de cada produto em `js/catalogo.js`. Funciona melhor com fotos quadradas de fundo transparente (PNG ou WebP, ~600×600).
- **Vitrine:** substitua `assets/img/acai-bowl.svg` e `assets/img/burger.webp` (fundo transparente) e atualize os `src` no `index.html`.
- Depois de trocar as fotos, remova as etiquetas "Imagens ilustrativas" e "Foto ilustrativa" e o crédito no rodapé.

## Créditos

- Foto do hambúrguer: Renee Comet, National Cancer Institute. Domínio público ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cheeseburger.jpg)). Recortada para fundo transparente.
- Ilustrações de açaí, trufado de frutas e bebida: criadas para este projeto.
- Fontes: Bricolage Grotesque e Instrument Serif (Google Fonts, licença OFL).

## Acessibilidade e desempenho

- Navegação por teclado, foco visível, link "Pular para o conteúdo", abas e diálogos acessíveis (`<dialog>` nativo).
- `prefers-reduced-motion` desliga as animações.
- Imagens abaixo da dobra com `loading="lazy"`. O mapa do Google só carrega quando chega perto da tela.
- A sacola e os dados do cliente ficam salvos só no navegador do próprio cliente (`localStorage`). Nada é enviado a servidores.
