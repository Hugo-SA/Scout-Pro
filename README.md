# 🧭 Scout Pro

Sistema web de scouting esportivo com foco em gestão e visualização de dados técnicos, desenvolvido em frontend com React.

O objetivo do projeto é oferecer uma interface para operações de cadastro, consulta, edição e remoção de informações relacionadas ao contexto de scouting (ex.: jogadores, equipes, competições e avaliações), com integração a API REST.

---

# ⚙️ Funcionalidades


- **Navegação entre páginas**
  - Implementada via roteamento no frontend (uso de `react-router-dom`).
- **Operações CRUD no frontend**
  - Estrutura preparada para criar, consultar, atualizar e excluir dados por integração HTTP (`axios`).
- **Interface responsiva e componentizada**
  - Uso de React com bibliotecas de UI para construção de componentes reutilizáveis.
- **Feedback visual e notificações**
  - Indícios de uso de notificações com `toastr`.
- **Testes de interface (base)**
  - Presença de bibliotecas de teste do ecossistema React Testing Library.

---

# 🧰 Tecnologias Utilizadas

## Linguagens
| Linguagem | Uso no projeto |
|---|---|
| JavaScript | Base da aplicação frontend |
| HTML | Estrutura de páginas/componentes |
| CSS | Estilização da interface |

## Frameworks e Bibliotecas
| Tecnologia | Finalidade |
|---|---|
| React (`react`, `react-dom`) | Construção da interface SPA |
| React Scripts (`react-scripts`) | Build, dev server e tooling (Create React App) |
| React Router DOM | Roteamento de páginas |
| Axios | Requisições HTTP para API |
| MUI (`@mui/material`, `@mui/icons-material`) | Componentes visuais e ícones |
| Emotion (`@emotion/react`, `@emotion/styled`) | Estilização (CSS-in-JS) |
| Bootswatch | Temas/estilos baseados em Bootstrap |
| Toastr | Mensagens de notificação |
| Testing Library (`@testing-library/*`) | Testes de componentes e comportamento |
| Web Vitals | Métricas de performance |

## Banco de dados
- Por ser um trabalho de uma disciplina dividida em duas (LP2 e LP3) onde essa era focada no front end, fizemos um Back-End fake
  que está numa pasta (`server-py`), porém ela foi **explicitamente desconsiderada** nesta documentação. (porém a integração com lp3 onde fizemos o Back-end já foi testada e funciona corretamente)

## Ferramentas
- Node.js / npm
- Create React App (estrutura e scripts via `react-scripts`)
- ESLint (configuração herdada de `react-app`)

---

# 🏗️ Arquitetura do Projeto

O repositório está organizado com foco em frontend na pasta `sp-app`, enquanto existe uma pasta backend (`server-py`) que não faz parte desta análise.

- **Raiz do repositório**
  - Contém arquivos de apoio e pastas de configuração de IDE.
- **`sp-app/`**
  - Aplicação React principal.
- **`sp-app/public/`**
  - Arquivos estáticos públicos.
- **`sp-app/src/`**
  - Código-fonte da aplicação (componentes, rotas, serviços, estilos etc.).

---

# 🗂️ Estrutura de Diretórios

```text
Scout-Pro/
├── .idea/                  # Configurações de IDE (JetBrains)
├── .vscode/                # Configurações de editor (VS Code)
├── README.md               # README da raiz (atual)
├── package-lock.json       # Lockfile na raiz (não define app principal)
├── server-py/              # Backend em Python (IGNORADO nesta documentação)
└── sp-app/                 # Frontend React principal
    ├── .gitignore
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── public/             # Recursos estáticos
    └── src/                # Código-fonte da aplicação
```

---

# 📋 Pré-requisitos

- **Node.js** (recomendado LTS)
- **npm** (normalmente já vem com Node.js)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

---

# ▶️ Como Executar

## 1) Clonar o repositório

```bash
git clone https://github.com/Hugo-SA/Scout-Pro.git
cd Scout-Pro
git checkout feature/estetica-fm
```

## 2) Instalar dependências

```bash
cd sp-app
npm install
```

## 3) Configurar variáveis de ambiente

Exemplo (caso necessário no projeto):

```bash
# sp-app/.env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## 4) Executar em modo de desenvolvimento

```bash
npm start
```

A aplicação deve abrir em:

- `http://localhost:3000`

## 5) Gerar build de produção

```bash
npm run build
```

Saída esperada:

- pasta `build/` dentro de `sp-app/`

---

# 🔧 Configurações

## `sp-app/package.json`

Principais pontos observados:

- **Scripts**
  - `npm start` → sobe ambiente de desenvolvimento
  - `npm run build` → gera build de produção
  - `npm test` → executa testes
  - `npm run eject` → ejeta configurações do CRA (irreversível)

- **Dependências**
  - UI: MUI, Emotion, Bootswatch
  - Roteamento: React Router
  - HTTP: Axios
  - Notificações: Toastr
  - Testes: Testing Library

- **Lint**
  - Herda configuração `react-app` e `react-app/jest`.


---

# 🔄 Fluxo da Aplicação

Fluxo funcional esperado, de acordo com arquitetura React + API REST:

1. Usuário acessa a aplicação no navegador.
2. O roteador do frontend direciona para a página correspondente.
3. Componentes da página disparam requisições HTTP (Axios) para API fake (server-py).
4. Dados retornam e atualizam o estado da interface.
5. Ações de CRUD enviam novas requisições e atualizam listagens/formulários.
6. Notificações (Toastr) sinalizam sucesso/erro ao usuário.

---

# 👨‍💻 Autores

- **Hugo-SA**  
  Repositório: https://github.com/Hugo-SA/Scout-Pro
- https://github.com/Celio738
- https://github.com/viniciuscguedes


---

##Observação: Como nesse projeto temos apenas o frontend, pode ser feito o redirecionamento (recomendamos esse passo ao invés de tentar rodar o banco fake) para um jsonfake 
https://my-json-server.typicode.com/
