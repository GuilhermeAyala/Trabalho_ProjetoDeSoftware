import { api } from '@/services/api';
import type { VagaHemocentro } from '@/types/hemocentro';

export type HemocentroPublico = {
  id: number; nome: string; endereco: string; latitude: number; longitude: number; distanciaKm?: number;
};

export type AgendamentoDoador = {
  id: number; data: string; horario: string; status: string;
  hemocentro: { id: number; nome: string; endereco: string };
};

export async function buscarHemocentros() {
  const response = await api.get<HemocentroPublico[]>('/hemocentros');
  return response.data;
}

export async function buscarVagasDisponiveis(hemocentroId: number) {
  const response = await api.get<VagaHemocentro[]>(`/hemocentros/${hemocentroId}/vagas`);
  return response.data;
}

function auth(token: string) { return { headers: { Authorization: `Bearer ${token}` } }; }

export async function buscarAgendamentosDoador(token: string, doadorId: number) {
  const response = await api.get<AgendamentoDoador[]>(`/agendamentos/doador/${doadorId}`, auth(token));
  return response.data;
}

export async function criarAgendamento(token: string, doadorId: number, hemocentroId: number, data: string, horario: string) {
  const response = await api.post('/agendamentos', { doadorId, hemocentroId, data, horario }, auth(token));
  return response.data;
}
