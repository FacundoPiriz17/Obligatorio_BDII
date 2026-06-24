import { View, Text } from "react-native";
import { cn } from "../../lib/cn";

export function AppCard({ children, className, ...props }) {
    return (
        <View
            className={cn("rounded-2xl border border-container-high/60 bg-white", className)}
            style={{
                shadowColor: "#141c28",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
            }}
            {...props}
        >
            {children}
        </View>
    );
}

export function CardHeader({ title, subtitle, right }) {
    return (
        <View className="flex-row items-start justify-between border-b border-container px-4 py-3">
            <View className="flex-1 mr-2">
                <Text className="text-base font-bold text-ink">{title}</Text>
                {subtitle && <Text className="mt-0.5 text-xs text-ink-faint">{subtitle}</Text>}
            </View>
            {right}
        </View>
    );
}

export function CardBody({ children, className }) {
    return <View className={cn("px-4 py-3", className)}>{children}</View>;
}
