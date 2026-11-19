# Escopo — Loja online da JM Açaí

Documento de escopo do e-commerce do site da JM Açaí (Eldorado do Sul, RS).
Versão 1 · novembro de 2026.

## 1. Objetivo

Permitir que o cliente monte e envie o pedido **no próprio site da JM Açaí**, com a identidade da marca, sem depender só da página do Anota.ai.

Resultados esperados:

- O cliente vai da vontade ao pedido em poucos toques, no celular.
- A loja recebe pedidos completos e legíveis (itens, opções, endereço, pagamento), sem precisar perguntar de novo.
- O cardápio pode ser atualizado sem refazer o site.

## 2. Decisão principal: como o pedido chega à loja

| Caminho | Como funciona | Prós | Contras |
| --- | --- | --- | --- |
| **A. Pedido pelo WhatsApp** (fase 1) | O site monta o pedido e abre o WhatsApp da loja com a mensagem pronta. | Sem servidor nem mensalidade extra. Vai ao ar rápido. A loja já usa WhatsApp. | Pagamento fora do site. A loja confirma manualmente. Sem painel de pedidos. |
| **B. Pagamento online** (fase 2) | Checkout com PIX ou cartão por um provedor de pagamento, e pedido registrado num banco de dados. | Pedido já pago. Menos cancelamento. Histórico e relatórios. | Precisa de servidor, conta no provedor, taxas por transação e cuidados com dados pessoais (LGPD). |
| **C. Continuar só no Anota.ai** | O site direciona para o cardápio oficial. | Nada a construir. | Experiência fora da marca, sem controle do layout nem dos dados. |

**Recomendação:** lançar com **A**, mantendo o Anota.ai como alternativa, e evoluir para **B** se o volume de pedidos justificar.

## 3. Fase 1 — Loja com pedido pelo WhatsApp (implementada)

Página `loja.html`, sem servidor. Já construída e testada nesta branch.

### Funcionalidades

- **Cardápio:** categorias Açaí, Hambúrgueres e Bebidas geladas, com os produtos e preços do cardápio oficial (Anota.ai, 19/11/2026). As categorias ficam fixas no topo ao rolar.
- **Personalização:** escolha de tamanho com preço por tamanho. Suporte a opções grátis ou pagas, com mínimo e máximo por grupo (ex.: "até 4 acompanhamentos"). Campo de observação com pergunta própria por produto ("Qual creme você quer?"). Quantidade.
- **Sacola:** fica salva no navegador. Permite editar item, mudar quantidade, remover e ver o subtotal.
- **Checkout em 3 etapas:** sacola → dados (entrega ou retirada, nome, telefone, endereço, pagamento, troco) → revisão com a mensagem exatamente como a loja vai receber.
- **Regras:** pedido mínimo (R$ 10,00), bloqueio fora do horário e taxa de entrega fixa ou "a confirmar pela loja".
- **Envio:** abre o WhatsApp da loja com o pedido formatado. O site não afirma que o pedido foi feito, só que a mensagem foi preparada.
- **Acessibilidade:** teclado, leitor de tela, foco visível e movimento reduzido.

### Para ativar o envio

1. Confirmar o **número do WhatsApp** que recebe pedidos. O informado, (51) 9891-4468, tem 8 dígitos após o DDD.
2. Confirmar **modalidades** (entrega e retirada), **formas de pagamento** e **taxa de entrega**.
3. Completar o cardápio (lista abaixo).
4. Em `js/config.js`, mudar `loja.envioAtivo` para `true`. A partir daí, os botões "pedir" da página inicial também passam a levar para a loja.
5. Fazer um pedido de teste ponta a ponta com a loja.

### Dados que faltam do cardápio

- Lista de **cremes** do açaí trufado e do trufado de frutas. Com ela, o cliente escolhe em botões em vez de digitar.
- **Acompanhamentos e adicionais** do açaí, com preços, se houver.
- **Molhos** disponíveis nos hambúrgueres.
- **Bebidas** dos combos. Quais podem ser escolhidas?
- **Descrições completas** dos hambúrgueres. Na fonte, várias aparecem cortadas.
- Um item no fim da categoria Hambúrguer apareceu cortado na captura e não foi cadastrado.
- **Fotos reais** dos produtos. Hoje o site usa ilustrações e uma foto de banco livre, marcadas como ilustrativas.

## 4. Fase 2 — Pagamento online e gestão (proposta)

| Item | Descrição |
| --- | --- |
| Backend leve | Funções serverless (ex.: Vercel ou Netlify Functions) para registrar pedidos e conversar com o provedor de pagamento. |
| Pagamento | PIX com QR code e confirmação automática, e cartão de crédito, por um provedor nacional (ex.: Mercado Pago, PagBank, Asaas). A escolha depende das taxas negociadas pela loja. |
| Banco de dados | Pedidos, clientes e cardápio (ex.: Supabase ou Firebase). |
| Painel da loja | Tela protegida por senha para ver os pedidos chegando em tempo real, mudar o status (recebido, em preparo, saiu para entrega) e pausar produtos esgotados. |
| Cardápio editável | A loja altera produtos, preços e fotos no painel, sem mexer em código. |
| Taxa por bairro | Tabela de bairros atendidos com taxa e tempo estimado, definida pela loja. |
| Acompanhamento | Página "meu pedido" com o status atualizado. |
| LGPD | Política de privacidade, consentimento e retenção mínima de dados. |

## 5. Fase 3 — Crescimento (opcional)

- Cupons e promoções definidos pela loja.
- Programa de fidelidade (ex.: a cada X pedidos, um açaí).
- Avisos por WhatsApp de mudança de status.
- Relatórios: mais vendidos, horários de pico, ticket médio.
- Impressão automática de comanda na cozinha.

## 6. Fora do escopo

- Aplicativo nativo (iOS ou Android). O site já funciona como app no celular.
- Integração com marketplaces (iFood e similares).
- Emissão de nota fiscal.
- Entregadores próprios ou roteirização.

## 7. Critérios de aceite da fase 1

- [x] Cardápio com produtos e preços do cardápio oficial.
- [x] Personalização com validação de opções obrigatórias e limites.
- [x] Sacola mantida ao recarregar a página.
- [x] Pedido mínimo e horário respeitados.
- [x] Mensagem do WhatsApp com itens, opções, observações, totais, dados do cliente e pagamento.
- [x] Sem rolagem horizontal de 360 px a 1920 px. Sem erros de JavaScript.
- [ ] Número do WhatsApp confirmado e envio ativado.
- [ ] Cremes, molhos e acompanhamentos cadastrados como opções.
- [ ] Fotos reais no lugar das ilustrações.
- [ ] Pedido de teste realizado com a loja.

## 8. Riscos e cuidados

- **Cardápio desatualizado:** com dois canais (site e Anota.ai), os preços precisam ser atualizados nos dois. A fase 2 resolve isso com o cardápio editável.
- **Pedido não enviado:** o cliente pode montar o pedido e não apertar "enviar" no WhatsApp. O site deixa isso claro na revisão e após abrir o WhatsApp.
- **Número errado:** com um número incorreto, os pedidos se perdem. Por isso o envio só é ativado após confirmação e teste.
