import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
export function DonationTimelineItem({ item, isLast }) {
    return (_jsxs(View, { style: styles.container, children: [_jsxs(View, { style: styles.timelineColumn, children: [_jsx(View, { style: styles.timelineIcon, children: _jsx(Ionicons, { color: colors.white, name: "water", size: 20 }) }), !isLast && _jsx(View, { style: styles.timelineLine })] }), _jsxs(View, { style: styles.card, children: [_jsx(Text, { style: styles.date, children: item.date }), _jsxs(View, { style: styles.row, children: [_jsx(Ionicons, { color: colors.primary[400], name: "time", size: 15 }), _jsx(Text, { style: styles.muted, children: item.time })] }), _jsxs(View, { style: styles.row, children: [_jsx(Ionicons, { color: colors.primary[400], name: "location", size: 15 }), _jsx(Text, { style: styles.place, children: item.place })] }), _jsx(View, { style: styles.divider }), _jsxs(View, { style: styles.pointsRow, children: [_jsx(Text, { style: styles.muted, children: "Pontos ganhos" }), _jsxs(Text, { style: styles.points, children: ["+", item.points, " pts"] })] })] })] }));
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 10,
        borderWidth: 1.5,
        flex: 1,
        padding: 16,
    },
    container: {
        flexDirection: 'row',
        gap: 24,
    },
    date: {
        color: colors.text.strong,
        fontSize: typography.size.lg,
        fontWeight: '700',
        marginBottom: 14,
    },
    divider: {
        backgroundColor: colors.border,
        height: 1,
        marginVertical: 14,
    },
    muted: {
        color: colors.text.muted,
        fontSize: typography.size.xs,
    },
    place: {
        color: colors.text.strong,
        flex: 1,
        fontSize: typography.size.md,
        fontWeight: '700',
    },
    points: {
        color: colors.success,
        fontSize: typography.size.sm,
        fontWeight: '800',
    },
    pointsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    timelineColumn: {
        alignItems: 'center',
        width: 48,
    },
    timelineIcon: {
        alignItems: 'center',
        backgroundColor: colors.primary[500],
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    timelineLine: {
        backgroundColor: colors.primary[500],
        flex: 1,
        width: 2,
    },
});
//# sourceMappingURL=DonationTimelineItem.js.map