import { useCallback, useEffect, useState } from "react";
import { useDeviceStore, selectMiDispositivo } from "../../dispositivo/store/useDeviceStore";
import { validacionService } from "../services/validacionService";

export function useScanner() {
    const { dispositivos, installationId, loading: loadingDevice, loaded, init } = useDeviceStore();
    const [estado, setEstado] = useState("idle");
    const [resultado, setResultado] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!loaded) init();
    }, [loaded, init]);

    // Usa el dispositivo de ESTE teléfono (por installationId).
    const dispositivo = selectMiDispositivo(dispositivos, installationId);
    const deviceRegistrado = Boolean(dispositivo);
    const idDispositivo = dispositivo?.idDispositivoEscaneo ?? null;

    const procesarQr = useCallback(
        async (codigoEscaneado) => {
            if (!idDispositivo) {
                setEstado("error");
                setErrorMsg(
                    "No tenés un dispositivo de escaneo activo asignado. Pedí a un administrador que te asigne uno."
                );
                return;
            }

            setEstado("scanning");
            setErrorMsg(null);
            setResultado(null);

            try {
                const v = await validacionService.escanear(idDispositivo, codigoEscaneado);
                if (v?.esValida === false) {
                    setEstado("error");
                    setErrorMsg("Entrada inválida.");
                    return;
                }
                setResultado({
                    idEntrada: v?.idEntrada,
                    nombrePropietario: v?.nombrePropietario,
                    partido: v?.partido,
                    sector: v?.nombreSector,
                    mensaje: "Entrada válida",
                });
                setEstado("success");
            } catch (err) {
                const msg = err?.detail ?? err?.message ?? "QR inválido o entrada ya consumida.";
                const yaUsada = /consumid|ya .*v[áa]lid|ya tiene|registrada/i.test(msg);
                setEstado(yaUsada ? "duplicada" : "error");
                setErrorMsg(msg);
            }
        },
        [idDispositivo]
    );

    const reset = useCallback(() => {
        setEstado("idle");
        setResultado(null);
        setErrorMsg(null);
    }, []);

    return {
        idDispositivo,
        dispositivo,
        deviceRegistrado,
        loadingDevice,
        estado,
        resultado,
        errorMsg,
        procesarQr,
        reset,
    };
}
