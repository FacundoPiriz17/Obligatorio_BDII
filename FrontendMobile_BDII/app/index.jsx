import { Redirect } from "expo-router";
import { useAuthStore } from "../src/features/auth/store/useAuthStore";
import { LoadingScreen } from "../src/components/ui/LoadingScreen";

export default function Index() {
    const { initializing, isAuthenticated, isAdmin, isFuncionario, isGeneral } = useAuthStore();

    if (initializing) {
        return <LoadingScreen label="Iniciando UCU Mundial…" />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    if (isAdmin) return <Redirect href="/(admin)/home" />;
    if (isFuncionario && !isGeneral) return <Redirect href="/(funcionario)/home" />;
    return <Redirect href="/(general)/home" />;
}
