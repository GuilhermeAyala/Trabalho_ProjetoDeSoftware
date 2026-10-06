import axios from 'axios';

import { API_URL } from '@/config/api';

type ApiErrorBody = {
  message?: string;
};

// Toda comunicação HTTP do app passa por esta instância. Assim, endereço,
// timeout e cabeçalhos ficam iguais para triagem, perfil e fluxos futuros.
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'A API demorou para responder. Tente novamente.';
  }

  if (!error.response) {
    return `Não foi possível conectar à API em ${API_URL}. Verifique se o backend está rodando.`;
  }

  return fallback;
}
