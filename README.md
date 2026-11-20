# VITTA

## Como executar o Web

Pré-requisitos: Docker Desktop em execução, Docker Compose v2 e portas `3000`, `5433`, `6380` e `8081` livres.

Na **primeira execução**, abra o PowerShell na raiz do repositório e use:

```powershell
docker compose up --build -d --remove-orphans
docker compose ps
```

Não use `docker compose start` na primeira execução: `start` não cria nem atualiza contêineres. O comando `up --build` acima cria o banco, o Redis, a API e o Web, executa o seed e aguarda as dependências ficarem saudáveis.

> O primeiro build baixa imagens e instala dependências, portanto pode levar alguns minutos. Aguarde o comando terminar e voltar ao prompt antes de abrir o navegador.

> Se o Docker exibir `invalid file request Dockerfile`, o OneDrive transformou arquivos do projeto em placeholders. Extraia ou copie o projeto para uma pasta local fora do OneDrive, por exemplo `C:\Projetos\VITTA`, e execute novamente o mesmo comando.

O estado esperado é `postgres`, `redis`, `api` e `web` como `healthy`. Acesse:

- Web: <http://localhost:8081>
- API: <http://localhost:3000>

O arquivo `.env.docker` é opcional. Os valores de demonstração já possuem padrões no Compose. Para personalizar portas, senhas ou segredos, copie `.env.docker.example` para `.env.docker` e execute os comandos com `docker compose --env-file .env.docker ...`.

Para encerrar sem apagar o banco:

```powershell
docker compose stop
```

Para iniciar novamente os contêineres já criados:

```powershell
docker compose start
```

Depois de alterar código ou trocar de versão, reconstrua com:

```powershell
docker compose up --build -d --remove-orphans
```

> `docker compose down -v` apaga definitivamente o volume local do PostgreSQL. Não use esse comando para uma parada comum.

## Aplicativo mobile

O aplicativo Android/iOS roda pelo Expo e, por isso, **não aparece em `docker compose ps`**. Mantenha a API iniciada pelo comando anterior e, em outro PowerShell na raiz do projeto, execute:

```powershell
Set-Location app
npm ci
npm start
```

O Metro usa a porta `8082`, portanto Web e App podem rodar ao mesmo tempo. Pressione `a` para abrir o Android Emulator ou leia o QR Code com o Expo Go. No celular físico, mantenha o celular e o computador na mesma rede; o App detecta automaticamente o endereço do computador usado pelo Expo. Consulte [app/README.md](app/README.md) para solução de problemas.

## Estrutura da entrega

```text
VITTA/
├── docs/       documentação acadêmica e artefatos editáveis
├── api/        API, Prisma, seed e testes
├── web/        aplicação para navegador
├── app/        aplicação Android/iOS
├── docker-compose.yml
└── README.md
```

A base Expo original atende web e mobile. Ela foi separada em `web/` e `app/` para que cada entregável tenha dependências, variáveis e comandos próprios, como solicitado. Não há aplicação desktop implementada no material recebido; não foi criada uma pasta vazia que pudesse sugerir o contrário.

## Validação

```powershell
Set-Location api
npm ci
npx prisma generate
npm test
npm run build
Set-Location ..

Set-Location app
npm ci
npm run typecheck
Set-Location ..

Set-Location web
npm ci
npm run typecheck
npm run build:web
Set-Location ..

.\validar-entrega.ps1
```

O validador aponta documentos obrigatórios ausentes, campos ainda não preenchidos e qualquer `node_modules` que possa entrar indevidamente na entrega.

## Geração do arquivo de entrega

Depois de resolver todas as pendências indicadas pelo validador:

```powershell
.\criar-entrega.ps1
```

O script cria `VITTA-entrega.zip` sem `.git`, configurações dos agentes, arquivos `.env`, caches, builds ou diretórios `node_modules`. Abra o ZIP e confira seu conteúdo antes de enviá-lo ao AVA.

## Credencial inicial de demonstração

O seed cria perfis prontos para a demonstração:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@vitta.local` | `VittaAdmin@2026` |
| Doador | `doador.demo@vitta.local` | `senha-demonstracao` |
| Hemocentro Central | `hemocentro.central@vitta.local` | `VittaHemocentro@2026` |

A senha do administrador pode ser substituída com `ADMIN_SEED_PASSWORD` antes da primeira execução. O seed não redefine uma senha já gravada.

## Redis e cache

O Redis é um cache descartável; o PostgreSQL continua sendo a fonte de verdade. Com a pilha Docker em execução, verifique a saúde do cache por HTTP:

```powershell
curl.exe http://localhost:3000/health
```

O campo `redis` deve retornar `ok`. Para inspecionar diretamente as chaves criadas após navegar pelas telas que consultam agendamentos, vagas ou triagens:

```powershell
docker compose exec redis redis-cli ping
docker compose exec redis redis-cli --scan --pattern "vitta:*"
docker compose exec redis redis-cli INFO keyspace
```

O cache começa vazio e suas chaves expiram em 15 minutos (900 segundos) por padrão. Isso é esperado.

## Links do projeto

- Protótipo: <https://www.figma.com/proto/NkLFRu8mj07xEIGy3b4ddk/VITTA?node-id=1-2&t=f3YzHBQHA5YRVyxG-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2>
- Deploy informado no projeto: <https://trabalho-projeto-de-software-9myezbtg7-projeto-vitta1.vercel.app?_vercel_share=611vkzsBz5Ztj6wsWSFyjPwhDdRfkMMg>
