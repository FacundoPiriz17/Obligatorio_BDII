import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { useFetch } from "../../src/hooks/useFetch";
import { reporteService } from "../../src/features/reportes/services/reporteService";
import { AppCard, CardHeader } from "../../src/components/ui/AppCard";
import { Flag } from "../../src/components/ui/Flag";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { UcuLogoIcon } from "../../src/components/ui/UcuLogoIcon";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { formatFecha, formatHora, formatMoney } from "../../src/lib/formatters";

export default function AdminHomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuthStore();

    const { data: home, loading, error, refetch } = useFetch(
        useCallback(() => reporteService.homeAdmin(), [])
    );

    const nombre = (user?.nombre || "").split(" ")[0];

    if (loading) return <LoadingScreen label="Cargando panel…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const h = home ?? {};

    const stats = [
        { label: "Eventos totales", value: h.eventosTotales ?? 0, icon: "calendar", color: "#002b61", bg: "bg-navy-100" },
        { label: "Eventos futuros", value: h.eventosFuturos ?? 0, icon: "time", color: "#00616d", bg: "bg-energy-500/20" },
        { label: "Entradas vendidas", value: h.entradasVendidas ?? 0, icon: "ticket", color: "#047857", bg: "bg-ok-100" },
        { label: "Validadas hoy", value: h.validacionesHoy ?? 0, icon: "checkmark-circle", color: "#047857", bg: "bg-ok-100" },
    ];

    return (
        <ScrollView
            className="flex-1 bg-surface"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero */}
            <View className="overflow-hidden bg-navy-950 px-5 pb-6" style={{ paddingTop: insets.top + 16 }}>
                <HeroBackground />
                <View className="mb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <UcuLogoIcon className="size-9 rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15" size={36} />
                        <View>
                            <Text className="text-sm font-extrabold text-white">UCU Mundial</Text>
                            <Text className="text-[10px] font-semibold uppercase tracking-widest text-energy-400">
                                Panel administrador
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={() => router.push("/(admin)/perfil")}
                        className="size-9 items-center justify-center rounded-full bg-white/15"
                    >
                        <Text className="text-sm font-extrabold text-white">
                            {(user?.nombre || user?.email || "?")[0].toUpperCase()}
                        </Text>
                    </Pressable>
                </View>

                <Text className="text-xs font-semibold uppercase tracking-widest text-energy-400">
                    Bienvenido{nombre ? `, ${nombre}` : ""}
                </Text>
                <Text className="mt-1 text-2xl font-extrabold text-white" style={{ letterSpacing: -0.4 }}>
                    Resumen del sistema
                </Text>
                <Text className="mt-2 text-3xl font-extrabold text-energy-400">
                    {formatMoney(h.montoVendido ?? 0)}
                </Text>
                <Text className="text-xs text-navy-100">Monto total vendido</Text>
            </View>

            <View className="px-4 pt-4 gap-4">
                {/* Stats grid */}
                <View className="flex-row flex-wrap gap-3">
                    {stats.map((s) => (
                        <View
                            key={s.label}
                            className="flex-1 rounded-2xl border border-container-high bg-white p-3"
                            style={{ minWidth: "46%" }}
                        >
                            <View className={`mb-2 size-9 items-center justify-center rounded-xl ${s.bg}`}>
                                <Ionicons name={s.icon} size={18} color={s.color} />
                            </View>
                            <Text className="text-2xl font-extrabold text-ink">{s.value}</Text>
                            <Text className="mt-0.5 text-xs font-medium text-ink-faint">{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Acceso auditoría */}
                <Pressable
                    onPress={() => router.push("/(admin)/auditoria")}
                    className="flex-row items-center gap-3 rounded-2xl bg-navy-900 px-4 py-4 active:bg-navy-950"
                >
                    <View className="size-10 items-center justify-center rounded-xl bg-energy-500">
                        <Ionicons name="shield-checkmark" size={20} color="#00173a" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-white">Registro de auditoría</Text>
                        <Text className="text-xs text-navy-100">
                            Compras, transferencias y validaciones · exportar PDF
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#7694d0" />
                </Pressable>

                {/* Próximos eventos */}
                {(h.proximosEventos?.length ?? 0) > 0 && (
                    <AppCard>
                        <CardHeader title="Próximos eventos" />
                        <View className="divide-y divide-container-high">
                            {h.proximosEventos.slice(0, 6).map((e, i) => (
                                <Animated.View
                                    key={e.idPartido ?? i}
                                    entering={FadeIn.duration(220).delay(Math.min(i, 8) * 40)}
                                    className="flex-row items-center gap-3 px-4 py-3"
                                >
                                    <Flag nombre={e.equipoLocal} size="md" />
                                    <View className="flex-1">
                                        <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
                                            {e.equipoLocal} vs {e.equipoVisitante}
                                        </Text>
                                        <Text className="text-xs text-ink-faint" numberOfLines={1}>
                                            {formatFecha(e.fecha)} · {formatHora(e.hora)} · {e.estadio}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-sm font-extrabold text-ink">{e.entradasVendidas}</Text>
                                        <Text className="text-[10px] text-ink-faint">vendidas</Text>
                                    </View>
                                </Animated.View>
                            ))}
                        </View>
                    </AppCard>
                )}
            </View>
        </ScrollView>
    );
}
