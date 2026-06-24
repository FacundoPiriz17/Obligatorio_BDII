import { apiClient } from "../../../services/apiClient";
import { endpoints } from "../../../services/endpoints";

export const reporteService = {
    homeAdmin: () => apiClient.get(endpoints.home.admin),

    auditoria: (tipo, limit = 200) =>
        apiClient.get(endpoints.reportes.auditoria, {
            params: { tipo: tipo || undefined, limit },
        }),

    eventosMasVendidos: (limit = 10) =>
        apiClient.get(endpoints.reportes.eventosMasVendidos, { params: { limit } }),
    mayoresCompradores: (limit = 10) =>
        apiClient.get(endpoints.reportes.mayoresCompradores, { params: { limit } }),
    ocupacionEventos: (limit = 10) =>
        apiClient.get(endpoints.reportes.ocupacionEventos, { params: { limit } }),
    resumenValidaciones: () => apiClient.get(endpoints.reportes.resumenValidaciones),
};
