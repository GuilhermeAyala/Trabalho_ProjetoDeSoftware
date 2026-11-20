import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, typography } from '@/theme';
export function TextField({ label, secureTextEntry, ...inputProps }) {
    return (_jsxs(View, { style: styles.container, children: [_jsx(Text, { style: styles.label, children: label }), _jsx(TextInput, { placeholderTextColor: colors.text.muted, secureTextEntry: secureTextEntry, style: styles.input, ...inputProps })] }));
}
const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    input: {
        borderColor: colors.fieldBorder,
        borderRadius: 16,
        borderWidth: 1,
        color: colors.text.strong,
        fontSize: typography.size.md + 1,
        height: 56,
        paddingHorizontal: 18,
    },
    label: {
        color: colors.primary[600],
        fontSize: typography.size.sm,
        fontWeight: '800',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=TextField.js.map