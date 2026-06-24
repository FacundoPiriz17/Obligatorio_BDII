import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { partidoService } from "../../../src/features/partidos/services/partidoService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppButton } from "../../../src/components/ui/AppButton";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import { Flag } from "../../../src/components/ui/Flag";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppCard, CardBody, CardHeader } from "../../../src/components/ui/AppCard";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { formatFecha, formatHora, formatMoney } from "../../../src/lib/formatters";

export default function PartidoDetalleScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        data: partido,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => partidoService.obtener(Number(id)), [id]));

    if (loading) return <LoadingScreen label="Cargando partido…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;
    if (!partido) return null;

    const p = partido;
    // El backend (eventos/{id}) devuelve `sectores`; cada sector trae costoTotalEntrada.
    const sectoresHabilitados = p.sectores ?? p.sectoresHabilitados ?? [];
    const puedeComprar = p.estado === "no empezado" && sectoresHabilitados.length > 0;

    return (
        <View className="flex-1 bg-surface">
            {/* Header navy */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-6" style={{ paddingTop: insets.top + 8 }}>
                <HeroBackground orbs={false} />
                <Pressable onPress={() => router.back()} hitSlop={8} className="mb-3 flex-row items-center gap-1.5">
                    <Ionicons name="arrow-back" size={20} color="#7694d0" />
                    <Text className="text-sm font-semibold text-navy-300">Volver</Text>
                </Pressable>
                <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-navy-300">
                            {p.fase ?? "Mundial 2026"}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-2">
                            <Flag nombre={p.equipoLocal} codigo={p.codigoLocal} size="md" />
                            <Text className="flex-1 text-xl font-extrabold text-white" style={{ letterSpacing: -0.3 }} numberOfLines={2}>
                                {p.equipoLocal} vs {p.equipoVisitante}
                            </Text>
                            <Flag nombre={p.equipoVisitante} codigo={p.codigoVisitante} size="md" />
                        </View>
                    </View>
                    <AppBadge estado={p.estado}>{p.estado}</AppBadge>
                </View>
                <View className="mt-3 flex-row flex-wrap gap-3">
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="calendar-outline" size={14} color="#acc7ff" />
                        <Text className="text-sm text-navy-100">{formatFecha(p.fecha)}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="time-outline" size={14} color="#acc7ff" />
                        <Text className="text-sm text-navy-100">{formatHora(p.hora)}</Text>
                    </View>
                    {p.estadio?.nombre && (
                        <View className="flex-row items-center gap-1.5">
                            <Ionicons name="location-outline" size={14} color="#acc7ff" />
                            <Text className="text-sm text-navy-100" numberOfLines={1}>
                                {p.estadio.nombre}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Estadio */}
                {p.estadio && (
                    <AppCard className="mb-4">
                        <CardHeader title="Estadio" />
                        <CardBody>
                            <Text className="text-base font-bold text-ink">{p.estadio.nombre}</Text>
                            {p.estadio.ciudad && (
                                <Text className="mt-1 text-sm text-ink-faint">
                                    {p.estadio.ciudad}, {p.estadio.pais}
                                </Text>
                            )}
                        </CardBody>
                    </AppCard>
                )}

                {/* Sectores disponibles */}
                {sectoresHabilitados.length > 0 && (
                    <AppCard className="mb-4">
                        <CardHeader title="Sectores disponibles" subtitle="Precio por entrada" />
                        <CardBody className="gap-2">
                            {sectoresHabilitados.map((s) => (
                                <View
                                    key={s.nombreSector}
                                    className="flex-row items-center justify-between rounded-xl border border-container-high bg-container-low px-3 py-2.5"
                                >
                                    <View className="flex-row items-center gap-2">
                                        <View className="size-7 items-center justify-center rounded-lg bg-navy-900">
                                            <Text className="text-xs font-extrabold text-white">{s.nombreSector}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm font-semibold text-ink">Sector {s.nombreSector}</Text>
                                            <Text className="text-xs text-ink-faint">
                                                {s.entradasDisponibles ?? "?"} disponibles
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-sm font-bold text-navy-900">
                                        {formatMoney(s.costoTotalEntrada ?? s.costoSector ?? s.costo)}
                                    </Text>
                                </View>
                            ))}
                        </CardBody>
                    </AppCard>
                )}

                {sectoresHabilitados.length === 0 && (
                    <View className="mb-4 rounded-2xl border border-warn-100 bg-warn-100 px-4 py-3">
                        <Text className="text-sm font-medium text-warn-600">
                            No hay sectores habilitados para este partido.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* CTA bottom */}
            {puedeComprar && (
                <View
                    className="border-t border-container-high bg-white px-5 py-4"
                    style={{ paddingBottom: insets.bottom + 8 }}
                >
                    <AppButton
                        variant="energy"
                        size="lg"
                        onPress={() => router.push(`/(general)/compras/nueva?partido=${p.idPartido ?? p.id}`)}
                    >
                        Comprar entradas
                    </AppButton>
                </View>
            )}
        </View>
    );
}
