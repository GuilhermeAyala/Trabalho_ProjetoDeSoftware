export interface RespostasTriagemDTO {
    estaEmBoasCondicoesDeSaude: boolean;
    pesaNoMinimo50Kg: boolean;
    dormiuPeloMenosSeisHoras: boolean;
    estaAlimentado: boolean;
    consumiuAlcoolNasUltimas12Horas: boolean;
    possuiSintomasInfecciosos: boolean;
    fezProcedimentoDeRiscoRecente: boolean;
}

export interface RealizarTriagemDTO {
    doadorId: number;
    agendamentoId?: number;
    respostas: RespostasTriagemDTO;
}

export interface ResultadoTriagemDTO {
    id: number;
    doadorId: number;
    agendamentoId: number | null;
    apto: boolean;
    motivosInaptidao: string[];
    realizadaEm: Date;
    agendamentoCancelado: boolean;
}
