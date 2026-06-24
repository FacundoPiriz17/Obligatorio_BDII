import { Pressable, Text, View } from "react-native";
import { AppInput } from "../../../components/ui/AppInput";
import { TIPOS_DOCUMENTO } from "../../../lib/constants";

export function RegisterForm({ step, data, onChange, errors }) {
    if (step === 0) {
        return (
            <View className="gap-4">
                <AppInput
                    label="Nombre completo"
                    iconName="person-outline"
                    placeholder="Juan Pérez"
                    value={data.nombre}
                    onChangeText={(v) => onChange("nombre", v)}
                    error={errors.nombre}
                />
                <AppInput
                    label="Email institucional"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="nombre@correo.ucu.edu.uy"
                    value={data.email}
                    onChangeText={(v) => onChange("email", v)}
                    error={errors.email}
                />
                <AppInput
                    label="Contraseña"
                    iconName="lock-closed-outline"
                    secureTextEntry
                    placeholder="Mínimo 6 caracteres"
                    value={data.password}
                    onChangeText={(v) => onChange("password", v)}
                    error={errors.password}
                />
            </View>
        );
    }

    if (step === 1) {
        return (
            <View className="gap-4">
                <View>
                    <Text className="mb-2 text-sm font-semibold text-ink">Tipo de documento</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {TIPOS_DOCUMENTO.map((t) => (
                            <Pressable
                                key={t}
                                onPress={() => onChange("tipoDocumento", t)}
                                className={`rounded-xl border px-4 py-2 ${
                                    data.tipoDocumento === t
                                        ? "border-navy-900 bg-navy-900"
                                        : "border-line bg-white"
                                }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${
                                        data.tipoDocumento === t ? "text-white" : "text-ink"
                                    }`}
                                >
                                    {t}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <AppInput
                    label="País del documento"
                    iconName="flag-outline"
                    placeholder="Uruguay"
                    value={data.paisDocumento}
                    onChangeText={(v) => onChange("paisDocumento", v)}
                />
                <AppInput
                    label="Número de documento"
                    iconName="card-outline"
                    keyboardType="numeric"
                    placeholder="12345678"
                    value={data.numeroDocumento}
                    onChangeText={(v) => onChange("numeroDocumento", v)}
                    error={errors.numeroDocumento}
                />
                <AppInput
                    label="Teléfono (opcional)"
                    iconName="call-outline"
                    keyboardType="phone-pad"
                    placeholder="+598 99 000 000"
                    value={data.telefono}
                    onChangeText={(v) => onChange("telefono", v)}
                />
            </View>
        );
    }

    // step === 2: Dirección
    return (
        <View className="gap-4">
            <Text className="text-sm text-ink-soft">
                Todos los campos de dirección son opcionales.
            </Text>
            <AppInput
                label="País"
                iconName="location-outline"
                placeholder="Uruguay"
                value={data.paisDireccion}
                onChangeText={(v) => onChange("paisDireccion", v)}
            />
            <AppInput
                label="Localidad"
                placeholder="Montevideo"
                value={data.localidadDireccion}
                onChangeText={(v) => onChange("localidadDireccion", v)}
            />
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <AppInput
                        label="Calle"
                        placeholder="Av. 8 de Octubre"
                        value={data.calleDireccion}
                        onChangeText={(v) => onChange("calleDireccion", v)}
                    />
                </View>
                <View className="w-24">
                    <AppInput
                        label="Número"
                        keyboardType="numeric"
                        placeholder="1234"
                        value={data.numeroDireccion}
                        onChangeText={(v) => onChange("numeroDireccion", v)}
                    />
                </View>
            </View>
            <AppInput
                label="Código postal"
                keyboardType="numeric"
                placeholder="11600"
                value={data.codigoPostalDireccion}
                onChangeText={(v) => onChange("codigoPostalDireccion", v)}
            />
        </View>
    );
}
