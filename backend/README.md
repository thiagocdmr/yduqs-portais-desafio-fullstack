## Descrição

Backend desenvolvido com NestJS, TypeScript, PostgreSQL e Prisma ORM, seguindo os princípios de Clean Architecture.

## Stack Tecnológica

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Documentação**: Swagger
- **Logs**: Winston

## Pré-requisitos

- Node.js >= 18.x
- Docker e Docker Compose
- npm

## Project setup

```bash
# Instalar dependências
$ npm install

# Iniciar banco de dados PostgreSQL com Docker
$ docker-compose up -d

# Gerar cliente Prisma
$ npx prisma generate

# Executar migrations
$ npx prisma migrate dev
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentação da API

Após iniciar a aplicação, acesse a documentação Swagger em:
- **URL**: http://localhost:3000/api/docs