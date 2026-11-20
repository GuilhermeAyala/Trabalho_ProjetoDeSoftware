import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
export default function App() {
    return (_jsxs(SafeAreaProvider, { children: [_jsx(StatusBar, { style: "dark" }), _jsx(RootNavigator, {})] }));
}
//# sourceMappingURL=App.js.map