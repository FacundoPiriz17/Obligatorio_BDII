import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "./toastConfig";


export function AppProviders({ children }) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                {children}
                <Toast config={toastConfig} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
