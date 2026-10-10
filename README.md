# Projeto de Software: Sistema VITTA

## Executar a aplicação completa (recomendado)

O Docker Compose inicia, em conjunto, o front-end, a API e o PostgreSQL. Esse é o caminho recomendado para usar a aplicação inteira; não é necessário executar `npm run` em terminais separados.

### Pré-requisito

Abra o Docker Desktop e espere ele indicar que está em execução. Confirme no PowerShell, na raiz deste repositório:

```powershell
docker version
docker compose version
```

### Primeira execução

1. Crie a configuração local do Docker (faça isso apenas uma vez):

```powershell
Copy-Item .env.docker.example .env.docker
```

2. Construa as imagens e inicie todos os serviços:

```powershell
docker compose --env-file .env.docker up --build --detach --wait
```

3. Confirme que os serviços estão em execução:

```powershell
docker compose --env-file .env.docker ps
```

O resultado deve mostrar `postgres` e `api` como `healthy` e o `frontend` como `running`.

Abra a aplicação em [http://localhost:8081](http://localhost:8081).

- Front-end: `http://localhost:8081`
- API: `http://localhost:3000`
- PostgreSQL: `localhost:5433`

Na inicialização, a API aplica o schema do Prisma ao banco Docker e cria o doador de demonstração caso ele ainda não exista.

### Próximas execuções

Depois que as imagens já foram construídas, basta iniciar:

```powershell
docker compose --env-file .env.docker.example up --detach --wait
```

Para acompanhar os logs enquanto usa a aplicação:

<<<<<<< Updated upstream
### Link do deploy caso haja problemas em achar
Link - https://trabalho-projeto-de-software.vercel.app/
=======
```powershell
docker compose --env-file .env.docker logs --follow
```

### Testes manuais rápidos

```powershell
curl.exe http://localhost:3000/
curl.exe http://localhost:3000/doadores
curl.exe -I http://localhost:8081/
docker compose --env-file .env.docker exec postgres pg_isready -U vitta -d vitta
```

### Parar ou recriar

Para parar a aplicação e manter os dados do PostgreSQL:

```powershell
docker compose --env-file .env.docker.example down
```

Para reconstruir as imagens após mudanças de dependências, Dockerfile ou código que será empacotado:

```powershell
docker compose --env-file .env.docker up --build --detach --wait
```

`docker compose down -v` também apaga o volume do banco de dados. Use-o somente se quiser reiniciar o banco do zero.

## Quando usar `npm run`

Para executar a aplicação completa, use Docker Compose. Os comandos npm continuam úteis somente para desenvolvimento ou depuração de um serviço isolado:

- API local: `npm run dev`
- Validar/gerar a versão de produção da API: `npm run build`
- Front-end fora do Docker: na pasta `frontend`, use `npm install` e `npx expo start`

Ao executar serviços fora do Docker, configure uma `DATABASE_URL` local apropriada e não suba outra API na porta `3000` ao mesmo tempo que o Compose.

## Uso em equipe e acesso externo

### Cada integrante rodando localmente

O modo mais simples para desenvolvimento é cada pessoa clonar o repositório e executar os comandos de Docker descritos acima. Cada computador terá sua própria API e seu próprio volume PostgreSQL; portanto, os dados de uma pessoa não são compartilhados automaticamente com o restante do time.

```powershell
git clone https://github.com/GuilhermeAyala/Trabalho_ProjetoDeSoftware.git
cd Trabalho_ProjetoDeSoftware
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build --detach --wait
```

### Acesso pela mesma rede Wi-Fi ou LAN

Por padrão, `localhost` funciona apenas no computador que iniciou o Docker. Para permitir que outros dispositivos da mesma rede acessem sua instância, descubra o IPv4 da sua máquina:

```powershell
ipconfig
```

Procure o valor **Endereço IPv4** (por exemplo, `192.168.1.50`). No arquivo `.env.docker`, substitua a variável abaixo pelo IP encontrado:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
```

Depois reconstrua e inicie os serviços:

```powershell
docker compose --env-file .env.docker up --build --detach --wait
```

Os dispositivos na mesma rede poderão abrir:

```text
http://192.168.1.50:8081
```

Se não funcionar, libere as portas `8081` (front-end) e `3000` (API) no Firewall do Windows. O IP usado na variável e no navegador deve ser o IPv4 real da máquina que executa o Docker.

### Acesso pela internet

Não use `localhost` nem o IP da rede local para disponibilizar o sistema fora da sua rede. Para isso, é necessário publicar a API e o banco em um servidor/cloud e gerar o front-end com a URL pública da API. Expor diretamente as portas do computador pelo roteador não é recomendado para este projeto.

## Links

- Protótipo no Figma: https://www.figma.com/proto/NkLFRu8mj07xEIGy3b4ddk/VITTA?node-id=1-2&t=f3YzHBQHA5YRVyxG-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2
- Deploy: https://trabalho-projeto-de-software-9myezbtg7-projeto-vitta1.vercel.app?_vercel_share=611vkzsBz5Ztj6wsWSFyjPwhDdRfkMMg
>>>>>>> Stashed changes
