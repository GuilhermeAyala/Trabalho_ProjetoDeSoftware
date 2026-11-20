import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BloodCentersScreen } from '@/screens/BloodCentersScreen';
import { DonationHistoryScreen } from '@/screens/DonationHistoryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { InformationCenterScreen } from '@/screens/InformationCenterScreen';
import { ScheduleScreen } from '@/screens/ScheduleScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { VoucherDetailsScreen } from '@/screens/VoucherDetailsScreen';
import { WalletScreen } from '@/screens/WalletScreen';
import { colors, typography } from '@/theme';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const tabIcons = {
    Home: 'home',
    BloodCenters: 'location',
    Wallet: 'ticket',
    Schedule: 'calendar',
    Settings: 'settings-outline',
};
const tabLabels = {
    Home: 'Inicio',
    BloodCenters: 'Hemocentros',
    Wallet: 'Vouchers',
    Schedule: 'Agendar',
    Settings: 'Config.',
};
function AppTabs() {
    return (_jsxs(Tab.Navigator, { screenOptions: ({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.primary[600],
            tabBarInactiveTintColor: colors.primary[600],
            tabBarLabel: ({ color }) => _jsx(Text, { style: [styles.tabLabel, { color }], children: tabLabels[route.name] }),
            tabBarIcon: ({ color, focused }) => {
                if (route.name === 'Wallet') {
                    return (_jsx(View, { style: styles.centerButton, children: _jsx(Ionicons, { color: colors.white, name: "menu", size: 28 }) }));
                }
                return _jsx(Ionicons, { color: color, name: tabIcons[route.name], size: focused ? 24 : 22 });
            },
            tabBarStyle: styles.tabBar,
        }), children: [_jsx(Tab.Screen, { component: HomeScreen, name: "Home" }), _jsx(Tab.Screen, { component: BloodCentersScreen, name: "BloodCenters" }), _jsx(Tab.Screen, { component: WalletScreen, name: "Wallet" }), _jsx(Tab.Screen, { component: ScheduleScreen, name: "Schedule" }), _jsx(Tab.Screen, { component: SettingsScreen, name: "Settings" })] }));
}
export function RootNavigator() {
    return (_jsx(NavigationContainer, { children: _jsxs(Stack.Navigator, { initialRouteName: "SignUp", screenOptions: { headerShown: false }, children: [_jsx(Stack.Screen, { component: SignUpScreen, name: "SignUp" }), _jsx(Stack.Screen, { component: AppTabs, name: "AppTabs" }), _jsx(Stack.Screen, { component: DonationHistoryScreen, name: "DonationHistory" }), _jsx(Stack.Screen, { component: InformationCenterScreen, name: "InformationCenter" }), _jsx(Stack.Screen, { component: VoucherDetailsScreen, name: "VoucherDetails" })] }) }));
}
const styles = StyleSheet.create({
    centerButton: {
        alignItems: 'center',
        backgroundColor: colors.primary[400],
        borderColor: colors.white,
        borderRadius: 28,
        borderWidth: 3,
        height: 56,
        justifyContent: 'center',
        marginBottom: 26,
        width: 56,
    },
    tabBar: {
        backgroundColor: colors.white,
        borderTopColor: colors.border,
        elevation: 12,
        height: Platform.select({ android: 76, ios: 92 }),
        paddingBottom: Platform.select({ android: 10, ios: 24 }),
        paddingTop: 8,
        shadowColor: colors.shadow,
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    tabLabel: {
        fontSize: typography.size.tiny,
        fontWeight: '600',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=RootNavigator.js.map