import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
export function StatCard({ icon, label, value, tone = 'primary' }) {
    return (_jsxs(View, { style: [styles.card, tone === 'success' && styles.success], children: [_jsx(Ionicons, { color: colors.white, name: icon, size: 34 }), _jsx(Text, { style: styles.value, children: value }), _jsx(Text, { style: styles.label, children: label })] }));
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.primary[300],
        borderRadius: 10,
        flex: 1,
        minHeight: 150,
        padding: 18,
    },
    label: {
        color: colors.white,
        fontSize: typography.size.xs,
        letterSpacing: 0,
        marginTop: 8,
    },
    success: {
        backgroundColor: colors.success,
    },
    value: {
        color: colors.white,
        fontSize: typography.size.hero,
        fontWeight: '900',
        letterSpacing: 0,
        marginTop: 10,
    },
});
//# sourceMappingURL=StatCard.js.map