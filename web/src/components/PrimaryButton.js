import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme';
export function PrimaryButton({ label, onPress, variant = 'primary', style }) {
    return (_jsx(Pressable, { accessibilityRole: "button", onPress: onPress, style: ({ pressed }) => [
            styles.button,
            styles[variant],
            pressed && styles.pressed,
            style,
        ], children: _jsx(Text, { style: [styles.label, variant === 'light' && styles.lightLabel], children: label }) }));
}
const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 18,
        height: 52,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    label: {
        color: colors.text.inverse,
        fontSize: typography.size.md,
        fontWeight: '800',
        letterSpacing: 0,
    },
    light: {
        backgroundColor: colors.white,
        borderColor: colors.white,
        borderWidth: 2,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    lightLabel: {
        color: colors.secondary[400],
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
    },
    primary: {
        backgroundColor: colors.primary[400],
    },
    secondary: {
        backgroundColor: colors.secondary[300],
    },
});
//# sourceMappingURL=PrimaryButton.js.map