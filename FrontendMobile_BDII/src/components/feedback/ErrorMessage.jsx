import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../ui/AppButton";

/**
 * Estado de error a pantalla completa. Respeta el safe-area superior para no
 * quedar pegado al notch / barra de estado.
 */
export function ErrorMessage({ error, onRetry }) {
    const insets = useSafeAreaInsets();
    const status = error?.status;
    const msg =
        error?.detail ||
        error?.message ||
        (status === 403
            ? "No tenés permisos para ver esto."
            : status === 404
              ? "No se encontró el recurso solicitado."
              : "Ocurrió un error inesperado.");

    return (
        <View className="flex-1 bg-surface px-4" style={{ paddingTop: insets.top + 24 }}>
            <View className="rounded-2xl border border-danger-100 bg-danger-100 px-4 py-4">
                <View className="flex-row items-start gap-3">
                    <Ionicons name="alert-circle" size={20} color="#ba1a1a" />
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-danger-700">
                            {status ? `Error ${status}` : "Error"}
                        </Text>
                        <Text className="mt-0.5 text-sm font-medium text-danger-700">{msg}</Text>
                    </View>
                </View>
                {onRetry && (
                    <AppButton variant="danger" size="sm" onPress={onRetry} className="mt-3 self-start">
                        Reintentar
                    </AppButton>
                )}
            </View>
        </View>
    );
}
