import { ActivityIndicator, Text, View } from "react-native";

export function LoadingScreen({ label = "Cargando…" }) {
    return (
        <View className="flex-1 items-center justify-center gap-3 bg-surface">
            <ActivityIndicator size="large" color="#002b61" />
            <Text className="text-sm font-medium text-ink-faint">{label}</Text>
        </View>
    );
}
