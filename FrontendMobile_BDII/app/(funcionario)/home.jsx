import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { useFetch } from "../../src/hooks/useFetch";
import { apiClient } from "../../src/services/apiClient";
import { endpoints } from "../../src/services/endpoints";
import { AppCard, CardBody, CardHeader } from "../../src/components/ui/AppCard";
import { AppBadge } from "../../src/components/ui/AppBadge";
import { Flag } from "../../src/components/ui/Flag";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { UcuLogoIcon } from "../../src/components/ui/UcuLogoIcon";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { formatFechaHora } from "../../src/lib/formatters";

export default function FuncionarioHomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const {
        data: home,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => apiClient.get(endpoints.home.funcionario), []));

    const nombre = (user?.nombre || "").split(" ")[0];

    if (loading) return <LoadingScreen label="Cargando panel…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const h = home;

    return (
        <ScrollView
            className="flex-1 bg-surface"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero header — tono distinto para diferenciar del general */}
            <View className="overflow-hidden bg-navy-800 px-5 pb-6" style={{ paddingTop: insets.top + 16 }}>
                <HeroBackground variant="funcionario" />
                <View className="mb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <UcuLogoIcon className="size-9 rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15" size={36} />
                        <View>
                            <Text className="text-sm font-extrabold text-white">UCU Mundial</Text>
                            <Text className="text-[10px] font-semibold uppercase tracking-widest text-navy-300">
                                Panel funcionario
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={() => router.push("/(funcionario)/perfil")}
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
                    Control de acceso
                </Text>
                <Text className="mt-1 text-sm text-navy-100">
                    Validá entradas en los sectores asignados.
                </Text>
            </View>

            <View className="px-4 pt-4 gap-4">
                {/* Stats */}
                <View className="flex-row gap-3">
                    {[
                        {
                            label: "Válidas hoy",
                            value: h?.validacionesValidasHoy ?? 0,
                            icon: "checkmark-circle",
                            color: "#047857",
                            bg: "bg-ok-100",
                        },
                        {
                            label: "Inválidas hoy",
                            value: h?.validacionesInvalidasHoy ?? 0,
                            icon: "close-circle",
                            color: "#ba1a1a",
                            bg: "bg-danger-100",
                        },
                        {
                            label: "Disp. activos",
                            value: h?.dispositivosActivos ?? 0,
                            icon: "phone-portrait",
                            color: "#002b61",
                            bg: "bg-navy-100",
                        },
                    ].map((s) => (
                        <View
                            key={s.label}
                            className="flex-1 rounded-2xl border border-container-high bg-white p-3"
                            style={{ shadowColor: "#141c28", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}
                        >
                            <View className={`mb-2 size-9 items-center justify-center rounded-xl ${s.bg}`}>
                                <Ionicons name={s.icon} size={18} color={s.color} />
                            </View>
                            <Text className="text-2xl font-extrabold text-ink">{s.value}</Text>
                            <Text className="mt-0.5 text-xs font-medium text-ink-faint">{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Acciones rápidas */}
                <AppCard>
                    <CardHeader title="Acciones rápidas" />
                    <View className="divide-y divide-container-high">
                        {[
                            {
                                icon: "scan",
                                label: "Escanear QR",
                                desc: "Validar entrada con cámara",
                                route: "/(funcionario)/scanner",
                                accent: true,
                            },
                            {
                                icon: "checkmark-circle-outline",
                                label: "Ver validaciones",
                                desc: "Historial del día",
                                route: "/(funcionario)/validaciones",
                                accent: false,
                            },
                            {
                                icon: "phone-portrait-outline",
                                label: "Mi dispositivo",
                                desc: "Info del dispositivo registrado",
                                route: "/(funcionario)/dispositivo",
                                accent: false,
                            },
                        ].map((a) => (
                            <Pressable
                                key={a.label}
                                onPress={() => router.push(a.route)}
                                className="flex-row items-center gap-3 px-4 py-3.5 active:bg-container-low"
                            >
                                <View
                                    className={`size-10 items-center justify-center rounded-xl ${
                                        a.accent ? "bg-energy-500" : "bg-container"
                                    }`}
                                >
                                    <Ionicons name={a.icon} size={20} color={a.accent ? "#00173a" : "#002b61"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-ink">{a.label}</Text>
                                    <Text className="text-xs text-ink-faint">{a.desc}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#c4c6d1" />
                            </Pressable>
                        ))}
                    </View>
                </AppCard>

                {/* Últimas validaciones */}
                {(h?.ultimasValidaciones?.length ?? 0) > 0 && (
                    <AppCard>
                        <CardHeader
                            title="Últimas validaciones"
                            right={
                                <Pressable onPress={() => router.push("/(funcionario)/validaciones")}>
                                    <Text className="text-xs font-semibold text-navy-700">Ver todas</Text>
                                </Pressable>
                            }
                        />
                        <View className="divide-y divide-container-high">
                            {h.ultimasValidaciones.slice(0, 5).map((v, i) => {
                                const ok = String(v.estado ?? "").toLowerCase().startsWith("vál");
                                return (
                                    <Animated.View
                                        key={v.idValidacion ?? i}
                                        entering={FadeIn.duration(220).delay(Math.min(i, 8) * 40)}
                                        className="flex-row items-center gap-3 px-4 py-3"
                                    >
                                        <View
                                            className={`size-8 items-center justify-center rounded-lg ${
                                                ok ? "bg-ok-100" : "bg-danger-100"
                                            }`}
                                        >
                                            <Ionicons
                                                name={ok ? "checkmark" : "close"}
                                                size={16}
                                                color={ok ? "#047857" : "#ba1a1a"}
                                            />
                                        </View>
                                        <Flag nombre={v.equipoLocal} size="sm" />
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
                                                {v.equipoLocal} vs {v.equipoVisitante}
                                            </Text>
                                            <Text className="text-xs text-ink-faint">
                                                {v.idEntrada ? `Entrada #${v.idEntrada}` : "QR sin entrada asociada"} · {formatFechaHora(v.fechaHora)}
                                            </Text>
                                        </View>
                                        <AppBadge variant={ok ? "ok" : "danger"}>
                                            {ok ? "Válida" : "Inválida"}
                                        </AppBadge>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </AppCard>
                )}
            </View>
        </ScrollView>
    );
}
