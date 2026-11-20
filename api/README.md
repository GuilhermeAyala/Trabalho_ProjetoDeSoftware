# API VITTA

## Instalação, configuração e execução

Pré-requisitos:

- Node.js 22 LTS e npm;
- PostgreSQL 17 acessível;
- Redis 7 acessível (a API continua consultando o PostgreSQL se o cache estiver indisponível);
- portas `3000`, `5432` e `6379` livres, ou valores equivalentes na configuração local.

No PowerShell, a partir da raiz do projeto:

```powershell
Set-Location api
npm ci
Copy-Item .env.example .env
```

Revise `api/.env`. `DATABASE_URL`, `HEMOCENTRO_AUTH_SECRET` e `CPF_ENCRYPTION_KEY` são obrigatórias para uma execução funcional. Mantenha a mesma `CPF_ENCRYPTION_KEY` enquanto houver CPFs gravados: trocar ou perder essa chave impede descriptografar os dados existentes.

Prepare o banco e inicie a API:

```powershell
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

A API responde em <http://localhost:3000>. Confirme em outro terminal:

```powershell
curl.exe http://localhost:3000/
curl.exe http://localhost:3000/hemocentros
```

## Variáveis de ambiente

| Variável | Finalidade | Exemplo local |
|---|---|---|
| `DATABASE_URL` | conexão PostgreSQL usada pelo Prisma | `postgresql://vitta:vitta_dev@localhost:5432/vitta?schema=public` |
| `HEMOCENTRO_AUTH_SECRET` | assinatura dos tokens de acesso | texto aleatório com pelo menos 32 caracteres |
| `CPF_ENCRYPTION_KEY` | criptografia AES-256-GCM dos CPFs | texto aleatório com pelo menos 32 caracteres |
| `ADMIN_SEED_PASSWORD` | senha inicial do administrador | `VittaAdmin@2026` |
| `REDIS_URL` | conexão do cache | `redis://localhost:6379` |
| `REDIS_CACHE_TTL_SECONDS` | duração do cache em segundos | `900` |

Nunca envie `api/.env` no ZIP ou no repositório. Envie somente `api/.env.example`.

## Execução pela raiz com Docker

O modo recomendado para a demonstração é o Compose da raiz, que inicia PostgreSQL, Redis, API e Web juntos:

```powershell
Set-Location ..
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build -d
```

## Testes e build

Dentro de `api/`:

```powershell
npm test
npm run build
```

O teste E2E exige a API e os serviços de dados em execução:

```powershell
npm run test:e2e
```

## Organização

- `src/controller`, `src/service` e `src/repository`: camadas HTTP, regras de negócio e persistência;
- `src/routes`: rotas Express;
- `src/middleware`: autenticação por perfil;
- `src/cache`: integração Redis;
- `prisma/schema.prisma`: modelo relacional;
- `prisma/seed.ts`: dados iniciais;
- `tests/`: testes automatizados.
