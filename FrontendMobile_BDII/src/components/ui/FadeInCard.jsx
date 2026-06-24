import Animated, { FadeInDown } from "react-native-reanimated";

export function FadeInCard({ children, index = 0, style }) {
    const delay = Math.min(index, 8) * 35;
    return (
        <Animated.View entering={FadeInDown.duration(220).delay(delay)} style={style}>
            {children}
        </Animated.View>
    );
}
