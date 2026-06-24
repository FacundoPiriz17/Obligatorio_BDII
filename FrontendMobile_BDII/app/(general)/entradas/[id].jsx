import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, Image, AppState } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { entradaService } from "../../../src/features/entradas/services/entradaService";
import { transferenciaService } from "../../../src/features/transferencias/services/transferenciaService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppCard, CardBody, CardHeader } from "../../../src/components/ui/AppCard";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import QRCode from "react-native-qrcode-svg";
import { Flag } from "../../../src/components/ui/Flag";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppButton } from "../../../src/components/ui/AppButton";
import { AppModal } from "../../../src/components/ui/AppModal";
import { AppInput } from "../../../src/components/ui/AppInput";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { formatFecha, formatHora, formatFechaHora, formatMoney } from "../../../src/lib/formatters";
import { useAuthStore } from "../../../src/features/auth/store/useAuthStore";
import { QR_REFRESH_SEGUNDOS, MAX_TRANSFERENCIAS } from "../../../src/lib/constants";
import {
    entradaPermiteQr,
    entradaPermiteTransferencia,
    entradaEstaVencida,
    estadoVisualEntrada,
} from "../../../src/features/entradas/utils/estadoEntrada";

export default function EntradaDetalleScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const [qrData, setQrData] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [countdown, setCountdown] = useState(QR_REFRESH_SEGUNDOS);
    const intervalRef = useRef(null);
    const [showTransfer, setShowTransfer] = useState(false);
    const [emailDestino, setEmailDestino] = useState("");
    const [transferLoading, setTransferLoading] = useState(false);

    const {
        data: entrada,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => entradaService.obtener(Number(id)), [id]));
    const { data: custodia } = useFetch(
        useCallback(() => entradaService.custodia(Number(id)).catch(() => null), [id])
    );

    const e = entrada;
    const esPropietario = e?.emailPropietarioActual?.toLowerCase() === user?.email?.toLowerCase();
    const activa = entradaPermiteQr(e, esPropietario);
    const puedeTransferir = entradaPermiteTransferencia(e, esPropietario);
    const estaVencida = entradaEstaVencida(e);
    const estadoVisual = estadoVisualEntrada(e);
    const eventosCustodia = custodia?.eventos ?? [];

    const generarQr = useCallback(async () => {
        if (!activa) return;
        setQrLoading(true);
        try {
            const res = await entradaService.generarQr(Number(id));
            setQrData(res);
            setCountdown(QR_REFRESH_SEGUNDOS);
        } catch {
            // silent
        } finally {
            setQrLoading(false);
        }
    }, [id, activa]);

    // Auto-refresh QR cada 30s mientras la app está en foreground
    useEffect(() => {
        if (!activa) return;
        generarQr();
        intervalRef.current = setInterval(generarQr, QR_REFRESH_SEGUNDOS * 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [activa, generarQr]);

    // Countdown visual
    useEffect(() => {
        if (!activa) return;
        const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : QR_REFRESH_SEGUNDOS)), 1000);
        return () => clearInterval(t);
    }, [activa]);

    // Regenerar QR cuando la app vuelve a foreground
    useEffect(() => {
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active" && activa) generarQr();
        });
        return () => sub.remove();
    }, [activa, generarQr]);

    const hacerTransferencia = async () => {
        if (!emailDestino.trim()) return;
        setTransferLoading(true);
        try {
            await transferenciaService.crear(Number(id), emailDestino.trim());
            Toast.show({ type: "success", text1: "Transferencia enviada correctamente" });
            setShowTransfer(false);
            setEmailDestino("");
            refetch();
        } catch (err) {
            Toast.show({ type: "error", text1: err?.detail ?? "Error al transferir." });
        } finally {
            setTransferLoading(false);
        }
    };

    if (loading) return <LoadingScreen label="Cargando entrada…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;
    if (!e) return null;

    const p = e.partido;

    return (
        <View className="flex-1 bg-surface">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="overflow-hidden bg-navy-950 px-4 pb-5" style={{ paddingTop: insets.top + 8 }}>
                    <HeroBackground orbs={false} />
                    <Pressable onPress={() => router.back()} hitSlop={8} className="mb-3 flex-row items-center gap-1.5">
                        <Ionicons name="arrow-back" size={20} color="#7694d0" />
                        <Text className="text-sm font-semibold text-navy-300">Mis entradas</Text>
                    </Pressable>
                    <View className="flex-row items-start justify-between">
                        <View className="flex-1 mr-3">
                            <Text className="text-[10px] font-bold uppercase tracking-widest text-navy-300">
                                Entrada #{e.idEntrada}
                            </Text>
                            <View className="mt-1 flex-row items-center gap-2">
                                <Flag nombre={p?.equipoLocal} size="sm" />
                                <Text
                                    className="flex-1 text-xl font-extrabold text-white"
                                    style={{ letterSpacing: -0.3 }}
                                    numberOfLines={2}
                                >
                                    {p?.equipoLocal} vs {p?.equipoVisitante}
                                </Text>
                                <Flag nombre={p?.equipoVisitante} size="sm" />
                            </View>
                            <Text className="mt-1 text-xs text-navy-300">
                                {formatFecha(p?.fecha)} · {formatHora(p?.hora)} · Sector {e.nombreSector}
                            </Text>
                        </View>
                        <AppBadge estado={estadoVisual}>{estadoVisual}</AppBadge>
                    </View>
                </View>

                <View className="px-4 pt-4 gap-4">
                    {/* QR */}
                    {activa && (
                        <AppCard>
                            <CardHeader
                                title="Código QR"
                                subtitle={`Se regenera en ${countdown}s`}
                                right={
                                    <Pressable onPress={generarQr} hitSlop={8} className="rounded-lg bg-container p-2">
                                        <Ionicons name="refresh" size={16} color="#002b61" />
                                    </Pressable>
                                }
                            />
                            <CardBody className="items-center py-6">
                                {qrLoading ? (
                                    <View className="size-48 items-center justify-center rounded-xl bg-container-low">
                                        <Ionicons name="qr-code-outline" size={48} color="#7694d0" />
                                        <Text className="mt-2 text-xs text-ink-faint">Generando QR…</Text>
                                    </View>
                                ) : qrData?.codigoQr ? (
                                    <View className="rounded-2xl border-4 border-navy-950 bg-white p-2">
                                        <QRCode value={qrData.codigoQr} size={200} backgroundColor="#ffffff" color="#00173a" />
                                    </View>
                                ) : qrData?.qrPngBase64 ? (
                                    <View className="rounded-2xl border-4 border-navy-950 p-2">
                                        <Image
                                            source={{ uri: `data:image/png;base64,${qrData.qrPngBase64}` }}
                                            style={{ width: 200, height: 200 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : (
                                    <Pressable
                                        onPress={generarQr}
                                        className="size-48 items-center justify-center rounded-xl bg-container-low"
                                    >
                                        <Ionicons name="qr-code-outline" size={48} color="#7694d0" />
                                        <Text className="mt-2 text-xs font-semibold text-navy-700">Generar QR</Text>
                                    </Pressable>
                                )}

                                {/* Countdown bar */}
                                {qrData && (
                                    <View className="mt-4 w-full gap-1.5">
                                        <View className="h-1.5 w-full overflow-hidden rounded-full bg-container-high">
                                            <View
                                                className="h-full rounded-full bg-energy-500"
                                                style={{ width: `${(countdown / QR_REFRESH_SEGUNDOS) * 100}%` }}
                                            />
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <View className="size-1.5 rounded-full bg-ok-500" />
                                            <Text className="text-[10px] font-semibold text-ok-600">
                                                QR activo — válido por {countdown}s
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </CardBody>
                        </AppCard>
                    )}

                    {estaVencida && (
                        <View className="rounded-2xl border border-container-high bg-container-low px-4 py-3">
                            <Text className="text-sm font-medium text-ink-soft">
                                Esta entrada está vencida porque el partido ya finalizó. Se mantiene como comprada, pero no genera QR ni puede transferirse.
                            </Text>
                        </View>
                    )}

                    {!esPropietario && (
                        <View className="rounded-2xl border border-warn-100 bg-warn-100 px-4 py-3">
                            <Text className="text-sm font-medium text-warn-600">
                                Esta entrada ya no está a tu nombre. El QR solo lo ve el propietario actual.
                            </Text>
                        </View>
                    )}

                    {/* Detalles */}
                    <AppCard>
                        <CardHeader title="Detalles" />
                        <CardBody>
                            <View className="gap-4">
                                {[
                                    {
                                        label: "Propietario actual",
                                        value: e.nombrePropietarioActual || e.emailPropietarioActual,
                                    },
                                    { label: "Sector", value: `Sector ${e.nombreSector}` },
                                    { label: "Estadio", value: p?.estadio?.nombre },
                                    { label: "Partido", value: `${p?.equipoLocal} vs ${p?.equipoVisitante}` },
                                    { label: "Fecha", value: `${formatFecha(p?.fecha)} ${formatHora(p?.hora)}` },
                                    { label: "Precio", value: formatMoney(e.costoTotal) },
                                    { label: "Emitida", value: formatFechaHora(e.fechaHora) },
                                ].map(({ label, value }) => (
                                    <View key={label}>
                                        <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                            {label}
                                        </Text>
                                        <Text className="mt-0.5 text-sm font-semibold text-ink" numberOfLines={2}>
                                            {value || "—"}
                                        </Text>
                                    </View>
                                ))}

                                {/* Transferencias restantes */}
                                <View>
                                    <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                        Transferencias restantes
                                    </Text>
                                    <View className="mt-1.5 flex-row items-center gap-2">
                                        <View className="flex-row gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <View
                                                    key={i}
                                                    className={`h-2 w-8 rounded-full ${
                                                        i < (e.transferenciasRestantes ?? 3) ? "bg-ok-500" : "bg-container-high"
                                                    }`}
                                                />
                                            ))}
                                        </View>
                                        <Text className="text-xs text-ink-faint">
                                            {e.transferenciasRestantes ?? 3} de {MAX_TRANSFERENCIAS}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </CardBody>
                    </AppCard>

                    {/* Cadena de custodia */}
                    {eventosCustodia.length > 0 && (
                        <AppCard>
                            <CardHeader title="Cadena de custodia" />
                            <CardBody className="gap-3">
                                {eventosCustodia.map((ev, i) => (
                                    <View key={i} className="flex-row gap-3">
                                        <View className="items-center">
                                            <View className="size-6 items-center justify-center rounded-full bg-container">
                                                <Ionicons name="ellipse" size={8} color="#002b61" />
                                            </View>
                                            {i < eventosCustodia.length - 1 && (
                                                <View className="mt-1 w-px flex-1 bg-container-high" style={{ minHeight: 20 }} />
                                            )}
                                        </View>
                                        <View className="flex-1 pb-2">
                                            <Text className="text-xs font-bold capitalize text-ink">
                                                {ev.tipo ?? ev.evento}
                                            </Text>
                                            <Text className="text-[10px] text-ink-faint">{formatFechaHora(ev.fechaHora)}</Text>
                                            {(ev.emailOrigen || ev.emailDestino) && (
                                                <Text className="text-[10px] text-ink-faint" numberOfLines={1}>
                                                    {[ev.emailOrigen, ev.emailDestino].filter(Boolean).join(" → ")}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </CardBody>
                        </AppCard>
                    )}
                </View>
            </ScrollView>

            {/* CTA transferir */}
            {puedeTransferir && (
                <View
                    className="border-t border-container-high bg-white px-5 py-4"
                    style={{ paddingBottom: insets.bottom + 8 }}
                >
                    <AppButton variant="outline" size="lg" onPress={() => setShowTransfer(true)}>
                        <Ionicons name="swap-horizontal" size={18} color="#141c28" />
                        <Text className="ml-2 text-sm font-semibold text-ink">
                            Transferir ({e.transferenciasRestantes} restantes)
                        </Text>
                    </AppButton>
                </View>
            )}

            {/* Modal transferencia */}
            <AppModal visible={showTransfer} onClose={() => setShowTransfer(false)} title="Transferir entrada">
                <Text className="mb-4 text-sm text-ink-soft">
                    Ingresá el email UCU de la persona a la que querés transferirle esta entrada.
                </Text>
                <AppInput
                    label="Email destino"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="destino@correo.ucu.edu.uy"
                    value={emailDestino}
                    onChangeText={setEmailDestino}
                />
                <View className="mt-5 gap-2">
                    <AppButton variant="primary" loading={transferLoading} onPress={hacerTransferencia}>
                        Enviar transferencia
                    </AppButton>
                    <AppButton variant="ghost" onPress={() => setShowTransfer(false)}>
                        Cancelar
                    </AppButton>
                </View>
            </AppModal>
        </View>
    );
}
