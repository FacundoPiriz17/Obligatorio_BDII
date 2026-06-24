import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { partidoService } from "../../../src/features/partidos/services/partidoService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import { Flag } from "../../../src/components/ui/Flag";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { FadeInCard } from "../../../src/components/ui/FadeInCard";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { formatFecha, formatHora } from "../../../src/lib/formatters";

export default function PartidosScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState("");

    const {
        data: partidos,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => partidoService.listar(), []));

    if (loading) return <LoadingScreen label="Cargando partidos…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const filtered = (partidos ?? []).filter(
        (p) =>
            !search ||
            p.equipoLocal?.toLowerCase().includes(search.toLowerCase()) ||
            p.equipoVisitante?.toLowerCase().includes(search.toLowerCase()) ||
            p.estadio?.nombre?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground orbs={false} />
                <Text className="text-xl font-extrabold text-white">Partidos</Text>
                <Text className="mt-0.5 text-xs text-navy-300">Mundial 2026</Text>
                {/* Search */}
                <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                    <Ionicons name="search" size={16} color="#7694d0" />
                    <TextInput
                        className="flex-1 text-sm text-white"
                        placeholder="Buscar partido o estadio…"
                        placeholderTextColor="#7694d0"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch("")} hitSlop={8}>
                            <Ionicons name="close-circle" size={16} color="#7694d0" />
                        </Pressable>
                    )}
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {filtered.length === 0 ? (
                    <EmptyState
                        iconName="calendar-outline"
                        title="Sin partidos"
                        description="No hay partidos que coincidan con tu búsqueda."
                    />
                ) : (
                    <View className="gap-3">
                        {filtered.map((p, index) => (
                            <FadeInCard key={p.idPartido ?? p.id} index={index}>
                                <Pressable
                                    onPress={() => router.push(`/(general)/partidos/${p.idPartido ?? p.id}`)}
                                    className="overflow-hidden rounded-2xl border border-container-high bg-white active:bg-container-low"
                                    style={{ shadowColor: "#141c28", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
                                >
                                    <View className="bg-navy-950 px-4 py-2">
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-[10px] font-bold uppercase tracking-widest text-navy-300">
                                                {p.fase ?? "Mundial 2026"}
                                            </Text>
                                            <AppBadge estado={p.estado}>{p.estado}</AppBadge>
                                        </View>
                                    </View>
                                    <View className="px-4 py-4">
                                        {/* Equipos */}
                                        <View className="flex-row items-center justify-center gap-3">
                                            <View className="flex-1 flex-row items-center justify-end gap-2">
                                                <Text className="text-right text-base font-bold text-ink" numberOfLines={2}>
                                                    {p.equipoLocal}
                                                </Text>
                                                <Flag nombre={p.equipoLocal} codigo={p.codigoLocal} size="md" />
                                            </View>
                                            <View className="rounded-lg bg-container px-2.5 py-1">
                                                <Text className="text-xs font-extrabold text-navy-900">VS</Text>
                                            </View>
                                            <View className="flex-1 flex-row items-center justify-start gap-2">
                                                <Flag nombre={p.equipoVisitante} codigo={p.codigoVisitante} size="md" />
                                                <Text className="text-left text-base font-bold text-ink" numberOfLines={2}>
                                                    {p.equipoVisitante}
                                                </Text>
                                            </View>
                                        </View>
                                        {/* Info */}
                                        <View className="mt-3 flex-row items-center justify-center gap-4">
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="calendar-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint">{formatFecha(p.fecha)}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="time-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint">{formatHora(p.hora)}</Text>
                                            </View>
                                        </View>
                                        {p.estadio?.nombre && (
                                            <View className="mt-1 flex-row items-center justify-center gap-1">
                                                <Ionicons name="location-outline" size={12} color="#747781" />
                                                <Text className="text-xs text-ink-faint" numberOfLines={1}>
                                                    {p.estadio.nombre}
                                                    {p.estadio.ciudad ? `, ${p.estadio.ciudad}` : ""}
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
