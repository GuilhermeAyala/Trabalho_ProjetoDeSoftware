import { API_URL } from '@/config/api';
import type { TriageAnswers, TriageResponse } from '@/types/triage';

type RealizarTriagemInput = {
  doadorId: number;
  respostas: TriageAnswers;
};

export async function realizarTriagem(input: RealizarTriagemInput): Promise<TriageResponse> {
  const response = await fetch(`${API_URL}/triagens`, {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const dados = await response.json().catch(() => null) as TriageResponse | { message?: string } | null;

  if (!response.ok) {
    throw new Error(dados?.message ?? 'Não foi possível concluir a triagem');
  }

  return dados as TriageResponse;
}
