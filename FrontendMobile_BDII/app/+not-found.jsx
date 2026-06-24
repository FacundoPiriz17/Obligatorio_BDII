import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../src/components/ui/AppButton";

export default function NotFoundScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 items-center justify-center bg-surface px-8"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
        >
            <View className="mb-5 size-20 items-center justify-center rounded-3xl bg-container">
                <Ionicons name="help-circle-outline" size={40} color="#7694d0" />
            </View>
            <Text className="text-center text-2xl font-extrabold text-ink">404</Text>
            <Text className="mt-1 text-center text-base font-semibold text-ink-soft">
                Página no encontrada
            </Text>
            <Text className="mt-2 text-center text-sm text-ink-faint">
                La pantalla que estás buscando no existe o fue movida.
            </Text>
            <AppButton variant="primary" size="lg" onPress={() => router.replace("/")} className="mt-8 w-full">
                Volver al inicio
            </AppButton>
        </View>
    );
}
