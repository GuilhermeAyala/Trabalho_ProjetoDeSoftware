# Aplicação web VITTA

## Execução recomendada com Docker

Pré-requisitos:

- Docker Desktop em execução;
- Docker Compose v2;
- portas `3000`, `5433`, `6380` e `8081` livres.

No PowerShell, a partir da raiz do projeto:

```powershell
docker compose up --build -d --remove-orphans
docker compose ps
```

Acesse <http://localhost:8081>. Esse comando também inicia PostgreSQL, Redis e API. Na primeira execução, não use `docker compose start`, pois ele não cria o contêiner `web`.

## Execução local opcional

Para desenvolver o Web sem Nginx, inicie somente a infraestrutura e a API; depois execute o Expo Web:

```powershell
docker compose up --build -d postgres redis api

Set-Location web
npm ci
Copy-Item .env.example .env
npm start
```

O Expo mostra a URL local no terminal. O arquivo `web/.env` deve conter:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DOADOR_ID=1
```

Reinicie o Expo depois de alterar `.env`. Variáveis `EXPO_PUBLIC_` são visíveis no bundle; nunca armazene nelas senhas ou segredos.

## Build de produção

```powershell
npm run typecheck
npm run build:web
```

O bundle estático é gerado em `web/dist/`. Esse diretório é artefato de build e não deve ser incluído no ZIP acadêmico, pois pode ser recriado pelo comando acima.

## Verificação da execução Docker

Para validar:

```powershell
curl.exe -I http://localhost:8081/
curl.exe http://localhost:3000/
```

## Organização

- `src/screens`: telas;
- `src/navigation`: rotas e navegação;
- `src/components`: componentes reutilizáveis, incluindo versões específicas `.web.tsx`;
- `src/services`: integração HTTP com a API;
- `src/models` e `src/viewmodels`: fluxo MVVM;
- `src/context`: sessões por perfil;
- `Dockerfile` e `nginx.conf`: geração e publicação do bundle estático.
