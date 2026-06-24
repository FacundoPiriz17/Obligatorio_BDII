import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { entradaService } from "../../../src/features/entradas/services/entradaService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import { Flag } from "../../../src/components/ui/Flag";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { FadeInCard } from "../../../src/components/ui/FadeInCard";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { formatFecha, formatHora } from "../../../src/lib/formatters";
import { estadoVisualEntrada } from "../../../src/features/entradas/utils/estadoEntrada";

const FILTROS = ["todas", "activa", "vencida", "consumida"];

export default function EntradasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [filtro, setFiltro] = useState("todas");

    const {
        data: entradas,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => entradaService.misEntradas(), []));

    if (loading) return <LoadingScreen label="Cargando entradas…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const lista = (entradas ?? []).filter((e) => filtro === "todas" || estadoVisualEntrada(e) === filtro);

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground orbs={false} />
                <Text className="text-xl font-extrabold text-white">Mis entradas</Text>
                <Text className="mt-0.5 text-xs text-navy-300">
                    {(entradas ?? []).length} entradas en total
                </Text>
                {/* Filtros */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 -mx-1">
                    <View className="flex-row gap-2 px-1">
                        {FILTROS.map((f) => (
                            <Pressable
                                key={f}
                                onPress={() => setFiltro(f)}
                                className={`rounded-full px-4 py-1.5 ${filtro === f ? "bg-energy-500" : "bg-white/10"}`}
                            >
                                <Text
                                    className={`text-xs font-semibold capitalize ${
                                        filtro === f ? "text-navy-950" : "text-navy-100"
                                    }`}
                                >
                                    {f}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 24, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {lista.length === 0 ? (
                    <EmptyState
                        iconName="ticket-outline"
                        title="Sin entradas"
                        description={
                            filtro === "todas"
                                ? "Todavía no tenés entradas. ¡Comprá para el próximo partido!"
                                : `No tenés entradas en estado "${filtro}".`
                        }
                        actionLabel={filtro === "todas" ? "Ver partidos" : undefined}
                        onAction={
                            filtro === "todas" ? () => router.push("/(general)/partidos") : undefined
                        }
                    />
                ) : (
                    <View className="gap-3">
                        {lista.map((e, index) => (
                            <FadeInCard key={e.idEntrada} index={index}>
                                <Pressable
                                    onPress={() => router.push(`/(general)/entradas/${e.idEntrada}`)}
                                    className="overflow-hidden rounded-2xl border border-container-high bg-white active:bg-container-low"
                                    style={{ shadowColor: "#141c28", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}
                                >
                                    {/* Top stripe */}
                                    <View className="flex-row items-center justify-between bg-navy-950 px-4 py-2">
                                        <Text className="text-[10px] font-bold uppercase tracking-widest text-navy-300">
                                            Entrada #{e.idEntrada}
                                        </Text>
                                        <AppBadge estado={estadoVisualEntrada(e)}>{estadoVisualEntrada(e)}</AppBadge>
                                    </View>
                                    <View className="px-4 py-3">
                                        <View className="flex-row items-center gap-2">
                                            <Flag nombre={e.partido?.equipoLocal} size="sm" />
                                            <Text className="flex-1 text-base font-bold text-ink" numberOfLines={1}>
                                                {e.partido?.equipoLocal} vs {e.partido?.equipoVisitante}
                                            </Text>
                                            <Flag nombre={e.partido?.equipoVisitante} size="sm" />
                                        </View>
                                        <View className="mt-2 flex-row flex-wrap gap-x-4 gap-y-1">
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="calendar-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint">{formatFecha(e.partido?.fecha)}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="time-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint">{formatHora(e.partido?.hora)}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="grid-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint">Sector {e.nombreSector}</Text>
                                            </View>
                                        </View>
                                        {/* Transferencias restantes */}
                                        {estadoVisualEntrada(e) === "activa" && (
                                            <View className="mt-3 flex-row items-center gap-2">
                                                <Text className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                                                    Transferencias
                                                </Text>
                                                <View className="flex-row gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <View
                                                            key={i}
                                                            className={`h-1.5 w-6 rounded-full ${
                                                                i < (e.transferenciasRestantes ?? 3) ? "bg-ok-500" : "bg-container-high"
                                                            }`}
                                                        />
                                                    ))}
                                                </View>
                                                <Text className="text-[10px] text-ink-faint">
                                                    {e.transferenciasRestantes ?? 3} restantes
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            </FadeInCard>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
