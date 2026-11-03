import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { useDonorSession } from '@/context/DonorSession';
import { colors, spacing, typography } from '@/theme';
import { useScheduleViewModel } from '@/viewmodels/useScheduleViewModel';
export function ScheduleScreen({ route }) {
    const navigation = useNavigation();
    const { sessao } = useDonorSession();
    const viewModelSession = useMemo(() => sessao ? { token: sessao.token, doadorId: sessao.doador.id } : null, [sessao?.doador.id, sessao?.token]);
    const vm = useScheduleViewModel(viewModelSession, route.params?.hemocentroId);
    async function confirmar() {
        const agendamentoId = await vm.confirmar();
        if (agendamentoId && sessao) {
            navigation.navigate('Triage', {
                doadorId: sessao.doador.id,
                agendamentoId,
            });
        }
    }
    return (<SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Agendar doação</Text>
          <Text style={styles.subtitle}>Escolha um local e um horário aberto pelo hemocentro.</Text>
        </View>

        {vm.carregando ? <Text style={styles.subtitle}>Carregando...</Text> : null}
        {vm.erro ? <Text style={styles.error}>{vm.erro}</Text> : null}
        {vm.mensagem ? <Text style={styles.success}>{vm.mensagem}</Text> : null}
        {vm.erro ? <PrimaryButton label="TENTAR NOVAMENTE" variant="light" onPress={() => void vm.recarregar()}/> : null}

        <SectionTitle>Escolha o hemocentro</SectionTitle>
        {vm.hemocentros.map((item) => (<Pressable key={item.id} onPress={() => vm.selecionarHemocentro(item.id)} style={[styles.centerOption, vm.selecionado === item.id && styles.centerSelected]}>
            <Text style={styles.appointmentTitle}>{item.nome}</Text>
            <Text style={styles.appointmentMeta}>{item.endereco}</Text>
          </Pressable>))}

        {vm.hemocentroSelecionado && (<View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons color={colors.white} name="calendar" size={32}/>
            </View>
            <Text style={styles.highlightTitle}>{vm.hemocentroSelecionado.nome}</Text>
            <Text style={styles.highlightText}>Horários disponíveis</Text>
            <View style={styles.fields}>
              {vm.vagas.length === 0 ? <Text style={styles.appointmentMeta}>Nenhum horário disponível no momento.</Text> : null}
              {vm.vagas.map((vaga) => (<Pressable key={vaga.id} onPress={() => vm.selecionarVaga(vaga)} style={[styles.centerOption, vm.data === vaga.data.slice(0, 10) && vm.horario === vaga.horario && styles.centerSelected]}>
                  <Text style={styles.appointmentTitle}>{vaga.data.slice(0, 10)} às {vaga.horario}</Text>
                  <Text style={styles.appointmentMeta}>{vaga.capacidade - vaga.reservadas} vagas livres</Text>
                </Pressable>))}
            </View>
            <PrimaryButton label={vm.salvando ? 'AGENDANDO...' : 'CONFIRMAR AGENDAMENTO'} disabled={vm.salvando || !vm.data || !vm.horario} onPress={() => void confirmar()} variant="light"/>
          </View>)}

        <SectionTitle>Próximos agendamentos</SectionTitle>
        <View style={styles.list}>
          {vm.agendamentos.length === 0 && !vm.carregando ? <Text style={styles.subtitle}>Nenhum agendamento encontrado.</Text> : null}
          {vm.agendamentos.map((appointment) => (<View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Ionicons color={colors.primary[400]} name="water" size={22}/>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>{appointment.hemocentro.nome}</Text>
                <Text style={styles.appointmentMeta}>{appointment.data.slice(0, 10)} às {appointment.horario}</Text>
              </View>
              <View style={styles.statusActions}>
                <View style={[styles.statusPill, ['AGUARDANDO_TRIAGEM', 'AGENDADO'].includes(appointment.status) && styles.pendingPill]}>
                  <Text style={styles.statusText}>{appointment.status.replaceAll('_', ' ')}</Text>
                </View>
                {appointment.status === 'AGUARDANDO_TRIAGEM' ? (<Pressable onPress={() => navigation.navigate('Triage', { doadorId: sessao.doador.id, agendamentoId: appointment.id })} style={styles.triageLink}>
                    <Text style={styles.triageLinkText}>FAZER TRIAGEM</Text>
                  </Pressable>) : null}
              </View>
            </View>))}
        </View>
      </ScrollView>
    </SafeAreaView>);
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
    statusActions: {
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    statusText: {
        color: colors.white,
        fontSize: typography.size.tiny,
        fontWeight: '900',
    },
    triageLink: {
        borderColor: colors.primary[400],
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: spacing.sm,
        paddingVertical: 5,
    },
    triageLinkText: {
        color: colors.primary[500],
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
//# sourceMappingURL=ScheduleScreen.js.map