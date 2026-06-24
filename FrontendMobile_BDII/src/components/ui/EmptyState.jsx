import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "./AppButton";

export function EmptyState({
                               iconName = "ticket-outline",
                               title,
                               description,
                               actionLabel,
                               onAction,
                           }) {
    return (
        <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
            <View className="size-16 items-center justify-center rounded-2xl bg-container">
                <Ionicons name={iconName} size={32} color="#7694d0" />
            </View>
            <Text className="text-center text-base font-bold text-ink">{title}</Text>
            {description && (
                <Text className="text-center text-sm text-ink-faint">{description}</Text>
            )}
            {actionLabel && onAction && (
                <AppButton variant="secondary" onPress={onAction} className="mt-2">
                    {actionLabel}
                </AppButton>
            )}
        </View>
    );
}
