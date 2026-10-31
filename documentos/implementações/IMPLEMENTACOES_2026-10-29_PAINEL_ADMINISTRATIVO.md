# Implementações do painel administrativo — 29/10/2026

**Data: 29/10/2026**

## Objetivo

Implementar uma área administrativa para analisar cadastros de hemocentros, gerenciar instituições aprovadas, controlar estoque de sangue, administrar horários de doação e registrar o comparecimento dos doadores.

O trabalho também ajustou o fluxo de cadastro do hemocentro: o envio do formulário não libera mais o acesso de imediato. O cadastro é salvo como solicitação pendente e passa a depender da decisão de um administrador.


## Acesso do administrador

Na tela inicial, escolha **Acesso do administrador**. O seed cria `admin@vitta.local` com a senha inicial `VittaAdmin@2026`, definida em `prisma/seed.ts`. Configure `ADMIN_SEED_PASSWORD` em `.env.docker` antes da primeira execução para substituí-la. O seed não altera a senha de um administrador já existente.

O cadastro de hemocentro envia uma solicitação pendente. O administrador aceita ou recusa no primeiro item do menu horizontal. O hemocentro consulta a decisão ao tentar entrar: a aprovação libera o portal; a recusa é mostrada na tela. Os demais itens do menu permitem editar/excluir hemocentros, movimentar estoque, abrir horários, alterar capacidade e registrar comparecimento ou ausência. A exclusão é lógica: remove o hemocentro da busca pública e bloqueia seu acesso, preservando o histórico de doações; o administrador pode reativá-lo.

## Fluxo de aprovação do hemocentro

```text
Hemocentro envia formulário de cadastro
        |
        v
POST /hemocentros/cadastro
        |
        v
Hemocentro, conta e oito estoques são salvos com status PENDENTE
        |
        v
Administrador consulta as solicitações e aprova ou recusa
        |
        +--> APROVADO: o hemocentro pode entrar e operar o portal
        |
        +--> RECUSADO: a tela de login informa a recusa
```

### Estados do hemocentro

O campo `Hemocentro.status` foi incluído no Prisma com quatro estados utilizados pela aplicação:

- `PENDENTE`: formulário enviado e aguardando análise;
- `APROVADO`: instituição visível ao público e com acesso ao portal;
- `RECUSADO`: solicitação negada;
- `DESATIVADO`: exclusão lógica feita pelo administrador.

Também foi adicionado `decididoEm`, que registra a data da aprovação ou recusa.

O cadastro cria, em uma única operação Prisma:

- o hemocentro com status `PENDENTE`;
- a conta associada em `HemocentroConta`, com senha armazenada por hash `scrypt`;
- os oito registros iniciais de estoque, todos com quantidade zero.

O login do hemocentro agora retorna mensagens conforme o estado da solicitação. Um token só é emitido para hemocentros aprovados. O middleware do hemocentro também consulta o status no banco a cada acesso protegido, portanto uma instituição desativada perde o acesso imediatamente.

## Administrador e autenticação

Foi criado o modelo `Administrador` no Prisma, contendo e-mail único e hash de senha. A autenticação usa token assinado com validade de 12 horas, separado do token de doador e do token de hemocentro.

O seed cria o administrador inicial:

```text
E-mail: admin@vitta.local
Senha padrão: VittaAdmin@2026
```

A senha pode ser alterada antes da primeira execução por meio da variável `ADMIN_SEED_PASSWORD`. O seed não substitui a senha de um administrador que já exista.

O Docker Compose recebeu essa variável no serviço da API e o arquivo `.env.docker.example` passou a documentá-la.

## Rotas administrativas

Todas as rotas abaixo, exceto o login, exigem `Authorization: Bearer <token-do-administrador>`.

| Método e rota | Finalidade |
| --- | --- |
| `POST /admin/login` | Autentica o administrador. |
| `GET /admin/solicitacoes` | Lista hemocentros com status `PENDENTE`. |
| `PATCH /admin/solicitacoes/:id` | Aprova ou recusa uma solicitação. |
| `GET /admin/hemocentros` | Lista hemocentros aprovados e desativados. |
| `PUT /admin/hemocentros/:id` | Altera nome, endereço, latitude e longitude. |
| `PATCH /admin/hemocentros/:id/status` | Reativa ou desativa um hemocentro. |
| `DELETE /admin/hemocentros/:id` | Faz exclusão lógica, alterando o status para `DESATIVADO`. |
| `GET /admin/hemocentros/:id/estoque` | Consulta o estoque do hemocentro selecionado. |
| `POST /admin/hemocentros/:id/estoque/movimentacoes` | Registra entrada ou baixa de bolsas. |
| `GET /admin/hemocentros/:id/vagas` | Lista horários de doação abertos. |
| `POST /admin/hemocentros/:id/vagas` | Abre um horário com data, hora e capacidade. |
| `PATCH /admin/hemocentros/:id/vagas/:vagaId` | Altera a capacidade de uma vaga. |
| `GET /admin/hemocentros/:id/agendamentos` | Lista os agendamentos do hemocentro. |
| `PATCH /admin/hemocentros/:id/agendamentos/:agendamentoId/status` | Atualiza o status do agendamento. |

O administrador usa as mesmas regras de estoque, vagas e transições de agendamento já utilizadas pelo portal do hemocentro. A operação só é permitida para instituições com status `APROVADO`.

## Exclusão lógica e visibilidade pública

A exclusão de um hemocentro não apaga agendamentos, estoque ou movimentações. Ela define o status como `DESATIVADO`, preservando o histórico do sistema.

Consequências da desativação:

- o hemocentro deixa de aparecer em `GET /hemocentros`;
- vagas do hemocentro deixam de aparecer para os doadores;
- o token já emitido deixa de acessar as rotas protegidas;
- o administrador pode reativar a instituição posteriormente.

As consultas públicas em `HemocentroRepository` e em `VagaService` foram ajustadas para considerar somente hemocentros aprovados.

## Horários e comparecimento

Foi incluído o estado `NAO_COMPARECEU` para os agendamentos. A nova transição permitida é:

```text
CONFIRMADO -> REALIZADO, CANCELADO ou NAO_COMPARECEU
```

O painel administrativo permite confirmar o agendamento e, depois, registrar que o doador compareceu ou não compareceu. Apenas `REALIZADO` concede os pontos de doação; ausências não alteram a pontuação do doador.

## Interface administrativa

Foi criada a tela `AdminScreens.tsx` e o acesso foi incluído na tela inicial do aplicativo. O administrador entra com e-mail e senha e acessa um menu horizontal com os três caminhos solicitados:

1. **Requisições de hemocentro**: exibe os dados do formulário enviado e permite aceitar ou recusar.
2. **Hemocentros**: permite escolher uma instituição, editar informações, excluir logicamente, reativar e movimentar o estoque.
3. **Horários e comparecimento**: permite abrir ou editar vagas, consultar agendamentos e registrar presença ou ausência.

Para movimentar o estoque no painel administrativo, a seleção de tipo sanguíneo foi deixada explícita dentro do formulário, com as opções A+, A-, B+, B-, AB+, AB-, O+ e O-. A movimentação exige tipo sanguíneo, entrada ou baixa, quantidade inteira e motivo.

## Ajustes no formulário de cadastro do hemocentro

O formulário agora:

- exibe que o cadastro enviado será analisado pelo administrador;
- mostra a mensagem de solicitação enviada após a persistência;
- orienta sobre o formato de e-mail esperado;
- valida o e-mail no frontend antes de chamar a API.

O e-mail deve ter domínio, por exemplo `contato@hemocentro.org`. Um valor como `teste2@contatoSantaLuzia` é rejeitado corretamente por não possuir a parte final do domínio, como `.com` ou `.org`.

Na tela de login, o hemocentro recebe uma mensagem quando a solicitação está pendente, foi recusada ou foi aprovada.

## PostgreSQL local e Docker

O PostgreSQL usado pela aplicação Docker é diferente de uma instalação local do PostgreSQL:

| Ambiente | Host | Porta | Banco | Usuário |
| --- | --- | --- | --- | --- |
| PostgreSQL local | `localhost` | `5432` | varia conforme a instalação | varia conforme a instalação |
| PostgreSQL do VITTA no Docker | `localhost` | `5433` | `vitta` | `vitta` |

A senha padrão do banco Docker é `vitta_dev`. No pgAdmin, deve ser registrado um servidor separado usando a porta `5433` para visualizar os dados criados pela aplicação.

As tabelas Prisma usam nomes com maiúsculas. Uma consulta manual no pgAdmin deve usar aspas, por exemplo:

```sql
SELECT * FROM "Hemocentro";
```

## Arquivos criados

- `src/service/AdministradorAuthService.ts`;
- `src/service/AdministradorService.ts`;
- `src/middleware/autenticarAdmin.ts`;
- `src/routes/AdministradorRoutes.ts`;
- `frontend/src/services/adminApi.ts`;
- `frontend/src/screens/AdminScreens.tsx`.

## Arquivos alterados

- `.env.docker.example`;
- `README.md`;
- `docker-compose.yml`;
- `prisma/schema.prisma`;
- `prisma/seed.ts`;
- `src/index.ts`;
- `src/dto/AgendamentoDTO.ts`;
- `src/middleware/autenticarHemocentro.ts`;
- `src/repository/HemocentroRepository.ts`;
- `src/service/HemocentroAuthService.ts`;
- `src/service/HemocentroService.ts`;
- `src/service/VagaService.ts`;
- `frontend/src/navigation/RootNavigator.tsx`;
- `frontend/src/screens/HemocentroScreens.tsx`;
- `frontend/src/services/hemocentroApi.ts`;
- `frontend/src/types/hemocentro.ts`;
- `frontend/src/types/navigation.ts`;
- `tests/hemocentro.e2e.ts`.

## Validações realizadas

- `npx prisma generate`: passou;
- `npm run build`: passou;
- `npm run typecheck` no frontend: passou;
- `npm test`: passou;
- `npm run test:e2e`: passou com API e PostgreSQL do Docker;
- build web do frontend: passou;
- containers `postgres`, `api` e `frontend` foram iniciados e verificados, com PostgreSQL e API saudáveis;
- o teste integrado validou solicitação pendente, aprovação, recusa, login, estoque, vagas, comparecimento, ausência, exclusão lógica e reativação.

## Limites atuais

- O administrador inicial é voltado ao ambiente local de demonstração. Antes de qualquer implantação compartilhada, a senha padrão deve ser trocada usando `ADMIN_SEED_PASSWORD`.
- A sessão de administrador, como as demais sessões do aplicativo, permanece em memória e exige novo login após recarregar o frontend.
- A decisão de aprovação é informada ao hemocentro na tela de login. O sistema ainda não envia e-mail ou notificação externa.

## Atualizações da sessão de 31/10/2026 — Triagem vinculada ao agendamento

**Data: 31/10/2026**

O fluxo de agendamento passou a exigir a triagem do doador antes da confirmação do horário. A reserva continua sendo feita no momento do agendamento, mas permanece com o status `AGUARDANDO_TRIAGEM` até que o questionário seja concluído.

### Fluxo da triagem

```text
Doador escolhe uma vaga
        |
        v
Agendamento criado como AGUARDANDO_TRIAGEM
        |
        v
Doador responde à triagem
        |
        +--> APTO: status muda para AGENDADO
        |
        +--> INAPTO: status muda para CANCELADO e a vaga é liberada
```

Quando a triagem reprova o doador, o sistema salva o resultado, cancela o agendamento e diminui a quantidade de reservas da vaga na mesma transação do PostgreSQL. O doador recebe o aviso: “Sua triagem não foi aprovada. O agendamento foi cancelado e a vaga foi liberada.”

### Alterações no backend

- `Agendamento.status` passou a iniciar como `AGUARDANDO_TRIAGEM`;
- `Triagem` recebeu o vínculo opcional `agendamentoId`;
- o endpoint de triagem aceita o identificador do agendamento;
- o repository valida que o agendamento pertence ao doador e ainda aguarda triagem;
- uma nova triagem não pode ser feita para um agendamento já processado;
- o hemocentro não pode confirmar um agendamento que ainda aguarda triagem;
- o retorno da API informa se o agendamento foi cancelado;
- a mensagem de criação informa que o horário foi reservado e que a triagem deve ser concluída;
- o adaptador PostgreSQL passou a respeitar o parâmetro `schema` da `DATABASE_URL`, permitindo separar corretamente bancos ou schemas locais e de teste.

### Alterações no frontend

Após criar um agendamento, o aplicativo abre automaticamente a tela de triagem e envia o `agendamentoId`. Se o doador sair antes de responder, o agendamento aparece como `AGUARDANDO TRIAGEM` e oferece o botão **FAZER TRIAGEM** para retomar o fluxo.

Na tela de resultado:

- a aprovação informa que o agendamento foi confirmado;
- a reprovação informa que o agendamento foi cancelado e a vaga liberada;
- o botão de retorno leva o doador para a lista de agendamentos;
- a triagem independente, acessada pela tela inicial, continua disponível.

### Arquivos alterados nesta sessão

- `prisma/schema.prisma`;
- `src/config/prisma.ts`;
- `src/controller/AgendamentoController.ts`;
- `src/controller/TriagemController.ts`;
- `src/dto/AgendamentoDTO.ts`;
- `src/dto/TriagemDTO.ts`;
- `src/repository/AgendamentoRepository.ts`;
- `src/repository/TriagemRepository.ts`;
- `src/service/HemocentroService.ts`;
- `src/service/TriagemService.ts`;
- `frontend/src/screens/ScheduleScreen.tsx`;
- `frontend/src/screens/TriageScreen.tsx`;
- `frontend/src/services/agendamentoApi.ts`;
- `frontend/src/services/triageApi.ts`;
- `frontend/src/types/hemocentro.ts`;
- `frontend/src/types/navigation.ts`;
- `frontend/src/types/triage.ts`;
- `tests/hemocentro.e2e.ts`.

### Validações realizadas nesta sessão

- `npx prisma generate`: passou;
- `npm run build`: passou;
- `npm run typecheck` no frontend: passou;
- `npm test`: passou;
- teste E2E passou com triagem aprovada, triagem reprovada, devolução da vaga, bloqueio de confirmação antes da triagem e bloqueio de uma segunda triagem para o mesmo agendamento;
- o schema isolado de PostgreSQL foi criado, validado e removido após os testes.
