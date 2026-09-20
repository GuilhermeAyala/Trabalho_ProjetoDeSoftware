import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VoucherCard } from '@/components/VoucherCard';
import { vouchersMock } from '@/data/vouchersMock';
import { userMock } from '@/data/userMock';
import { colors, spacing, typography } from '@/theme';
export function WalletScreen() {
    const navigation = useNavigation();
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsx(Text, { style: styles.title, children: "Minha carteira" }), _jsxs(View, { style: styles.pointsCard, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.pointsLabel, children: "Saldo de Pontos" }), _jsx(Text, { style: styles.points, children: userMock.points }), _jsxs(View, { style: styles.levelRow, children: [_jsx(Ionicons, { color: colors.white, name: "trophy", size: 20 }), _jsxs(Text, { style: styles.level, children: ["Nivel: ", userMock.level] })] })] }), _jsx(Ionicons, { color: colors.white, name: "trophy", size: 122, style: styles.trophy })] }), _jsxs(View, { style: styles.voucherCount, children: [_jsxs(View, { style: styles.countLabel, children: [_jsx(Ionicons, { color: colors.primary[400], name: "wallet", size: 18 }), _jsx(Text, { style: styles.countText, children: "Meus Vouchers Ativos" })] }), _jsx(View, { style: styles.countPill, children: _jsx(Text, { style: styles.countNumber, children: userMock.activeVouchers }) })] }), _jsx(View, { style: styles.list, children: vouchersMock.map((voucher) => (_jsx(VoucherCard, { voucher: voucher, onPress: () => navigation.navigate('VoucherDetails', { voucher }) }, voucher.id))) })] }) }));
}
const styles = StyleSheet.create({
    content: {
        gap: spacing.lg,
        padding: spacing.xl,
        paddingBottom: 120,
    },
    countLabel: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
    },
    countNumber: {
        color: colors.white,
        fontSize: typography.size.md,
        fontWeight: '900',
    },
    countPill: {
        alignItems: 'center',
        backgroundColor: colors.info,
        borderRadius: 10,
        height: 32,
        justifyContent: 'center',
        width: 40,
    },
    countText: {
        color: colors.text.muted,
        fontSize: typography.size.md,
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
    list: {
        gap: spacing.md,
    },
    points: {
        color: colors.white,
        fontSize: 44,
        fontWeight: '900',
        marginVertical: spacing.sm,
    },
    pointsCard: {
        backgroundColor: colors.primary[400],
        borderRadius: 10,
        minHeight: 170,
        overflow: 'hidden',
        padding: spacing.xl,
    },
    pointsLabel: {
        color: colors.white,
        fontSize: typography.size.lg,
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    title: {
        color: colors.primary[400],
        fontSize: typography.size.xl,
        fontWeight: '900',
    },
    trophy: {
        opacity: 0.2,
        position: 'absolute',
        right: 14,
        top: 44,
    },
    voucherCount: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
//# sourceMappingURL=WalletScreen.js.map