import { StyleSheet, View } from "react-native";

let LinearGradient = null;
try {
    // eslint-disable-next-line global-require
    LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch {
    LinearGradient = null;
}

const PALETAS = {
    navy: ["#0b3c7e", "#002b61", "#00173a"],
    funcionario: ["#2a5391", "#0b3c7e", "#002b61"],
};

export function HeroBackground({ variant = "navy", orbs = true }) {
    const colors = PALETAS[variant] ?? PALETAS.navy;
    return (
        <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
            {LinearGradient ? (
                <LinearGradient
                    colors={colors}
                    locations={[0, 0.42, 0.85]}
                    start={{ x: 0.9, y: 0 }}
                    end={{ x: 0.15, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[1] }]} />
            )}
            {orbs && (
                <>
                    <View
                        className="absolute rounded-full bg-white/5"
                        style={{ width: 240, height: 240, top: -100, right: -70 }}
                    />
                    <View
                        className="absolute rounded-full bg-energy-700/20"
                        style={{ width: 210, height: 210, bottom: -130, left: 30 }}
                    />
                </>
            )}
        </View>
    );
}
