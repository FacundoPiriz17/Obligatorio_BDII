import { apiClient } from "../../../services/apiClient";
import { endpoints } from "../../../services/endpoints";

export const compraService = {
    crear: (entradas) => apiClient.post(endpoints.compras.base, { entradas }),
    listar: (filtros) => apiClient.get(endpoints.compras.base, { params: filtros }),
    obtener: (id) => apiClient.get(endpoints.compras.porId(id)),
    confirmar: (id) => apiClient.post(endpoints.compras.confirmar(id)),
    pagar: (id) => apiClient.post(endpoints.compras.pagar(id)),
    cancelar: (id) => apiClient.post(endpoints.compras.cancelar(id)),
    misEntradas: (filtros) => apiClient.get(endpoints.compras.misEntradas, { params: filtros }),
    partidosDisponibles: () => apiClient.get(endpoints.compras.partidosDisponibles),
    generarQr: (idEntrada) => apiClient.post(endpoints.compras.generarQr(idEntrada)),
};
