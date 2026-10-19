import { api } from '@/services/api';
import type { AgendamentoHemocentro, EstoqueHemocentro, MovimentacaoEstoque, SessaoHemocentro, VagaHemocentro } from '@/types/hemocentro';

type CadastroHemocentro = {
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  email: string;
  senha: string;
};

function auth(token: string) { return { headers: { Authorization: `Bearer ${token}` } }; }

export async function cadastrarHemocentro(dados: CadastroHemocentro) {
  const response = await api.post<SessaoHemocentro>('/hemocentros/cadastro', dados);
  return response.data;
}

export async function entrarHemocentro(email: string, senha: string) {
  const response = await api.post<SessaoHemocentro>('/hemocentros/login', { email, senha });
  return response.data;
}

export async function listarEstoque(token: string) {
  const response = await api.get<EstoqueHemocentro[]>('/hemocentros/me/estoque', auth(token));
  return response.data;
}

export async function listarMovimentacoes(token: string) {
  const response = await api.get<MovimentacaoEstoque[]>('/hemocentros/me/estoque/movimentacoes', auth(token));
  return response.data;
}

export async function movimentarEstoque(token: string, dados: {
  tipoSanguineo: string; tipo: 'ENTRADA' | 'BAIXA'; quantidade: number; motivo: string;
}) {
  const response = await api.post('/hemocentros/me/estoque/movimentacoes', dados, auth(token));
  return response.data;
}

export async function listarAgenda(token: string) {
  const response = await api.get<AgendamentoHemocentro[]>('/hemocentros/me/agendamentos', auth(token));
  return response.data;
}

export async function atualizarAgendamento(token: string, id: number, status: AgendamentoHemocentro['status']) {
  const response = await api.patch(`/hemocentros/me/agendamentos/${id}/status`, { status }, auth(token));
  return response.data;
}

export async function listarVagasHemocentro(token: string) {
  const response = await api.get<VagaHemocentro[]>('/hemocentros/me/vagas', auth(token));
  return response.data;
}

export async function abrirVaga(token: string, data: string, horario: string, capacidade: number) {
  const response = await api.post<VagaHemocentro>('/hemocentros/me/vagas', { data, horario, capacidade }, auth(token));
  return response.data;
}

export async function alterarCapacidadeVaga(token: string, vagaId: number, capacidade: number) {
  const response = await api.patch<VagaHemocentro>(`/hemocentros/me/vagas/${vagaId}`, { capacidade }, auth(token));
  return response.data;
}
