import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  scheduleModel,
  type AgendamentoDoador,
  type HemocentroPublico,
  type VagaHemocentro,
} from '@/models/ScheduleModel';
import { getApiErrorMessage } from '@/services/api';

type ScheduleSession = {
  token: string;
  doadorId: number;
} | null;

export function useScheduleViewModel(sessao: ScheduleSession, hemocentroInicial?: number) {
  const [hemocentros, setHemocentros] = useState<HemocentroPublico[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoDoador[]>([]);
  const [vagas, setVagas] = useState<VagaHemocentro[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(hemocentroInicial ?? null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (hemocentroInicial) setSelecionado(hemocentroInicial);
  }, [hemocentroInicial]);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      if (!sessao) {
        setErro('Entre na sua conta de doador para acessar os agendamentos.');
        return;
      }
      const [locais, agenda] = await Promise.all([
        scheduleModel.listarHemocentros(),
        scheduleModel.listarAgendamentosDoDoador(sessao.token, sessao.doadorId),
      ]);
      setHemocentros(locais);
      setAgendamentos(agenda);
      setSelecionado((atual) => atual ?? locais[0]?.id ?? null);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar os agendamentos.'));
    } finally {
      setCarregando(false);
    }
  }, [sessao?.doadorId, sessao?.token]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (!selecionado) {
      setVagas([]);
      return;
    }
    setData('');
    setHorario('');
    let ativo = true;
    scheduleModel.listarVagasDisponiveis(selecionado)
      .then((lista) => { if (ativo) setVagas(lista); })
      .catch((error) => {
        if (ativo) setErro(getApiErrorMessage(error, 'Não foi possível carregar as vagas.'));
      });
    return () => { ativo = false; };
  }, [selecionado]);

  const selecionarVaga = useCallback((vaga: VagaHemocentro) => {
    setData(vaga.data.slice(0, 10));
    setHorario(vaga.horario);
    setErro('');
  }, []);

  const confirmar = useCallback(async () => {
    if (!sessao) {
      setErro('Entre na sua conta de doador para agendar.');
      return null;
    }
    if (!selecionado || !data.trim() || !horario.trim()) {
      setErro('Selecione um hemocentro e informe data e horário.');
      return null;
    }

    setSalvando(true);
    setErro('');
    setMensagem('');
    try {
      const response = await scheduleModel.criarAgendamento(
        sessao.token,
        sessao.doadorId,
        selecionado,
        data,
        horario,
      );
      setData('');
      setHorario('');
      setMensagem('Horário reservado. Conclua a triagem para confirmar.');
      await carregar();
      setVagas(await scheduleModel.listarVagasDisponiveis(selecionado));
      return response.agendamento.id;
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível criar o agendamento.'));
      return null;
    } finally {
      setSalvando(false);
    }
  }, [carregar, data, horario, selecionado, sessao]);

  const hemocentroSelecionado = useMemo(
    () => hemocentros.find((item) => item.id === selecionado),
    [hemocentros, selecionado],
  );

  return {
    agendamentos,
    carregando,
    confirmar,
    data,
    erro,
    hemocentros,
    hemocentroSelecionado,
    horario,
    mensagem,
    recarregar: carregar,
    salvando,
    selecionado,
    selecionarHemocentro: setSelecionado,
    selecionarVaga,
    vagas,
  };
}
