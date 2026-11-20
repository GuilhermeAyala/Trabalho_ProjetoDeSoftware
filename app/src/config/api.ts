import { NativeModules, Platform } from 'react-native';

// O bundle do Expo é servido pelo mesmo computador que expõe a API. Usar o
// host do Metro permite rodar no emulador ou em um celular na mesma rede sem
// exigir que o avaliador descubra e configure manualmente o endereço IPv4.
const scriptUrl = NativeModules.SourceCode?.scriptURL;
const metroHost = typeof scriptUrl === 'string'
  ? scriptUrl.match(/^https?:\/\/(\[[^\]]+\]|[^/:]+)/)?.[1]
  : undefined;
const hostLocal = metroHost ?? (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const enderecoLocal = `http://${hostLocal}:3000`;

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? enderecoLocal).replace(/\/$/, '');

// Identidade temporária do protótipo até o login fornecer o id da sessão.
const doadorIdConfigurado = Number(process.env.EXPO_PUBLIC_DOADOR_ID ?? 1);
export const CURRENT_DONOR_ID = Number.isInteger(doadorIdConfigurado) && doadorIdConfigurado > 0
  ? doadorIdConfigurado
  : 1;
