import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { cn } from "../../lib/cn";

const variantBase = {
    primary: "bg-navy-900 active:bg-navy-950",
    energy: "bg-energy-500 active:bg-energy-400",
    secondary: "bg-container active:bg-container-high",
    outline: "border border-line bg-white active:bg-surface-dim",
    ghost: "active:bg-container",
    danger: "bg-danger-600 active:bg-danger-700",
};

const variantText = {
    primary: "text-white font-semibold",
    energy: "text-navy-950 font-bold",
    secondary: "text-navy-900 font-semibold",
    outline: "text-ink font-semibold",
    ghost: "text-ink-soft font-semibold",
    danger: "text-white font-semibold",
};

const sizeBase = {
    sm: "h-9 px-3 rounded-lg gap-1.5",
    md: "h-11 px-4 rounded-xl gap-2",
    lg: "h-13 px-6 rounded-xl gap-2",
};

const sizeText = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
                              variant = "primary",
                              size = "md",
                              loading = false,
                              disabled = false,
                              onPress,
                              children,
                              className,
                              textClassName,
                          }) {
    const isDisabled = disabled || loading;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={() => {
                scale.value = withTiming(0.97, { duration: 80 });
            }}
            onPressOut={() => {
                scale.value = withTiming(1, { duration: 120 });
            }}
            disabled={isDisabled}
            style={animatedStyle}
            className={cn(
                "flex-row items-center justify-center",
                variantBase[variant],
                sizeBase[size],
                isDisabled && "opacity-50",
                className
            )}
        >
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={
                        variant === "energy"
                            ? "#00173a"
                            : variant === "secondary" || variant === "outline"
                                ? "#002b61"
                                : "#fff"
                    }
                />
            )}
            {typeof children === "string" ? (
                <Text className={cn(variantText[variant], sizeText[size], textClassName)}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </AnimatedPressable>
    );
}
