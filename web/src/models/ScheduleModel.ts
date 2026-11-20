import {
  buscarAgendamentosDoador,
  buscarHemocentros,
  buscarVagasDisponiveis,
  criarAgendamento,
} from '@/services/agendamentoApi';

export type { AgendamentoDoador, HemocentroPublico } from '@/services/agendamentoApi';
export type { VagaHemocentro } from '@/types/hemocentro';

export const scheduleModel = {
  listarHemocentros: buscarHemocentros,
  listarVagasDisponiveis: buscarVagasDisponiveis,
  listarAgendamentosDoDoador: buscarAgendamentosDoador,
  criarAgendamento,
};
