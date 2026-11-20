import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
export function VoucherCard({ voucher, onPress }) {
    return (_jsxs(Pressable, { accessibilityRole: "button", onPress: onPress, style: styles.card, children: [_jsxs(View, { style: styles.header, children: [_jsx(View, { style: [styles.brandIcon, { backgroundColor: voucher.accentColor }], children: _jsx(Ionicons, { color: colors.white, name: voucher.iconName, size: 24 }) }), _jsxs(View, { style: styles.copy, children: [_jsx(Text, { style: styles.brand, children: voucher.brand }), _jsx(Text, { style: [styles.title, { color: voucher.accentColor }], children: voucher.title })] })] }), _jsxs(View, { style: styles.tagRow, children: [_jsx(View, { style: styles.tag, children: _jsx(Text, { style: styles.tagText, children: voucher.tag }) }), _jsx(Ionicons, { color: colors.secondary[400], name: "pricetag-outline", size: 20 })] }), _jsxs(Text, { style: styles.expiration, children: ["Valido ate: ", voucher.expiresAt] }), _jsx(View, { style: styles.button, children: _jsx(Text, { style: styles.buttonText, children: "Usar Voucher" }) })] }));
}
const styles = StyleSheet.create({
    brand: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
        letterSpacing: 0,
    },
    brandIcon: {
        alignItems: 'center',
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    button: {
        alignItems: 'center',
        backgroundColor: colors.secondary[300],
        borderRadius: 16,
        height: 32,
        justifyContent: 'center',
        marginTop: 18,
    },
    buttonText: {
        color: colors.white,
        fontSize: typography.size.md,
        fontWeight: '800',
    },
    card: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 15,
        borderWidth: 1.5,
        padding: 18,
    },
    copy: {
        flex: 1,
        gap: 2,
    },
    expiration: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
        marginLeft: 62,
        marginTop: 8,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 16,
    },
    tag: {
        backgroundColor: colors.secondary[300],
        borderRadius: 16,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    tagRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        marginLeft: 62,
        marginTop: 8,
    },
    tagText: {
        color: colors.white,
        fontSize: typography.size.tiny,
        fontWeight: '700',
    },
    title: {
        fontSize: typography.size.xl,
        fontWeight: '900',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=VoucherCard.js.map