import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
import { PrimaryButton } from './PrimaryButton';
export function BloodCenterCard({ bloodCenter, onSchedule }) {
    return (_jsxs(View, { style: styles.card, children: [_jsxs(View, { style: styles.header, children: [_jsx(View, { style: styles.icon, children: _jsx(Ionicons, { color: colors.primary[400], name: "medical", size: 24 }) }), _jsxs(View, { style: styles.copy, children: [_jsx(Text, { style: styles.title, children: bloodCenter.name }), _jsx(Text, { style: styles.address, children: bloodCenter.address })] })] }), _jsxs(View, { style: styles.metaRow, children: [_jsxs(View, { style: styles.metaItem, children: [_jsx(Ionicons, { color: colors.secondary[400], name: "navigate", size: 18 }), _jsx(Text, { style: styles.metaText, children: bloodCenter.distance })] }), _jsxs(View, { style: styles.metaItem, children: [_jsx(Ionicons, { color: colors.secondary[400], name: "calendar", size: 18 }), _jsx(Text, { style: styles.metaText, children: bloodCenter.nextSlot })] })] }), _jsx(PrimaryButton, { label: "AGENDAR DOACAO", onPress: onSchedule, variant: "secondary", style: styles.button })] }));
}
const styles = StyleSheet.create({
    address: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
    },
    button: {
        height: 42,
        marginTop: 16,
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
        gap: 4,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
    },
    icon: {
        alignItems: 'center',
        backgroundColor: colors.softPrimary,
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    metaItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 18,
        marginTop: 16,
    },
    metaText: {
        color: colors.text.strong,
        fontSize: typography.size.sm,
        fontWeight: '700',
    },
    title: {
        color: colors.text.strong,
        fontSize: typography.size.lg,
        fontWeight: '800',
    },
});
//# sourceMappingURL=BloodCenterCard.js.map