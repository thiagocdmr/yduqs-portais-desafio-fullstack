# Backend - Sistema de Matrículas

Backend desenvolvido com NestJS, TypeScript, PostgreSQL e Prisma ORM, seguindo os princípios de Clean Architecture.

## Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testes](#-testes)
- [Documentação da API](#-documentação-da-api)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

## Stack Tecnológica

- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript 5.x
- **Banco de Dados**: PostgreSQL 15
- **ORM**: Prisma 6.x
- **Documentação**: Swagger
- **Logs**: Winston
- **Testes**: Jest & Supertest
- **Containerização**: Docker & Docker Compose

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (vem com o Node.js)
- **Docker** ([Download](https://www.docker.com/get-started))
- **Docker Compose** (geralmente incluído com Docker Desktop)

Para verificar se estão instalados corretamente:

```bash
node --version
npm --version
docker --version
docker-compose --version
```

## Instalação e Configuração

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

Edite o arquivo `.env` conforme necessário. As variáveis padrão são:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_db?schema=public"
PORT=3000
CORS_ORIGINS=http://localhost:5173
```

> ⚠️ **Importante**: A senha do PostgreSQL no `docker-compose.yml` é `postgres`. Se você alterou a senha no `.env`, certifique-se de que corresponda ao `docker-compose.yml`.

### 3. Iniciar o Banco de Dados PostgreSQL

Inicie o container do PostgreSQL usando Docker Compose:

```bash
docker-compose up -d
```

Verifique se o container está rodando:

```bash
docker ps
```

Você deve ver um container chamado `postgres_db` em execução.

### 4. Configurar o Prisma

Gere o cliente Prisma:

```bash
npx prisma generate
```

Execute as migrations para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
```

### 5. Popular o Banco de Dados (Seed)

Para popular o banco com dados iniciais de cursos:

```bash
npm run db:seed
```

> 💡 **Dica**: Este comando executa o arquivo `prisma/seed.ts` que insere cursos de exemplo no banco de dados.

## Executando a Aplicação

### Modo Desenvolvimento (com hot-reload)

```bash
npm run start:dev
```

A aplicação estará disponível em: **http://localhost:3000**

## Testes

### Testes Unitários

Executa todos os testes unitários:

```bash
npm run test
```

### Cobertura de Testes

Gera relatório de cobertura de código:

```bash
npm run test:cov
```

O relatório será gerado na pasta `coverage/` e pode ser visualizado abrindo o arquivo `coverage/lcov-report/index.html` no navegador.

## Documentação da API

Após iniciar a aplicação, acesse a documentação interativa Swagger:

- **URL**: http://localhost:3000/api/docs

A documentação Swagger permite:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pelo navegador
- Ver os schemas de request/response
- Entender os códigos de status HTTP retornados

### Principais Endpoints

- **GET** `/courses` - Lista todos os cursos disponíveis
- **GET** `/courses/:id` - Busca um curso específico
- **POST** `/students` - Cria um novo estudante
- **POST** `/enrollments` - Realiza uma matrícula

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start` | Inicia a aplicação em modo normal |
| `npm run start:dev` | Inicia em modo desenvolvimento com hot-reload |
| `npm run start:prod` | Inicia em modo produção |
| `npm run start:debug` | Inicia em modo debug |
| `npm run build` | Compila o projeto TypeScript |
| `npm run test` | Executa testes unitários |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:cov` | Gera relatório de cobertura |
| `npm run test:e2e` | Executa testes E2E |
| `npm run lint` | Executa o linter (ESLint) |
| `npm run format` | Formata o código com Prettier |
| `npx prisma generate` | Gera o cliente Prisma |
| `npx prisma migrate dev` | Executa migrations em desenvolvimento |
| `npx prisma studio` | Abre interface visual do banco de dados |
| `npx prisma migrate reset` | Reseta o banco de dados |
| `npm run db:seed` | Popula o banco com dados iniciais |

## Estrutura do Projeto

```
backend/
├── prisma/
│   ├── migrations/          # Migrations do banco de dados
│   ├── schema.prisma        # Schema do Prisma
│   └── seed.ts             # Script de seed
├── src/
│   ├── common/             # Código compartilhado (DTOs, filters, etc.)
│   ├── config/             # Configurações da aplicação
│   ├── courses/            # Módulo de cursos
│   ├── students/           # Módulo de estudantes
│   ├── enrollments/        # Módulo de matrículas
│   ├── app.module.ts       # Módulo principal
│   └── main.ts             # Ponto de entrada
├── test/                   # Testes E2E
├── logs/                   # Arquivos de log
├── docker-compose.yml      # Configuração do Docker
├── .env.example           # Exemplo de variáveis de ambiente
└── package.json           # Dependências e scripts
```

## Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://postgres:postgres@localhost:5432/nestjs_db?schema=public` |
| `PORT` | Porta da aplicação | `3000` |
| `CORS_ORIGINS` | Origens permitidas para CORS | `http://localhost:5173` |