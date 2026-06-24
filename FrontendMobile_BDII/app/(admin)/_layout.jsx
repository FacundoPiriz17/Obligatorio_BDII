import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";

const TABS = [
    { name: "home", title: "Resumen", icon: "stats-chart-outline", iconFocused: "stats-chart" },
    { name: "auditoria", title: "Auditoría", icon: "shield-checkmark-outline", iconFocused: "shield-checkmark" },
];

export default function AdminLayout() {
    const { initializing, isAuthenticated, isAdmin } = useAuthStore();
    const insets = useSafeAreaInsets();

    if (initializing) return <LoadingScreen />;
    if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
    if (!isAdmin) return <Redirect href="/(general)/home" />;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#00173a",
                    borderTopColor: "rgba(255,255,255,0.08)",
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 6,
                },
                tabBarActiveTintColor: "#00e3fd",
                tabBarInactiveTintColor: "#7694d0",
                tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 2 },
            }}
        >
            {TABS.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused, color }) => (
                            <Ionicons name={focused ? tab.iconFocused : tab.icon} size={22} color={color} />
                        ),
                    }}
                />
            ))}
            {/* Perfil: accesible pero sin pestaña propia (mantiene el tab bar de admin) */}
            <Tabs.Screen name="perfil" options={{ href: null }} />
        </Tabs>
    );
}
