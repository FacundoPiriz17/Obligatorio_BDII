import "../src/styles/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { PaperProvider } from "react-native-paper";
import { toastConfig } from "../src/providers/toastConfig";
import { useAuthStore } from "../src/features/auth/store/useAuthStore";

export default function RootLayout() {
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        initialize();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider>
                    <StatusBar style="light" backgroundColor="#00173a" />
                    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(general)" />
                        <Stack.Screen name="(funcionario)" />
                        <Stack.Screen name="(admin)" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <Toast config={toastConfig} />
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
