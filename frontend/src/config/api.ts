import { Platform } from 'react-native';

// No Android Emulator, localhost aponta para o próprio emulador. Em celular
// físico, configure EXPO_PUBLIC_API_URL com o IP do computador na rede local.
const enderecoLocal = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? enderecoLocal).replace(/\/$/, '');

// Identidade temporária do protótipo até o login fornecer o id da sessão.
const doadorIdConfigurado = Number(process.env.EXPO_PUBLIC_DOADOR_ID ?? 1);
export const CURRENT_DONOR_ID = Number.isInteger(doadorIdConfigurado) && doadorIdConfigurado > 0
  ? doadorIdConfigurado
  : 1;
