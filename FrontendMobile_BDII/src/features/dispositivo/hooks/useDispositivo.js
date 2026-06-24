import { useCallback, useEffect } from "react";
import { useDeviceStore, selectMiDispositivo, ordenarDispositivos } from "../store/useDeviceStore";

export function useDispositivo() {
    const { installationId, dispositivos, loading, error, loaded, init, refetchDispositivos } =
        useDeviceStore();

    useEffect(() => {
        if (!loaded) init();
    }, [loaded, init]);

    const refetch = useCallback(async () => {
        await refetchDispositivos();
    }, [refetchDispositivos]);

    // Dispositivo de ESTE teléfono (el que se está usando ahora).
    const dispositivoActual = selectMiDispositivo(dispositivos, installationId);
    // Lista completa ordenada: primero el de este teléfono, luego el resto.
    const dispositivosOrdenados = ordenarDispositivos(dispositivos, installationId);
    // Los "otros" dispositivos habilitados del funcionario (sin el de este teléfono).
    const otrosDispositivos = dispositivosOrdenados.filter(
        (d) => d !== dispositivoActual
    );

    return {
        installationId,
        dispositivos: dispositivosOrdenados,
        dispositivoActual,
        otrosDispositivos,
        registrado: Boolean(dispositivoActual),
        loading,
        error,
        refetch,
    };
}
