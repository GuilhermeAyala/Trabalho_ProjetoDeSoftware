# Aplicativo mobile VITTA

## Instalação, configuração e execução

Pré-requisitos:

- Node.js 22 LTS e npm;
- API VITTA em execução;
- para dispositivo físico: Expo Go compatível com Expo SDK 54 e celular na mesma rede do computador;
- para emulador: Android Studio/Android Emulator; no macOS, o iOS Simulator também pode ser usado.

No PowerShell, a partir da raiz do projeto:

```powershell
# Se a API ainda não estiver em execução:
docker compose up --build -d postgres redis api

Set-Location app
npm ci
npm start
```

O Expo/Metro inicia em modo LAN na porta `8082`, evitando conflito com o Web na porta `8081`. A validação remota de dependências é desativada para que uma indisponibilidade dos servidores do Expo não impeça a apresentação. Com o servidor aberto, pressione `a` para Android ou leia o QR Code com o Expo Go. Também é possível iniciar o Android diretamente:

```powershell
npm run android
```

## URL da API

No modo de desenvolvimento, o App detecta automaticamente o computador que executa o Expo e usa a API na porta `3000`. Isso atende Android Emulator, iOS Simulator e celular físico na mesma rede sem editar um endereço IP.

Se for necessário apontar para outra API, crie `app/.env` a partir de `.env.example` e informe:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
EXPO_PUBLIC_DOADOR_ID=1
```

Se o celular não alcançar a API, confirme que ambos estão na mesma rede, que o Expo está no modo `LAN` e que a porta `3000` está permitida no Firewall do Windows. Reinicie o Expo depois de alterar `.env`.

Variáveis com prefixo `EXPO_PUBLIC_` entram no aplicativo compilado. Nunca coloque senhas, chaves criptográficas ou segredos de autenticação nelas.

## Verificação

```powershell
npm run typecheck
```

Para confirmar a API antes de abrir o app:

```powershell
curl.exe http://localhost:3000/
```

O resultado deve começar com `Servidor VITTA rodando` ou retornar HTTP `200`.

## Organização

- `src/screens`: telas;
- `src/navigation`: rotas e navegação;
- `src/components`: componentes reutilizáveis;
- `src/services`: integração HTTP com a API;
- `src/models` e `src/viewmodels`: fluxo MVVM;
- `src/context`: sessões de doador e hemocentro;
- `src/theme`: cores, espaçamentos e tipografia.
