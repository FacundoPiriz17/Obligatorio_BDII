import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { compraService } from "../../../src/features/compras/services/compraService";
import { useCarritoStore } from "../../../src/features/compras/store/useCarritoStore";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppButton } from "../../../src/components/ui/AppButton";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppCard, CardBody, CardHeader } from "../../../src/components/ui/AppCard";
import { FadeInCard } from "../../../src/components/ui/FadeInCard";
import { ConfirmDialog } from "../../../src/components/feedback/ConfirmDialog";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { formatFecha, formatHora, formatMoney } from "../../../src/lib/formatters";
import { MAX_ENTRADAS_POR_COMPRA, COMISION_ESTIMADA } from "../../../src/lib/constants";

export default function NuevaCompraScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { partido: partidoParam } = useLocalSearchParams();

    const { items, addItem, removeItem, updateCantidad, clear, total, cantidadTotal } =
        useCarritoStore();

    const [selectedPartido, setSelectedPartido] = useState(
        partidoParam ? Number(partidoParam) : null
    );
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        data: partidos,
        loading: pLoading,
        error: pError,
        refetch,
    } = useFetch(useCallback(() => compraService.partidosDisponibles(), []));

    // Si viene un partido preseleccionado limpiamos el carrito de otros
    useEffect(() => {
        if (partidoParam) {
            const id = Number(partidoParam);
            if (items.some((i) => i.idPartido !== id)) clear();
        }
    }, [partidoParam]);

    const partidoActivo = (partidos ?? []).find((p) => (p.idPartido ?? p.id) === selectedPartido);

    const excedeLimite = cantidadTotal() >= MAX_ENTRADAS_POR_COMPRA;

    const confirmarCompra = async () => {
        if (items.length === 0) return;
        setLoading(true);
        setShowConfirm(false);
        try {
            const payload = items.map((i) => ({
                idPartido: i.idPartido,
                nombreSector: i.nombreSector,
                cantidad: i.cantidad,
            }));
            const res = await compraService.crear(payload);
            clear();
            Toast.show({
                type: "success",
                text1: `Compra #${res.idCompra} creada. Confirmala y pagala para emitir tus entradas.`,
            });
            router.replace("/(general)/compras/historial");
        } catch (err) {
            Toast.show({ type: "error", text1: err?.detail ?? "Error al procesar la compra." });
        } finally {
            setLoading(false);
        }
    };

    if (pLoading) return <LoadingScreen label="Cargando partidos disponibles…" />;
    if (pError) return <ErrorMessage error={pError} onRetry={refetch} />;

    const subtotal = total();
    const comision = subtotal * (COMISION_ESTIMADA / 100);
    const totalFinal = subtotal + comision;

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-4" style={{ paddingTop: insets.top + 8 }}>
                <HeroBackground orbs={false} />
                <Pressable onPress={() => router.back()} hitSlop={8} className="mb-3 flex-row items-center gap-1.5">
                    <Ionicons name="arrow-back" size={20} color="#7694d0" />
                    <Text className="text-sm font-semibold text-navy-300">Volver</Text>
                </Pressable>
                <Text className="text-xl font-extrabold text-white">Nueva compra</Text>
                <Text className="mt-0.5 text-xs text-navy-300">
                    Máximo {MAX_ENTRADAS_POR_COMPRA} entradas por transacción
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                {/* 1 — Seleccionar partido */}
                <Text className="mb-3 text-base font-bold text-ink">1. Seleccioná un partido</Text>
                <View className="gap-2">
                    {(partidos ?? []).map((p, index) => {
                        const pid = p.idPartido ?? p.id;
                        const seleccionado = selectedPartido === pid;
                        return (
                            <FadeInCard key={pid} index={index}>
                                <Pressable
                                    onPress={() => {
                                        setSelectedPartido(pid);
                                        // Limpiar items de otros partidos al cambiar
                                        if (items.some((i) => i.idPartido !== pid)) clear();
                                    }}
                                    className={`overflow-hidden rounded-2xl border ${
                                        seleccionado ? "border-navy-700 bg-navy-950" : "border-container-high bg-white"
                                    } active:opacity-90`}
                                >
                                    <View className="px-4 py-3">
                                        <View className="flex-row items-center justify-between">
                                            <Text
                                                className={`flex-1 text-sm font-bold ${seleccionado ? "text-white" : "text-ink"}`}
                                                numberOfLines={1}
                                            >
                                                {p.equipoLocal} vs {p.equipoVisitante}
                                            </Text>
                                            {seleccionado && <Ionicons name="checkmark-circle" size={18} color="#00e3fd" />}
                                        </View>
                                        <Text className={`mt-1 text-xs ${seleccionado ? "text-navy-300" : "text-ink-faint"}`}>
                                            {formatFecha(p.fecha)} · {formatHora(p.hora)}
                                            {p.estadio?.nombre ? ` · ${p.estadio.nombre}` : ""}
                                        </Text>
                                    </View>
                                </Pressable>
                            </FadeInCard>
                        );
                    })}
                </View>

                {/* 2 — Seleccionar sectores */}
                {partidoActivo && (
                    <>
                        <Text className="mb-3 mt-6 text-base font-bold text-ink">2. Elegí los sectores</Text>
                        <View className="gap-2">
                            {(partidoActivo.sectores ?? partidoActivo.sectoresHabilitados ?? []).map((s) => {
                                const itemExistente = items.find(
                                    (i) => i.idPartido === selectedPartido && i.nombreSector === s.nombreSector
                                );
                                const cantidad = itemExistente?.cantidad ?? 0;
                                const puedeSumar = cantidadTotal() < MAX_ENTRADAS_POR_COMPRA;

                                return (
                                    <AppCard key={s.nombreSector}>
                                        <CardBody>
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center gap-3">
                                                    <View className="size-10 items-center justify-center rounded-xl bg-navy-950">
                                                        <Text className="text-sm font-extrabold text-energy-500">
                                                            {s.nombreSector}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text className="text-sm font-bold text-ink">
                                                            Sector {s.nombreSector}
                                                        </Text>
                                                        <Text className="text-xs text-ink-faint">
                                                            {formatMoney(s.costoTotalEntrada ?? s.costoSector ?? s.costo)} c/u · {s.entradasDisponibles ?? "?"} disp.
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* Stepper */}
                                                <View className="flex-row items-center gap-2">
                                                    <Pressable
                                                        onPress={() => {
                                                            if (cantidad > 0)
                                                                updateCantidad(selectedPartido, s.nombreSector, cantidad - 1);
                                                        }}
                                                        disabled={cantidad === 0}
                                                        className={`size-8 items-center justify-center rounded-full border ${
                                                            cantidad === 0
                                                                ? "border-container-high bg-container"
                                                                : "border-navy-700 bg-navy-900"
                                                        }`}
                                                    >
                                                        <Ionicons name="remove" size={16} color={cantidad === 0 ? "#c4c6d1" : "#fff"} />
                                                    </Pressable>
                                                    <Text className="w-6 text-center text-base font-bold text-ink">
                                                        {cantidad}
                                                    </Text>
                                                    <Pressable
                                                        onPress={() => {
                                                            if (!puedeSumar) return;
                                                            addItem({
                                                                idPartido: selectedPartido,
                                                                nombreSector: s.nombreSector,
                                                                cantidad: 1,
                                                                precioUnitario: s.costoTotalEntrada ?? s.costoSector ?? s.costo,
                                                                nombrePartido: `${partidoActivo.equipoLocal} vs ${partidoActivo.equipoVisitante}`,
                                                                fechaPartido: partidoActivo.fecha,
                                                                horaPartido: partidoActivo.hora,
                                                            });
                                                        }}
                                                        disabled={!puedeSumar}
                                                        className={`size-8 items-center justify-center rounded-full border ${
                                                            !puedeSumar
                                                                ? "border-container-high bg-container"
                                                                : "border-navy-700 bg-navy-900"
                                                        }`}
                                                    >
                                                        <Ionicons name="add" size={16} color={!puedeSumar ? "#c4c6d1" : "#fff"} />
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </CardBody>
                                    </AppCard>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* 3 — Resumen */}
                {items.length > 0 && (
                    <>
                        <Text className="mb-3 mt-6 text-base font-bold text-ink">3. Resumen</Text>
                        <AppCard>
                            <CardHeader
                                title="Tu carrito"
                                subtitle={`${cantidadTotal()} entrada${cantidadTotal() !== 1 ? "s" : ""}`}
                            />
                            <CardBody className="gap-2">
                                {items.map((item, i) => (
                                    <View key={i} className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
                                                {item.nombrePartido ?? `Partido #${item.idPartido}`}
                                            </Text>
                                            <Text className="text-xs text-ink-faint">
                                                Sector {item.nombreSector} × {item.cantidad}
                                            </Text>
                                        </View>
                                        <Text className="text-sm font-bold text-ink">
                                            {formatMoney(item.precioUnitario * item.cantidad)}
                                        </Text>
                                    </View>
                                ))}

                                <View className="mt-2 border-t border-container-high pt-3">
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm text-ink-soft">Subtotal</Text>
                                        <Text className="text-sm font-semibold text-ink">{formatMoney(subtotal)}</Text>
                                    </View>
                                    <View className="mt-1 flex-row justify-between">
                                        <Text className="text-sm text-ink-soft">Comisión (~{COMISION_ESTIMADA}%)</Text>
                                        <Text className="text-sm font-semibold text-ink">{formatMoney(comision)}</Text>
                                    </View>
                                    <View className="mt-2 flex-row justify-between">
                                        <Text className="text-base font-bold text-ink">Total estimado</Text>
                                        <Text className="text-base font-extrabold text-navy-900">
                                            {formatMoney(totalFinal)}
                                        </Text>
                                    </View>
                                    <Text className="mt-1 text-[10px] text-ink-faint">
                                        * El total final lo confirma el servidor al procesar la compra.
                                    </Text>
                                </View>
                            </CardBody>
                        </AppCard>
                    </>
                )}

                {excedeLimite && (
                    <View className="mt-3 rounded-xl border border-warn-100 bg-warn-100 px-3 py-2">
                        <Text className="text-xs font-medium text-warn-600">
                            Límite de {MAX_ENTRADAS_POR_COMPRA} entradas por transacción alcanzado.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* CTA fijo */}
            <View
                className="border-t border-container-high bg-white px-5 py-4"
                style={{ paddingBottom: insets.bottom + 8 }}
            >
                <AppButton
                    variant="energy"
                    size="lg"
                    disabled={items.length === 0}
                    loading={loading}
                    onPress={() => setShowConfirm(true)}
                >
                    {items.length === 0
                        ? "Agregá entradas para continuar"
                        : `Comprar ${cantidadTotal()} entrada${cantidadTotal() !== 1 ? "s" : ""} · ${formatMoney(totalFinal)}`}
                </AppButton>
            </View>

            <ConfirmDialog
                visible={showConfirm}
                title="Confirmar compra"
                message={`Estás por comprar ${cantidadTotal()} entrada${cantidadTotal() !== 1 ? "s" : ""} por aprox. ${formatMoney(totalFinal)}. ¿Confirmás?`}
                confirmLabel="Sí, comprar"
                onConfirm={confirmarCompra}
                onCancel={() => setShowConfirm(false)}
            />
        </View>
    );
}
