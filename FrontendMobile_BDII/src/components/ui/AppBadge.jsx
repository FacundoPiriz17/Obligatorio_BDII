import { Text, View } from "react-native";
import { cn } from "../../lib/cn";

const variantClasses = {
    navy: { container: "bg-navy-100", text: "text-navy-900" },
    ok: { container: "bg-ok-100", text: "text-ok-600" },
    warn: { container: "bg-warn-100", text: "text-warn-600" },
    danger: { container: "bg-danger-100", text: "text-danger-700" },
    info: { container: "bg-info-100", text: "text-info-600" },
    neutral: { container: "bg-container", text: "text-ink-soft" },
};

const estadoToVariant = {
    activa: "ok",
    paga: "ok",
    aceptada: "ok",
    válida: "ok",
    empezado: "ok",
    pendiente: "warn",
    confirmada: "info",
    consumida: "neutral",
    vencida: "neutral",
    "no empezado": "neutral",
    terminado: "neutral",
    cancelada: "danger",
    rechazada: "danger",
    inválida: "danger",
};

export function AppBadge({ children, variant, estado }) {
    const resolvedVariant =
        variant ?? (estado ? (estadoToVariant[estado.toLowerCase()] ?? "neutral") : "neutral");
    const styles = variantClasses[resolvedVariant];

    return (
        <View className={cn("rounded-full px-2.5 py-1", styles.container)}>
            <Text className={cn("text-[10px] font-bold uppercase tracking-wide", styles.text)}>
                {children ?? estado}
            </Text>
        </View>
    );
}
