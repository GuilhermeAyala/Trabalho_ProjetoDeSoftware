import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { useDonorSession } from '@/context/DonorSession';
import { buscarAgendamentosDoador } from '@/services/agendamentoApi';
import type { DonationHistoryItem } from '@/types/domain';

export function useDonorDonations() {
  const { sessao } = useDonorSession();
  const [doacoes, setDoacoes] = useState<DonationHistoryItem[]>([]);
  const token = sessao?.token;
  const doadorId = sessao?.doador.id;

  useFocusEffect(useCallback(() => {
    if (!token || !doadorId) {
      setDoacoes([]);
      return undefined;
    }
    let ativo = true;

    buscarAgendamentosDoador(token, doadorId)
      .then((agendamentos) => {
        if (!ativo) return;
        setDoacoes(agendamentos
          .filter((item) => item.status === 'REALIZADO')
          .sort((a, b) => `${b.data}-${b.horario}`.localeCompare(`${a.data}-${a.horario}`))
          .map((item) => ({
            id: String(item.id),
            date: new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
            time: item.horario,
            place: item.hemocentro.nome,
            points: 50,
          })));
      })
      .catch(() => {
        if (ativo) setDoacoes([]);
      });

    return () => { ativo = false; };
  }, [doadorId, token]));

  return doacoes;
}
