import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "../../lib/cn";

export function ScreenContainer({ children, scroll = true, className, safeBottom = true }) {
    const inner = <View className={cn("flex-1 bg-surface px-4", className)}>{children}</View>;

    if (scroll) {
        return (
            <SafeAreaView className="flex-1 bg-surface" edges={safeBottom ? ["bottom"] : []}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {inner}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={safeBottom ? ["bottom"] : []}>
            {inner}
        </SafeAreaView>
    );
}
