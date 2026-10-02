export type TriageAnswers = {
  estaEmBoasCondicoesDeSaude: boolean;
  pesaNoMinimo50Kg: boolean;
  dormiuPeloMenosSeisHoras: boolean;
  estaAlimentado: boolean;
  consumiuAlcoolNasUltimas12Horas: boolean;
  possuiSintomasInfecciosos: boolean;
  fezProcedimentoDeRiscoRecente: boolean;
};

export type TriageResult = {
  id: number;
  doadorId: number;
  apto: boolean;
  motivosInaptidao: string[];
  realizadaEm: string;
};

export type TriageResponse = {
  message: string;
  aviso: string;
  resultado: TriageResult;
};
