import { useState } from "react";
import { View } from "react-native";
import { AppInput } from "../../../components/ui/AppInput";
import { AppButton } from "../../../components/ui/AppButton";

export function LoginForm({ onSubmit, loading = false, error }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View className="gap-4">
            <AppInput
                label="Email institucional"
                iconName="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="nombre@correo.ucu.edu.uy"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
            />
            <AppInput
                label="Contraseña"
                iconName="lock-closed-outline"
                secureTextEntry
                autoComplete="password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                error={error}
                returnKeyType="done"
                onSubmitEditing={() => onSubmit(email.trim(), password)}
            />
            <AppButton
                variant="primary"
                size="lg"
                loading={loading}
                onPress={() => onSubmit(email.trim(), password)}
                className="mt-2"
            >
                Iniciar sesión
            </AppButton>
        </View>
    );
}
