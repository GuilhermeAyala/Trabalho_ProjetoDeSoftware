import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { donationsMock } from '@/data/donationsMock';
import { userMock } from '@/data/userMock';
import { colors, spacing, typography } from '@/theme';
export function HomeScreen() {
    const navigation = useNavigation();
    const lastDonation = donationsMock[0];
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { children: [_jsxs(Text, { style: styles.greeting, children: ["Ola, ", userMock.name.split(' ')[0]] }), _jsx(Text, { style: styles.subtitle, children: "Pronto para salvar vidas hoje?" })] }), _jsx(View, { style: styles.avatar, children: _jsx(Text, { style: styles.avatarText, children: userMock.initials }) })] }), _jsxs(View, { style: styles.pointsCard, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.pointsLabel, children: "Saldo de Pontos" }), _jsx(Text, { style: styles.points, children: userMock.points }), _jsxs(View, { style: styles.levelRow, children: [_jsx(Ionicons, { color: colors.white, name: "trophy", size: 20 }), _jsxs(Text, { style: styles.level, children: ["Nivel: ", userMock.level] })] })] }), _jsx(Ionicons, { color: colors.white, name: "trophy", size: 112, style: styles.trophy })] }), _jsxs(View, { style: styles.quickActions, children: [_jsx(PrimaryButton, { label: "AGENDAR DOACAO", onPress: () => navigation.navigate('AppTabs', { screen: 'Schedule' }) }), _jsx(PrimaryButton, { label: "CENTRAL DE INFORMACOES", onPress: () => navigation.navigate('InformationCenter'), variant: "light" })] }), _jsx(SectionTitle, { children: "Seu impacto" }), _jsxs(View, { style: styles.impactGrid, children: [_jsxs(View, { style: styles.impactCard, children: [_jsx(Ionicons, { color: colors.primary[400], name: "water", size: 28 }), _jsx(Text, { style: styles.impactValue, children: userMock.donationsCount }), _jsx(Text, { style: styles.impactLabel, children: "Doacoes realizadas" })] }), _jsxs(View, { style: styles.impactCard, children: [_jsx(Ionicons, { color: colors.success, name: "trending-up", size: 28 }), _jsx(Text, { style: styles.impactValue, children: userMock.totalPoints }), _jsx(Text, { style: styles.impactLabel, children: "Pontos ganhos" })] })] }), lastDonation && (_jsxs(View, { style: styles.lastDonation, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.lastTitle, children: "Ultima doacao" }), _jsx(Text, { style: styles.lastText, children: lastDonation.place }), _jsxs(Text, { style: styles.lastMuted, children: [lastDonation.date, " as ", lastDonation.time] })] }), _jsx(PrimaryButton, { label: "HISTORICO", onPress: () => navigation.navigate('DonationHistory'), style: styles.smallButton })] }))] }) }));
}
const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        backgroundColor: colors.primary[400],
        borderRadius: 24,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    avatarText: {
        color: colors.white,
        fontSize: typography.size.lg,
        fontWeight: '900',
    },
    content: {
        gap: spacing.xl,
        padding: spacing.xl,
        paddingBottom: 120,
    },
    greeting: {
        color: colors.text.strong,
        fontSize: typography.size.xxl,
        fontWeight: '900',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    impactCard: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 12,
        borderWidth: 1.5,
        flex: 1,
        padding: spacing.lg,
    },
    impactGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    impactLabel: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
    },
    impactValue: {
        color: colors.text.strong,
        fontSize: typography.size.xxl,
        fontWeight: '900',
        marginTop: spacing.sm,
    },
    lastDonation: {
        backgroundColor: colors.softPrimary,
        borderRadius: 18,
        gap: spacing.md,
        padding: spacing.lg,
    },
    lastMuted: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
        marginTop: 4,
    },
    lastText: {
        color: colors.text.strong,
        fontSize: typography.size.lg,
        fontWeight: '800',
        marginTop: 6,
    },
    lastTitle: {
        color: colors.primary[600],
        fontSize: typography.size.sm,
        fontWeight: '800',
    },
    level: {
        color: colors.white,
        fontSize: typography.size.md,
        fontWeight: '800',
    },
    levelRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
    },
    points: {
        color: colors.white,
        fontSize: 46,
        fontWeight: '900',
        marginVertical: spacing.sm,
    },
    pointsCard: {
        backgroundColor: colors.primary[400],
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 172,
        overflow: 'hidden',
        padding: spacing.xl,
    },
    pointsLabel: {
        color: colors.white,
        fontSize: typography.size.lg,
    },
    quickActions: {
        gap: spacing.md,
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    smallButton: {
        height: 42,
    },
    subtitle: {
        color: colors.text.muted,
        fontSize: typography.size.md,
        marginTop: 4,
    },
    trophy: {
        opacity: 0.22,
        position: 'absolute',
        right: -12,
        top: 32,
    },
});
//# sourceMappingURL=HomeScreen.js.map