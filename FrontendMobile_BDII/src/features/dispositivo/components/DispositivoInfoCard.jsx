import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppCard, CardBody, CardHeader } from "../../../components/ui/AppCard";
import { AppBadge } from "../../../components/ui/AppBadge";


export function DispositivoInfoCard({ installationId, dispositivoActivo }) {
    const registrado = Boolean(dispositivoActivo);

    return (
        <AppCard>
            <CardHeader
                title="Mi dispositivo"
                right={
                    <AppBadge variant={registrado ? "ok" : "warn"}>
                        {registrado ? "Habilitado" : "Sin asignar"}
                    </AppBadge>
                }
            />
            <CardBody className="gap-4">
                {/* ID local del teléfono */}
                <View>
                    <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                        ID de instalación (este teléfono)
                    </Text>
                    <Text className="mt-1 font-mono text-xs text-ink" numberOfLines={2} selectable>
                        {installationId ?? "—"}
                    </Text>
                </View>

                {registrado ? (
                    <>
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                    Dispositivo de escaneo
                                </Text>
                                <Text className="mt-0.5 text-sm font-semibold text-ink">
                                    #{dispositivoActivo.idDispositivoEscaneo}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                    Modelo
                                </Text>
                                <Text className="mt-0.5 text-sm font-semibold text-ink">
                                    {dispositivoActivo.modelo ?? "—"}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                                Funcionario asignado
                            </Text>
                            <Text className="mt-0.5 text-sm font-semibold text-ink">
                                {dispositivoActivo.nombreFuncionario ?? dispositivoActivo.emailFuncionario}
                                {dispositivoActivo.numeroLegajo
                                    ? `  ·  Legajo ${dispositivoActivo.numeroLegajo}`
                                    : ""}
                            </Text>
                        </View>
                        <View className="flex-row items-start gap-2 rounded-xl bg-ok-100 px-3 py-3">
                            <Ionicons name="shield-checkmark" size={16} color="#047857" />
                            <Text className="flex-1 text-xs text-ok-600">
                                Este dispositivo está autorizado para escanear y validar entradas.
                            </Text>
                        </View>
                    </>
                ) : (
                    <View className="flex-row items-start gap-2 rounded-xl bg-warn-100 px-3 py-3">
                        <Ionicons name="alert-circle" size={16} color="#b45309" />
                        <Text className="flex-1 text-xs text-warn-600">
                            Todavía no tenés un dispositivo de escaneo activo asignado. Un administrador debe
                            asignarte uno desde el panel para poder escanear entradas.
                        </Text>
                    </View>
                )}
            </CardBody>
        </AppCard>
    );
}
