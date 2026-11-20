import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { useDonorSession } from '@/context/DonorSession';
import { buscarPerfilDoador } from '@/services/donorApi';

export function useRefreshDonorProfile() {
  const { sessao, definirSessao } = useDonorSession();
  const token = sessao?.token;
  const doadorId = sessao?.doador.id;

  useFocusEffect(useCallback(() => {
    if (!token || !doadorId) return undefined;
    let ativo = true;

    buscarPerfilDoador(token, doadorId)
      .then((doador) => {
        if (ativo) definirSessao({ token, doador });
      })
      .catch(() => {
        // Mantém os últimos dados válidos da sessão se a atualização falhar.
      });

    return () => { ativo = false; };
  }, [definirSessao, doadorId, token]));
}
