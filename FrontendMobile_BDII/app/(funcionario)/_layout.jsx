import { useEffect } from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { useDeviceStore } from "../../src/features/dispositivo/store/useDeviceStore";
import { DeviceRegistroModal } from "../../src/features/dispositivo/components/DeviceRegistroModal";

const TABS = [
    { name: "home", title: "Inicio", icon: "home-outline", iconFocused: "home" },
    { name: "scanner", title: "Escanear", icon: "scan-outline", iconFocused: "scan" },
    {
        name: "validaciones",
        title: "Validaciones",
        icon: "checkmark-circle-outline",
        iconFocused: "checkmark-circle",
    },
    {
        name: "dispositivo",
        title: "Dispositivo",
        icon: "phone-portrait-outline",
        iconFocused: "phone-portrait",
    },
];

export default function FuncionarioLayout() {
    const { initializing, isAuthenticated, isFuncionario, user } = useAuthStore();
    const { installationId, justCreated, acknowledged, registrando, init, acknowledge, registrarDispositivo } =
        useDeviceStore();
    const insets = useSafeAreaInsets();

    // Asegura el installation id y trae los dispositivos asignados al entrar.
    useEffect(() => {
        if (isFuncionario) init();
    }, [isFuncionario, init]);

    if (initializing) return <LoadingScreen />;
    if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
    if (!isFuncionario) return <Redirect href="/(general)/home" />;

    // Primer ingreso: se generó el UUID por primera vez → gate de registro.
    const mostrarRegistro = justCreated && !acknowledged;

    const handleRegistro = async () => {
        try {
            const disp = await registrarDispositivo();
            Toast.show({
                type: "success",
                text1: disp ? "Dispositivo registrado" : "Dispositivo listo",
                text2: disp ? `Asignado: #${disp.idDispositivoEscaneo}` : undefined,
            });
        } catch (err) {
            // No bloqueamos el acceso: si el backend no permite el alta (p.ej. 403),
            // el funcionario igual puede escanear con un dispositivo asignado por Admin.
            Toast.show({
                type: "error",
                text1: "No se pudo registrar el dispositivo en el backend",
                text2: err?.detail ?? err?.message,
            });
        } finally {
            acknowledge();
        }
    };

    return (
        <>
        <DeviceRegistroModal
            visible={mostrarRegistro}
            installationId={installationId}
            loading={registrando}
            onConfirm={handleRegistro}
        />
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0b3c7e",
                    borderTopColor: "rgba(255,255,255,0.10)",
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 6,
                },
                tabBarActiveTintColor: "#00e3fd",
                tabBarInactiveTintColor: "#7694d0",
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "600",
                    marginTop: 2,
                },
            }}
        >
            {TABS.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused, color }) => (
                            <Ionicons name={focused ? tab.iconFocused : tab.icon} size={22} color={color} />
                        ),
                    }}
                />
            ))}
            {/* Perfil: accesible pero sin pestaña propia (mantiene el tab bar de funcionario) */}
            <Tabs.Screen name="perfil" options={{ href: null }} />
        </Tabs>
        </>
    );
}
