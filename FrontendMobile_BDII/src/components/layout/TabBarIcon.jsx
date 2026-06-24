import { Ionicons } from "@expo/vector-icons";

export function TabBarIcon({ name, color, size = 24 }) {
    return <Ionicons name={name} size={size} color={color} />;
}
