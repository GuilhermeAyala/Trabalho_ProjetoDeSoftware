import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { HemocentroSessionProvider } from './src/context/HemocentroSession';
import { DonorSessionProvider } from './src/context/DonorSession';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DonorSessionProvider><HemocentroSessionProvider><RootNavigator /></HemocentroSessionProvider></DonorSessionProvider>
    </SafeAreaProvider>
  );
}
