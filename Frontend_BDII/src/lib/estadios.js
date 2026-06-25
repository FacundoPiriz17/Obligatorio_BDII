import estadios from "../assets/data/estadios.json";

const STORAGE_KEY = "bdii.estadios.imagenes";

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const mapa = estadios.reduce((acc, e) => {
  if (e?.nombre_estadio && e?.imageUrl) acc[norm(e.nombre_estadio)] = e.imageUrl;
  return acc;
}, {});

const claves = Object.keys(mapa);

function leerOverrides() {
  if (typeof window === "undefined" || !window.localStorage) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function escribirOverrides(overrides) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

/** Guarda o elimina la imagen local asociada al nombre de un estadio. */
export function guardarImagenEstadio(nombre, imageUrl) {
  const k = norm(nombre);
  if (!k) return;

  const overrides = leerOverrides();
  const url = String(imageUrl ?? "").trim();

  if (url) overrides[k] = url;
  else delete overrides[k];

  escribirOverrides(overrides);
}

/** URL de la imagen del estadio por nombre, o null si no hay coincidencia. */
export function imagenEstadio(nombre) {
  if (!nombre) return null;
  const k = norm(nombre);
  if (!k) return null;

  const overrides = leerOverrides();
  if (overrides[k]) return overrides[k];

  if (mapa[k]) return mapa[k];
  const aprox = claves.find((m) => m.includes(k) || k.includes(m));
  return aprox ? mapa[aprox] : null;
}
