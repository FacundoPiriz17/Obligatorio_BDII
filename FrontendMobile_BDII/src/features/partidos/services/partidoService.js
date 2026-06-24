import { apiClient } from "../../../services/apiClient";
import { endpoints } from "../../../services/endpoints";

export const partidoService = {
    listar: (filtros) => apiClient.get(endpoints.eventos.base, { params: filtros }),
    obtener: (id) => apiClient.get(endpoints.eventos.porId(id)),
    disponibles: () => apiClient.get(endpoints.compras.partidosDisponibles),
    equipos: () => apiClient.get(endpoints.infraestructura.equipos),
};
