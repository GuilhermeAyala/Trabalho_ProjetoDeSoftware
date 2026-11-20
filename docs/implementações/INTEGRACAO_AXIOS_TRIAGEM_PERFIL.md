# Integração Axios, triagem e perfil do doador - dia 05/10

## Objetivo

Esta implementação padroniza a comunicação entre o frontend e o backend com Axios e conecta dois fluxos do aplicativo à API:

- envio da pré-triagem e exibição do resultado de aptidão;
- consulta dos dados públicos do perfil do doador.

O fluxo segue a separação:

`Tela -> Serviço HTTP -> Route -> Controller -> Service -> Repository -> Prisma/PostgreSQL`

## Cliente HTTP do frontend

O arquivo `frontend/src/services/api.ts` contém a instância compartilhada do Axios. Nele ficam centralizados:

- endereço-base da API;
- timeout das requisições;
- cabeçalho JSON;
- leitura das mensagens de erro devolvidas pelo backend;
- mensagens específicas para API indisponível e timeout.

Os serviços de cada caso de uso continuam separados:

- `triageApi.ts`: envia as respostas para `POST /triagens`;
- `donorApi.ts`: consulta o perfil em `GET /doadores/:id`.

## Fluxo da triagem

Ao finalizar o formulário, o frontend envia o `doadorId` e todas as respostas booleanas. O backend valida o doador, avalia os critérios, registra a pré-triagem e retorna:

- `apto`;
- `motivosInaptidao`;
- data de realização;
- aviso de que o resultado não substitui a avaliação clínica presencial.

A tela apresenta uma mensagem de aptidão quando nenhum impedimento é encontrado. Em caso de inaptidão, apresenta a lista de critérios não atingidos retornada pelo backend.

## Consulta do perfil

A tela de configurações consulta o doador ao ser aberta e possui estados de carregamento, sucesso, erro e nova tentativa.

Somente os campos públicos são exibidos:

- nome;
- e-mail;
- sexo;
- tipo sanguíneo;
- pontos de doação.

CPF, senha e data de nascimento não são selecionados pelo repository e, portanto, não saem do backend nesse endpoint.

Enquanto a autenticação ainda não está implementada, o identificador do doador é lido de `EXPO_PUBLIC_DOADOR_ID`, com valor padrão `1`. Futuramente esse valor deverá vir da sessão autenticada.

## Rotas do doador

As rotas principais foram padronizadas:

- `POST /doadores`;
- `GET /doadores`;
- `GET /doadores/:id`;
- `PUT /doadores/:id`;
- `DELETE /doadores/:id`;
- `POST /doadores/:id/doacoes/confirmar`.

A URL antiga iniciada por `/doador/doadores` foi mantida temporariamente como compatibilidade.

## Correção de CORS

O backend agora encerra as requisições de preflight `OPTIONS` com status `204`. Isso permite que o navegador envie requisições JSON para a API sem bloquear a triagem por CORS.

## Cadastro e pontuação

`pontosDoacao` deixou de ser obrigatório no contrato de criação do doador. O frontend não define a pontuação inicial: o banco cria o doador com zero pontos e o backend controla os acréscimos após doações confirmadas.

## Configuração local

Exemplo de `frontend/.env` para web ou simulador iOS:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DOADOR_ID=1
```

No Android Emulator, o endereço padrão da API é `http://10.0.2.2:3000`. Em celular físico, deve ser usado o IP do computador na rede local.

O backend usa a variável `DATABASE_URL` do arquivo `.env` da raiz. Como o PostgreSQL está instalado diretamente no Windows e a API roda fora do Docker, o host correto é `localhost`:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/ProjetoVitta?schema=public"
```

Como backend e banco executam localmente neste cenário, o host correto é `localhost`.

Com o serviço PostgreSQL iniciado, execute o backend:

```bash
npx prisma validate
npx prisma generate
npm run dev
```

Em outro terminal:

```bash
cd frontend
npm run web
```

## Validações realizadas

- compilação TypeScript do backend;
- verificação TypeScript do frontend;
- exportação web do Expo;
- consulta real de perfil sem campos sensíveis;
- pré-triagem com resultado apto;
- pré-triagem com resultado inapto e motivos;
- preflight CORS retornando `204`.

## Teste de persistência no PostgreSQL

Foi executado um teste de integração usando dados fictícios e a API real conectada ao banco local `ProjetoVitta`.

Fluxo validado:

1. cadastro por `POST /doadores`;
2. consulta do perfil por `GET /doadores/:id`;
3. registro de triagem apta por `POST /triagens`;
4. registro de triagem inapta por `POST /triagens`;
5. consulta da última triagem;
6. confirmação de doação e acréscimo de 50 pontos;
7. consulta direta das tabelas com o cliente `psql`.

Registros de teste confirmados no PostgreSQL:

- doador fictício com ID `1`;
- triagem apta com ID `1`;
- triagem inapta com ID `2`;
- duas triagens relacionadas ao mesmo doador;
- pontuação persistida com valor `50`;
- CPF, senha e data de nascimento presentes no banco;
- CPF, senha e data de nascimento ausentes das respostas públicas da API.

O cenário inapto persistiu os motivos `Condição de saúde informada` e `Descanso insuficiente`. A consulta de última triagem retornou corretamente o registro inapto mais recente.

### Limitações identificadas

- A tela `SignUpScreen` ainda não chama `POST /doadores`; atualmente o cadastro completo foi validado pela API. Portanto, clicar em **Criar conta** no frontend ainda não registra um novo usuário.
- A senha é armazenada pelo backend, mas ainda não passa por hash. Antes de considerar autenticação ou uso fora do protótipo, deve ser aplicado hash com uma biblioteca apropriada.
- O `EXPO_PUBLIC_DOADOR_ID` continua sendo uma identificação temporária até existir sessão de usuário autenticado.
