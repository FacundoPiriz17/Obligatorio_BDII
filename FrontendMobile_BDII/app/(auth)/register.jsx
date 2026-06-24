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
import { TIPOS_DOCUMENTO, DOMINIOS_EMAIL_VALIDOS } from "../../src/lib/constants";

const STEPS = ["Cuenta", "Documento", "Dirección"];

export default function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const register = useAuthStore((s) => s.register);
    const login = useAuthStore((s) => s.login);

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        paisDocumento: "Uruguay",
        tipoDocumento: "CI",
        numeroDocumento: "",
        paisDireccion: "",
        localidadDireccion: "",
        calleDireccion: "",
        numeroDireccion: "",
        codigoPostalDireccion: "",
        telefono: "",
    });

    const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

    const validate = () => {
        const e = {};
        if (step === 0) {
            if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
            if (!DOMINIOS_EMAIL_VALIDOS.some((d) => form.email.toLowerCase().endsWith(d)))
                e.email = "Usá tu email institucional (@correo.ucu.edu.uy o @ucu.edu.uy).";
            if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";
            if (form.password !== form.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden.";
        }
        if (step === 1) {
            if (!form.numeroDocumento.trim()) e.numeroDocumento = "El número de documento es obligatorio.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (!validate()) return;
        if (step < 2) setStep((s) => s + 1);
        else submit();
    };

    const submit = async () => {
        setLoading(true);
        try {
            const telefonos = form.telefono.trim() ? [form.telefono.trim()] : [];
            await register({
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                password: form.password,
                paisDocumento: form.paisDocumento,
                tipoDocumento: form.tipoDocumento,
                numeroDocumento: parseInt(form.numeroDocumento, 10),
                paisDireccion: form.paisDireccion || undefined,
                localidadDireccion: form.localidadDireccion || undefined,
                calleDireccion: form.calleDireccion || undefined,
                numeroDireccion: form.numeroDireccion ? parseInt(form.numeroDireccion, 10) : undefined,
                codigoPostalDireccion: form.codigoPostalDireccion
                    ? parseInt(form.codigoPostalDireccion, 10)
                    : undefined,
                telefonos,
            });
            await login(form.email.trim(), form.password);
            Toast.show({ type: "success", text1: "¡Cuenta creada! Bienvenido a UCU Mundial" });
            router.replace("/(general)/home");
        } catch (err) {
            Toast.show({ type: "error", text1: err?.detail ?? "Error al crear la cuenta." });
        } finally {
            setLoading(false);
        }
    };

    const stepContent = [
        // Step 0: Cuenta
        <View key="cuenta" className="gap-4">
            <AppInput
                label="Nombre completo"
                iconName="person-outline"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChangeText={set("nombre")}
                error={errors.nombre}
            />
            <AppInput
                label="Email institucional"
                iconName="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="nombre@correo.ucu.edu.uy"
                value={form.email}
                onChangeText={set("email")}
                error={errors.email}
            />
            <AppInput
                label="Contraseña"
                iconName="lock-closed-outline"
                secureTextEntry
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChangeText={set("password")}
                error={errors.password}
            />
            <AppInput
                label="Confirmar contraseña"
                iconName="lock-closed-outline"
                secureTextEntry
                placeholder="Repetí la contraseña"
                value={form.confirmPassword}
                onChangeText={set("confirmPassword")}
                error={errors.confirmPassword}
            />
        </View>,

        // Step 1: Documento
        <View key="doc" className="gap-4">
            <View>
                <Text className="mb-2 text-sm font-semibold text-ink">Tipo de documento</Text>
                <View className="flex-row flex-wrap gap-2">
                    {TIPOS_DOCUMENTO.map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => set("tipoDocumento")(t)}
                            className={`rounded-xl border px-4 py-2 ${
                                form.tipoDocumento === t ? "border-navy-900 bg-navy-900" : "border-line bg-white"
                            }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    form.tipoDocumento === t ? "text-white" : "text-ink"
                                }`}
                            >
                                {t}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <AppInput
                label="País del documento"
                iconName="flag-outline"
                placeholder="Uruguay"
                value={form.paisDocumento}
                onChangeText={set("paisDocumento")}
            />
            <AppInput
                label="Número de documento"
                iconName="card-outline"
                keyboardType="numeric"
                placeholder="12345678"
                value={form.numeroDocumento}
                onChangeText={set("numeroDocumento")}
                error={errors.numeroDocumento}
            />
            <AppInput
                label="Teléfono (opcional)"
                iconName="call-outline"
                keyboardType="phone-pad"
                placeholder="+598 99 000 000"
                value={form.telefono}
                onChangeText={set("telefono")}
            />
        </View>,

        // Step 2: Dirección
        <View key="dir" className="gap-4">
            <Text className="text-sm text-ink-soft">Todos los campos de dirección son opcionales.</Text>
            <AppInput
                label="País"
                iconName="location-outline"
                placeholder="Uruguay"
                value={form.paisDireccion}
                onChangeText={set("paisDireccion")}
            />
            <AppInput
                label="Localidad"
                placeholder="Montevideo"
                value={form.localidadDireccion}
                onChangeText={set("localidadDireccion")}
            />
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <AppInput
                        label="Calle"
                        placeholder="Av. 8 de Octubre"
                        value={form.calleDireccion}
                        onChangeText={set("calleDireccion")}
                    />
                </View>
                <View className="w-24">
                    <AppInput
                        label="Número"
                        keyboardType="numeric"
                        placeholder="1234"
                        value={form.numeroDireccion}
                        onChangeText={set("numeroDireccion")}
                    />
                </View>
            </View>
            <AppInput
                label="Código postal"
                keyboardType="numeric"
                placeholder="11600"
                value={form.codigoPostalDireccion}
                onChangeText={set("codigoPostalDireccion")}
            />
        </View>,
    ];

    return (
        <View className="flex-1 bg-navy-950">
            <StatusBar style="light" />
            {/* Header */}
            <View
                className="flex-row items-center gap-3 px-5"
                style={{ paddingTop: insets.top + 12, paddingBottom: 16 }}
            >
                <Pressable
                    onPress={() => (step > 0 ? setStep((s) => s - 1) : router.back())}
                    hitSlop={8}
                    className="rounded-xl p-2 active:bg-white/10"
                >
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </Pressable>
                <View className="flex-1">
                    <Text className="text-lg font-extrabold text-white">Crear cuenta</Text>
                    <Text className="text-xs text-navy-300">
                        Paso {step + 1} de {STEPS.length} · {STEPS[step]}
                    </Text>
                </View>
            </View>

            {/* Step indicator */}
            <View className="mx-5 mb-2 flex-row gap-1.5">
                {STEPS.map((_, i) => (
                    <View
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i <= step ? "bg-energy-500" : "bg-white/20"}`}
                    />
                ))}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
                <ScrollView
                    className="flex-1 rounded-t-3xl bg-surface"
                    contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="mb-5 text-xl font-extrabold text-ink">{STEPS[step]}</Text>
                    {stepContent[step]}

                    <AppButton
                        variant={step === 2 ? "energy" : "primary"}
                        size="lg"
                        loading={loading}
                        onPress={next}
                        className="mt-7"
                    >
                        {step === 2 ? "Crear cuenta" : "Continuar"}
                    </AppButton>

                    {step === 0 && (
                        <Pressable onPress={() => router.back()} className="mt-4 items-center">
                            <Text className="text-sm text-ink-soft">
                                ¿Ya tenés cuenta? <Text className="font-bold text-navy-900">Iniciá sesión</Text>
                            </Text>
                        </Pressable>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
