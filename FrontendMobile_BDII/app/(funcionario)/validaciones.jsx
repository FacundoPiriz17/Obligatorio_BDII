import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validacionService } from "../../src/features/validaciones/services/validacionService";
import { useFetch } from "../../src/hooks/useFetch";
import { AppBadge } from "../../src/components/ui/AppBadge";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { AppCard, CardBody } from "../../src/components/ui/AppCard";
import { FadeInCard } from "../../src/components/ui/FadeInCard";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { formatFechaHora } from "../../src/lib/formatters";

export default function ValidacionesScreen() {
    const insets = useSafeAreaInsets();

    const {
        data: validaciones,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => validacionService.listar(), []));

    const lista = validaciones ?? [];
    const hoy = lista.filter((v) => {
        const d = new Date(v.fechaHora);
        const now = new Date();
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
        );
    });

    if (loading) return <LoadingScreen label="Cargando validaciones…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-800 px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground variant="funcionario" orbs={false} />
                <Text className="text-xl font-extrabold text-white">Validaciones</Text>
                <View className="mt-2 flex-row gap-3">
                    <View className="rounded-xl bg-white/10 px-3 py-1.5">
                        <Text className="text-xs font-semibold text-white">Hoy: {hoy.length}</Text>
                    </View>
                    <View className="rounded-xl bg-white/10 px-3 py-1.5">
                        <Text className="text-xs font-semibold text-white">Total: {lista.length}</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 24, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {lista.length === 0 ? (
                    <EmptyState
                        iconName="checkmark-circle-outline"
                        title="Sin validaciones"
                        description="Todavía no validaste ninguna entrada."
                    />
                ) : (
                    <View className="gap-3">
                        {lista.map((v, i) => {
                            const ok = v.esValida;
                            return (
                                <FadeInCard key={v.idValidacion ?? i} index={i}>
                                    <AppCard>
                                        <CardBody>
                                            <View className="flex-row items-center gap-3">
                                                <View
                                                    className={`size-10 items-center justify-center rounded-xl ${
                                                        ok ? "bg-ok-100" : "bg-danger-100"
                                                    }`}
                                                >
                                                    <Ionicons
                                                        name={ok ? "checkmark-circle" : "close-circle"}
                                                        size={20}
                                                        color={ok ? "#047857" : "#ba1a1a"}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-sm font-bold text-ink">
                                                        {v.idEntrada ? `Entrada #${v.idEntrada}` : "QR sin entrada asociada"}
                                                    </Text>
                                                    <Text className="text-xs text-ink-faint">
                                                        {v.nombreSector ? `Sector ${v.nombreSector} · ` : ""}
                                                        {formatFechaHora(v.fechaHora)}
                                                    </Text>
                                                    {v.nombrePropietario && (
                                                        <Text
                                                            className="text-xs text-ink-faint"
                                                            numberOfLines={1}
                                                        >
                                                            {v.nombrePropietario}
                                                        </Text>
                                                    )}
                                                </View>
                                                <AppBadge variant={ok ? "ok" : "danger"}>
                                                    {ok ? "Válida" : "Inválida"}
                                                </AppBadge>
                                            </View>
                                        </CardBody>
                                    </AppCard>
                                </FadeInCard>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
