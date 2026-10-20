export type Hemocentro = {
  id: number;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
};

export type SessaoHemocentro = { hemocentro: Hemocentro; token: string };

export type EstoqueHemocentro = {
  id: number;
  tipoSanguineo: string;
  quantidade: number;
  nivel: string;
};

export type MovimentacaoEstoque = {
  id: number;
  tipo: 'ENTRADA' | 'BAIXA';
  quantidade: number;
  motivo: string;
  criadaEm: string;
  estoque: { tipoSanguineo: string };
};

export type AgendamentoHemocentro = {
  id: number;
  data: string;
  horario: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO';
  doador: { id: number; nome: string; email: string; tipoSanguineo: string };
};

export type VagaHemocentro = {
  id: number;
  hemocentroId: number;
  data: string;
  horario: string;
  capacidade: number;
  reservadas: number;
};
