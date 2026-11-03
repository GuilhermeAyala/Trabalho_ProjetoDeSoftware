import { type AgendamentoDoador, type HemocentroPublico, type VagaHemocentro } from '@/models/ScheduleModel';
type ScheduleSession = {
    token: string;
    doadorId: number;
} | null;
export declare function useScheduleViewModel(sessao: ScheduleSession, hemocentroInicial?: number): {
    agendamentos: AgendamentoDoador[];
    carregando: boolean;
    confirmar: () => Promise<number | null>;
    data: string;
    erro: string;
    hemocentros: HemocentroPublico[];
    hemocentroSelecionado: HemocentroPublico | undefined;
    horario: string;
    mensagem: string;
    recarregar: () => Promise<void>;
    salvando: boolean;
    selecionado: number | null;
    selecionarHemocentro: import("react").Dispatch<import("react").SetStateAction<number | null>>;
    selecionarVaga: (vaga: VagaHemocentro) => void;
    vagas: VagaHemocentro[];
};
export {};
//# sourceMappingURL=useScheduleViewModel.d.ts.map