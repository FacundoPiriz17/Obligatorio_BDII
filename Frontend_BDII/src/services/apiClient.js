import { storage, TOKEN_KEY } from "../lib/storage";

const BASE_URL = import.meta.env.VITE_API_URL || "";

/** Convierte detalles de validación en texto legible */
function flattenDetails(details) {
  if (!details) return null;

  if (typeof details === "string") return details;

  if (Array.isArray(details)) {
    return details.filter(Boolean).join(" ");
  }

  if (typeof details === "object") {
    return Object.values(details)
      .flat()
      .filter(Boolean)
      .join(" ");
  }

  return null;
}

/** Error de API compatible con ApiErrorResponse del back y ProblemDetails de .NET */
export class ApiError extends Error {
  constructor({ status, code, title, detail, details, problem }) {
    super(detail || title || `Error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.details = details;
    this.problem = problem;
  }
}

/** Suscriptor para expulsar al usuario cuando el token expira (401). */
let onUnauthorized = null;

export const setOnUnauthorized = (fn) => {
  onUnauthorized = fn;
};

const buildQuery = (params) => {
  if (!params) return "";

  const qs = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });

  const s = qs.toString();
  return s ? `?${s}` : "";
};

function getProblemField(problem, camel, pascal) {
  return problem?.[camel] ?? problem?.[pascal];
}

async function request(path, { method = "GET", body, params, auth = true } = {}) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = storage.get(TOKEN_KEY);

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;

  try {
    res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError({
      status: 0,
      code: "network_error",
      title: "Sin conexión",
      detail: "No se pudo contactar al servidor. Verificá que el backend esté levantado.",
    });
  }

  if (res.status === 401 && auth && token) {
    onUnauthorized?.();
  }

  if (!res.ok) {
    let problem = null;

    try {
      problem = await res.json();
    } catch {
      /* respuesta sin cuerpo */
    }

    const details = getProblemField(problem, "details", "Details");
    const title =
      getProblemField(problem, "title", "Title") ||
      getProblemField(problem, "message", "Message") ||
      res.statusText ||
      `Error ${res.status}`;

    const detail =
      getProblemField(problem, "detail", "Detail") ||
      getProblemField(problem, "message", "Message") ||
      flattenDetails(details) ||
      title;

    throw new ApiError({
      status: res.status,
      code: getProblemField(problem, "code", "Code"),
      title,
      detail,
      details,
      problem,
    });
  }

  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};