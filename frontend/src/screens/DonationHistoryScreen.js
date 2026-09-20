import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DonationTimelineItem } from '@/components/DonationTimelineItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { donationsMock } from '@/data/donationsMock';
import { userMock } from '@/data/userMock';
import { colors, spacing } from '@/theme';
export function DonationHistoryScreen({ navigation }) {
    return (_jsxs(SafeAreaView, { edges: ['bottom'], style: styles.safeArea, children: [_jsx(ScreenHeader, { title: "Historico de doacoes", onBack: navigation.goBack }), _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(View, { style: styles.stats, children: [_jsx(StatCard, { icon: "hand-left", label: "Doacoes Realizadas", value: String(userMock.donationsCount) }), _jsx(StatCard, { icon: "trending-up", label: "Pontos Ganhos", value: String(userMock.totalPoints), tone: "success" })] }), _jsx(SectionTitle, { children: "Suas doacoes" }), _jsx(View, { style: styles.timeline, children: donationsMock.map((item, index) => (_jsx(DonationTimelineItem, { isLast: index === donationsMock.length - 1, item: item }, item.id))) })] })] }));
}
const styles = StyleSheet.create({
    content: {
        gap: spacing.lg,
        padding: spacing.xl,
        paddingBottom: 120,
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    stats: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    timeline: {
        gap: spacing.md,
    },
});
//# sourceMappingURL=DonationHistoryScreen.js.map