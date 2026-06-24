import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { AppInput } from "../../src/components/ui/AppInput";
import { AppButton } from "../../src/components/ui/AppButton";
import { UcuLogoIcon } from "../../src/components/ui/UcuLogoIcon";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { ROLES } from "../../src/lib/constants";

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async () => {
        if (!email.trim() || !password) {
            setError("Completá todos los campos.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const roles = await login(email.trim(), password);
            Toast.show({ type: "success", text1: "Sesión iniciada" });
            // Ruteo por rol — mismo criterio que app/index.jsx
            if (roles.includes(ROLES.ADMIN)) {
                router.replace("/(admin)/home");
            } else if (roles.includes(ROLES.FUNCIONARIO) && !roles.includes(ROLES.GENERAL)) {
                router.replace("/(funcionario)/home");
            } else {
                router.replace("/(general)/home");
            }
        } catch (err) {
            setError(err?.detail ?? "Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 overflow-hidden bg-navy-950">
            <StatusBar style="light" />
            <HeroBackground />
            {/* Hero top */}
            <View className="items-center px-6 pb-8" style={{ paddingTop: insets.top + 32 }}>
                {/* Logo */}
                <UcuLogoIcon
                    className="mb-6 size-16 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15"
                    size={64}
                />
                <Text className="text-3xl font-extrabold text-white" style={{ letterSpacing: -0.5 }}>
                    UCU Mundial
                </Text>
                <Text className="mt-1 text-xs font-semibold uppercase tracking-widest text-navy-300">
                    Ticketing oficial · 2026
                </Text>
                <Text className="mt-4 text-center text-sm text-navy-100">
                    La cancha del mundo, en tu bolsillo.
                </Text>
            </View>

            {/* Form card */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        className="flex-1 rounded-t-3xl bg-surface px-5 pt-8"
                        style={{ paddingBottom: insets.bottom + 24 }}
                    >
                        <Text className="text-xl font-extrabold text-ink">Iniciá sesión</Text>
                        <Text className="mt-1 text-sm text-ink-soft">
                            Ingresá con tu cuenta UCU para gestionar tus entradas.
                        </Text>

                        <View className="mt-7 gap-4">
                            <AppInput
                                label="Email institucional"
                                iconName="mail-outline"
                                keyboardType="email-address"
                                autoComplete="email"
                                placeholder="nombre@correo.ucu.edu.uy"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                returnKeyType="next"
                            />
                            <AppInput
                                label="Contraseña"
                                iconName="lock-closed-outline"
                                secureTextEntry
                                autoComplete="password"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                error={error}
                                returnKeyType="done"
                                onSubmitEditing={onSubmit}
                            />
                        </View>

                        {/* Shield info */}
                        <View className="mt-5 flex-row items-start gap-2 rounded-xl bg-container-low px-3 py-3">
                            <Ionicons name="shield-checkmark" size={16} color="#047857" />
                            <Text className="flex-1 text-xs text-ink-soft">
                                Tus entradas usan QR dinámico: el código se regenera cada 30 segundos para
                                prevenir fraudes.
                            </Text>
                        </View>

                        <AppButton variant="primary" size="lg" loading={loading} onPress={onSubmit} className="mt-6">
                            Iniciar sesión
                        </AppButton>

                        <Pressable onPress={() => router.push("/(auth)/register")} className="mt-5 items-center">
                            <Text className="text-sm text-ink-soft">
                                ¿No tenés cuenta? <Text className="font-bold text-navy-900">Registrate</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
