const normalizar = (valor) => (valor ?? "").toString().trim().toLowerCase();

export const entradaEstaVencida = (entrada) =>
    normalizar(entrada?.estado) === "activa" && normalizar(entrada?.partido?.estado) === "terminado";

export const estadoVisualEntrada = (entrada) =>
    entradaEstaVencida(entrada) ? "vencida" : entrada?.estado;

export const entradaPermiteQr = (entrada, esPropietario = true) =>
    esPropietario && estadoVisualEntrada(entrada) === "activa";

export const entradaPermiteTransferencia = (entrada, esPropietario = true) =>
    entradaPermiteQr(entrada, esPropietario) && (entrada?.transferenciasRestantes ?? 0) > 0;
