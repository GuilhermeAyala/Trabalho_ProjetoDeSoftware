export interface AgendarDoacaoDTO {
    doadorId: number;
    hemocentroId: number;
    // A API recebe data no formato YYYY-MM-DD e horário no formato HH:mm.
    data: string;
    horario: string;
}

export interface AgendamentoDTO {
    id: number;
    data: Date;
    horario: string;
    status: string;
    criadoEm: Date;
    doadorId: number;
    hemocentro: {
        id: number;
        nome: string;
        endereco: string;
    };
}

/**
 * Estados aceitos pela API para o ciclo de um agendamento.
 * O Prisma ainda persiste o campo como String; esta união restringe o contrato
 * HTTP enquanto não houver necessidade de criar um enum no banco.
 */
export const STATUS_AGENDAMENTO = [
    "AGENDADO",
    "CONFIRMADO",
    "REALIZADO",
    "CANCELADO",
] as const;

export type StatusAgendamento = typeof STATUS_AGENDAMENTO[number];

export interface FiltrosAgendamentoHemocentroDTO {
    status?: StatusAgendamento;
    dataInicio?: Date;
    dataFim?: Date;
}
