import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { reporteService } from "../../src/features/reportes/services/reporteService";
import { exportarAuditoriaPdf } from "../../src/features/reportes/lib/auditoriaPdf";
import { useFetch } from "../../src/hooks/useFetch";
import { AppBadge } from "../../src/components/ui/AppBadge";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { AppCard, CardBody } from "../../src/components/ui/AppCard";
import { FadeInCard } from "../../src/components/ui/FadeInCard";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { formatFechaHora, formatMoney } from "../../src/lib/formatters";

const TIPOS = [
    { value: "", label: "Todo" },
    { value: "compra", label: "Compras" },
    { value: "transferencia", label: "Transferencias" },
    { value: "validacion", label: "Validaciones" },
];

const TIPO_META = {
    compra: { icon: "bag", bg: "bg-info-100", color: "#1d4ed8" },
    transferencia: { icon: "swap-horizontal", bg: "bg-navy-100", color: "#002b61" },
    validacion: { icon: "scan", bg: "bg-ok-100", color: "#047857" },
};

export default function AuditoriaScreen() {
    const insets = useSafeAreaInsets();
    const [tipo, setTipo] = useState("");
    const [exportando, setExportando] = useState(false);

    const { data, loading, error, refetch } = useFetch(
        useCallback(() => reporteService.auditoria(tipo || undefined), [tipo])
    );

    const rows = data ?? [];

    const handleExport = async () => {
        if (rows.length === 0) {
            Toast.show({ type: "info", text1: "No hay registros para exportar." });
            return;
        }
        setExportando(true);
        try {
            await exportarAuditoriaPdf(rows, {
                tipoFiltro: TIPOS.find((t) => t.value === tipo)?.label ?? "Todos",
            });
            Toast.show({ type: "success", text1: "PDF de auditoría generado." });
        } catch (e) {
            Toast.show({ type: "error", text1: e?.message ?? "No se pudo generar el PDF." });
        } finally {
            setExportando(false);
        }
    };

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground orbs={false} />
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-extrabold text-white">Auditoría</Text>
                        <Text className="mt-0.5 text-xs text-navy-300">
                            Registro unificado del sistema
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleExport}
                        disabled={exportando}
                        className="flex-row items-center gap-2 rounded-xl bg-energy-500 px-3.5 py-2.5 active:bg-energy-400"
                        style={{ opacity: exportando ? 0.6 : 1 }}
                    >
                        <Ionicons name="download-outline" size={16} color="#00173a" />
                        <Text className="text-sm font-bold text-navy-950">
                            {exportando ? "Generando…" : "PDF"}
                        </Text>
                    </Pressable>
                </View>

                {/* Filtros */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3 -mx-1"
                    contentContainerStyle={{ paddingHorizontal: 4, gap: 6 }}
                >
                    {TIPOS.map((t) => {
                        const activo = tipo === t.value;
                        return (
                            <Pressable
                                key={t.value || "todo"}
                                onPress={() => setTipo(t.value)}
                                className={`rounded-full px-3.5 py-1.5 ${
                                    activo ? "bg-energy-500" : "bg-white/10"
                                }`}
                            >
                                <Text
                                    className={`text-xs font-bold ${activo ? "text-navy-950" : "text-navy-100"}`}
                                >
                                    {t.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {loading ? (
                <LoadingScreen label="Cargando auditoría…" />
            ) : error ? (
                <ErrorMessage error={error} onRetry={refetch} />
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, paddingBottom: 24, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {rows.length === 0 ? (
                        <EmptyState
                            iconName="shield-checkmark-outline"
                            title="Sin registros"
                            description="No hay eventos de auditoría para este filtro."
                        />
                    ) : (
                        <View className="gap-3">
                            <Text className="text-xs font-semibold text-ink-faint">
                                {rows.length} registro(s)
                            </Text>
                            {rows.map((r, i) => {
                                const meta = TIPO_META[r.tipo] ?? TIPO_META.compra;
                                return (
                                    <FadeInCard key={`${r.tipo}-${r.idReferencia}-${i}`} index={i}>
                                        <AppCard>
                                            <CardBody>
                                                <View className="flex-row items-center gap-3">
                                                    <View
                                                        className={`size-10 items-center justify-center rounded-xl ${meta.bg}`}
                                                    >
                                                        <Ionicons name={meta.icon} size={20} color={meta.color} />
                                                    </View>
                                                    <View className="flex-1">
                                                        <View className="flex-row items-center gap-1.5">
                                                            <Text className="text-sm font-bold capitalize text-ink">
                                                                {r.tipo}
                                                            </Text>
                                                            <Text className="text-xs text-ink-faint">
                                                                #{r.idReferencia}
                                                            </Text>
                                                        </View>
                                                        <Text className="text-xs text-ink-soft" numberOfLines={1}>
                                                            {r.usuario}
                                                        </Text>
                                                        <Text className="text-[11px] text-ink-faint">
                                                            {formatFechaHora(r.fecha)}
                                                            {r.detalle ? ` · ${r.detalle}` : ""}
                                                        </Text>
                                                    </View>
                                                    <View className="items-end gap-1">
                                                        {r.estado ? <AppBadge estado={r.estado} /> : null}
                                                        {r.monto != null && (
                                                            <Text className="text-sm font-extrabold text-ink">
                                                                {formatMoney(r.monto)}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </CardBody>
                                        </AppCard>
                                    </FadeInCard>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
