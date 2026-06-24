import { create } from "zustand";
import { authService } from "../services/authService";
import { secureStorage, TOKEN_KEY } from "../../../lib/secureStorage";
import { normalizarRol, ROLES } from "../../../lib/constants";
import { setOnUnauthorized } from "../../../services/apiClient";
import { useDeviceStore } from "../../dispositivo/store/useDeviceStore";

const aplicarRoles = (rawRoles = []) => rawRoles.map(normalizarRol);

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    initializing: true,
    isAuthenticated: false,
    isAdmin: false,
    isFuncionario: false,
    isGeneral: false,
    hasRole: (rol) => (get().user?.roles ?? []).includes(rol),

    initialize: async () => {
        const token = await secureStorage.get(TOKEN_KEY);
        if (!token) {
            set({ initializing: false });
            return;
        }
        try {
            const perfil = await authService.me();
            const roles = aplicarRoles(perfil.roles);
            set({
                user: { ...perfil, roles },
                token,
                isAuthenticated: true,
                isAdmin: roles.includes(ROLES.ADMIN),
                isFuncionario: roles.includes(ROLES.FUNCIONARIO),
                isGeneral: roles.includes(ROLES.GENERAL),
            });
        } catch {
            await secureStorage.remove(TOKEN_KEY);
        } finally {
            set({ initializing: false });
        }
    },

    login: async (email, password) => {
        const res = await authService.login(email, password);
        await secureStorage.set(TOKEN_KEY, res.token);
        let perfil;
        try {
            perfil = await authService.me();
        } catch {
            perfil = { email: res.email, nombre: res.nombre, roles: res.roles };
        }
        const roles = aplicarRoles(perfil.roles ?? res.roles);
        set({
            user: { email: perfil.email, nombre: perfil.nombre, roles },
            token: res.token,
            isAuthenticated: true,
            isAdmin: roles.includes(ROLES.ADMIN),
            isFuncionario: roles.includes(ROLES.FUNCIONARIO),
            isGeneral: roles.includes(ROLES.GENERAL),
        });
        return roles;
    },

    register: async (datos) => {
        await authService.register(datos);
    },

    logout: async () => {
        await secureStorage.remove(TOKEN_KEY);
        // Limpia el estado del dispositivo en memoria (conserva el installation id cifrado).
        useDeviceStore.getState().reset();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isFuncionario: false,
            isGeneral: false,
        });
    },

    refreshUser: async () => {
        const perfil = await authService.me();
        const roles = aplicarRoles(perfil.roles);
        set((s) => ({
            user: { ...s.user, ...perfil, roles },
            isAdmin: roles.includes(ROLES.ADMIN),
            isFuncionario: roles.includes(ROLES.FUNCIONARIO),
            isGeneral: roles.includes(ROLES.GENERAL),
        }));
    },
}));

// Registrar callback de 401 → logout automático
setOnUnauthorized(() => useAuthStore.getState().logout());
