import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { appointmentsMock } from '@/data/appointmentsMock';
import { bloodCentersMock } from '@/data/bloodCentersMock';
import { colors, spacing, typography } from '@/theme';
export function ScheduleScreen() {
    const suggestedCenter = bloodCentersMock[0];
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.title, children: "Agendar doacao" }), _jsx(Text, { style: styles.subtitle, children: "Escolha um local, confirme o horario e acompanhe seus agendamentos." })] }), suggestedCenter && (_jsxs(View, { style: styles.highlightCard, children: [_jsx(View, { style: styles.highlightIcon, children: _jsx(Ionicons, { color: colors.white, name: "calendar", size: 32 }) }), _jsx(Text, { style: styles.highlightTitle, children: suggestedCenter.name }), _jsx(Text, { style: styles.highlightText, children: suggestedCenter.nextSlot }), _jsx(PrimaryButton, { label: "CONFIRMAR AGENDAMENTO", variant: "light" })] })), _jsx(SectionTitle, { children: "Proximos agendamentos" }), _jsx(View, { style: styles.list, children: appointmentsMock.map((appointment) => (_jsxs(View, { style: styles.appointmentCard, children: [_jsx(View, { style: styles.appointmentIcon, children: _jsx(Ionicons, { color: colors.primary[400], name: "water", size: 22 }) }), _jsxs(View, { style: styles.appointmentInfo, children: [_jsx(Text, { style: styles.appointmentTitle, children: appointment.bloodCenter }), _jsxs(Text, { style: styles.appointmentMeta, children: [appointment.date, " as ", appointment.time] })] }), _jsx(View, { style: [styles.statusPill, appointment.status === 'pending' && styles.pendingPill], children: _jsx(Text, { style: styles.statusText, children: appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente' }) })] }, appointment.id))) })] }) }));
}
const styles = StyleSheet.create({
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
//# sourceMappingURL=ScheduleScreen.js.map