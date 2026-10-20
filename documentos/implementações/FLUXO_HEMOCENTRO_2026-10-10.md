# Fluxo do hemocentro — 10/10/2026 / 18/10/2026

## Objetivo

Implementar o domínio do hemocentro de acordo com os diagramas do projeto e com os relacionamentos definidos no Prisma. O fluxo permite:

- listar hemocentros por proximidade do usuário;
- criar um agendamento para um hemocentro escolhido;
- permitir que cada hemocentro liste e consulte somente seus agendamentos;
- permitir que o hemocentro controle o status dos seus agendamentos;
- impedir que um hemocentro consulte ou altere um agendamento pertencente a outro.

## Modelos Prisma envolvidos

### Hemocentro

O modelo existente possui:

- `id`: identificador do hemocentro;
- `nome`: nome apresentado ao usuário;
- `endereco`: endereço exibido no resultado da busca;
- `latitude` e `longitude`: coordenadas usadas no cálculo de proximidade;
- `agendamento`: relação de um hemocentro para vários agendamentos;
- `estoque`: relação de um hemocentro para seus registros de estoque.

### Agendamento

O modelo existente possui:

- `id`: identificador do agendamento;
- `data` e `horario`: momento previsto da doação;
- `status`: estado atual, iniciado como `AGENDADO`;
- `criadoEm`: data de criação do registro;
- `doadorId`: identifica o doador;
- `hemocentroId`: identifica o hemocentro proprietário;
- `doador` e `hemocentro`: relações Prisma correspondentes.

O campo decisivo para o isolamento é `Agendamento.hemocentroId`. Todas as consultas e alterações feitas pelo fluxo do hemocentro incluem esse campo no filtro do Prisma.

## Fluxo completo

```text
Doador informa localização
        |
        v
GET /hemocentros?latitude=...&longitude=...
        |
        v
HemocentroService calcula a distância e ordena do mais próximo ao mais distante
        |
        v
Doador escolhe um hemocentro e envia POST /agendamentos
        |
        v
Agendamento é salvo com doadorId + hemocentroId
        |
        v
Hemocentro consulta /hemocentros/:hemocentroId/agendamentos
        |
        v
Repository aplica where: { hemocentroId }
        |
        v
Somente agendamentos desse hemocentro são devolvidos
```

## Listagem por proximidade

Rota:

```http
GET /hemocentros?latitude=-15.7800&longitude=-47.9300
```

O controller exige latitude e longitude juntas. O service valida os intervalos aceitos e calcula a distância com a fórmula de Haversine. A resposta contém `distanciaKm` e é ordenada do menor para o maior valor.

Exemplo simplificado:

```json
[
  {
    "id": 1,
    "nome": "Hemocentro Central",
    "endereco": "Setor Médico Hospitalar Norte, Brasília - DF",
    "latitude": -15.77972,
    "longitude": -47.92972,
    "distanciaKm": 0.04
  },
  {
    "id": 2,
    "nome": "Hemocentro Asa Sul",
    "endereco": "Asa Sul, Brasília - DF",
    "latitude": -15.82343,
    "longitude": -47.92549,
    "distanciaKm": 4.85
  }
]
```

Sem coordenadas, `GET /hemocentros` continua disponível e retorna os hemocentros em ordem alfabética.

## Recebimento de agendamentos

O doador agenda a doação pela rota já existente:

```http
POST /agendamentos
Content-Type: application/json
```

```json
{
  "doadorId": 1,
  "hemocentroId": 2,
  "data": "2026-11-10",
  "horario": "13:30"
}
```

Antes de salvar, o service:

1. valida os IDs;
2. valida os formatos `YYYY-MM-DD` e `HH:mm`;
3. impede agendamentos no passado;
4. confirma que doador e hemocentro existem;
5. impede a duplicação do mesmo horário para o mesmo doador e hemocentro;
6. salva o registro com `hemocentroId`.

A partir desse momento, o agendamento pertence ao domínio do hemocentro escolhido.

## Consulta dos agendamentos do hemocentro

### Listar

```http
GET /hemocentros/:hemocentroId/agendamentos
```

Filtros opcionais:

```http
GET /hemocentros/2/agendamentos?status=AGENDADO&dataInicio=2026-11-01&dataFim=2026-11-30
```

As datas usam `YYYY-MM-DD`. A data inicial não pode ser posterior à final.

### Consultar um agendamento

```http
GET /hemocentros/:hemocentroId/agendamentos/:agendamentoId
```

O repository não pesquisa somente por `agendamentoId`. A consulta usa os dois identificadores:

```ts
where: {
  id: agendamentoId,
  hemocentroId,
}
```

Se o agendamento `10` pertencer ao hemocentro `2`:

- `GET /hemocentros/2/agendamentos/10` retorna `200`;
- `GET /hemocentros/1/agendamentos/10` retorna `404`;
- a resposta `404` não informa se o registro existe em outro hemocentro.

Os dados públicos do doador retornados ao hemocentro são limitados a `id`, `nome`, `email` e `tipoSanguineo`. CPF, senha, nascimento e respostas da pré-triagem não são selecionados.

## Controle de status

Rota:

```http
PATCH /hemocentros/:hemocentroId/agendamentos/:agendamentoId/status
Content-Type: application/json
```

```json
{
  "status": "CONFIRMADO"
}
```

Estados aceitos:

- `AGENDADO`;
- `CONFIRMADO`;
- `REALIZADO`;
- `CANCELADO`.

Transições permitidas:

```text
AGENDADO   -> CONFIRMADO ou CANCELADO
CONFIRMADO -> REALIZADO ou CANCELADO
REALIZADO  -> estado final
CANCELADO  -> estado final
```

A atualização usa `updateMany` com `id` e `hemocentroId`. Dessa forma, uma tentativa do hemocentro `1` de alterar um agendamento do hemocentro `2` não modifica nenhuma linha e retorna `404`.

Marcar um agendamento como `REALIZADO` ainda não concede pontos automaticamente. O fluxo atual de pontuação permanece separado e deverá ser integrado ao agendamento em uma evolução futura, preferencialmente dentro de uma transação para evitar pontuação duplicada.

## Camadas e responsabilidades

### HemocentroRoutes

Expõe as rotas HTTP e mantém as rotas mais específicas antes de `/:id`.

### HemocentroController

Converte parâmetros HTTP, valida formatos básicos, chama o service e transforma resultados em respostas `200`, `400` ou `404`.

### HemocentroService

Concentra regras de negócio: existência do hemocentro, validação do período, status aceitos, transições de status e cálculo de proximidade.

### AgendamentoRepository

Executa as consultas Prisma. É a última barreira de isolamento porque sempre adiciona `hemocentroId` ao `where` usado pela visão do hemocentro.

## Dados de demonstração

O seed passou a garantir dois hemocentros fictícios, sem duplicá-los em execuções posteriores:

- Hemocentro Central;
- Hemocentro Asa Sul.

Esses registros permitem testar ordenação por proximidade e isolamento entre hemocentros logo após iniciar o Compose.

## Validações realizadas em 10/10/2026

- compilação TypeScript do backend;
- build da imagem Docker da API;
- inicialização saudável de API e PostgreSQL;
- listagem de dois hemocentros ordenados por distância;
- criação de agendamento para o segundo hemocentro;
- consulta pelo hemocentro proprietário retornando `200`;
- consulta do mesmo agendamento pelo outro hemocentro retornando `404`;
- listagem do proprietário contendo o agendamento;
- listagem do outro hemocentro não contendo o agendamento;
- alteração para `CONFIRMADO` pelo proprietário;
- tentativa de alteração pelo outro hemocentro retornando `404`;
- remoção do agendamento fictício após o teste.

## Limitação de autenticação

O isolamento de dados por domínio está implementado no repository, mas o projeto ainda não possui autenticação de hemocentro. Atualmente o `hemocentroId` vem da URL. Em uma versão autenticada, esse ID deve vir da sessão ou token do usuário administrativo, e não de um valor controlado pelo cliente.

A tela `BloodCentersScreen` também continua usando dados mockados. A API de proximidade e de agendamento está pronta para integração, mas obter a localização real do dispositivo e substituir os mocks no frontend ficou fora deste fluxo de backend.

O desenho futuro recomendado é:

```text
Token autenticado -> middleware identifica hemocentroId
                  -> service recebe o id autenticado
                  -> repository filtra pelo mesmo hemocentroId
```

Assim, além de impedir consultas cruzadas, a API também impedirá que alguém finja ser outro hemocentro apenas alterando a URL.

## Arquivos de código alterados

- `src/dto/AgendamentoDTO.ts`;
- `src/repository/AgendamentoRepository.ts`;
- `src/service/HemocentroService.ts`;
- `src/controller/HemocentroController.ts`;
- `src/routes/HemocentroRoutes.ts`;
- `src/index.ts`;
- `prisma/seed.ts`.

Nenhum documento anterior em `documentos/implementações` foi modificado por esta implementação.

# Parte II — Implementação de 18/10/2026

Esta seção registra a implementação realizada em 18/10. O conteúdo acima documenta o estado de 10/10 e foi preservado como histórico. As limitações antigas sobre autenticação, tela mockada, vagas, estoque e pontos devem ser lidas em conjunto com as atualizações abaixo.

## Separação dos acessos

- A primeira tela do aplicativo agora pergunta se o acesso é de **doador** ou de **hemocentro**. O fluxo de cadastro do doador continua em `SignUp`; o hemocentro usa `HemocentroSignUp`, `HemocentroLogin` e uma navegação própria com Agenda, Vagas, Estoque e Perfil.
- O cadastro de hemocentro solicita nome, endereço, latitude, longitude, e-mail e senha. Nome, endereço e coordenadas seguem o modelo `Hemocentro` do Prisma. E-mail e hash da senha ficam no novo modelo `HemocentroConta`, separado dos dados do doador.
- As coordenadas são digitadas pelo responsável. Não há geocodificação automática: essa escolha evita depender de serviço externo e permite corrigir manualmente a posição no cadastro. O formulário aceita vírgula decimal e a API valida os intervalos de latitude e longitude.
- A senha é armazenada com `scrypt` e salt aleatório; não é devolvida pelas rotas. O login emite um token assinado com prazo de 12 horas. A chave `HEMOCENTRO_AUTH_SECRET` deve ter pelo menos 32 caracteres. O Compose define um valor apenas para desenvolvimento; em outro ambiente deve ser fornecida uma chave própria.
- A sessão do hemocentro fica em memória no aplicativo. Ao recarregar, é necessário entrar novamente. Ainda não existem recuperação de senha, revogação de tokens ou cadastro verificado de instituições.

## Rotas de cadastro e área autenticada

| Método e rota | Finalidade |
| --- | --- |
| `POST /hemocentros/cadastro` | Cria o hemocentro, sua conta e oito estoques inicialmente zerados. |
| `POST /hemocentros/login` | Valida e-mail/senha e devolve token e dados públicos do hemocentro. |
| `GET /hemocentros/me` | Consulta o perfil identificado pelo token. |
| `GET /hemocentros/me/agendamentos` | Lista somente os agendamentos do hemocentro autenticado. |
| `GET /hemocentros/me/agendamentos/:agendamentoId` | Consulta um agendamento da própria instituição. |
| `PATCH /hemocentros/me/agendamentos/:agendamentoId/status` | Altera o status conforme as transições já definidas. |
| `GET /hemocentros/me/vagas` | Lista horários abertos pela instituição. |
| `POST /hemocentros/me/vagas` | Abre horário com data, hora e capacidade. |
| `PATCH /hemocentros/me/vagas/:vagaId` | Altera a capacidade, sem reduzi-la abaixo das reservas. |
| `GET /hemocentros/me/estoque` | Consulta os oito tipos sanguíneos, quantidades e níveis. |
| `GET /hemocentros/me/estoque/movimentacoes` | Consulta as últimas 50 entradas e baixas. |
| `POST /hemocentros/me/estoque/movimentacoes` | Registra entrada ou baixa de bolsas com quantidade e motivo. |
| `GET /hemocentros/:id/vagas` | Expõe ao doador apenas horários futuros com vagas livres. |

Todas as rotas `/me` exigem `Authorization: Bearer <token>`. As rotas antigas `/:hemocentroId/agendamentos...` também exigem token e recusam quando o ID da URL difere do ID autenticado. O ID usado nas operações da área própria vem da sessão, não do cliente. A listagem pública de hemocentros continua aberta para o doador.

## Vagas, agendamentos e pontos

- O novo modelo `Vaga` pertence ao hemocentro e registra data, horário, capacidade e número de reservas. O par hemocentro/data/horário é único.
- Um novo agendamento exige uma vaga aberta para o mesmo hemocentro, data e horário. A reserva da vaga e a criação do agendamento ocorrem na mesma transação. Uma atualização condicional impede que duas requisições ocupem a última vaga ao mesmo tempo.
- `Agendamento.vagaId` é opcional para manter compatibilidade com registros anteriores; o fluxo novo sempre preenche esse campo. O cancelamento devolve a reserva da vaga na mesma transação da troca de status.
- Quando o hemocentro altera `CONFIRMADO` para `REALIZADO`, a mesma transação acrescenta 50 pontos ao doador. A condição sobre o status anterior impede pontuação duplicada por repetição da requisição.
- A rota antiga `POST /doadores/:id/doacoes/confirmar`, que atribuía pontos apenas pelo ID do doador, foi retirada. A confirmação agora faz parte do agendamento operado pelo hemocentro.
- O aplicativo do doador passou a consultar hemocentros e horários reais, criar agendamento em vaga aberta e listar seus agendamentos pela API. Isso é a fronteira de integração entre as duas áreas: as telas e credenciais do hemocentro permanecem independentes.

## Estoque de sangue

- `Estoque` agora possui `quantidade` de bolsas e unicidade por hemocentro/tipo sanguíneo. O cadastro cria A+, A-, B+, B-, AB+, AB-, O+ e O- com quantidade zero.
- A área do hemocentro mostra as oito quantidades, permite selecionar o tipo sanguíneo, informar uma **entrada** ou **baixa**, a quantidade inteira e um motivo. Baixas acima do saldo são rejeitadas.
- Cada alteração registra uma `MovimentacaoEstoque` com tipo, quantidade, motivo e data. Quantidade e histórico são gravados atomicamente e filtrados pelo hemocentro autenticado.
- O nível é calculado pelo número de bolsas: `ESGOTADO` = 0; `CRITICO` = 1 a 5; `BAIXO` = 6 a 15; `ADEQUADO` = 16 ou mais. Esses limites são regras do protótipo e precisam de validação clínica/operacional antes de uso real.

## Interface e arquivos principais

A área do hemocentro reutiliza a paleta, tipografia, campos e botões da experiência do doador. Os pontos principais estão em `frontend/src/screens/HemocentroScreens.tsx`, `frontend/src/navigation/RootNavigator.tsx`, `frontend/src/services/hemocentroApi.ts` e `frontend/src/context/HemocentroSession.tsx`. A integração pública de agendamento do doador está em `frontend/src/services/agendamentoApi.ts`, `BloodCentersScreen.tsx` e `ScheduleScreen.tsx`.

No backend, os novos componentes são `HemocentroAuthService`, `EstoqueService`, `VagaService`, `EstoqueRepository`, `HemocentroPortalController`, `VagaController` e `autenticarHemocentro`. Também foram ampliados `AgendamentoRepository`, `HemocentroService`, `HemocentroRoutes`, `schema.prisma`, `docker-compose.yml` e o cabeçalho CORS para aceitar `Authorization`.

## Verificação de 18/10/2026 e limites conhecidos

- `npx prisma validate`: passou.
- `npx prisma generate`: passou.
- `npm run build` no backend: passou.
- `npm run typecheck` no frontend: passou.
- `npm run build:web` no frontend: passou, com o bundle Expo Web gerado.
- `npm test`: dois testes automatizados passaram. Eles verificam rejeição de token adulterado ou expirado e validação de tipo, quantidade e motivo antes de movimentar estoque.
- `npm run test:e2e`: passou com API e PostgreSQL do Compose.
- O teste E2E criou dois hemocentros e dois doadores temporários e validou cadastro, login válido e inválido, oito estoques iniciais, entrada, baixa, rejeição por saldo insuficiente, histórico, abertura e capacidade de vaga, agendamento, bloqueio de vaga lotada, isolamento entre hemocentros, confirmação, realização, atribuição única de 50 pontos e transição final inválida.
- Somente os dados identificados pelo teste foram removidos ao final.
- A stack `postgres`, `api` e `frontend` foi verificada em execução. PostgreSQL e API apresentaram estado `healthy`.
- O log confirmou a sincronização do schema e a execução idempotente do seed.
- O `--accept-data-loss` acrescentado temporariamente ao comando do Compose foi retirado depois da primeira sincronização.
- Manter `--accept-data-loss` em toda inicialização aceitaria automaticamente perdas futuras. Por isso, o Compose voltou a executar apenas `prisma db push`.
- O banco do Compose é sincronizado por `prisma db push` na inicialização.
- Antes de aplicar em um banco existente, é necessário revisar possíveis duplicidades de `Estoque` por hemocentro e tipo sanguíneo, já que o novo índice exige unicidade.
- O fluxo ainda não possui uma migração versionada para produção.
- A consulta automática da localização do dispositivo e o cadastro geocodificado continuam pendentes.
- O teste repetível está em `tests/hemocentro.e2e.ts`, exige a stack local ativa nas portas padrão e pode ser executado com `npm run test:e2e`.

## Sessão e dados reais do doador

Depois da entrega do portal do hemocentro, foi corrigido o fluxo do doador que ainda reutilizava uma identidade de demonstração. Essa correção é importante para o hemocentro porque agenda, confirmação, realização da doação e pontuação dependem da identificação correta da pessoa atendida.

### Cadastro, login e separação das sessões

- O formulário antigo apenas abria a Home e não persistia os dados digitados.
- O cadastro agora envia nome, e-mail, senha, CPF, data de nascimento, sexo e tipo sanguíneo para a API, respeitando os campos obrigatórios do modelo `Doador` no `schema.prisma`.
- Foram criadas as rotas `POST /doadores/cadastro` e `POST /doadores/login`.
- Ambas devolvem o perfil público do doador e um token.
- CPF, senha e data de nascimento não são devolvidos ao frontend.
- Novas senhas de doador são armazenadas com `scrypt` e salt aleatório.
- Cadastros antigos com senha em texto puro são migrados para hash no primeiro login válido, sem expor a senha na resposta.
- O token do doador contém `doadorId` e validade de 12 horas.
- O token do hemocentro contém `hemocentroId`; por isso, uma sessão não é aceita como se fosse a outra.
- A assinatura usa a variável de ambiente `HEMOCENTRO_AUTH_SECRET`, apesar do nome legado da variável.
- O frontend ganhou `DonorSessionProvider`, separado do `HemocentroSessionProvider`.
- Nome, iniciais, pontuação, triagem e agendamentos passam a usar o doador autenticado, em vez de `CURRENT_DONOR_ID` ou do usuário mockado “Guilherme”.
- A sessão ainda fica apenas em memória. Atualizar completamente a página exige novo login.
- Recuperação de senha, revogação e persistência segura da sessão continuam pendentes.

### Proteção dos dados de cada doador

- `GET /doadores/:id` exige token de doador e rejeita a consulta quando o ID da URL não corresponde ao `doadorId` autenticado.
- `POST /triagens`, `POST /agendamentos` e `GET /agendamentos/doador/:doadorId` também exigem o token.
- Essas rotas recusam operações feitas em nome de outro doador.
- A Home envia para a triagem o ID da sessão.
- A tela de agendamento lista e cria registros somente para a identidade autenticada.
- A rota de listagem geral de doadores deixou de ficar publicamente exposta no fluxo atual.
- Os campos sensíveis permanecem excluídos pelos `select` do Prisma.

### Pontos, impacto e histórico reais

- A Home, a Carteira, as Configurações e o Histórico atualizam o perfil pela API sempre que a tela recebe foco.
- Depois que o hemocentro marca um agendamento como `REALIZADO`, os 50 pontos atribuídos na transação aparecem nas telas do doador.
- O “Saldo de Pontos” na Carteira deixou de usar o valor fixo de 850.
- A Carteira usa `pontosDoacao` do perfil autenticado e calcula a apresentação do nível como bronze, prata ou ouro.
- “Doações realizadas” é calculado no backend com uma contagem Prisma filtrada por `doadorId` e `status = REALIZADO`.
- Um doador sem doações recebe zero.
- Agendamentos apenas criados, confirmados ou cancelados não entram no total.
- A última doação e a linha do tempo do Histórico são montadas a partir dos agendamentos reais com status `REALIZADO`.
- Se não houver nenhum, o aplicativo informa que ainda não existem doações realizadas.
- Cada item realizado mostra data, horário, hemocentro e os 50 pontos definidos pela regra atual.
- Os dados antigos de demonstração não são mais usados nessas telas.
- Foram retiradas as cópias JavaScript compiladas e desatualizadas de Home, Configurações, Carteira e Histórico que poderiam manter nomes ou valores fixos paralelos aos arquivos TypeScript.

### Operação com Docker e credenciais

- O `README.md` passou a explicar `docker compose up --build -d`, `start`, `stop`, `down`, logs, reinício por serviço, reconstrução, validação e remoção intencional do volume com `down -v`.
- Alterações feitas depois da construção das imagens exigem `docker compose up --build -d` para aparecerem na stack.
- Nenhum contêiner foi ligado automaticamente nas últimas correções, respeitando a decisão de iniciar o Docker manualmente.
- Valores presentes no Compose e nos arquivos `.example` são apenas padrões locais de desenvolvimento.
- Em ambiente compartilhado ou de produção, `POSTGRES_PASSWORD` e `HEMOCENTRO_AUTH_SECRET` devem ser definidos em um arquivo local não versionado ou no gerenciador de segredos da infraestrutura.
- O frontend recebe apenas `EXPO_PUBLIC_API_URL`.
- Segredos de assinatura, senha do PostgreSQL, CPF e hashes de senha não devem usar variáveis `EXPO_PUBLIC_*`, pois tudo com esse prefixo pode entrar no bundle do aplicativo.
- A equipe deve garantir que arquivos locais como `.env.docker` não sejam adicionados ao Git.
- O arquivo de exemplo não deve conter credenciais reais.

### Arquivos principais do complemento

Backend:

- `src/service/DoadorAuthService.ts`;
- `src/middleware/doadorAuth.ts`;
- `src/controller/DoadorController.ts`;
- `src/repository/DoadorRepository.ts`;
- `src/routes/DoadorRoutes.ts`;
- `src/routes/AgendamentoRoutes.ts`;
- `src/routes/TriagemRoutes.ts`.

Frontend:

- `frontend/src/context/DonorSession.tsx`;
- `frontend/src/hooks/useRefreshDonorProfile.ts`;
- `frontend/src/hooks/useDonorDonations.ts`;
- `frontend/src/screens/SignUpScreen.tsx`;
- `frontend/src/screens/DonorLoginScreen.tsx`;
- `frontend/src/screens/HomeScreen.tsx`;
- `frontend/src/screens/WalletScreen.tsx`;
- `frontend/src/screens/SettingsScreen.tsx`;
- `frontend/src/screens/DonationHistoryScreen.tsx`;
- `frontend/src/screens/ScheduleScreen.tsx`;
- `frontend/src/screens/TriageScreen.tsx`.

Contratos e integração:

- `frontend/src/types/donor.ts`;
- `frontend/src/types/navigation.ts`;
- `frontend/src/services/donorApi.ts`;
- `frontend/src/services/agendamentoApi.ts`;
- `frontend/src/services/triageApi.ts`;
- `frontend/App.tsx`;
- `frontend/src/navigation/RootNavigator.tsx`.

### Verificação do complemento

- `npm run build` no backend: passou.
- `npm run typecheck` no frontend: passou.
- Os dois testes automatizados existentes do hemocentro continuaram passando depois da introdução da sessão do doador.
- A correção mais recente de contagem, Carteira e Histórico foi verificada por compilação e checagem de tipos.
- Para validar na aplicação Docker, é necessário reconstruir as imagens e executar o fluxo: cadastro do doador → agendamento → confirmação e realização pelo hemocentro → retorno à Home e à Carteira do doador.