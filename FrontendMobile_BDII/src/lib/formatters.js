import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("es");

const toDay = (value) => {
    if (!value) return null;
    const d = dayjs(value);
    return d.isValid() ? d : null;
};

export const formatMoney = (value) => {
    if (value === null || value === undefined) return "—";
    return `US$ ${Number(value).toLocaleString("es-UY")}`;
};

export const formatFecha = (value) => {
    const d = toDay(value);
    return d ? d.format("ddd D MMM YYYY") : "—";
};

export const formatFechaLarga = (value) => {
    const d = toDay(value);
    return d ? d.format("dddd D [de] MMMM") : "—";
};

export const formatHora = (value) => {
    if (!value) return "—";
    return String(value).slice(0, 5);
};

export const formatFechaHora = (value) => {
    const d = toDay(value);
    return d ? d.format("DD/MM/YYYY HH:mm") : "—";
};

export const formatHoraExacta = (value) => {
    const d = toDay(value);
    return d ? d.format("HH:mm:ss") : "—";
};

export const formatPartido = (p) =>
    p ? `${p.equipoLocal ?? "?"} vs ${p.equipoVisitante ?? "?"}` : "—";

export const formatRelativo = (value) => {
    const d = toDay(value);
    if (!d) return "—";
    return d.fromNow();
};
