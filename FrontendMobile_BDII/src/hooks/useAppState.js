import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useAppForeground(onForeground) {
    const stateRef = useRef(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (next) => {
            if (stateRef.current.match(/inactive|background/) && next === "active") {
                onForeground();
            }
            stateRef.current = next;
        });
        return () => sub.remove();
    }, [onForeground]);
}
