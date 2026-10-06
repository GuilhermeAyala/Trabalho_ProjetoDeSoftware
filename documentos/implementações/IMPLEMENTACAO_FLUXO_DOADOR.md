# Implementação do fluxo do doador

Este recorte implementa somente os casos de uso **Agendar Doação**, **Consultar Hemocentros** e **Realizar Triagem no App**, mantendo a divisão apresentada na visão de implantação:

`Route -> Controller -> Service -> Repository -> Prisma/PostgreSQL`

## Responsabilidade de cada camada

- **Route:** define a URL e encaminha a requisição.
- **Controller:** traduz HTTP para os dados usados pelo caso de uso e monta a resposta.
- **Service:** concentra validações e regras de negócio.
- **Repository:** contém exclusivamente as consultas ao Prisma.
- **DTO:** define os dados que entram ou saem de cada fluxo.

## Rotas implementadas

### Consultar hemocentros

- `GET /hemocentros`: lista todos os hemocentros por nome.
- `GET /hemocentros?latitude=-23.55&longitude=-46.63`: calcula a distância, em quilômetros, e ordena do mais próximo para o mais distante.
- `GET /hemocentros/:id`: consulta um hemocentro específico.

O cálculo local usa a fórmula de Haversine. A camada de serviço foi deixada preparada para que uma API de mapas substitua o cálculo no futuro sem alterar controller ou repository.

### Realizar triagem no app

- `POST /triagens`: registra as respostas e devolve apenas o resultado da pré-triagem.
- `GET /triagens/doador/:doadorId/ultima`: consulta o último resultado do doador.

Exemplo de entrada:

```json
{
  "doadorId": 1,
  "respostas": {
    "estaEmBoasCondicoesDeSaude": true,
    "pesaNoMinimo50Kg": true,
    "dormiuPeloMenosSeisHoras": true,
    "estaAlimentado": true,
    "consumiuAlcoolNasUltimas12Horas": false,
    "possuiSintomasInfecciosos": false,
    "fezProcedimentoDeRiscoRecente": false
  }
}
```

A triagem do aplicativo é explicitamente preliminar. Ela não substitui a avaliação clínica presencial e, por isso, não foi usada para bloquear automaticamente o agendamento. A resposta imediata informa os motivos ao próprio fluxo que enviou o questionário; consultas posteriores devolvem apenas `apto` e a data, sem repetir respostas ou motivos de saúde.

### Agendar doação

- `POST /agendamentos`: cria um agendamento.
- `GET /agendamentos/doador/:doadorId`: lista os agendamentos de um doador.

Exemplo de entrada:

```json
{
  "doadorId": 1,
  "hemocentroId": 1,
  "data": "2026-10-15",
  "horario": "14:30"
}
```

O serviço valida doador, hemocentro e data futura. O banco também possui uma restrição única para impedir que o mesmo doador repita o mesmo agendamento.

## Decisões de escopo

- Notificações, estoque e funções administrativas ficaram fora desta entrega.
- O controle de quantidade de vagas por horário depende da futura entidade `Slot/Vaga`; por enquanto, o sistema não presume que cada horário aceite somente uma pessoa.
- A integração externa com mapas não foi adicionada; o contrato atual não depende de chave de API.
- As respostas detalhadas da triagem ficam no banco, mas não são devolvidas nas consultas, reduzindo a exposição de informações de saúde.
- CPF, senha e data de nascimento continuam fora dos retornos públicos do doador.

## Banco de dados

O schema adiciona a tabela `Triagem`, o vínculo com `Doador`, valores padrão para pontuação e status e a restrição de horário do agendamento. Após revisar as mudanças, sincronize o banco e gere o cliente:

```bash
npx prisma db push
npx prisma generate
```

`db push` é indicado aqui para o ambiente acadêmico sem histórico de migrations. Em um ambiente versionado/produção, crie e revise uma migration.

## Tela de triagem no frontend

A tela `TriageScreen` segue a arquitetura do frontend:

`Navegação -> Tela -> Serviço HTTP -> API`

- A Home envia o `doadorId` ao navegar, evitando que a tela dependa diretamente do usuário mockado.
- `triageApi.ts` é responsável pelo `POST /triagens` e pelo tratamento dos erros HTTP.
- `triage.ts` mantém o contrato TypeScript com as mesmas chaves de respostas usadas no backend.
- A tela exige todas as respostas antes do envio e mostra estados separados de carregamento, erro, aptidão e inaptidão.
- Quando o resultado é inapto, os itens de `motivosInaptidao` retornados pelo backend são apresentados como lista.

Para informar onde a API está sendo executada, copie `frontend/.env.example` para `frontend/.env` e ajuste:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Em um celular físico, use o endereço IP do computador no lugar de `localhost`. No Android Emulator, o padrão usado pelo projeto é `http://10.0.2.2:3000`.
