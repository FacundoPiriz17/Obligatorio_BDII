import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { entradaService } from "../services/entradaService";
import { QR_REFRESH_SEGUNDOS } from "../../../lib/constants";

export function useQrDinamico(idEntrada, activo) {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(QR_REFRESH_SEGUNDOS);

    const intervalRef = useRef(null);
    const countdownRef = useRef(null);

    const fetchQr = useCallback(async () => {
        if (!activo) return;
        setLoading(true);
        try {
            const res = await entradaService.generarQr(idEntrada);
            setQrData(res);
            setCountdown(QR_REFRESH_SEGUNDOS);
        } catch {
            // Si falla no reseteamos el QR anterior — sigue siendo válido hasta el próximo intento
        } finally {
            setLoading(false);
        }
    }, [idEntrada, activo]);

    useEffect(() => {
        if (!activo) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            return;
        }

        fetchQr();

        intervalRef.current = setInterval(fetchQr, QR_REFRESH_SEGUNDOS * 1000);
        countdownRef.current = setInterval(
            () => setCountdown((c) => (c > 0 ? c - 1 : QR_REFRESH_SEGUNDOS)),
            1000
        );

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [activo, fetchQr]);

    useEffect(() => {
        if (!activo) return;
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") fetchQr();
        });
        return () => sub.remove();
    }, [activo, fetchQr]);

    return { qrData, loading, countdown, refresh: fetchQr };
}
