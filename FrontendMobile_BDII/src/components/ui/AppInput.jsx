import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../lib/cn";

export function AppInput({
                             label,
                             error,
                             hint,
                             iconName,
                             secureTextEntry,
                             containerClassName,
                             className,
                             ...props
                         }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={cn("gap-1.5", containerClassName)}>
            {label && <Text className="text-sm font-semibold text-ink">{label}</Text>}
            <View
                className={cn(
                    "flex-row items-center rounded-xl border bg-white px-3",
                    error ? "border-danger-500" : "border-line focus:border-navy-700",
                    "h-12"
                )}
            >
                {iconName && (
                    <Ionicons name={iconName} size={18} color="#747781" style={{ marginRight: 8 }} />
                )}
                <TextInput
                    className={cn("flex-1 text-base text-ink", className)}
                    secureTextEntry={secureTextEntry && !showPassword}
                    placeholderTextColor="#747781"
                    autoCapitalize="none"
                    {...props}
                />
                {secureTextEntry && (
                    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={18}
                            color="#747781"
                        />
                    </Pressable>
                )}
            </View>
            {error && <Text className="text-xs font-medium text-danger-600">{error}</Text>}
            {hint && !error && <Text className="text-xs text-ink-faint">{hint}</Text>}
        </View>
    );
}
