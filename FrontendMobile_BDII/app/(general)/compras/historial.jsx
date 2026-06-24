import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Animated, { FadeIn } from "react-native-reanimated";
import { compraService } from "../../../src/features/compras/services/compraService";
import { useFetch } from "../../../src/hooks/useFetch";
import { AppBadge } from "../../../src/components/ui/AppBadge";
import { HeroBackground } from "../../../src/components/ui/HeroBackground";
import { AppButton } from "../../../src/components/ui/AppButton";
import { FadeInCard } from "../../../src/components/ui/FadeInCard";
import { ConfirmDialog } from "../../../src/components/feedback/ConfirmDialog";
import { LoadingScreen } from "../../../src/components/ui/LoadingScreen";
import { ErrorMessage } from "../../../src/components/feedback/ErrorMessage";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { formatFechaHora, formatMoney } from "../../../src/lib/formatters";

const FILTROS = ["todas", "pendiente", "confirmada", "paga", "cancelada"];

// Una compra recién creada queda "pendiente": hay que confirmarla y
// pagarla (acá simulado) para que sus entradas se activen de verdad.
const ACCION_POR_TIPO = {
    confirmar: compraService.confirmar,
    pagar: compraService.pagar,
    cancelar: compraService.cancelar,
};

export default function HistorialComprasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [filtro, setFiltro] = useState("todas");
    const [abierta, setAbierta] = useState(null);
    const [accion, setAccion] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const {
        data: compras,
        loading,
        error,
        refetch,
    } = useFetch(useCallback(() => compraService.listar(), []));

    const ejecutarAccion = async () => {
        if (!accion) return;
        setProcesando(true);
        try {
            const fn = ACCION_POR_TIPO[accion.tipo];
            await fn(accion.compra.idCompra ?? accion.compra.id);
            Toast.show({
                type: "success",
                text1:
                    accion.tipo === "pagar"
                        ? "¡Pago registrado! Tus entradas ya están activas en Mis entradas."
                        : accion.tipo === "confirmar"
                            ? "Compra confirmada. Falta el pago para emitir las entradas."
                            : "Compra cancelada.",
            });
            setAccion(null);
            refetch();
        } catch (err) {
            Toast.show({ type: "error", text1: err?.detail ?? "La acción no se pudo completar." });
        } finally {
            setProcesando(false);
        }
    };

    if (loading) return <LoadingScreen label="Cargando compras…" />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const lista = (compras ?? []).filter((c) => filtro === "todas" || c.estado === filtro);

    const totalPagado = (compras ?? [])
        .filter((c) => c.estado === "paga")
        .reduce((acc, c) => acc + (c.montoTotal ?? 0), 0);

    return (
        <View className="flex-1 bg-surface">
            {/* Header */}
            <View className="overflow-hidden bg-navy-950 px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
                <HeroBackground orbs={false} />
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-extrabold text-white">Mis compras</Text>
                        <Text className="mt-0.5 text-xs text-navy-300">
                            Total pagado: {formatMoney(totalPagado)}
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => router.push("/(general)/partidos")}
                        className="flex-row items-center gap-1.5 rounded-xl bg-energy-500 px-3 py-2 active:bg-energy-400"
                    >
                        <Ionicons name="add" size={16} color="#00173a" />
                        <Text className="text-xs font-bold text-navy-950">Nueva</Text>
                    </Pressable>
                </View>

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
                        iconName="bag-outline"
                        title="Sin compras"
                        description={
                            filtro === "todas"
                                ? "Todavía no realizaste ninguna compra."
                                : `No tenés compras en estado "${filtro}".`
                        }
                        actionLabel={filtro === "todas" ? "Ver partidos" : undefined}
                        onAction={
                            filtro === "todas" ? () => router.push("/(general)/partidos") : undefined
                        }
                    />
                ) : (
                    <View className="gap-3">
                        {lista.map((c, index) => {
                            const idCompra = c.idCompra ?? c.id;
                            const expandida = abierta === idCompra;
                            // Antes de pagar solo hay "items" reservados (sin QR);
                            // una vez paga, "entradas" trae las entradas reales emitidas.
                            const tieneEntradas = (c.entradas ?? []).length > 0;
                            const lineas = tieneEntradas ? c.entradas : c.items ?? [];
                            const cantidadTotal = tieneEntradas
                                ? lineas.length
                                : lineas.reduce((acc, i) => acc + (i.cantidad ?? 1), 0);

                            return (
                                <FadeInCard key={idCompra} index={index}>
                                    <View
                                        className="overflow-hidden rounded-2xl border border-container-high bg-white"
                                        style={{
                                            shadowColor: "#141c28",
                                            shadowOpacity: 0.05,
                                            shadowRadius: 6,
                                            elevation: 1,
                                        }}
                                    >
                                        {/* Stripe top */}
                                        <View className="flex-row items-center justify-between bg-navy-950 px-4 py-2">
                                            <Text className="text-[10px] font-bold uppercase tracking-widest text-navy-300">
                                                Compra #{idCompra}
                                            </Text>
                                            <AppBadge estado={c.estado}>{c.estado}</AppBadge>
                                        </View>

                                        <View className="px-4 py-3">
                                            {/* Resumen colapsado: entradas si ya está paga, items si no */}
                                            {tieneEntradas
                                                ? lineas.slice(0, 2).map((e, i) => (
                                                    <Text key={i} className="text-sm font-semibold text-ink" numberOfLines={1}>
                                                        {e.partido?.equipoLocal} vs {e.partido?.equipoVisitante} · Sector{" "}
                                                        {e.nombreSector}
                                                    </Text>
                                                ))
                                                : lineas.slice(0, 2).map((it, i) => (
                                                    <Text key={i} className="text-sm font-semibold text-ink" numberOfLines={1}>
                                                        {it.nombrePartido ?? `Partido #${it.idPartido}`} · Sector{" "}
                                                        {it.nombreSector} × {it.cantidad}
                                                    </Text>
                                                ))}
                                            {lineas.length > 2 && (
                                                <Text className="text-xs text-ink-faint">+{lineas.length - 2} más</Text>
                                            )}

                                            <View className="mt-3 flex-row items-center justify-between">
                                                <View className="flex-row items-center gap-1">
                                                    <Ionicons name="calendar-outline" size={12} color="#747781" />
                                                    <Text className="text-xs text-ink-faint">
                                                        {formatFechaHora(c.fechaHora)}
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center gap-1">
                                                    <Ionicons name="ticket-outline" size={12} color="#747781" />
                                                    <Text className="text-xs font-semibold text-navy-900">
                                                        {cantidadTotal} entrada
                                                        {cantidadTotal !== 1 ? "s" : ""}
                                                    </Text>
                                                    <Text className="text-sm font-bold text-ink">
                                                        {"  "}
                                                        {formatMoney(c.montoTotal)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Acciones según estado, igual que la versión web */}
                                            <View className="mt-3 flex-row items-center gap-2">
                                                {c.estado === "pendiente" && (
                                                    <>
                                                        <AppButton
                                                            size="sm"
                                                            className="flex-1"
                                                            onPress={() => setAccion({ tipo: "confirmar", compra: c })}
                                                        >
                                                            Confirmar
                                                        </AppButton>
                                                        <AppButton
                                                            size="sm"
                                                            variant="ghost"
                                                            textClassName="text-danger-600"
                                                            onPress={() => setAccion({ tipo: "cancelar", compra: c })}
                                                        >
                                                            Cancelar
                                                        </AppButton>
                                                    </>
                                                )}
                                                {c.estado === "confirmada" && (
                                                    <>
                                                        <AppButton
                                                            size="sm"
                                                            variant="energy"
                                                            className="flex-1"
                                                            onPress={() => setAccion({ tipo: "pagar", compra: c })}
                                                        >
                                                            Pagar
                                                        </AppButton>
                                                        <AppButton
                                                            size="sm"
                                                            variant="ghost"
                                                            textClassName="text-danger-600"
                                                            onPress={() => setAccion({ tipo: "cancelar", compra: c })}
                                                        >
                                                            Cancelar
                                                        </AppButton>
                                                    </>
                                                )}
                                                <Pressable
                                                    onPress={() => setAbierta(expandida ? null : idCompra)}
                                                    hitSlop={8}
                                                    className="ml-auto rounded-lg p-1.5 active:bg-container"
                                                >
                                                    <Ionicons
                                                        name={expandida ? "chevron-up" : "chevron-down"}
                                                        size={18}
                                                        color="#747781"
                                                    />
                                                </Pressable>
                                            </View>
                                        </View>

                                        {/* Detalle expandido: entradas reales si ya está paga, items reservados si no */}
                                        {expandida && (
                                            <Animated.View
                                                entering={FadeIn.duration(180)}
                                                className="border-t border-container-low bg-container-low/40"
                                            >
                                                {tieneEntradas
                                                    ? lineas.map((e, i) => (
                                                        <View
                                                            key={e.idEntrada ?? i}
                                                            className={`flex-row flex-wrap items-center gap-2 px-4 py-3 ${
                                                                i < lineas.length - 1 ? "border-b border-container-low" : ""
                                                            }`}
                                                        >
                                                            <Ionicons name="ticket-outline" size={14} color="#0b3c7e" />
                                                            <Text className="text-sm font-bold text-ink">#{e.idEntrada}</Text>
                                                            <Text className="flex-1 text-xs text-ink-soft" numberOfLines={1}>
                                                                {e.partido?.equipoLocal} vs {e.partido?.equipoVisitante} · Sector{" "}
                                                                {e.nombreSector}
                                                            </Text>
                                                            <AppBadge estado={e.estado}>{e.estado}</AppBadge>
                                                            <Text className="text-sm font-semibold text-ink">
                                                                {formatMoney(e.costoTotal)}
                                                            </Text>
                                                            {c.estado === "paga" && e.estado === "activa" && (
                                                                <Pressable
                                                                    onPress={() => router.push(`/(general)/entradas/${e.idEntrada}`)}
                                                                >
                                                                    <Text className="text-xs font-bold text-navy-900">Ver QR</Text>
                                                                </Pressable>
                                                            )}
                                                        </View>
                                                    ))
                                                    : lineas.map((it, i) => (
                                                        <View
                                                            key={i}
                                                            className={`flex-row flex-wrap items-center gap-2 px-4 py-3 ${
                                                                i < lineas.length - 1 ? "border-b border-container-low" : ""
                                                            }`}
                                                        >
                                                            <Ionicons name="ticket-outline" size={14} color="#747781" />
                                                            <Text className="flex-1 text-xs text-ink-soft" numberOfLines={1}>
                                                                {it.nombrePartido ?? `Partido #${it.idPartido}`} · Sector{" "}
                                                                {it.nombreSector} × {it.cantidad}
                                                            </Text>
                                                            <Text className="text-sm font-semibold text-ink">
                                                                {formatMoney(it.precioUnitario * it.cantidad)}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                {!tieneEntradas && (
                                                    <View className="flex-row items-start gap-2 px-4 py-3">
                                                        <Ionicons name="information-circle-outline" size={14} color="#747781" />
                                                        <Text className="flex-1 text-[11px] text-ink-faint">
                                                            Las entradas con su QR se emiten recién cuando la compra queda paga.
                                                        </Text>
                                                    </View>
                                                )}
                                            </Animated.View>
                                        )}
                                    </View>
                                </FadeInCard>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            <ConfirmDialog
                visible={!!accion}
                loading={procesando}
                variant={accion?.tipo === "cancelar" ? "danger" : accion?.tipo === "pagar" ? "energy" : "primary"}
                title={
                    accion?.tipo === "confirmar"
                        ? `Confirmar compra #${accion?.compra.idCompra ?? accion?.compra.id}`
                        : accion?.tipo === "pagar"
                            ? `Pagar ${formatMoney(accion?.compra.montoTotal)}`
                            : `Cancelar compra #${accion?.compra?.idCompra ?? accion?.compra?.id}`
                }
                confirmLabel={
                    accion?.tipo === "confirmar"
                        ? "Confirmar compra"
                        : accion?.tipo === "pagar"
                            ? "Pagar ahora"
                            : "Cancelar compra"
                }
                message={
                    accion?.tipo === "confirmar"
                        ? "Al confirmar, la compra queda lista para el pago."
                        : accion?.tipo === "pagar"
                            ? "Simularemos el pago y tus entradas quedarán activas con su QR dinámico."
                            : "Esta acción libera las entradas reservadas y no se puede deshacer."
                }
                onConfirm={ejecutarAccion}
                onCancel={() => setAccion(null)}
            />
        </View>
    );
}