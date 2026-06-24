import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { transferenciaService } from "../../../src/features/transferencias/services/transferenciaService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppButton } from "../../../src/components/ui/AppButton";
import { FadeInCard } from "../../../src/components/ui/FadeInCard";
import { AppCard, CardBody } from "../../../src/components/ui/AppCard";
import { ConfirmDialog } from "../../../src/components/feedback/ConfirmDialog";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { formatFechaHora } from "../../../src/lib/formatters";
import { useAuthStore } from "../../../src/features/auth/store/useAuthStore";

const TABS = ["recibidas", "enviadas"];

export default function TransferenciasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const [tab, setTab] = useState("recibidas");
    const [accion, setAccion] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const {
        data: transferencias,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => transferenciaService.listar(), []));

    const todas = transferencias ?? [];
    const recibidas = todas.filter((t) => t.emailDestino?.toLowerCase() === user?.email?.toLowerCase());
    const enviadas = todas.filter((t) => t.emailOrigen?.toLowerCase() === user?.email?.toLowerCase());
    const lista = tab === "recibidas" ? recibidas : enviadas;

    const ejecutarAccion = async () => {
        if (!accion) return;
        setActionLoading(true);
        try {
            if (accion.tipo === "aceptar") await transferenciaService.aceptar(accion.id);
            if (accion.tipo === "rechazar") await transferenciaService.rechazar(accion.id);
            if (accion.tipo === "cancelar") await transferenciaService.cancelar(accion.id);
            Toast.show({
                type: "success",
                text1: `Transferencia ${
                    accion.tipo === "aceptar" ? "aceptada" : accion.tipo === "rechazar" ? "rechazada" : "cancelada"
                } correctamente`,
            });
            refetch();
        } catch (err) {
            Toast.show({ type: "error", text1: err?.detail ?? "Error al procesar la acción." });
        } finally {
            setActionLoading(false);
            setAccion(null);
        }
    };

    if (loading) return <LoadingScreen label="Cargando transferencias…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground orbs={false} />
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-extrabold text-white">Transferencias</Text>
                        <Text className="mt-0.5 text-xs text-navy-300">
                            {recibidas.filter((t) => t.estado === "pendiente").length} pendientes de aceptar
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => router.push("/(general)/transferencias/nueva")}
                        className="flex-row items-center gap-1.5 rounded-xl bg-energy-500 px-3 py-2"
                    >
                        <Ionicons name="add" size={16} color="#00173a" />
                        <Text className="text-xs font-bold text-navy-950">Nueva</Text>
                    </Pressable>
                </View>

                {/* Tabs */}
                <View className="mt-3 flex-row rounded-xl bg-white/10 p-1">
                    {TABS.map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => setTab(t)}
                            className={`flex-1 items-center rounded-lg py-2 ${tab === t ? "bg-energy-500" : ""}`}
                        >
                            <Text
                                className={`text-xs font-bold capitalize ${tab === t ? "text-navy-950" : "text-navy-300"}`}
                            >
                                {t} ({t === "recibidas" ? recibidas.length : enviadas.length})
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 24, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {lista.length === 0 ? (
                    <EmptyState
                        iconName="swap-horizontal-outline"
                        title={`Sin transferencias ${tab}`}
                        description={
                            tab === "recibidas"
                                ? "Nadie te ha enviado entradas todavía."
                                : "Todavía no transferiste ninguna entrada."
                        }
                    />
                ) : (
                    <View className="gap-3">
                        {lista.map((t, index) => {
                            const idT = t.idTransferencia ?? t.id;
                            const esPendiente = t.estado === "pendiente";
                            const esRecibida = tab === "recibidas";

                            return (
                                <FadeInCard key={idT} index={index}>
                                    <AppCard>
                                        <CardBody>
                                            <View className="flex-row items-start justify-between gap-2">
                                                <View className="size-10 items-center justify-center rounded-xl bg-container">
                                                    <Ionicons
                                                        name={esRecibida ? "arrow-down" : "arrow-up"}
                                                        size={18}
                                                        color={esRecibida ? "#047857" : "#1d4ed8"}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-sm font-bold text-ink" numberOfLines={1}>
                                                        Entrada #{t.entrada?.idEntrada ?? "—"}
                                                        {t.entrada?.partido
                                                            ? ` · ${t.entrada.partido.equipoLocal} vs ${t.entrada.partido.equipoVisitante}`
                                                            : ""}
                                                    </Text>
                                                    {t.entrada?.nombreSector && (
                                                        <Text className="text-xs text-ink-faint">
                                                            Sector {t.entrada.nombreSector}
                                                        </Text>
                                                    )}
                                                    <Text className="text-xs text-ink-faint">
                                                        {esRecibida ? `De: ${t.emailOrigen}` : `Para: ${t.emailDestino}`}
                                                    </Text>
                                                    <Text className="text-xs text-ink-faint">{formatFechaHora(t.fechaHora)}</Text>
                                                </View>
                                                <AppBadge estado={t.estado}>{t.estado}</AppBadge>
                                            </View>

                                            {esPendiente && (
                                                <View className="mt-3 flex-row gap-2">
                                                    {esRecibida ? (
                                                        <>
                                                            <AppButton
                                                                variant="primary"
                                                                size="sm"
                                                                className="flex-1"
                                                                onPress={() => setAccion({ id: idT, tipo: "aceptar" })}
                                                            >
                                                                Aceptar
                                                            </AppButton>
                                                            <AppButton
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onPress={() => setAccion({ id: idT, tipo: "rechazar" })}
                                                            >
                                                                Rechazar
                                                            </AppButton>
                                                        </>
                                                    ) : (
                                                        <AppButton
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onPress={() => setAccion({ id: idT, tipo: "cancelar" })}
                                                        >
                                                            Cancelar
                                                        </AppButton>
                                                    )}
                                                </View>
                                            )}
                                        </CardBody>
                                    </AppCard>
                                </FadeInCard>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            <ConfirmDialog
                visible={!!accion}
                title={
                    accion?.tipo === "aceptar"
                        ? "Aceptar transferencia"
                        : accion?.tipo === "rechazar"
                            ? "Rechazar transferencia"
                            : "Cancelar transferencia"
                }
                message={
                    accion?.tipo === "aceptar"
                        ? "Al aceptar, la entrada pasará a ser tuya. ¿Confirmás?"
                        : accion?.tipo === "rechazar"
                            ? "¿Seguro que querés rechazar esta transferencia?"
                            : "¿Seguro que querés cancelar el envío de esta transferencia?"
                }
                confirmLabel={
                    accion?.tipo === "aceptar" ? "Sí, aceptar" : accion?.tipo === "rechazar" ? "Sí, rechazar" : "Sí, cancelar"
                }
                destructive={accion?.tipo !== "aceptar"}
                onConfirm={ejecutarAccion}
                onCancel={() => setAccion(null)}
            />
        </View>
    );
}
