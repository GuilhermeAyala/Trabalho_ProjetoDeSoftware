import { buscarAgendamentosDoador, buscarHemocentros, buscarVagasDisponiveis, criarAgendamento } from '@/services/agendamentoApi';
export type { AgendamentoDoador, HemocentroPublico } from '@/services/agendamentoApi';
export type { VagaHemocentro } from '@/types/hemocentro';
export declare const scheduleModel: {
    listarHemocentros: typeof buscarHemocentros;
    listarVagasDisponiveis: typeof buscarVagasDisponiveis;
    listarAgendamentosDoDoador: typeof buscarAgendamentosDoador;
    criarAgendamento: typeof criarAgendamento;
};
//# sourceMappingURL=ScheduleModel.d.ts.map