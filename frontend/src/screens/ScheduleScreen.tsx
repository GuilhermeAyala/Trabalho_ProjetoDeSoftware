import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { useDonorSession } from '@/context/DonorSession';
import { getApiErrorMessage } from '@/services/api';
import { buscarAgendamentosDoador, buscarHemocentros, buscarVagasDisponiveis, criarAgendamento, type AgendamentoDoador, type HemocentroPublico } from '@/services/agendamentoApi';
import { colors, spacing, typography } from '@/theme';
import type { VagaHemocentro } from '@/types/hemocentro';
import type { AppTabParamList } from '@/types/navigation';

type Props = BottomTabScreenProps<AppTabParamList, 'Schedule'>;

export function ScheduleScreen({ route }: Props) {
  const { sessao } = useDonorSession();
  const [hemocentros, setHemocentros] = useState<HemocentroPublico[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoDoador[]>([]);
  const [vagas, setVagas] = useState<VagaHemocentro[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(route.params?.hemocentroId ?? null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { if (route.params?.hemocentroId) setSelecionado(route.params.hemocentroId); }, [route.params?.hemocentroId]);
  useEffect(() => {
    if (!selecionado) { setVagas([]); return; }
    setData(''); setHorario('');
    let ativo = true;
    buscarVagasDisponiveis(selecionado).then((lista) => { if (ativo) setVagas(lista); })
      .catch((error) => { if (ativo) setErro(getApiErrorMessage(error, 'Não foi possível carregar as vagas.')); });
    return () => { ativo = false; };
  }, [selecionado]);

  async function carregar() {
    setCarregando(true); setErro('');
    try {
      if (!sessao) { setErro('Entre na sua conta de doador para acessar os agendamentos.'); return; }
      const [locais, agenda] = await Promise.all([buscarHemocentros(), buscarAgendamentosDoador(sessao.token, sessao.doador.id)]);
      setHemocentros(locais); setAgendamentos(agenda);
      setSelecionado((atual) => atual ?? locais[0]?.id ?? null);
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível carregar os agendamentos.')); }
    finally { setCarregando(false); }
  }
  useEffect(() => { void carregar(); }, [sessao?.doador.id]);

  async function confirmar() {
    if (!sessao) { setErro('Entre na sua conta de doador para agendar.'); return; }
    if (!selecionado || !data.trim() || !horario.trim()) {
      setErro('Selecione um hemocentro e informe data e horário.'); return;
    }
    setSalvando(true); setErro(''); setMensagem('');
    try {
      await criarAgendamento(sessao.token, sessao.doador.id, selecionado, data, horario);
      setData(''); setHorario(''); setMensagem('Agendamento criado com sucesso.');
      await carregar();
      setVagas(await buscarVagasDisponiveis(selecionado));
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível criar o agendamento.')); }
    finally { setSalvando(false); }
  }

  const suggestedCenter = hemocentros.find((item) => item.id === selecionado);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Agendar doacao</Text>
          <Text style={styles.subtitle}>Escolha um local e um horário aberto pelo hemocentro.</Text>
        </View>

        {carregando ? <Text style={styles.subtitle}>Carregando...</Text> : null}
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}
        {erro ? <PrimaryButton label="TENTAR NOVAMENTE" variant="light" onPress={() => void carregar()} /> : null}

        <SectionTitle>Escolha o hemocentro</SectionTitle>
        {hemocentros.map((item) => <Pressable key={item.id} onPress={() => setSelecionado(item.id)} style={[styles.centerOption, selecionado === item.id && styles.centerSelected]}>
          <Text style={styles.appointmentTitle}>{item.nome}</Text>
          <Text style={styles.appointmentMeta}>{item.endereco}</Text>
        </Pressable>)}

        {suggestedCenter && (
          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons color={colors.white} name="calendar" size={32} />
            </View>
            <Text style={styles.highlightTitle}>{suggestedCenter.nome}</Text>
            <Text style={styles.highlightText}>Horários disponíveis</Text>
            <View style={styles.fields}>
              {vagas.length === 0 ? <Text style={styles.appointmentMeta}>Nenhum horário disponível no momento.</Text> : null}
              {vagas.map((vaga) => <Pressable key={vaga.id} onPress={() => { setData(vaga.data.slice(0, 10)); setHorario(vaga.horario); }} style={[styles.centerOption, data === vaga.data.slice(0, 10) && horario === vaga.horario && styles.centerSelected]}>
                <Text style={styles.appointmentTitle}>{vaga.data.slice(0, 10)} às {vaga.horario}</Text>
                <Text style={styles.appointmentMeta}>{vaga.capacidade - vaga.reservadas} vagas livres</Text>
              </Pressable>)}
            </View>
            <PrimaryButton label={salvando ? 'AGENDANDO...' : 'CONFIRMAR AGENDAMENTO'} disabled={salvando || !data || !horario} onPress={() => void confirmar()} variant="light" />
          </View>
        )}

        <SectionTitle>Proximos agendamentos</SectionTitle>
        <View style={styles.list}>
          {agendamentos.length === 0 && !carregando ? <Text style={styles.subtitle}>Nenhum agendamento encontrado.</Text> : null}
          {agendamentos.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Ionicons color={colors.primary[400]} name="water" size={22} />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>{appointment.hemocentro.nome}</Text>
                <Text style={styles.appointmentMeta}>
                  {appointment.data.slice(0, 10)} às {appointment.horario}
                </Text>
              </View>
              <View style={[styles.statusPill, appointment.status === 'AGENDADO' && styles.pendingPill]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerOption: { borderColor: colors.border, borderRadius: 12, borderWidth: 1.5, gap: 4, padding: spacing.lg },
  centerSelected: { backgroundColor: colors.softPrimary, borderColor: colors.primary[400] },
  fields: { alignSelf: 'stretch', backgroundColor: colors.white, borderRadius: 12, gap: spacing.md, padding: spacing.lg, width: '100%' },
  error: { color: colors.primary[600], fontSize: typography.size.md, fontWeight: '700' },
  success: { color: '#087F54', fontSize: typography.size.md, fontWeight: '700' },
  appointmentCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  appointmentIcon: {
    alignItems: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentMeta: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
  },
  appointmentTitle: {
    color: colors.text.strong,
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: 120,
  },
  highlightCard: {
    alignItems: 'center',
    backgroundColor: colors.primary[400],
    borderRadius: 15,
    gap: spacing.md,
    padding: spacing.xl,
  },
  highlightIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  highlightText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: '700',
  },
  highlightTitle: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: '900',
    textAlign: 'center',
  },
  list: {
    gap: spacing.md,
  },
  pendingPill: {
    backgroundColor: colors.secondary[300],
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  statusPill: {
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.white,
    fontSize: typography.size.tiny,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.primary[400],
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
});
