import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../../../components/ui/AppButton";

export function QRScanner({ onScan, active = true }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const cooldownRef = useRef(null);

    useEffect(() => {
        if (active) setScanned(false);
        return () => {
            if (cooldownRef.current) clearTimeout(cooldownRef.current);
        };
    }, [active]);

    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="#00e3fd" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-navy-950 px-8">
                <View className="size-16 items-center justify-center rounded-2xl bg-container">
                    <Ionicons name="camera-outline" size={32} color="#7694d0" />
                </View>
                <Text className="text-center text-base font-bold text-white">
                    Permiso de cámara requerido
                </Text>
                <Text className="text-center text-sm text-navy-300">
                    Necesitamos acceso a la cámara para escanear los códigos QR de las entradas.
                </Text>
                <AppButton variant="energy" onPress={requestPermission}>
                    Conceder permiso
                </AppButton>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {/* CameraView NO admite children: la cámara va sola y el visor encima como hermano absoluto. */}
            <CameraView
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={
                    scanned || !active
                        ? undefined
                        : ({ data }) => {
                            setScanned(true);
                            onScan(data);
                            // Cooldown de 2s antes de permitir otro escaneo
                            cooldownRef.current = setTimeout(() => setScanned(false), 2000);
                        }
                }
            />
            {/* Overlay con visor (hermano, posicionado absoluto sobre la cámara) */}
            <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
                    {/* Oscurecido arriba */}
                    <View className="absolute inset-x-0 top-0 h-1/4 bg-black/60" />
                    {/* Oscurecido abajo */}
                    <View className="absolute inset-x-0 bottom-0 h-1/4 bg-black/60" />
                    {/* Oscurecido lados */}
                    <View className="absolute bottom-1/4 left-0 top-1/4 w-[12%] bg-black/60" />
                    <View className="absolute bottom-1/4 right-0 top-1/4 w-[12%] bg-black/60" />

                    {/* Marco del visor */}
                    <View className="size-56 rounded-2xl" style={{ borderWidth: 2, borderColor: "#00e3fd" }}>
                        {/* Esquinas decorativas */}
                        {[
                            "absolute top-0 left-0",
                            "absolute top-0 right-0",
                            "absolute bottom-0 left-0",
                            "absolute bottom-0 right-0",
                        ].map((pos, i) => (
                            <View
                                key={i}
                                className={`${pos} size-6`}
                                style={{
                                    borderColor: "#00e3fd",
                                    borderTopWidth: i < 2 ? 3 : 0,
                                    borderBottomWidth: i >= 2 ? 3 : 0,
                                    borderLeftWidth: i % 2 === 0 ? 3 : 0,
                                    borderRightWidth: i % 2 !== 0 ? 3 : 0,
                                }}
                            />
                        ))}
                    </View>

                    <Text className="mt-4 text-center text-xs font-semibold text-white/80">
                        Apuntá al código QR de la entrada
                    </Text>
                    {scanned && (
                        <View className="mt-2 rounded-full bg-energy-500/20 px-4 py-1.5">
                            <Text className="text-xs font-bold text-energy-400">Procesando…</Text>
                        </View>
                    )}
                </View>
        </View>
    );
}
