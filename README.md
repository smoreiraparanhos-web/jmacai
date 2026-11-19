# JM Açaí — site

Vitrine digital da JM Açaí (Eldorado do Sul, RS). HTML, CSS e JavaScript puros, sem build e sem dependências.
Todos os pedidos vão para o cardápio oficial da loja no Anota.ai. O site não tem carrinho nem checkout próprio.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000. Para publicar, basta enviar os arquivos deste repositório para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages).

## Estrutura

```
jmacai/
├── index.html          página única, HTML semântico, SEO e Open Graph
├── css/styles.css      estilos (mobile first, tokens de cor no :root)
├── js/config.js        ← DADOS DA LOJA: links, telefone, horário, sugestões
├── js/main.js          interações (menu, status aberto/fechado, abas, animações)
└── assets/
    ├── favicon.svg
    └── img/            acai-bowl.svg, burger.webp, og.jpg
```

## O que editar

Quase tudo fica em `js/config.js`: link de pedido, Instagram, telefone, endereço, horário (usado também no selo "Aberto agora") e os textos da seção "Encontre seu próximo favorito". Quando houver produtos reais, troque os textos e preencha `preco`; o preço passa a aparecer em amarelo.

O HTML já traz os mesmos dados escritos direto no código, para SEO e para quem navega sem JavaScript. Se mudar algo no `config.js`, atualize também o JSON-LD no `<head>` do `index.html`.

## Pendências (confirmar com a loja)

| Item | Situação |
| --- | --- |
| Telefone `(51) 9891-4468` | Tem 8 dígitos após o DDD. Celulares costumam ter 9. Confirmar. |
| Horário 13h30–23h30 | Alguns canais indicam abertura às 13h. Confirmar. |
| Logotipo | Hoje é um wordmark tipográfico provisório. Trocar pelo logo original no header e no footer (há um comentário no `index.html` indicando o ponto). |
| Fotos | Ilustração de açaí e foto de hambúrguer de banco livre, sinalizadas como ilustrativas. Substituir por fotos reais da loja. |
| Cardápio e preços | Não há produtos, preços ou promoções inventados. Tudo direciona ao Anota.ai. |

## Trocar as imagens

- **Açaí:** substitua `assets/img/acai-bowl.svg` por uma foto vista de cima (PNG ou WebP com fundo transparente, ~1200×1200) e atualize o `src` no `index.html` e no `config.js`. Fotos recortadas funcionam melhor com a composição do hero.
- **Hambúrguer:** substitua `assets/img/burger.webp` (fundo transparente, ~1200 px de largura).
- Depois de trocar as fotos, remova as etiquetas "Imagens ilustrativas" e "Foto ilustrativa" e o crédito no rodapé.

## Créditos

- Foto do hambúrguer: Renee Comet, National Cancer Institute. Domínio público ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cheeseburger.jpg)). Recortada para fundo transparente.
- Ilustração da tigela de açaí: criada para este projeto.
- Fontes: Bricolage Grotesque e Instrument Serif (Google Fonts, licença OFL).

## Acessibilidade e desempenho

- Navegação por teclado, foco visível, link "Pular para o conteúdo" e abas com setas (padrão WAI-ARIA).
- `prefers-reduced-motion` desliga as animações.
- Imagens abaixo da dobra com `loading="lazy"`; o mapa do Google só carrega quando chega perto da tela.
- Botões de pedido abrem em nova aba e avisam isso a leitores de tela.
