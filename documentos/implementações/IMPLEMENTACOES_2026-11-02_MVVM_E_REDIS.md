# Implementações de 02/11/2026 — MVVM no React Native e Redis no Docker

**Data: 02/11/2026**

## Objetivo

Organizar os fluxos de agendamento e triagem do aplicativo React Native com o padrão MVVM e adicionar o Redis como cache de consultas sobre o PostgreSQL. O PostgreSQL continua sendo a fonte de verdade: nenhuma reserva, triagem, alteração de status ou mudança de capacidade depende de uma gravação no Redis para ser concluída.

## MVVM no React Native

Os fluxos de **Agendamento** e **Triagem** foram separados em três responsabilidades:

- **Model:** centraliza o acesso aos serviços HTTP e os contratos de dados usados pelo fluxo;
- **ViewModel:** concentra estado, validações, carregamento, envio e mensagens apresentadas pela tela;
- **View:** as telas TSX renderizam os dados do ViewModel e cuidam da navegação.

### Agendamento

- `ScheduleModel.ts` reúne as operações de hemocentros, vagas e agendamentos;
- `useScheduleViewModel.ts` controla seleção de hemocentro e vaga, carregamento, confirmação, erros e atualização das listas;
- `ScheduleScreen.tsx` ficou dedicada aos componentes visuais e à navegação para a triagem após a reserva.

### Triagem

- `TriageModel.ts` mantém as perguntas e o acesso ao endpoint de triagem;
- `useTriageViewModel.ts` controla respostas, validação do questionário, envio e resultado;
- `TriageScreen.tsx` renderiza o questionário e os estados de aprovação ou cancelamento.

Essa estrutura é compartilhada pelas execuções Android, iOS e web do Expo. Os artefatos `.js`, `.d.ts` e source maps mantidos pelo projeto também foram gerados novamente para evitar que o Metro ou o bundle web carreguem versões antigas das telas.

## Redis como camada do PostgreSQL

Foi adicionado o serviço `redis` ao `docker-compose.yml`, usando `redis:7.4-alpine`. O container possui limite de 128 MB e política `allkeys-lru`.

O Redis é intencionalmente descartável:

- não usa AOF nem snapshots;
- não possui volume persistente;
- as chaves expiram, por padrão, em 60 segundos;
- se o container for recriado, as consultas recompõem o cache a partir do PostgreSQL.

O tempo de expiração pode ser alterado por `REDIS_CACHE_TTL_SECONDS` no `.env.docker`. A porta publicada é `6380`, evitando conflito com uma instalação local na porta `6379`.

### Estratégia cache-aside

Nas consultas, a API procura a chave no Redis. Em caso de acerto, devolve o valor em cache. Em caso de ausência ou indisponibilidade, consulta o PostgreSQL e tenta guardar o resultado no Redis.

As operações de escrita seguem esta ordem:

1. validar a operação;
2. concluir a transação no PostgreSQL;
3. invalidar ou atualizar as chaves relacionadas no Redis;
4. devolver a resposta.

Uma falha de cache não desfaz uma alteração confirmada no PostgreSQL. O cliente Redis foi configurado sem fila offline, então a API passa diretamente ao banco quando o Redis está fora do ar.

### Dados armazenados no cache

- agendamentos de um doador;
- agendas filtradas de um hemocentro;
- vagas abertas e vagas disponíveis de um hemocentro;
- última triagem de um doador, somente com os campos gerais já permitidos pela API.

Exemplos de chaves:

```text
vitta:agendamentos:doador:1
vitta:agendamentos:hemocentro:2:todos:inicio:fim
vitta:vagas:hemocentro:2:disponiveis
vitta:triagens:doador:1:ultima
```

Reservas, cancelamentos, reprovação na triagem e mudanças de capacidade invalidam as vagas relacionadas. Criações e alterações de status também invalidam as agendas do doador e do hemocentro. A triagem continua atualizando o agendamento e liberando a vaga na mesma transação do PostgreSQL.

## Como executar tudo no Docker

Na raiz do projeto, crie o arquivo local de ambiente caso ainda não exista:

```powershell
Copy-Item .env.docker.example .env.docker
```

Construa as imagens e inicie PostgreSQL, Redis, API e frontend:

```powershell
docker compose --env-file .env.docker up --build -d
```

Também é possível usar os valores padrão:

```powershell
docker compose up --build -d
```

Confira os quatro serviços:

```powershell
docker compose ps
```

O esperado é `postgres`, `redis` e `api` como saudáveis e `frontend` em execução. Depois que os containers já existem, `docker compose stop` e `docker compose start` continuam válidos.

## Como diferenciar os serviços locais dos serviços Docker

O PostgreSQL instalado diretamente no computador e o PostgreSQL do Docker são instâncias diferentes. Neste projeto, as portas publicadas são:

| Serviço | Local | Docker |
|---|---:|---:|
| PostgreSQL | `localhost:5432` | `localhost:5433` |
| Redis | — | `localhost:6380` |

O arquivo `.env` da execução local aponta para o banco `ProjetoVitta`, usando o usuário `postgres` na porta `5432`. Já o `.env.docker.example` configura o banco isolado do Docker como `vitta`, usando o usuário `vitta` na porta `5433`. Essa separação é intencional: o Docker não deve acessar ou alterar automaticamente o banco instalado localmente.

Se o pgAdmin estiver conectado à porta `5432`, ele está mostrando o PostgreSQL local. Para acessar o PostgreSQL do Docker pelo pgAdmin, crie uma nova conexão com:

- Host: `localhost`;
- Port: `5433`;
- Database: `vitta`;
- Username: `vitta`;
- Password: o valor de `POSTGRES_PASSWORD` do `.env.docker`.

### Passo a passo no pgAdmin para o banco Docker

1. Clique com o botão direito em `Servers`.
2. Escolha `Register` e depois `Server`.
3. Na aba `General`, informe um nome como `Vitta Docker`.
4. Na aba `Connection`, preencha:

   ```text
   Host name/address: localhost
   Port: 5433
   Maintenance database: vitta
   Username: vitta
   Password: vitta_dev
   ```

5. Deixe `Kerberos authentication` desligado.
6. Ative `Save password`, se quiser que o pgAdmin memorize a senha.
7. Deixe `Role` e `Service` vazios. Se a tela exigir um valor para `Role`, use `vitta`.
8. Clique em `Save`.

O campo `Username` é o usuário usado para autenticar no PostgreSQL. O campo `Role` não substitui o `Username`; ele serve para aplicar um `SET ROLE` depois da autenticação e normalmente fica vazio. Se `Username` estiver como `postgres` ao conectar na porta `5433`, aparecerá erro de autenticação, mesmo que `postgres` funcione na sua instalação local.

Para o banco local, use outro registro no pgAdmin:

- Host: `localhost`;
- Port: `5432`;
- Maintenance database: `ProjetoVitta`;
- Role: `postgres`;
- Password: a senha definida no `.env` local.

Não use `postgres`/`ProjetoVitta` na conexão da porta `5433`. Na instância Docker validada, os valores ativos são `vitta`/`vitta`.

O Redis não aparece no pgAdmin, pois ele não é PostgreSQL. Para confirmar os serviços Docker diretamente:

```powershell
docker compose ps
docker compose exec postgres pg_isready -U vitta -d vitta
```

As respostas esperadas são `accepting connections` para o PostgreSQL e `PONG` para o Redis. Também é possível confirmar as portas publicadas no Windows:

```powershell
Test-NetConnection localhost -Port 5433
Test-NetConnection localhost -Port 6380
```

Para verificar pela API, consulte:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

O campo `postgres` identifica o banco como fonte de verdade e o campo `redis` informa se a camada de cache está disponível. Se os containers ainda não existirem, use o comando de inicialização geral descrito anteriormente; `docker compose start` só inicia containers que já foram criados.

## Arquivos principais criados

- `src/cache/RedisCache.ts`;
- `src/cache/CacheKeys.ts`;
- `frontend/src/models/ScheduleModel.ts`;
- `frontend/src/models/TriageModel.ts`;
- `frontend/src/viewmodels/useScheduleViewModel.ts`;
- `frontend/src/viewmodels/useTriageViewModel.ts`.

## Arquivos principais alterados

- `docker-compose.yml` e `.env.docker.example`;
- `package.json` e `package-lock.json`;
- `src/index.ts`;
- `src/repository/AgendamentoRepository.ts`;
- `src/repository/TriagemRepository.ts`;
- `src/service/VagaService.ts`;
- `frontend/src/screens/ScheduleScreen.tsx`;
- `frontend/src/screens/TriageScreen.tsx`;
- artefatos JavaScript, declarações e source maps correspondentes.

## Validações realizadas

- build TypeScript da API: passou;
- typecheck do frontend: passou;
- testes unitários: 3 testes passaram;
- validação do Docker Compose: passou;
- imagem da API: construída com sucesso;
- bundle web do Expo e imagem do frontend: construídos com sucesso;
- containers PostgreSQL, Redis e API: saudáveis;
- endpoint `/health`: confirmou API e Redis disponíveis;
- consulta pública de vagas: criou uma chave `vitta:vagas:hemocentro:<id>:disponiveis` no Redis;
- fallback testado com o Redis parado: a API iniciou, a consulta de vagas continuou respondendo pelo PostgreSQL e o Redis reconectou após ser iniciado novamente;
- frontend servido pelo container: respondeu HTTP 200 em `http://localhost:8081`.
