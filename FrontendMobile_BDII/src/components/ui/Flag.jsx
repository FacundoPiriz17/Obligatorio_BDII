import { Image, Text, View } from "react-native";
import { resolverBandera } from "../../lib/flagImages";

/**
 * Bandera de un país a partir de su código FIFA o nombre.
 * Si no hay imagen disponible cae a una cajita con el código, para que la UI
 * nunca quede rota (mismo criterio que el Flag del frontend web).
 */
const SIZES = {
    xs: { w: 22, h: 15, font: 8, radius: 4 },
    sm: { w: 28, h: 19, font: 9, radius: 5 },
    md: { w: 34, h: 23, font: 10, radius: 6 },
    lg: { w: 52, h: 35, font: 12, radius: 8 },
    xl: { w: 76, h: 51, font: 14, radius: 10 },
};

export function Flag({ codigo, nombre, size = "md", style }) {
    const s = SIZES[size] ?? SIZES.md;
    const flag = resolverBandera(codigo) ?? resolverBandera(nombre);
    const code = (flag?.codigo || codigo || (nombre || "?").slice(0, 3)).toUpperCase();

    if (flag) {
        return (
            <Image
                source={flag.source}
                resizeMode="cover"
                accessibilityLabel={nombre ? `Bandera de ${nombre}` : `Bandera ${code}`}
                style={[
                    {
                        width: s.w,
                        height: s.h,
                        borderRadius: s.radius,
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "rgba(20,28,40,0.10)",
                    },
                    style,
                ]}
            />
        );
    }

    return (
        <View
            style={[
                {
                    width: s.w,
                    height: s.h,
                    borderRadius: s.radius,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#002b61",
                },
                style,
            ]}
        >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: s.font }}>{code}</Text>
        </View>
    );
}
