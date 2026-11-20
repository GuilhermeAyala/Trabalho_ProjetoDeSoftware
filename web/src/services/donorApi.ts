import { api } from '@/services/api';
import type { DonorSession } from '@/types/donor';

export type DonorRegistration = {
  nome: string; email: string; password: string; cpf: string;
  sexo: string; tipoSanguineo: string; DataNascimento: string;
};

export async function cadastrarDoador(dados: DonorRegistration): Promise<DonorSession> {
  const { data } = await api.post<DonorSession>('/doadores/cadastro', dados);
  return data;
}

export async function entrarDoador(email: string, password: string): Promise<DonorSession> {
  const { data } = await api.post<DonorSession>('/doadores/login', { email, password });
  return data;
}

export async function buscarPerfilDoador(token: string, doadorId: number): Promise<DonorSession['doador']> {
  const { data } = await api.get<DonorSession['doador']>(`/doadores/${doadorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

