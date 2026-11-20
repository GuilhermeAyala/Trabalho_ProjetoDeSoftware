# Mudanças de 09/10/2026 — Dockerização e execução integrada

## Objetivo

Permitir que o VITTA seja executado como uma aplicação completa, com front-end, API e PostgreSQL iniciados em conjunto pelo Docker Compose. Antes dessas mudanças, a execução dependia de iniciar os serviços localmente e configurar um PostgreSQL externo.

## Alterações realizadas

| Área | Alteração | Efeito |
| --- | --- | --- |
| Orquestração | Adicionado `docker-compose.yml` com os serviços `postgres`, `api` e `frontend`. | Um único comando sobe a aplicação completa. |
| Banco | PostgreSQL 17 Alpine com volume nomeado `vitta_postgres_data`. | Os dados persistem após `docker compose down`. A porta externa padrão é `5433`. |
| API | Adicionado `Dockerfile` baseado em Node 22 Alpine. | Instala dependências com `npm ci`, gera o Prisma Client, compila TypeScript e inicia em produção. |
| API e banco | Configurado `DATABASE_URL` interna com o host `postgres` e dependência condicionada ao healthcheck do banco. | A API só inicia quando o PostgreSQL está pronto. |
| Schema e dados iniciais | Adicionado `prisma/seed.ts` e o script `db:seed`. | Na primeira subida, o schema é sincronizado e é criado um doador fictício de demonstração de forma idempotente. |
| Front-end | Adicionados `frontend/Dockerfile` e `frontend/nginx.conf`. | O Expo exporta a versão web durante o build; o Nginx serve o bundle estático na porta `8081`. |
| Configuração | Adicionado `.env.docker.example` e incluído `.env.docker` no `.gitignore`. | Cada máquina pode manter portas, credenciais locais e URL da API sem enviar esses valores ao Git. |
| Contexto de build | Adicionados `.dockerignore` na raiz e em `frontend/`. | Arquivos desnecessários, dependências locais e segredos não são enviados às imagens. |
| Documentação | Atualizado `README.md`. | Há instruções para primeira execução, reexecução, logs, testes, equipe e rede local. |
| Serviço do doador | Removido o método vazio `realizarTriagem` de `DoadorService`. | Não há alteração de comportamento: o método não possuía implementação nem era utilizado. |

## Arquitetura no Compose

```text
Navegador -> frontend (Nginx, porta 8081)
                    |
                    -> API Express (porta 3000)
                              |
                              -> PostgreSQL 17 (porta externa 5433)
```

Dentro da rede Docker, a API acessa o banco pelo hostname `postgres` na porta `5432`. Fora dos containers, o banco é publicado como `localhost:5433`, evitando conflito com um PostgreSQL local que use a porta padrão `5432`.

## Como executar

Na primeira vez, na raiz do repositório:

```powershell
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build --detach --wait
```

O primeiro comando é obrigatório porque `.env.docker` não é versionado. Sem ele, o Compose exibirá `couldn't find env file`.

Em execuções posteriores:

```powershell
docker compose --env-file .env.docker up --detach --wait
```

Para encerrar e preservar os dados:

```powershell
docker compose --env-file .env.docker down
```

Use `docker compose --env-file .env.docker down -v` somente quando desejar apagar o volume e reinicializar o banco de dados.

## Validação realizada em 09/10/2026

- Docker CLI `29.8.2`, Docker Compose `v5.5.1` e Docker Desktop/WSL foram verificados;
- a configuração do Compose foi validada com `docker compose config --quiet`;
- as imagens da API e do front-end foram construídas com sucesso;
- `docker compose up --detach --wait` deixou `postgres` e `api` saudáveis e o `frontend` em execução;
- `GET http://localhost:3000/` retornou `200` com `API rodando`;
- `GET http://localhost:8081/` retornou `200` e o HTML da aplicação;
- o preflight CORS de `OPTIONS /triagens` retornou `204` com `Access-Control-Allow-Origin: *`;
- `pg_isready` confirmou o PostgreSQL disponível e o schema público possuía cinco tabelas;
- `GET /doadores` retornou `200` e o doador de demonstração criado pelo seed.

## Observações e limitações

- Não é necessário rodar `npm run` manualmente para executar a aplicação completa: esses comandos são usados dentro dos containers durante build e inicialização. Eles continuam úteis apenas para desenvolvimento isolado.
- `EXPO_PUBLIC_API_URL` é incorporada ao bundle do front-end no momento do build. Para acesso por outro dispositivo na mesma rede, altere essa variável em `.env.docker` para `http://SEU_IPV4:3000` e execute o comando com `--build` novamente.
- Cada integrante que executar o Compose localmente terá um volume de banco independente. Para dados compartilhados ou acesso pela internet é necessário publicar API e banco em uma infraestrutura central.
- O fluxo usa `prisma db push`, adequado ao ambiente acadêmico e ao banco Docker local. Em produção, a evolução do schema deve usar migrações versionadas.
- Os builds do npm relataram vulnerabilidades transitivas. Elas não impediram a execução validada, mas devem ser avaliadas antes de uma publicação em produção.

## Organização da documentação

O conteúdo de Docker que havia sido acrescentado a `INTEGRACAO_AXIOS_TRIAGEM_PERFIL.md` foi movido para este arquivo. O documento de integração permanece restrito aos fluxos de Axios, triagem e perfil; o `README.md` permanece como guia rápido de uso do projeto.
