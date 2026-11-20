import { realizarTriagem } from '@/services/triageApi';
// Este contrato usa as mesmas chaves do DTO do backend.
export const triageQuestions = [
    { key: 'estaEmBoasCondicoesDeSaude', text: 'Você está em boas condições de saúde hoje?' },
    { key: 'pesaNoMinimo50Kg', text: 'Você pesa pelo menos 50 kg?' },
    { key: 'dormiuPeloMenosSeisHoras', text: 'Você dormiu pelo menos 6 horas nas últimas 24 horas?' },
    { key: 'estaAlimentado', text: 'Você está alimentado e evitou alimentos muito gordurosos?' },
    { key: 'consumiuAlcoolNasUltimas12Horas', text: 'Você consumiu bebida alcoólica nas últimas 12 horas?' },
    { key: 'possuiSintomasInfecciosos', text: 'Você está com febre, gripe ou outro sintoma infeccioso?' },
    { key: 'fezProcedimentoDeRiscoRecente', text: 'Você fez tatuagem, piercing ou outro procedimento de risco recentemente?' },
];
export const triageModel = {
    realizar: realizarTriagem,
};
//# sourceMappingURL=TriageModel.js.map