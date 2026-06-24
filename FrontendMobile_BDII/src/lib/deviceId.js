import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { secureStorage } from "./secureStorage";
import { INSTALLATION_ID_KEY } from "./constants";

let cachedId = null;

export function getModeloDispositivo() {
    const base =
        Device.modelName ||
        Device.deviceName ||
        [Device.brand, Device.osName].filter(Boolean).join(" ") ||
        "Dispositivo móvil";
    const conSO = Device.osName && !base.includes(Device.osName) ? `${base} ${Device.osName}` : base;
    return conSO.trim().slice(0, 30);
}

export async function getOrCreateInstallationId() {
    if (cachedId) return { installationId: cachedId, justCreated: false };

    const stored = await secureStorage.get(INSTALLATION_ID_KEY);
    if (stored) {
        cachedId = stored;
        return { installationId: stored, justCreated: false };
    }

    const installationId = Crypto.randomUUID();
    await secureStorage.set(INSTALLATION_ID_KEY, installationId);
    cachedId = installationId;
    return { installationId, justCreated: true };
}

export async function getDeviceId() {
    const { installationId } = await getOrCreateInstallationId();
    return installationId;
}

export async function clearInstallationId() {
    cachedId = null;
    await secureStorage.remove(INSTALLATION_ID_KEY);
}
