import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispositivo } from "../../src/features/dispositivo/hooks/useDispositivo";
import { DispositivoInfoCard } from "../../src/features/dispositivo/components/DispositivoInfoCard";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../src/components/feedback/ErrorMessage";
import { HeroBackground } from "../../src/components/ui/HeroBackground";
import { AppCard, CardBody, CardHeader } from "../../src/components/ui/AppCard";
import { AppBadge } from "../../src/components/ui/AppBadge";

export default function DispositivoScreen() {
    const insets = useSafeAreaInsets();
    const { installationId, dispositivoActual, otrosDispositivos, loading, error, refetch } =
        useDispositivo();

    if (loading && !installationId) return <LoadingScreen label="Leyendo dispositivo…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    return (
        <View className="flex-1 bg-surface">
            <View className="overflow-hidden bg-navy-800 px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground variant="funcionario" orbs={false} />
                <Text className="text-xl font-extrabold text-white">Mi dispositivo</Text>
                <Text className="mt-0.5 text-xs text-navy-300">
                    Identificación de este teléfono y tus dispositivos de escaneo
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Dispositivo en uso ahora (este teléfono) */}
                <View className="mb-2 flex-row items-center gap-2">
                    <View className="size-1.5 rounded-full bg-ok-500" />
                    <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                        En uso ahora
                    </Text>
                </View>
                <DispositivoInfoCard
                    installationId={installationId}
                    dispositivoActivo={dispositivoActual}
                />

                {/* Otros dispositivos habilitados del funcionario */}
                {otrosDispositivos.length > 0 && (
                    <AppCard className="mt-4">
                        <CardHeader
                            title="Otros dispositivos"
                            subtitle={`${otrosDispositivos.length} dispositivo(s) más a tu nombre`}
                        />
                        <View className="divide-y divide-container-high">
                            {otrosDispositivos.map((d) => (
                                <View
                                    key={d.idDispositivoEscaneo}
                                    className="flex-row items-center gap-3 px-4 py-3"
                                >
                                    <View className="size-9 items-center justify-center rounded-xl bg-container">
                                        <Ionicons name="phone-portrait-outline" size={18} color="#002b61" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-ink">
                                            #{d.idDispositivoEscaneo} · {d.modelo ?? "Sin modelo"}
                                        </Text>
                                        {d.installationId && (
                                            <Text className="text-[11px] text-ink-faint" numberOfLines={1}>
                                                {d.installationId}
                                            </Text>
                                        )}
                                    </View>
                                    <AppBadge variant={d.activo ? "ok" : "neutral"}>
                                        {d.activo ? "Activo" : "Inactivo"}
                                    </AppBadge>
                                </View>
                            ))}
                        </View>
                    </AppCard>
                )}

                <AppCard className="mt-4">
                    <CardHeader title="¿Cómo funciona?" />
                    <CardBody className="gap-3">
                        {[
                            {
                                icon: "finger-print-outline",
                                text: "El ID de instalación identifica de forma única este teléfono y se guarda cifrado en el dispositivo.",
                            },
                            {
                                icon: "scan-outline",
                                text: "Este teléfono se registra automáticamente como dispositivo de escaneo. Podés tener varios dispositivos habilitados a tu nombre.",
                            },
                            {
                                icon: "shield-checkmark-outline",
                                text: "Cada validación queda registrada a tu nombre y la podés revisar en la pestaña Validaciones.",
                            },
                        ].map(({ icon, text }, i) => (
                            <View key={i} className="flex-row items-start gap-3">
                                <View className="size-8 items-center justify-center rounded-lg bg-container">
                                    <Ionicons name={icon} size={16} color="#002b61" />
                                </View>
                                <Text className="flex-1 text-sm text-ink-soft">{text}</Text>
                            </View>
                        ))}
                    </CardBody>
                </AppCard>
            </ScrollView>
        </View>
    );
}
