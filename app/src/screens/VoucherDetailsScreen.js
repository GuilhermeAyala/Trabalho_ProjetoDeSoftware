import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';
export function VoucherDetailsScreen({ navigation, route }) {
    const { voucher } = route.params;
    return (_jsxs(SafeAreaView, { edges: ['bottom'], style: styles.safeArea, children: [_jsx(ScreenHeader, { title: "Detalhes do voucher", onBack: navigation.goBack }), _jsx(ScrollView, { contentContainerStyle: styles.content, children: _jsxs(View, { style: styles.card, children: [_jsx(View, { style: [styles.icon, { backgroundColor: voucher.accentColor }], children: _jsx(Ionicons, { color: colors.white, name: voucher.iconName, size: 42 }) }), _jsx(Text, { style: styles.brand, children: voucher.brand }), _jsx(Text, { style: [styles.title, { color: voucher.accentColor }], children: voucher.title }), _jsx(View, { style: styles.imageMock, children: _jsx(Ionicons, { color: colors.secondary[400], name: "gift", size: 84 }) }), _jsx(Text, { style: styles.label, children: "Codigo do voucher" }), _jsx(View, { style: styles.codeBox, children: _jsx(Text, { style: styles.code, children: voucher.code }) }), _jsxs(View, { style: styles.detailsBox, children: [_jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Desconto:" }), _jsx(Text, { style: styles.detailValue, children: voucher.tag })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Data de aquisicao:" }), _jsx(Text, { style: styles.detailValue, children: voucher.acquiredAt })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Valido ate:" }), _jsx(Text, { style: styles.detailValue, children: voucher.expiresAt })] })] }), _jsx(PrimaryButton, { label: "USAR VOUCHER", variant: "secondary" })] }) })] }));
}
const styles = StyleSheet.create({
    brand: {
        color: colors.text.strong,
        fontSize: typography.size.xxl,
        fontWeight: '900',
        marginTop: spacing.lg,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 18,
        borderWidth: 1.5,
        padding: spacing.xl,
    },
    code: {
        color: colors.primary[600],
        fontSize: typography.size.xl,
        fontWeight: '900',
        letterSpacing: 0,
        textAlign: 'center',
    },
    codeBox: {
        backgroundColor: colors.softPrimary,
        borderRadius: 10,
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
    },
    content: {
        padding: spacing.xl,
    },
    detailLabel: {
        color: colors.text.strong,
        flex: 1,
        fontSize: typography.size.sm,
        fontWeight: '700',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailValue: {
        color: colors.text.strong,
        fontSize: typography.size.sm,
        fontWeight: '800',
    },
    detailsBox: {
        backgroundColor: colors.softPrimary,
        borderRadius: 10,
        gap: spacing.sm,
        marginVertical: spacing.lg,
        padding: spacing.lg,
    },
    icon: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 40,
        height: 80,
        justifyContent: 'center',
        width: 80,
    },
    imageMock: {
        alignItems: 'center',
        backgroundColor: colors.softPrimary,
        borderRadius: 12,
        height: 230,
        justifyContent: 'center',
        marginVertical: spacing.xl,
    },
    label: {
        color: colors.text.strong,
        fontSize: typography.size.md,
        fontWeight: '800',
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    title: {
        fontSize: typography.size.xl,
        fontWeight: '900',
        marginTop: spacing.sm,
        textAlign: 'center',
    },
});
//# sourceMappingURL=VoucherDetailsScreen.js.map