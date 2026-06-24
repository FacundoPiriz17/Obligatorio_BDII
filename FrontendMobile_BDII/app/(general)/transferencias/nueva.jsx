import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { transferenciaService } from "../../../src/features/transferencias/services/transferenciaService";
import { entradaService } from "../../../src/features/entradas/services/entradaService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppButton } from "../../../src/components/ui/AppButton";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppInput } from "../../../src/components/ui/AppInput";
import { AppCard, CardBody } from "../../../src/components/ui/AppCard";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { formatFecha, formatHora } from "../../../src/lib/formatters";
import { MAX_TRANSFERENCIAS } from "../../../src/lib/constants";
import { entradaPermiteTransferencia } from "../../../src/features/entradas/utils/estadoEntrada";

export default function NuevaTransferenciaScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [selectedEntrada, setSelectedEntrada] = useState(null);
    const [emailDestino, setEmailDestino] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorLocal, setErrorLocal] = useState(null);

    const {
        data: entradas,
        loading: eLoading,
        error: eError,
        refetch,
    } = useFetch(useCallback(() => entradaService.misEntradas({ estado: "activa" }), []));

    const entradasTransferibles = (entradas ?? []).filter((e) => entradaPermiteTransferencia(e));

    const enviar = async () => {
        if (!selectedEntrada) {
            setErrorLocal("Seleccioná una entrada.");
            return;
        }
        if (!emailDestino.trim()) {
            setErrorLocal("Ingresá el email del destinatario.");
            return;
        }
        setErrorLocal(null);
        setLoading(true);
        try {
            await transferenciaService.crear(selectedEntrada, emailDestino.trim());
            Toast.show({ type: "success", text1: "Transferencia enviada correctamente." });
            router.replace("/(general)/transferencias");
        } catch (err) {
            setErrorLocal(err?.detail ?? "Error al enviar la transferencia.");
        } finally {
            setLoading(false);
        }
    };

    if (eLoading) return <LoadingScreen label="Cargando entradas…" />;
    if (eError) return <ErrorMessage error={eError} onRetry={refetch} />;

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-4" style={{ paddingTop: insets.top + 8 }}>
                <HeroBackground orbs={false} />
                <Pressable onPress={() => router.back()} hitSlop={8} className="mb-3 flex-row items-center gap-1.5">
                    <Ionicons name="arrow-back" size={20} color="#7694d0" />
                    <Text className="text-sm font-semibold text-navy-300">Transferencias</Text>
                </Pressable>
                <Text className="text-xl font-extrabold text-white">Nueva transferencia</Text>
                <Text className="mt-0.5 text-xs text-navy-300">
                    Cada entrada puede transferirse máximo {MAX_TRANSFERENCIAS} veces
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 130 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* 1 — Seleccionar entrada */}
                <Text className="mb-3 text-base font-bold text-ink">
                    1. Seleccioná la entrada a transferir
                </Text>

                {entradasTransferibles.length === 0 ? (
                    <EmptyState
                        iconName="ticket-outline"
                        title="Sin entradas disponibles"
                        description="No tenés entradas activas que se puedan transferir."
                        actionLabel="Ver partidos"
                        onAction={() => router.push("/(general)/partidos")}
                    />
                ) : (
                    <View className="gap-2">
                        {entradasTransferibles.map((e) => {
                            const sel = selectedEntrada === e.idEntrada;
                            return (
                                <Pressable
                                    key={e.idEntrada}
                                    onPress={() => setSelectedEntrada(e.idEntrada)}
                                    className={`overflow-hidden rounded-2xl border ${
                                        sel ? "border-navy-700 bg-navy-950" : "border-container-high bg-white"
                                    }`}
                                >
                                    <View className="px-4 py-3">
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-1 mr-3">
                                                <Text
                                                    className={`text-sm font-bold ${sel ? "text-white" : "text-ink"}`}
                                                    numberOfLines={1}
                                                >
                                                    {e.partido?.equipoLocal} vs {e.partido?.equipoVisitante}
                                                </Text>
                                                <Text className={`text-xs ${sel ? "text-navy-300" : "text-ink-faint"}`}>
                                                    {formatFecha(e.partido?.fecha)} · {formatHora(e.partido?.hora)} · Sector{" "}
                                                    {e.nombreSector}
                                                </Text>
                                                <View className="mt-1.5 flex-row items-center gap-1.5">
                                                    <View className="flex-row gap-1">
                                                        {[0, 1, 2].map((i) => (
                                                            <View
                                                                key={i}
                                                                className={`h-1 w-5 rounded-full ${
                                                                    i < (e.transferenciasRestantes ?? 3)
                                                                        ? sel
                                                                            ? "bg-energy-500"
                                                                            : "bg-ok-500"
                                                                        : sel
                                                                            ? "bg-white/20"
                                                                            : "bg-container-high"
                                                                }`}
                                                            />
                                                        ))}
                                                    </View>
                                                    <Text className={`text-[10px] font-semibold ${sel ? "text-navy-300" : "text-ink-faint"}`}>
                                                        {e.transferenciasRestantes ?? 3} transferencias restantes
                                                    </Text>
                                                </View>
                                            </View>
                                            {sel && <Ionicons name="checkmark-circle" size={20} color="#00e3fd" />}
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                {/* 2 — Email destino */}
                {selectedEntrada && (
                    <>
                        <Text className="mb-3 mt-6 text-base font-bold text-ink">2. ¿A quién se la enviás?</Text>
                        <AppCard>
                            <CardBody>
                                <AppInput
                                    label="Email del destinatario"
                                    iconName="mail-outline"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="destino@correo.ucu.edu.uy"
                                    value={emailDestino}
                                    onChangeText={(t) => {
                                        setEmailDestino(t);
                                        setErrorLocal(null);
                                    }}
                                    error={errorLocal}
                                    hint="El destinatario debe tener una cuenta UCU activa."
                                />
                            </CardBody>
                        </AppCard>

                        {/* Info */}
                        <View className="mt-3 flex-row items-start gap-2 rounded-xl border border-info-100 bg-info-100 px-3 py-3">
                            <Ionicons name="information-circle" size={16} color="#1d4ed8" />
                            <Text className="flex-1 text-xs text-info-600">
                                El destinatario deberá aceptar la transferencia. Hasta que no lo haga, la entrada
                                sigue siendo tuya.
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* CTA */}
            {selectedEntrada && (
                <View
                    className="border-t border-container-high bg-white px-5 py-4"
                    style={{ paddingBottom: insets.bottom + 8 }}
                >
                    <AppButton
                        variant="primary"
                        size="lg"
                        loading={loading}
                        disabled={!emailDestino.trim()}
                        onPress={enviar}
                    >
                        Enviar transferencia
                    </AppButton>
                </View>
            )}
        </View>
    );
}
