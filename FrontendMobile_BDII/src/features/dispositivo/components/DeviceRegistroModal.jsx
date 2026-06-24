import { Modal, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../../../components/ui/AppButton";

export function DeviceRegistroModal({ visible, installationId, onConfirm, loading = false }) {
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <Animated.View
                entering={FadeIn.duration(200)}
                className="flex-1 justify-center bg-black/50 px-6"
            >
                <Animated.View
                    entering={SlideInDown.duration(200)}
                    className="rounded-3xl bg-white p-6"
                >
                    <View className="mb-4 size-14 items-center justify-center rounded-2xl bg-energy-500/20">
                        <Ionicons name="phone-portrait" size={28} color="#00616d" />
                    </View>

                    <Text className="text-xl font-extrabold text-ink">Registrar este dispositivo</Text>
                    <Text className="mt-2 text-sm text-ink-soft">
                        Vamos a registrar este teléfono como tu dispositivo de validación. Quedará vinculado
                        a tu cuenta de funcionario para escanear y validar entradas.
                    </Text>

                    <View className="mt-4 rounded-2xl border border-container-high bg-container-low px-4 py-3">
                        <Text className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                            ID de instalación
                        </Text>
                        <Text className="mt-1 font-mono text-xs text-ink" numberOfLines={2} selectable>
                            {installationId ?? "Generando…"}
                        </Text>
                    </View>

                    <View className="mt-4 flex-row items-start gap-2 rounded-xl bg-info-100 px-3 py-3">
                        <Ionicons name="information-circle" size={16} color="#1d4ed8" />
                        <Text className="flex-1 text-xs text-info-600">
                            Este identificador se guarda cifrado en el teléfono y no se comparte con otras
                            cuentas.
                        </Text>
                    </View>

                    <AppButton
                        variant="energy"
                        size="lg"
                        className="mt-6 w-full"
                        loading={loading}
                        onPress={onConfirm}
                    >
                        Registrar y continuar
                    </AppButton>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}
