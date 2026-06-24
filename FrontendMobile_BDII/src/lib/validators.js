import { DOMINIOS_EMAIL_VALIDOS } from "./constants";

export const esEmailUCU = (email) =>
    DOMINIOS_EMAIL_VALIDOS.some((d) => email.toLowerCase().endsWith(d));

export const esPasswordValida = (pwd) => pwd.length >= 6;

export const esNumeroValido = (valor) =>
    /^\d+$/.test(valor.trim()) && valor.trim().length > 0;
