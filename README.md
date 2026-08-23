# Projeto de Software: Sistema VITTA

Protótipo no Figma: https://www.figma.com/proto/NkLFRu8mj07xEIGy3b4ddk/VITTA?node-id=1-2&t=f3YzHBQHA5YRVyxG-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2

## Instruções de instalação:
1 - npm init -y pra gerar o package.json
2 - npm install - gera o nodejs
3 - npm install -D typescript ts-node-dev @types/node @types/express - gera o typescript e o express
4 - npm install express dotenv - gera express 
5 - npx tsc --init - gera o tsconfig
6 - npm install prisma @types/pg --save-dev 
7 - npm install @prisma/client @prisma/adapter-pg pg dotenv

## Instrução para rodar o backend
1 - entre na pasta src, com cd src
2 - digite npm run dev

## Comandos do prisma

1 - npx prisma init --output ../generated/prisma - criando o schema no prisma
Set up a new local Prisma Postgres `prisma dev`-ready project
      $ prisma init

      Start a local Prisma Postgres server for development
      $ prisma dev

      Generate artifacts (e.g. Prisma Client)
      $ prisma generate

      Browse your data
      $ prisma studio

      Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
      $ prisma migrate dev

      Pull the schema from an existing database, updating the Prisma schema
      $ prisma db pull

      Push the Prisma schema state to the database
      $ prisma db push

      Validate your Prisma schema
      $ prisma validate

      Format your Prisma schema
      $ prisma format

      Display Prisma version info
      $ prisma version

      Display Prisma debug info
      $ prisma debug

2 - CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.