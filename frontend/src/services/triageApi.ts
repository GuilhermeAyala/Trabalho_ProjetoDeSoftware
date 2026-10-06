import { api } from '@/services/api';
import type { TriageAnswers, TriageResponse } from '@/types/triage';

type RealizarTriagemInput = {
  doadorId: number;
  respostas: TriageAnswers;
};

export async function realizarTriagem(input: RealizarTriagemInput): Promise<TriageResponse> {
  const { data } = await api.post<TriageResponse>('/triagens', input);
  return data;
}
