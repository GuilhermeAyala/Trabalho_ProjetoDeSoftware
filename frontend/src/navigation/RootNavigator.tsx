import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { BloodCentersScreen } from '@/screens/BloodCentersScreen';
import { DonationHistoryScreen } from '@/screens/DonationHistoryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { AccessChoiceScreen, HemocentroAgendaScreen, HemocentroEstoqueScreen, HemocentroLoginScreen, HemocentroPerfilScreen, HemocentroSignUpScreen, HemocentroVagasScreen } from '@/screens/HemocentroScreens';
import { InformationCenterScreen } from '@/screens/InformationCenterScreen';
import { ScheduleScreen } from '@/screens/ScheduleScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { DonorLoginScreen } from '@/screens/DonorLoginScreen';
import { TriageScreen } from '@/screens/TriageScreen';
import { VoucherDetailsScreen } from '@/screens/VoucherDetailsScreen';
import { WalletScreen } from '@/screens/WalletScreen';
import { colors, typography } from '@/theme';
import type { AppTabParamList, RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();
const HemocentroTab = createBottomTabNavigator<{
  HemocentroAgenda: undefined;
  HemocentroEstoque: undefined;
  HemocentroVagas: undefined;
  HemocentroPerfil: undefined;
}>();

const tabIcons: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  BloodCenters: 'location',
  Wallet: 'ticket',
  Schedule: 'calendar',
  Settings: 'settings-outline',
};

const tabLabels: Record<keyof AppTabParamList, string> = {
  Home: 'Inicio',
  BloodCenters: 'Hemocentros',
  Wallet: 'Vouchers',
  Schedule: 'Agendar',
  Settings: 'Config.',
};

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.primary[600],
        tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>{tabLabels[route.name]}</Text>,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Wallet') {
            return (
              <View style={styles.centerButton}>
                <Ionicons color={colors.white} name="menu" size={28} />
              </View>
            );
          }

          return <Ionicons color={color} name={tabIcons[route.name]} size={focused ? 24 : 22} />;
        },
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen component={BloodCentersScreen} name="BloodCenters" />
      <Tab.Screen component={WalletScreen} name="Wallet" />
      <Tab.Screen component={ScheduleScreen} name="Schedule" />
      <Tab.Screen component={SettingsScreen} name="Settings" />
    </Tab.Navigator>
  );
}

function HemocentroTabs() {
  return (
    <HemocentroTab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary[600], tabBarInactiveTintColor: colors.text.muted, tabBarStyle: styles.tabBar }}>
      <HemocentroTab.Screen component={HemocentroAgendaScreen} name="HemocentroAgenda" options={{ title: 'Agenda', tabBarIcon: ({ color }) => <Ionicons color={color} name="calendar" size={23} /> }} />
      <HemocentroTab.Screen component={HemocentroVagasScreen} name="HemocentroVagas" options={{ title: 'Vagas', tabBarIcon: ({ color }) => <Ionicons color={color} name="time" size={23} /> }} />
      <HemocentroTab.Screen component={HemocentroEstoqueScreen} name="HemocentroEstoque" options={{ title: 'Estoque', tabBarIcon: ({ color }) => <Ionicons color={color} name="water" size={23} /> }} />
      <HemocentroTab.Screen component={HemocentroPerfilScreen} name="HemocentroPerfil" options={{ title: 'Hemocentro', tabBarIcon: ({ color }) => <Ionicons color={color} name="medical" size={23} /> }} />
    </HemocentroTab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AccessChoice" screenOptions={{ headerShown: false }}>
        <Stack.Screen component={AccessChoiceScreen} name="AccessChoice" />
        <Stack.Screen component={SignUpScreen} name="SignUp" />
        <Stack.Screen component={DonorLoginScreen} name="DonorLogin" />
        <Stack.Screen component={HemocentroSignUpScreen} name="HemocentroSignUp" />
        <Stack.Screen component={HemocentroLoginScreen} name="HemocentroLogin" />
        <Stack.Screen component={HemocentroTabs} name="HemocentroTabs" />
        <Stack.Screen component={AppTabs} name="AppTabs" />
        <Stack.Screen component={DonationHistoryScreen} name="DonationHistory" />
        <Stack.Screen component={InformationCenterScreen} name="InformationCenter" />
        <Stack.Screen component={TriageScreen} name="Triage" />
        <Stack.Screen component={VoucherDetailsScreen} name="VoucherDetails" />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
