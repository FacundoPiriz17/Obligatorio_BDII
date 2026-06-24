import { useCallback } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { partidoService } from "../services/partidoService";

export function usePartidos(filtros) {
    const { data, loading, error, refetch } = useFetch(
        useCallback(() => partidoService.listar(filtros), [JSON.stringify(filtros)])
    );

    return {
        partidos: data ?? [],
        loading,
        error,
        refetch,
    };
}

export function usePartido(id) {
    const { data, loading, error, refetch } = useFetch(
        useCallback(() => partidoService.obtener(id), [id])
    );

    return { partido: data, loading, error, refetch };
}

export function usePartidosDisponibles() {
    const { data, loading, error, refetch } = useFetch(
        useCallback(() => partidoService.disponibles(), [])
    );

    return {
        partidos: data ?? [],
        loading,
        error,
        refetch,
    };
}
