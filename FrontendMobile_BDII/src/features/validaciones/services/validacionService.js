import { apiClient } from "../../../services/apiClient";
import { endpoints } from "../../../services/endpoints";

const nombrePartido = (p) =>
    p ? `${p.equipoLocal ?? "?"} vs ${p.equipoVisitante ?? "?"}` : undefined;

const normalizeValidacion = (v) => {
    if (!v) return v;
    const entrada = v.entrada ?? {};
    const estado = v.estado ?? "";
    return {
        idValidacion: v.idValidacion,
        idEntrada: v.idEntrada ?? entrada.idEntrada,
        idDispositivo: v.idDispositivo,
        estado,
        esValida: estado.toLowerCase().startsWith("vál") || estado.toLowerCase() === "valida",
        codigoEscaneado: v.codigoEscaneado,
        fechaHora: v.fechaHora,
        nombreSector: entrada.nombreSector,
        nombrePropietario: entrada.nombrePropietarioActual,
        emailPropietario: entrada.emailPropietarioActual,
        partido: nombrePartido(entrada.partido),
        partidoRaw: entrada.partido,
        funcionario: v.funcionario,
        entrada,
    };
};

export const validacionService = {
    listar: async (filtros) => {
        const data = await apiClient.get(endpoints.validaciones.base, { params: filtros });
        return Array.isArray(data) ? data.map(normalizeValidacion) : [];
    },

    obtener: async (id) =>
        normalizeValidacion(await apiClient.get(endpoints.validaciones.porId(id))),

    escanear: async (idDispositivo, codigoEscaneado) =>
        normalizeValidacion(
            await apiClient.post(endpoints.validaciones.escanear, {
                idDispositivo: Number(idDispositivo),
                codigoEscaneado,
            })
        ),

    invalidar: async (idDispositivo, idEntrada, codigoEscaneado) =>
        normalizeValidacion(
            await apiClient.post(endpoints.validaciones.invalidar, {
                idDispositivo: Number(idDispositivo),
                idEntrada: Number(idEntrada),
                codigoEscaneado,
            })
        ),

    verificarManual: (idEntrada, numeroDocumento) =>
        apiClient.post(endpoints.validaciones.manualVerificar, {
            idEntrada: Number(idEntrada),
            numeroDocumento: Number(numeroDocumento),
        }),
};
