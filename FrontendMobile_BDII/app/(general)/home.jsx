import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { useFetch } from "../../src/hooks/useFetch";
import { apiClient } from "../../src/services/apiClient";
import { endpoints } from "../../src/services/endpoints";
import { AppCard, CardBody } from "../../src/components/ui/AppCard";
import { AppBadge } from "../../src/components/ui/AppBadge";
import { Flag } from "../../src/components/ui/Flag";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { UcuLogoIcon } from "../../src/components/ui/UcuLogoIcon";
import { FadeInCard } from "../../src/components/ui/FadeInCard";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { formatFecha, formatHora, formatFechaHora } from "../../src/lib/formatters";

function StatCard({ icon, label, value, tone = "navy", hint }) {
    const toneColors = {
        navy: { bg: "bg-navy-100", icon: "#002b61", text: "text-navy-900" },
        energy: { bg: "bg-energy-500/20", icon: "#00616d", text: "text-navy-900" },
        ok: { bg: "bg-ok-100", icon: "#047857", text: "text-ok-600" },
        warn: { bg: "bg-warn-100", icon: "#b45309", text: "text-warn-600" },
    };
    const c = toneColors[tone];

    return (
        <View
            className="flex-1 rounded-2xl border border-container-high bg-white p-3"
            style={{ minWidth: "47%" }}
        >
            <View className={`mb-2 size-9 items-center justify-center rounded-xl ${c.bg}`}>
                <Ionicons name={icon} size={18} color={c.icon} />
            </View>
            <Text className={`text-2xl font-extrabold ${c.text}`}>{value}</Text>
            <Text className="mt-0.5 text-xs font-medium text-ink-faint" numberOfLines={1}>
                {label}
            </Text>
            {hint && (
                <Text className="mt-0.5 text-[10px] text-ink-faint" numberOfLines={1}>
                    {hint}
                </Text>
            )}
        </View>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const {
        data: home,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => apiClient.get(endpoints.home.general), []));

    const nombre = (user?.nombre || "").split(" ")[0];

    if (loading) return <LoadingScreen label="Preparando tu inicio…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    return (
        <ScrollView
            className="flex-1 bg-surface"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero header */}
            <View className="overflow-hidden bg-navy-950 px-5 pb-6" style={{ paddingTop: insets.top + 16 }}>
                <HeroBackground />
                {/* Top row */}
                <View className="mb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <UcuLogoIcon className="size-9 rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15" size={36} />
                        <View>
                            <Text className="text-sm font-extrabold text-white">UCU Mundial</Text>
                            <Text className="text-[10px] font-semibold uppercase tracking-widest text-navy-300">
                                Ticketing 2026
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={() => router.push("/(general)/perfil")} hitSlop={8}>
                        <View className="size-9 items-center justify-center rounded-full bg-white/15">
                            <Text className="text-sm font-extrabold text-white">
                                {(user?.nombre || user?.email || "?").slice(0, 1).toUpperCase()}
                            </Text>
                        </View>
                    </Pressable>
                </View>

                <Text className="text-xs font-semibold uppercase tracking-widest text-energy-400">
                    Bienvenido{nombre ? `, ${nombre}` : ""}
                </Text>
                <Text className="mt-1 text-2xl font-extrabold text-white" style={{ letterSpacing: -0.4 }}>
                    Tu Mundial 2026
                </Text>
                <Text className="mt-1 text-sm text-navy-100">
                    Gestioná tus entradas desde un solo lugar.
                </Text>
            </View>

            <View className="px-4">
                {/* Stats */}
                <View className="mt-4 flex-row flex-wrap gap-3">
                    <StatCard
                        icon="ticket"
                        label="Entradas activas"
                        value={home?.entradasActivas ?? 0}
                        tone="energy"
                    />
                    <StatCard icon="bag" label="Compras pagas" value={home?.comprasPagas ?? 0} tone="ok" />
                    <StatCard
                        icon="arrow-down"
                        label="Transf. recibidas"
                        value={home?.transferenciasPendientesRecibidas ?? 0}
                        tone={home?.transferenciasPendientesRecibidas ? "warn" : "navy"}
                        hint="pendientes"
                    />
                    <StatCard
                        icon="arrow-up"
                        label="Transf. enviadas"
                        value={home?.transferenciasPendientesEnviadas ?? 0}
                        tone="navy"
                        hint="pendientes"
                    />
                </View>

                {/* Accesos rápidos */}
                <Text className="mb-3 mt-6 text-base font-bold text-ink">Accesos rápidos</Text>
                <View className="flex-row gap-3">
                    {[
                        { label: "Ver partidos", icon: "calendar", route: "/(general)/partidos" },
                        { label: "Mis entradas", icon: "ticket", route: "/(general)/entradas" },
                        { label: "Transferir", icon: "swap-horizontal", route: "/(general)/transferencias/nueva" },
                    ].map((a) => (
                        <Pressable
                            key={a.label}
                            onPress={() => router.push(a.route)}
                            className="flex-1 items-center rounded-2xl border border-container-high bg-white py-4 active:bg-container-low"
                        >
                            <View className="mb-2 size-10 items-center justify-center rounded-xl bg-container">
                                <Ionicons name={a.icon} size={20} color="#002b61" />
                            </View>
                            <Text className="text-center text-xs font-semibold text-ink" numberOfLines={2}>
                                {a.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Próximas entradas */}
                {(home?.proximasEntradas?.length ?? 0) > 0 && (
                    <>
                        <Text className="mb-3 mt-6 text-base font-bold text-ink">Próximas entradas</Text>
                        <View className="gap-3">
                            {home.proximasEntradas.slice(0, 3).map((e, index) => (
                                <FadeInCard key={e.idEntrada} index={index}>
                                    <Pressable onPress={() => router.push(`/(general)/entradas/${e.idEntrada}`)}>
                                        <AppCard>
                                            <CardBody className="flex-row items-center gap-3">
                                                <Flag nombre={e.equipoLocal} size="md" />
                                                <View className="flex-1">
                                                    <Text className="text-sm font-bold text-ink" numberOfLines={1}>
                                                        {e.equipoLocal} vs {e.equipoVisitante}
                                                    </Text>
                                                    <Text className="text-xs text-ink-faint">
                                                        {formatFecha(e.fechaPartido)} · {formatHora(e.horaPartido)} · Sector{" "}
                                                        {e.nombreSector}
                                                    </Text>
                                                </View>
                                                <AppBadge estado={e.estado} />
                                            </CardBody>
                                        </AppCard>
                                    </Pressable>
                                </FadeInCard>
                            ))}
                        </View>
                    </>
                )}

                {/* Transferencias pendientes */}
                {(home?.transferenciasPendientes?.length ?? 0) > 0 && (
                    <>
                        <Text className="mb-3 mt-6 text-base font-bold text-ink">
                            Transferencias pendientes
                        </Text>
                        <View className="gap-3">
                            {home.transferenciasPendientes.map((t, index) => (
                                <FadeInCard key={t.idTransferencia} index={index}>
                                    <Pressable onPress={() => router.push("/(general)/transferencias")}>
                                        <AppCard>
                                            <CardBody className="flex-row items-center gap-3">
                                                <View className="size-10 items-center justify-center rounded-xl bg-warn-100">
                                                    <Ionicons name="swap-horizontal" size={18} color="#b45309" />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-sm font-bold text-ink">Entrada #{t.idEntrada}</Text>
                                                    <Text className="text-xs text-ink-faint">
                                                        De: {t.emailOrigen} · {formatFechaHora(t.fechaHora)}
                                                    </Text>
                                                </View>
                                                <AppBadge variant="warn">Pendiente</AppBadge>
                                            </CardBody>
                                        </AppCard>
                                    </Pressable>
                                </FadeInCard>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}
