import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useScanner } from "../../src/features/validaciones/hooks/useScanner";
import { QRScanner } from "../../src/features/validaciones/components/QRScanner";
import { ResultadoValidacion } from "../../src/features/validaciones/components/ResultadoValidacion";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";

export default function ScannerScreen() {
    const insets = useSafeAreaInsets();
    const { loadingDevice, deviceRegistrado, estado, resultado, errorMsg, procesarQr, reset } =
        useScanner();

    if (loadingDevice) return <LoadingScreen label="Verificando dispositivo…" />;

    // Dispositivo no registrado
    if (!deviceRegistrado) {
        return (
            <View
                className="flex-1 items-center justify-center bg-navy-950 px-8"
                style={{ paddingTop: insets.top }}
            >
                <View className="mb-4 size-16 items-center justify-center rounded-2xl bg-danger-100">
                    <Ionicons name="phone-portrait-outline" size={32} color="#ba1a1a" />
                </View>
                <Text className="text-center text-xl font-extrabold text-white">
                    Sin dispositivo asignado
                </Text>
                <Text className="mt-2 text-center text-sm text-navy-300">
                    No tenés un dispositivo de escaneo activo asignado a tu cuenta. Solicitá a un
                    administrador que te asigne uno antes de poder escanear entradas.
                </Text>
                <View className="mt-6 w-full rounded-2xl border border-warn-100/30 bg-warn-100/10 px-4 py-3">
                    <Text className="text-center text-xs font-semibold text-warn-500">
                        Los dispositivos de escaneo se asignan desde el panel de administración.
                    </Text>
                </View>
            </View>
        );
    }

    const scanning = estado === "idle" || estado === "scanning";

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
            {/* Header sobre la cámara */}
            <View
                className="absolute left-0 right-0 top-0 z-10 px-4 pb-3"
                style={{ paddingTop: insets.top + 12 }}
            >
                <View className="flex-row items-center gap-2">
                    <View className="size-8 items-center justify-center rounded-xl bg-energy-500">
                        <Ionicons name="scan" size={16} color="#00173a" />
                    </View>
                    <Text className="text-base font-extrabold text-white">Escanear entrada</Text>
                </View>
            </View>

            {/* Cámara — ocupa todo */}
            <View className="flex-1">
                <QRScanner onScan={procesarQr} active={scanning} />
            </View>

            {/* Panel de resultado anclado abajo */}
            <ResultadoValidacion estado={estado} resultado={resultado} errorMsg={errorMsg} onReset={reset} />
        </View>
    );
}
