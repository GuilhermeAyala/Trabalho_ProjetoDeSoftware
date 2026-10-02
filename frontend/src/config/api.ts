import { Platform } from 'react-native';

// No Android Emulator, localhost aponta para o próprio emulador. Em celular
// físico, configure EXPO_PUBLIC_API_URL com o IP do computador na rede local.
const enderecoLocal = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? enderecoLocal).replace(/\/$/, '');
