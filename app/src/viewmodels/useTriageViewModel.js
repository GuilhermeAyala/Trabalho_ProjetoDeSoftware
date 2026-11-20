import { useCallback, useMemo, useState } from 'react';
import { triageModel, triageQuestions, } from '@/models/TriageModel';
import { getApiErrorMessage } from '@/services/api';
export function useTriageViewModel(sessao, agendamentoId) {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const allQuestionsAnswered = useMemo(() => triageQuestions.every(({ key }) => typeof answers[key] === 'boolean'), [answers]);
    const answerQuestion = useCallback((key, value) => {
        setAnswers((current) => ({ ...current, [key]: value }));
        setError('');
    }, []);
    const submitTriage = useCallback(async () => {
        if (!allQuestionsAnswered) {
            setError('Responda todas as perguntas antes de continuar.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            if (!sessao)
                throw new Error('Entre na sua conta de doador para realizar a triagem.');
            const response = await triageModel.realizar(sessao.token, {
                doadorId: sessao.doadorId,
                agendamentoId,
                respostas: answers,
            });
            setResult(response.resultado);
            setNotice(response.aviso);
        }
        catch (requestError) {
            setError(getApiErrorMessage(requestError, 'Não foi possível concluir a triagem.'));
        }
        finally {
            setIsLoading(false);
        }
    }, [agendamentoId, allQuestionsAnswered, answers, sessao]);
    const restartTriage = useCallback(() => {
        setAnswers({});
        setResult(null);
        setNotice('');
        setError('');
    }, []);
    return {
        allQuestionsAnswered,
        answerQuestion,
        answers,
        error,
        isLoading,
        notice,
        questions: triageQuestions,
        restartTriage,
        result,
        submitTriage,
    };
}
//# sourceMappingURL=useTriageViewModel.js.map