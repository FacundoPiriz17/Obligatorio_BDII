import { create } from "zustand";
import { getOrCreateInstallationId, clearInstallationId, getModeloDispositivo } from "../../../lib/deviceId";
import { dispositivoService } from "../services/dispositivoService";

export const useDeviceStore = create((set, get) => ({
    installationId: null,
    justCreated: false,
    acknowledged: false,
    dispositivos: [],
    loading: false,
    loaded: false,
    registrando: false,
    error: null,

    init: async ({ force = false } = {}) => {
        if (!force && (get().loaded || get().loading)) return;
        set({ loading: true, error: null });
        try {
            const { installationId, justCreated } = await getOrCreateInstallationId();
            let dispositivos = [];
            try {
                dispositivos = (await dispositivoService.mios()) ?? [];
            } catch {
                // /mios puede fallar si el backend aún no respondió; queda vacío.
            }
            set({
                installationId,
                justCreated: get().acknowledged ? false : justCreated,
                dispositivos,
                loaded: true,
            });

            // Auto-registro de ESTE teléfono: si todavía no existe un dispositivo
            // con este installationId (aunque haya otros asignados), lo registramos.
            // En el primer arranque (justCreated) lo dispara el modal; acá cubrimos
            // los ingresos siguientes. El endpoint es idempotente.
            const miDispositivo = installationId
                ? dispositivos.find((d) => d.installationId === installationId)
                : null;
            if (!justCreated && !miDispositivo) {
                try {
                    await get().registrarDispositivo();
                } catch {
                    // Sin red o el backend aún no permite el alta: se reintenta el próximo ingreso.
                }
            }
        } catch (error) {
            set({ error });
        } finally {
            set({ loading: false });
        }
    },

    refetchDispositivos: async () => {
        const dispositivos = (await dispositivoService.mios()) ?? [];
        set({ dispositivos });
        return dispositivos;
    },

    registrarDispositivo: async () => {
        const installationId = get().installationId;
        // Si ESTE teléfono (su installationId) ya está registrado, no duplicamos.
        const mio = (get().dispositivos ?? []).find(
            (d) => installationId && d.installationId === installationId
        );
        if (mio) return mio;
        if (get().registrando) return null;

        set({ registrando: true });
        try {
            // POST /dispositivos/mios — upsert idempotente por installation_id.
            await dispositivoService.registrar({
                modelo: getModeloDispositivo(),
                installationId,
            });
            const dispositivos = (await dispositivoService.mios()) ?? [];
            set({ dispositivos });
            return selectMiDispositivo(dispositivos, installationId);
        } finally {
            set({ registrando: false });
        }
    },

    acknowledge: () => set({ acknowledged: true, justCreated: false }),

    reset: async ({ borrarInstallationId = false } = {}) => {
        if (borrarInstallationId) await clearInstallationId();
        set({
            installationId: borrarInstallationId ? null : get().installationId,
            justCreated: false,
            acknowledged: false,
            dispositivos: [],
            loaded: false,
            error: null,
        });
    },
}));

/** Dispositivo de escaneo a usar (fallback genérico): primero activo. */
export const selectDispositivoActivo = (dispositivos = []) =>
    dispositivos.find((d) => d.activo) ?? dispositivos[0] ?? null;

/**
 * Dispositivo de ESTE teléfono: el que coincide con el installationId.
 * Si no hay match (todavía no se registró este teléfono), cae al primero activo.
 */
export const selectMiDispositivo = (dispositivos = [], installationId = null) => {
    if (installationId) {
        const mio =
            dispositivos.find((d) => d.activo && d.installationId === installationId) ??
            dispositivos.find((d) => d.installationId === installationId);
        if (mio) return mio;
    }
    return selectDispositivoActivo(dispositivos);
};

/**
 * Ordena los dispositivos del funcionario poniendo PRIMERO el de este teléfono
 * (installationId) y luego el resto (activos antes que inactivos).
 */
export const ordenarDispositivos = (dispositivos = [], installationId = null) =>
    [...dispositivos].sort((a, b) => {
        const aMio = installationId && a.installationId === installationId ? 1 : 0;
        const bMio = installationId && b.installationId === installationId ? 1 : 0;
        if (aMio !== bMio) return bMio - aMio; // el de este teléfono primero
        const aAct = a.activo ? 1 : 0;
        const bAct = b.activo ? 1 : 0;
        return bAct - aAct; // luego activos primero
    });
