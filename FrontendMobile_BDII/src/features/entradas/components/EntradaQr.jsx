import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppCard, CardBody, CardHeader } from "../../../components/ui/AppCard";
import { useQrDinamico } from "../hooks/useQrDinamico";
import { QR_REFRESH_SEGUNDOS } from "../../../lib/constants";

export function EntradaQr({ idEntrada, activo = true }) {
    const { qrData, loading, countdown, refresh } = useQrDinamico(idEntrada, activo);

    const progreso = countdown / QR_REFRESH_SEGUNDOS;

    return (
        <AppCard>
            <CardHeader
                title="Código QR"
                subtitle={qrData ? `Se renueva en ${countdown}s` : "Toca para generar"}
                right={
                    <Pressable
                        onPress={refresh}
                        hitSlop={8}
                        className="rounded-lg bg-container p-2 active:bg-container-high"
                    >
                        <Ionicons name="refresh" size={16} color="#002b61" />
                    </Pressable>
                }
            />
            <CardBody className="items-center py-6">
                {loading && !qrData ? (
                    <View className="size-52 items-center justify-center rounded-2xl bg-container-low">
                        <Ionicons name="qr-code-outline" size={56} color="#7694d0" />
                        <Text className="mt-3 text-xs font-semibold text-ink-faint">Generando QR…</Text>
                    </View>
                ) : qrData?.qrPngBase64 ? (
                    <View>
                        <View className="rounded-2xl border-4 border-navy-950 p-2">
                            <Image
                                source={{ uri: `data:image/png;base64,${qrData.qrPngBase64}` }}
                                style={{ width: 208, height: 208 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                ) : (
                    <Pressable
                        onPress={refresh}
                        className="size-52 items-center justify-center rounded-2xl bg-container-low active:bg-container"
                    >
                        <Ionicons name="qr-code-outline" size={56} color="#7694d0" />
                        <Text className="mt-3 text-xs font-bold text-navy-700">Generar QR</Text>
                    </Pressable>
                )}

                {/* Barra de cuenta regresiva */}
                {qrData && (
                    <View className="mt-5 w-full gap-1.5">
                        <View className="h-2 w-full overflow-hidden rounded-full bg-container-high">
                            <View
                                className="h-full rounded-full bg-energy-500"
                                style={{ width: `${progreso * 100}%` }}
                            />
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-1.5">
                                <View className="size-2 rounded-full bg-ok-500" />
                                <Text className="text-[10px] font-bold uppercase tracking-wide text-ok-600">
                                    QR activo
                                </Text>
                            </View>
                            <Text className="text-[10px] text-ink-faint">Válido por {countdown}s</Text>
                        </View>
                    </View>
                )}

                {/* Disclaimer seguridad */}
                <View className="mt-4 flex-row items-start gap-2">
                    <Ionicons name="shield-checkmark-outline" size={14} color="#047857" />
                    <Text className="flex-1 text-[10px] text-ink-faint">
                        Este QR se renueva automáticamente cada {QR_REFRESH_SEGUNDOS}s para prevenir capturas
                        de pantalla y reventa.
                    </Text>
                </View>
            </CardBody>
        </AppCard>
    );
}
