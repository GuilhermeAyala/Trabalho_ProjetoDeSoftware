import { buscarAgendamentosDoador, buscarHemocentros, buscarVagasDisponiveis, criarAgendamento, } from '@/services/agendamentoApi';
export const scheduleModel = {
    listarHemocentros: buscarHemocentros,
    listarVagasDisponiveis: buscarVagasDisponiveis,
    listarAgendamentosDoDoador: buscarAgendamentosDoador,
    criarAgendamento,
};
//# sourceMappingURL=ScheduleModel.js.map