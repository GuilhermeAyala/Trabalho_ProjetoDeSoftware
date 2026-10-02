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
    respostas: RespostasTriagemDTO;
}

export interface ResultadoTriagemDTO {
    id: number;
    doadorId: number;
    apto: boolean;
    motivosInaptidao: string[];
    realizadaEm: Date;
}
