# Implementações de 31/10/2026 — mapa de hemocentros e proteção do CPF

**Data: 31/10/2026**

## Objetivo

Adicionar ao fluxo do doador um mapa interativo de hemocentros e proteger o CPF dos doadores em repouso no PostgreSQL.

## Mapa de hemocentros no fluxo do doador

A tela **Hemocentros** passou a exibir um mapa acima da lista de instituições. Os pontos usados no mapa vêm da mesma resposta pública de `GET /hemocentros`, usando as coordenadas `latitude` e `longitude` já cadastradas para cada instituição.

O mapa é renderizado de acordo com a plataforma:

- no navegador, por um `iframe` inserido na tela React Native Web;
- em Android e iOS, por `react-native-webview`.

As duas versões reutilizam o mesmo HTML de mapa. Dados de nome e endereço recebidos da API são inseridos com `textContent` nos pop-ups, evitando que o conteúdo do cadastro seja interpretado como HTML.

### Interação

- o mapa enquadra os hemocentros carregados automaticamente;
- cada marcador apresenta **Local de doação**, nome e endereço ao clique;
- os controles `+` e `−` permitem aproximar e afastar a visualização;
- o mapa utiliza o estilo vetorial Liberty do OpenFreeMap com MapLibre, permitindo zoom até o nível 18 e enquadramento automático até o nível 14;
- coordenadas ausentes ou fora dos intervalos de latitude e longitude são ignoradas para evitar a criação de marcadores inválidos.

### Correção do bloqueio 403

A primeira camada baseada diretamente nos blocos do OpenStreetMap foi removida da versão web. Em alguns navegadores, o `iframe` isolado não enviava o cabeçalho de origem esperado pelo serviço e os blocos retornavam `403 Access blocked`.

O mapa agora usa o estilo vetorial público do OpenFreeMap, que fornece o estilo e os dados vetoriais com CORS liberado. Assim, a tela não exibe mais blocos de erro e também não fica limitada ao zoom nacional da camada raster provisória.

## Proteção do CPF no banco de dados

Os CPFs dos doadores passaram a ser armazenados com criptografia autenticada AES-256-GCM. Cada valor recebe um IV aleatório e uma tag de autenticação, protegendo confidencialidade e integridade do dado salvo.

O valor persistido também inclui uma impressão HMAC da versão normalizada do CPF. Essa impressão permite localizar duplicidades sem gravar o CPF em texto puro. A comparação de integridade usa tempo constante antes de devolver um CPF descriptografado.

### Cadastro, seed e registros existentes

- o cadastro de doador normaliza o CPF antes da validação e do armazenamento;
- a verificação de CPF duplicado consulta a impressão HMAC e mantém compatibilidade temporária com valores legados em texto puro;
- o `seed.ts` passou a salvar o CPF do doador demonstrativo criptografado;
- na inicialização da API, CPFs legados em texto puro são identificados e migrados em uma transação do Prisma;
- senhas e CPF continuam ausentes das respostas públicas da API.

### Configuração necessária

Foi criada a variável `CPF_ENCRYPTION_KEY`, documentada em `.env.docker.example` e configurada no serviço `api` do Docker Compose. A chave deve ter pelo menos 32 caracteres e deve permanecer a mesma enquanto houver CPFs criptografados no banco. A perda ou troca da chave impede a recuperação dos valores já salvos.

## Docker

O frontend foi reconstruído após as mudanças do mapa. Para aplicar alterações futuras no bundle web do Docker, use:

```powershell
docker compose build frontend
docker compose up -d --force-recreate --no-deps frontend
```

Na validação desta sessão, o container do frontend respondeu `200` em `http://localhost:8081` e o bundle foi conferido com o estilo vetorial do OpenFreeMap, sem referências ao servidor de blocos bloqueado do OpenStreetMap.

## Arquivos criados

- `frontend/src/components/DonationMap.tsx`;
- `frontend/src/components/DonationMap.web.tsx`;
- `frontend/src/components/DonationMapHtml.ts`;
- `src/security/CpfEncryption.ts`;
- `src/service/CpfMigrationService.ts`.

Os artefatos JavaScript, declarações e source maps correspondentes aos novos componentes e à tela de hemocentros também foram atualizados, pois o projeto os mantém versionados para o bundle atual.

## Arquivos alterados

- `.env.docker.example`;
- `README.md`;
- `docker-compose.yml`;
- `frontend/package.json` e `frontend/package-lock.json`;
- `frontend/src/screens/BloodCentersScreen.tsx` e seus artefatos gerados;
- `prisma/seed.ts`;
- `src/index.ts`;
- `src/repository/DoadorRepository.ts`;
- `src/service/DoadorAuthService.ts`;
- `tests/hemocentro.test.ts`;
- `tests/hemocentro.e2e.ts`.

## Validações realizadas

- `npm run build` no backend: passou;
- `npm run typecheck` no frontend: passou;
- `npm run build:web` no frontend: passou;
- testes unitários: passaram;
- teste E2E com PostgreSQL isolado: passou, incluindo persistência criptografada do CPF, bloqueio de CPF duplicado e migração de CPF legado;
- `docker compose config`: passou;
- imagens Docker reconstruídas com sucesso;
- API e PostgreSQL ficaram saudáveis após a inicialização do Compose;
- frontend Docker respondeu `200` em `http://localhost:8081`.
