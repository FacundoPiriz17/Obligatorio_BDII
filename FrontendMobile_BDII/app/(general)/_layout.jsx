import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
import { LoadingScreen } from "../../src/components/ui/LoadingScreen";

const TABS = [
    { name: "home", title: "Inicio", icon: "home-outline", iconFocused: "home" },
    { name: "partidos/index", title: "Partidos", icon: "calendar-outline", iconFocused: "calendar" },
    { name: "entradas/index", title: "Entradas", icon: "ticket-outline", iconFocused: "ticket" },
    { name: "compras/historial", title: "Compras", icon: "bag-outline", iconFocused: "bag" },
    {
        name: "transferencias/index",
        title: "Trans.",
        icon: "swap-horizontal-outline",
        iconFocused: "swap-horizontal",
    },
];

export default function GeneralLayout() {
    const { initializing, isAuthenticated } = useAuthStore();
    const insets = useSafeAreaInsets();

    if (initializing) return <LoadingScreen />;
    if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

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
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "600",
                    marginTop: 2,
                },
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
            {/* Pantallas que NO aparecen en el tab bar */}
            <Tabs.Screen name="partidos/[id]" options={{ href: null }} />
            <Tabs.Screen name="entradas/[id]" options={{ href: null }} />
            <Tabs.Screen name="compras/nueva" options={{ href: null }} />
            <Tabs.Screen name="transferencias/nueva" options={{ href: null }} />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    href: null,
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
