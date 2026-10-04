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
