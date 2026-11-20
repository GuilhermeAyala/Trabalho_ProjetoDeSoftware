import { Ionicons } from '@expo/vector-icons';
type StatCardProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    tone?: 'primary' | 'success';
};
export declare function StatCard({ icon, label, value, tone }: StatCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=StatCard.d.ts.map