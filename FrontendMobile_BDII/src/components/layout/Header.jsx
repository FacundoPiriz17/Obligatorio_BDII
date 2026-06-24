import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header({ title, subtitle, showBack = false, right }) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View className="bg-navy-950 px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <View className="flex-row items-center">
                {showBack && (
                    <Pressable
                        onPress={() => router.back()}
                        hitSlop={8}
                        className="mr-2 -ml-1 rounded-lg p-1.5 active:bg-white/10"
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </Pressable>
                )}
                <View className="flex-1">
                    <Text className="text-lg font-extrabold text-white" numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-xs text-navy-300" numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>
                {right && <View className="ml-2">{right}</View>}
            </View>
        </View>
    );
}
