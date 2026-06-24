import { Image, View } from "react-native";
import { cn } from "../../lib/cn";

const ucuLogo = require("../../../assets/images/ucu-logo-white.png");

export function UcuLogoIcon({ className, imgClassName, size, style }) {
    return (
        <View
            className={cn("items-center justify-center rounded-lg bg-navy-950 p-1.5", className)}
            style={[size ? { width: size, height: size } : null, style]}
        >
            <Image
                source={ucuLogo}
                className={cn("h-full w-full", imgClassName)}
                resizeMode="contain"
            />
        </View>
    );
}
