import { realizarTriagem } from '@/services/triageApi';
import type { TriageAnswers } from '@/types/triage';
export type AnswerKey = keyof TriageAnswers;
export type PartialTriageAnswers = Partial<Record<AnswerKey, boolean>>;
export declare const triageQuestions: {
    key: AnswerKey;
    text: string;
}[];
export declare const triageModel: {
    realizar: typeof realizarTriagem;
};
//# sourceMappingURL=TriageModel.d.ts.map