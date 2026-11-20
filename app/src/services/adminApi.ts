import { api } from '@/services/api';
import type { AgendamentoHemocentro, EstoqueHemocentro, VagaHemocentro } from '@/types/hemocentro';

export type CentroAdmin = { id: number; nome: string; endereco: string; latitude: number; longitude: number;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'DESATIVADO'; decididoEm: string | null; conta: { email: string } | null };
export type SessaoAdmin = { token: string; email: string };
const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });
const base = (id: number) => `/admin/hemocentros/${id}`;

export async function entrarAdmin(email: string, senha: string) { return (await api.post<SessaoAdmin>('/admin/login', { email, senha })).data; }
export async function listarSolicitacoes(token: string) { return (await api.get<CentroAdmin[]>('/admin/solicitacoes', auth(token))).data; }
export async function decidirSolicitacao(token: string, id: number, decisao: 'APROVADO' | 'RECUSADO') {
  return (await api.patch<CentroAdmin>(`/admin/solicitacoes/${id}`, { decisao }, auth(token))).data;
}
export async function listarCentrosAdmin(token: string) { return (await api.get<CentroAdmin[]>('/admin/hemocentros', auth(token))).data; }
export async function editarCentroAdmin(token: string, id: number, dados: Pick<CentroAdmin, 'nome' | 'endereco' | 'latitude' | 'longitude'>) {
  return (await api.put<CentroAdmin>(base(id), dados, auth(token))).data;
}
export async function ativarCentroAdmin(token: string, id: number, status: 'APROVADO' | 'DESATIVADO') {
  return (await api.patch<CentroAdmin>(`${base(id)}/status`, { status }, auth(token))).data;
}
export async function excluirCentroAdmin(token: string, id: number) {
  return (await api.delete<CentroAdmin>(base(id), auth(token))).data;
}
export async function estoqueAdmin(token: string, id: number) { return (await api.get<EstoqueHemocentro[]>(`${base(id)}/estoque`, auth(token))).data; }
export async function movimentarEstoqueAdmin(token: string, id: number, dados: { tipoSanguineo: string; tipo: 'ENTRADA' | 'BAIXA'; quantidade: number; motivo: string }) {
  return (await api.post(`${base(id)}/estoque/movimentacoes`, dados, auth(token))).data;
}
export async function vagasAdmin(token: string, id: number) { return (await api.get<VagaHemocentro[]>(`${base(id)}/vagas`, auth(token))).data; }
export async function abrirVagaAdmin(token: string, id: number, data: string, horario: string, capacidade: number) {
  return (await api.post<VagaHemocentro>(`${base(id)}/vagas`, { data, horario, capacidade }, auth(token))).data;
}
export async function alterarVagaAdmin(token: string, id: number, vagaId: number, capacidade: number) {
  return (await api.patch<VagaHemocentro>(`${base(id)}/vagas/${vagaId}`, { capacidade }, auth(token))).data;
}
export async function agendaAdmin(token: string, id: number) { return (await api.get<AgendamentoHemocentro[]>(`${base(id)}/agendamentos`, auth(token))).data; }
export async function alterarAgendaAdmin(token: string, id: number, agendamentoId: number, status: AgendamentoHemocentro['status']) {
  return (await api.patch(`${base(id)}/agendamentos/${agendamentoId}/status`, { status }, auth(token))).data;
}
