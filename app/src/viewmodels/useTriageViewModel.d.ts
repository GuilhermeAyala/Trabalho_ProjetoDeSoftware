import { type AnswerKey } from '@/models/TriageModel';
import type { TriageAnswers, TriageResult } from '@/types/triage';
type TriageSession = {
    token: string;
    doadorId: number;
} | null;
export declare function useTriageViewModel(sessao: TriageSession, agendamentoId?: number): {
    allQuestionsAnswered: boolean;
    answerQuestion: (key: AnswerKey, value: boolean) => void;
    answers: Partial<Record<keyof TriageAnswers, boolean>>;
    error: string;
    isLoading: boolean;
    notice: string;
    questions: {
        key: AnswerKey;
        text: string;
    }[];
    restartTriage: () => void;
    result: TriageResult | null;
    submitTriage: () => Promise<void>;
};
export {};
//# sourceMappingURL=useTriageViewModel.d.ts.map