# 🎨 Frontend - Sistema de Matrículas

Interface web desenvolvida com React, TypeScript, Vite e Material-UI para o sistema de matrículas de cursos.

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testes](#-testes)
- [Build para Produção](#-build-para-produção)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

## 🛠️ Stack Tecnológica

- **Framework**: React 19.x
- **Linguagem**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **UI Framework**: Material-UI (MUI) 7.x
- **Roteamento**: React Router DOM 7.x
- **HTTP Client**: Axios 1.x
- **Validação**: Brazilian Utils (CPF, telefone)
- **Testes**: Vitest + React Testing Library
- **Ícones**: Material Icons

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (vem com o Node.js)
- **Backend rodando** na porta 3000 (veja o README do backend)

Para verificar se estão instalados corretamente:

```bash
node --version
npm --version
```

## 🔧 Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário. A variável padrão é:

```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ **Importante**: Certifique-se de que a URL aponta para o backend em execução. Se o backend estiver rodando em outra porta, ajuste a variável.

### 3. Verificar Backend

Antes de iniciar o frontend, certifique-se de que o backend está rodando:

1. Navegue até a pasta `backend`
2. Siga as instruções do README do backend
3. Verifique se o backend está acessível em `http://localhost:3000`
4. Teste acessando `http://localhost:3000/api/docs` (Swagger)

## ▶️ Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**



## 🧪 Testes

### Executar Testes

Executa todos os testes em modo watch:

```bash
npm run test
```

### Cobertura de Testes

Gera relatório de cobertura de código:

```bash
npm run test:coverage
```

O relatório será gerado e exibido no terminal. Para visualizar em HTML, verifique a pasta de cobertura gerada.

Acesse: **http://localhost:4173**

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npm run preview` | Preview da build de produção |
| `npm run lint` | Executa o linter (ESLint) |
| `npm run test` | Executa testes em modo watch |
| `npm run test:ui` | Abre interface gráfica de testes |
| `npm run test:coverage` | Gera relatório de cobertura |

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── vite.svg           # Favicon e assets públicos
├── src/
│   ├── __tests__/         # Testes unitários
│   ├── assets/            # Imagens, ícones, etc.
│   ├── components/        # Componentes reutilizáveis
│   │   ├── CourseCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── StudentFormFields.tsx
│   ├── contexts/          # Context API (estado global)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas/rotas
│   │   ├── Home.tsx
│   │   ├── StudentForm.tsx
│   │   └── Success.tsx
│   ├── services/          # Serviços (API calls)
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Funções utilitárias
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── .env.example           # Exemplo de variáveis de ambiente
├── .env                   # Variáveis de ambiente (não versionado)
├── vite.config.ts         # Configuração do Vite
├── tsconfig.json          # Configuração do TypeScript
└── package.json           # Dependências e scripts
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3000` |

> 📝 **Nota**: Todas as variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.