const normalizar = (valor) => (valor ?? "").toString().trim().toLowerCase();

/**
 * Estado calculado solo para la UI.
 * En base una entrada puede seguir activa aunque el partido ya haya terminado;
 * visualmente la mostramos como vencida para no confundirla con una entrada vigente.
 */
export const entradaEstaVencida = (entrada) =>
  normalizar(entrada?.estado) === "activa" && normalizar(entrada?.partido?.estado) === "terminado";

export const estadoVisualEntrada = (entrada) =>
  entradaEstaVencida(entrada) ? "vencida" : entrada?.estado;

export const entradaPermiteQr = (entrada, esPropietario = true) =>
  esPropietario && estadoVisualEntrada(entrada) === "activa";

export const entradaPermiteTransferencia = (entrada, esPropietario = true) =>
  entradaPermiteQr(entrada, esPropietario) && (entrada?.transferenciasRestantes ?? 0) > 0;
