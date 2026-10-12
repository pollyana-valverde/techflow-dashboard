# TechFlow Dashboard

Checkpoint 5 de FrontEnd Design | Engenharia de Software | FIAP

Dashboard responsivo da empresa fictícia **TechFlow** para acompanhar projetos, equipes e indicadores. A interface foi construída com o conceito Mobile-First, usando HTML, Tailwind CSS e JavaScript puro.

## Integrantes

| Nome | RM |
| --- | --- |
| Pollyana Valverde dos Santos | RM569871 |
| Luana Lopes Sventkauskas | RM569643 |

## Tecnologias utilizadas

- **HTML5** semântico (header, aside, main, section, article, fieldset)
- **Tailwind CSS 3** via CDN, com `darkMode: 'class'`
- **JavaScript puro** (sem bibliotecas ou frameworks)
- **CSS** complementar em `css/styles.css` (rolagem suave, barra de rolagem e redução de movimento)
- **localStorage** para salvar a preferência de tema
- Fonte **Plus Jakarta Sans** (Google Fonts) e ícones SVG no estilo Heroicons

## Como executar

Não é preciso instalar nada. Basta abrir o arquivo `index.html` no navegador (com internet, para carregar o Tailwind pelo CDN). Também funciona com a extensão Live Server do VS Code.

## Estrutura de pastas

```
techflow-dashboard/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

## Principais recursos implementados

### Dashboard (desktop e mobile)
- **Navbar** fixa no topo com campo de pesquisa, seletor de tema, notificações e informações do usuário.
- **Sidebar** com navegação, contadores e card de ajuda. No desktop ela fica sempre visível; no celular e no tablet ela abre e fecha pelo botão de menu, com fundo escurecido.
- **4 cards de indicadores**: Projetos ativos, Projetos concluídos, Tarefas pendentes e Equipes.
- **7 cards de projetos** em CSS Grid com tamanhos diferentes:
  - card de destaque com `md:col-span-2` e `xl:row-span-2`;
  - card alto com `md:row-span-2`;
  - card largo com `md:col-span-2`;
  - demais cards ocupando uma célula.
  - `grid-flow-dense` para os cards se encaixarem sem deixar espaços vazios.

### Modal de Novo Projeto
- Campos: Nome, Responsável, Categoria, Prioridade, Prazo e Descrição.
- Validação visual com JavaScript:
  - o campo é validado quando o usuário sai dele e, depois disso, enquanto ele corrige;
  - estado de **erro** (borda vermelha, ícone e mensagem) e de **sucesso** (borda verde, ícone de check e mensagem);
  - alerta geral no topo quando há erros e alerta de sucesso ao salvar;
  - o prazo não aceita datas passadas e a descrição tem contador de caracteres.
- Ao salvar, o botão fica **disabled** com indicador de carregamento, o projeto aparece na grade com o selo "Novo" e o indicador de projetos ativos aumenta. Nada é salvo em banco de dados, como pedido no enunciado.

### Interações
- Dropdown do usuário (abre no clique, fecha ao clicar fora ou com Esc).
- Menu mobile da Sidebar (fecha pelo X, pelo fundo escurecido, por um link ou com Esc).
- Estados `hover:`, `focus:`, `active:` e `disabled:` em botões, links e campos.
- `group-hover:` nos cards de indicadores, cards de projetos e itens da Sidebar.
- `peer-checked:` nos botões de prioridade do formulário e no interruptor "Notificações por e-mail" do dropdown.
- Transições com `transition`, `transition-all`, `duration-*` e `ease-*` (cards, modal, sidebar, dropdown e toast).

### Tema Light | Dark | System
- Seletor com três opções na navbar.
- Usa a variante `dark:` do Tailwind, ativada pela classe `dark` no `<html>`.
- No modo **System** a página segue a preferência do sistema operacional (`prefers-color-scheme`) e muda sozinha se o usuário trocar o tema do computador.
- A escolha fica salva no **localStorage**. Um pequeno script no `<head>` aplica o tema antes da página aparecer, para não piscar no tema errado.

## Conceitos aplicados

| Conceito | Classes utilizadas | Onde aparece |
| --- | --- | --- |
| Flexbox | `flex`, `flex-col`, `items-center`, `justify-between`, `flex-wrap`, `gap-*` | Navbar, cabeçalho da página, rodapé dos cards, Sidebar |
| Grid | `grid`, `grid-cols-*`, `col-span-*`, `row-span-*`, `gap-*` | Indicadores, grade de projetos, formulário |
| Responsividade | `sm:`, `md:`, `lg:`, `xl:`, `2xl:` | Colunas da grade, Sidebar, pesquisa, textos do seletor de tema, espaçamentos |
| Estados | `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`, `peer-checked:` | Botões, campos, cards, prioridade, interruptor |
| Transições | `transition`, `transition-all`, `duration-*`, `ease-*` | Cards, modal, Sidebar, dropdown, toast |
| Dark Mode | `dark:` | Todos os componentes |

### Comportamento por tamanho de tela (Mobile-First)

| Tela | Comportamento |
| --- | --- |
| Celular | Uma coluna, pesquisa em linha própria, Sidebar escondida com botão de menu, modal abre de baixo para cima |
| Tablet (`sm:` e `md:`) | Indicadores em 2 colunas, projetos em 2 colunas, pesquisa volta para a navbar |
| Notebook (`lg:`) | Sidebar fixa e sempre visível |
| Desktop (`xl:` e `2xl:`) | Indicadores e projetos em 4 colunas, textos Light, Dark e System visíveis, espaçamentos maiores |

## Link do GitHub

[https://github.com/SEU-USUARIO/techflow-dashboard](https://github.com/SEU-USUARIO/techflow-dashboard)

## Dificuldades encontradas

- **Pensar Mobile-First.** Estávamos acostumadas a montar o layout do desktop e depois adaptar para o celular. Aqui tivemos que escrever as classes sem prefixo pensando no celular e só depois adicionar `md:`, `lg:` e `xl:`, o que no começo deixou a gente confusa sobre qual classe valia em cada tamanho.
- **Cards de tamanhos diferentes no Grid.** Combinar `col-span` e `row-span` sem deixar buracos na grade deu trabalho. Tivemos que desenhar a grade no papel para cada breakpoint e descobrimos o `grid-flow-dense`, que ajuda o navegador a encaixar os cards menores nos espaços livres.
- **Modo System do tema.** Entender que o modo System não é um terceiro tema, e sim "seguir o computador", levou um tempo. Usamos `matchMedia('(prefers-color-scheme: dark)')` e também tivemos que ouvir a mudança dessa preferência. Além disso, a página piscava no tema claro ao recarregar, o que resolvemos aplicando o tema com um script no `<head>`.
- **Momento certo de mostrar os erros.** No início o formulário mostrava erro enquanto a pessoa ainda estava digitando, o que ficava chato. Passamos a validar ao sair do campo e só revalidar em tempo real depois disso. Também percebemos que a mensagem de erro, ao aparecer, empurrava o botão Salvar para baixo e o clique se perdia no celular, então reservamos o espaço da mensagem.
- **Sidebar no redimensionamento.** Se a Sidebar estivesse aberta no celular e a janela fosse aumentada, a página ficava travada sem rolagem. Resolvemos fechando a Sidebar quando a tela chega ao tamanho `lg`.
