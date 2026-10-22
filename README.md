# Projeto de Software: Sistema VITTA

O VITTA usa Docker Compose para executar o front-end, a API e o PostgreSQL juntos.

## Pré-requisitos

Instale e abra o Docker Desktop. Espere o status indicar que ele está em execução e confirme, na raiz do repositório:

```powershell
docker version
docker compose version
```

## Comandos do Docker para o time

Execute os comandos abaixo na pasta raiz do projeto.

### Primeira execução ou atualização completa

Crie o arquivo de configuração local uma única vez:

```powershell
Copy-Item .env.docker.example .env.docker
```

Depois construa as imagens e inicie todos os serviços:

```powershell
docker compose --env-file .env.docker up --build -d
```

Também funciona sem arquivo `.env.docker`, usando os valores padrão do `docker-compose.yml`:

```powershell
docker compose up --build -d
```

Use esse comando quando alguém alterar `Dockerfile`, `package.json`, dependências, schema Prisma ou código que será incluído nas imagens.

### Conferir se iniciou corretamente

```powershell
docker compose ps
```

O esperado é `postgres` e `api` como `healthy`, e `frontend` como `running`.

Endereços locais:

- Front-end: [http://localhost:8081](http://localhost:8081)
- API: [http://localhost:3000](http://localhost:3000)
- PostgreSQL: `localhost:5433`

### Iniciar novamente após usar `stop`

```powershell
docker compose start
```

Esse comando inicia os contêineres que já existem sem reconstruir imagens e preserva os dados do PostgreSQL.

### Parar a aplicação e manter os dados

```powershell
docker compose stop
```

Para retornar depois, use `docker compose start`.

### Remover os contêineres e manter o banco

```powershell
docker compose down
```

Na próxima vez, execute `docker compose up -d` ou `docker compose up --build -d`. O volume `vitta_postgres_data` permanece, portanto os dados do banco são preservados.

### Acompanhar logs

Logs de todos os serviços:

```powershell
docker compose logs -f
```

Somente a API:

```powershell
docker compose logs -f api
```

Para sair dos logs, use `Ctrl + C`. Isso não interrompe os serviços.

### Reiniciar um serviço específico

Por exemplo, para reiniciar apenas a API:

```powershell
docker compose restart api
```

Após alterar o código da API, reconstrua somente esse serviço:

```powershell
docker compose up --build -d api
```

### Validar a aplicação

Com a stack em execução, os comandos abaixo verificam a API, o front-end e o PostgreSQL:

```powershell
curl.exe http://localhost:3000/
curl.exe http://localhost:3000/hemocentros
curl.exe -I http://localhost:8081/
docker compose exec postgres pg_isready -U vitta -d vitta
```

Para executar a validação completa do fluxo de hemocentro, que cria e remove dados temporários de teste:

```powershell
npm run test:e2e
```

Para os testes unitários e a compilação da API:

```powershell
npm test
npm run build
```

Para verificar o TypeScript do front-end:

```powershell
Set-Location frontend
npm run typecheck
Set-Location ..
```

### Reiniciar o banco do zero

```powershell
docker compose down -v
```

Esse comando remove o volume `vitta_postgres_data` e apaga todos os dados locais do PostgreSQL. Use apenas quando a equipe decidir descartar o banco local. Depois, execute:

```powershell
docker compose up --build -d
```

## Configuração para cada integrante

Cada colega deve criar sua própria cópia de `.env.docker` a partir de `.env.docker.example`. Os serviços e o banco executados no computador de uma pessoa não são compartilhados automaticamente com as demais.

Para abrir o front-end em outro dispositivo da mesma rede, encontre o IPv4 com `ipconfig`, altere `EXPO_PUBLIC_API_URL` em `.env.docker` para o IP da máquina, por exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
```

Em seguida, reconstrua o front-end:

```powershell
docker compose --env-file .env.docker up --build -d frontend
```

O outro dispositivo poderá acessar `http://192.168.1.50:8081`. Se necessário, libere as portas `8081` e `3000` no Firewall do Windows.

## Problemas frequentes

- `permission denied` ou erro de conexão ao Docker: abra o Docker Desktop e espere ele concluir a inicialização.
- Porta `3000`, `5433` ou `8081` ocupada: pare o processo que usa a porta ou ajuste `API_PORT`, `POSTGRES_PORT` ou `FRONTEND_PORT` em `.env.docker`.
- API não inicia depois de uma alteração no schema: confira `docker compose logs api`. O Compose sincroniza o schema com `prisma db push` e executa o seed durante a inicialização.
- Não use `docker compose down -v` para uma simples parada: ele apaga o banco local.

## Links

- Protótipo no Figma: https://www.figma.com/proto/NkLFRu8mj07xEIGy3b4ddk/VITTA?node-id=1-2&t=f3YzHBQHA5YRVyxG-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2
- Deploy: https://trabalho-projeto-de-software-9myezbtg7-projeto-vitta1.vercel.app?_vercel_share=611vkzsBz5Ztj6wsWSFyjPwhDdRfkMMg


## ligar, desligar, primeira vez usando e etc 
quando alterar o codigo ou ligar pela primeira vez: docker compose up --build -d
ligar: docker compose start
desligar:docker compose stop
verificar status: docker compose ps