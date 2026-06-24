import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../../../components/ui/AppButton";

const ESTILOS = {
    success: {
        wrap: "bg-ok-100 border-ok-500",
        icon: "bg-ok-500",
        iconName: "checkmark",
        text: "text-ok-600",
        titulo: "Entrada válida",
        boton: "primary",
        botonLabel: "Escanear otra entrada",
    },
    duplicada: {
        wrap: "bg-warn-100 border-warn-500",
        icon: "bg-warn-500",
        iconName: "alert",
        text: "text-warn-600",
        titulo: "Ya validada",
        boton: "secondary",
        botonLabel: "Escanear otra entrada",
    },
    error: {
        wrap: "bg-danger-100 border-danger-600",
        icon: "bg-danger-600",
        iconName: "close",
        text: "text-danger-700",
        titulo: "Entrada inválida",
        boton: "danger",
        botonLabel: "Intentar nuevamente",
    },
};

export function ResultadoValidacion({ estado, resultado, errorMsg, onReset }) {
    if (estado === "idle" || estado === "scanning") return null;

    const s = ESTILOS[estado] ?? ESTILOS.error;
    const esExito = estado === "success";

    return (
        <Animated.View
            entering={FadeInDown.duration(220)}
            className={`mx-0 rounded-t-3xl border-t-2 px-6 pb-6 pt-5 ${s.wrap}`}
        >
            {/* Ícono */}
            <View className="mb-4 items-center">
                <View className={`size-16 items-center justify-center rounded-3xl ${s.icon}`}>
                    <Ionicons name={s.iconName} size={36} color="#fff" />
                </View>
                <Text className={`mt-3 text-xl font-extrabold ${s.text}`}>{s.titulo}</Text>
                {(errorMsg || resultado?.mensaje) && (
                    <Text className={`mt-1 text-center text-sm ${s.text}`}>
                        {errorMsg ?? resultado?.mensaje}
                    </Text>
                )}
            </View>

            {esExito && resultado && (
                <View className="mb-4 gap-3 rounded-2xl border border-ok-500/30 bg-white px-4 py-4">
                    {[
                        { label: "Entrada", value: resultado.idEntrada ? `#${resultado.idEntrada}` : undefined },
                        { label: "Propietario", value: resultado.nombrePropietario },
                        { label: "Partido", value: resultado.partido },
                        { label: "Sector", value: resultado.sector ? `Sector ${resultado.sector}` : undefined },
                    ]
                        .filter((r) => r.value)
                        .map(({ label, value }) => (
                            <View key={label}>
                                <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                    {label}
                                </Text>
                                <Text className="mt-0.5 text-sm font-semibold text-ink">{value}</Text>
                            </View>
                        ))}
                </View>
            )}

            <AppButton variant={s.boton} size="lg" onPress={onReset} className="w-full">
                {s.botonLabel}
            </AppButton>
        </Animated.View>
    );
}
