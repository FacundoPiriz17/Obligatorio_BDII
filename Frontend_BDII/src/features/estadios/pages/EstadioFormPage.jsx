import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LuArrowLeft } from "react-icons/lu";
import PageHeader from "../../../components/layout/PageHeader";
import Card, { CardBody, CardHeader } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { LoadingBlock } from "../../../components/ui/Spinner";
import ErrorMessage from "../../../components/feedback/ErrorMessage";
import EstadioImagen from "../components/EstadioImagen";
import { estadioService } from "../services/estadioService";
import { useFetch } from "../../../hooks/useFetch";
import { PAISES_SEDE, SECTORES } from "../../../lib/constants";
import { routePaths } from "../../../routes/routePaths";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { cn } from "../../../lib/cn";
import { useAuth } from "../../auth/hooks/useAuth";
import { esEnteroPositivo } from "../../../lib/validators";
import { guardarImagenEstadio, imagenEstadio } from "../../../lib/estadios";

/**
 * Alta / edición de estadio.
 * Un estadio siempre tiene los sectores A, B, C y D.
 * Por defecto, las capacidades se reparten equitativamente según la capacidad total.
 */

const crearSectoresBase = (actuales = []) =>
  SECTORES.map((nombreSector) => {
    const existente = actuales.find((s) => s.nombreSector === nombreSector);
    return {
      nombreSector,
      capacidad: existente ? String(existente.capacidad ?? "") : "",
      costo: existente ? String(existente.costo ?? "") : "",
    };
  });

const crearSectoresEquitativos = (capacidad, actuales = []) => {
  const existentes = crearSectoresBase(actuales);
  const total = Number(capacidad);

  if (!Number.isInteger(total) || total <= 0) return existentes;

  const base = Math.floor(total / SECTORES.length);
  const resto = total % SECTORES.length;

  return SECTORES.map((nombreSector, index) => {
    const existente = existentes.find((s) => s.nombreSector === nombreSector);
    return {
      nombreSector,
      capacidad: String(base + (index < resto ? 1 : 0)),
      costo: existente?.costo ?? "",
    };
  });
};

const esEnteroNoNegativoOpcional = (v) =>
  v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0);

const urlValidaOpcional = (v) => {
  const valor = String(v ?? "").trim();
  if (!valor) return true;

  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function EstadioFormPage() {
  const { idEstadio } = useParams();
  const esEdicion = !!idEstadio;
  useDocumentTitle(esEdicion ? "Editar estadio" : "Nuevo estadio");
  const navigate = useNavigate();
  const { user } = useAuth();
  const paisAdmin = user?.paisAdmin;

  const { data: original, loading, error, refetch } = useFetch(
    useCallback(() => (esEdicion ? estadioService.obtener(idEstadio) : Promise.resolve(null)), [idEstadio, esEdicion])
  );

  const [form, setForm] = useState({
    nombre: "",
    capacidad: "",
    ubicacion: "",
    ciudad: "",
    pais: PAISES_SEDE[0],
    imagenUrl: "",
    sectores: crearSectoresBase(),
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!original) return;

    setForm({
      nombre: original.nombre ?? "",
      capacidad: String(original.capacidad ?? ""),
      ubicacion: original.ubicacion ?? "",
      ciudad: original.ciudad ?? "",
      pais: original.pais ?? PAISES_SEDE[0],
      imagenUrl: imagenEstadio(original.nombre) ?? "",
      sectores: crearSectoresBase(original.sectores ?? []),
    });
  }, [original]);

  const capacidadTotal = Number(form.capacidad) || 0;
  const sumaSectores = form.sectores.reduce((acc, s) => acc + (Number(s.capacidad) || 0), 0);
  const diferencia = capacidadTotal - sumaSectores;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setCapacidad = (e) => {
    const valor = e.target.value;
    setForm((f) => ({
      ...f,
      capacidad: valor,
      sectores: crearSectoresEquitativos(valor, f.sectores),
    }));
  };

  const repartirEquitativamente = () =>
    setForm((f) => ({
      ...f,
      sectores: crearSectoresEquitativos(f.capacidad, f.sectores),
    }));

  const setSector = (idx, campo, valor) =>
    setForm((f) => ({
      ...f,
      sectores: f.sectores.map((s, i) => (i === idx ? { ...s, [campo]: valor } : s)),
    }));

  const validar = () => {
    const e = {};

    if (form.nombre.trim().length < 3) e.nombre = "Mínimo 3 caracteres.";
    if (!form.ciudad.trim()) e.ciudad = "Indicá la ciudad.";
    if (!esEnteroPositivo(form.capacidad)) {
      e.capacidad = "La capacidad total es obligatoria y debe ser un entero positivo.";
    }
    if (!urlValidaOpcional(form.imagenUrl)) {
      e.imagenUrl = "La imagen debe ser una URL http/https válida.";
    }

    for (const s of form.sectores) {
      if (!esEnteroPositivo(s.capacidad)) {
        e.sectores = `La capacidad del sector ${s.nombreSector} debe ser un entero positivo.`;
        break;
      }

      if (!esEnteroNoNegativoOpcional(s.costo)) {
        e.sectores = `El costo del sector ${s.nombreSector} debe ser un entero mayor o igual a 0, o quedar vacío.`;
        break;
      }
    }

    if (!e.capacidad && !e.sectores && sumaSectores !== capacidadTotal) {
      e.sectores = `La suma de sectores (${sumaSectores.toLocaleString("es-UY")}) debe coincidir con la capacidad total (${capacidadTotal.toLocaleString("es-UY")}).`;
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardarImagenLocal = () => {
    const nombre = form.nombre.trim();

    if (esEdicion && original?.nombre && original.nombre.trim() !== nombre) {
      guardarImagenEstadio(original.nombre, null);
    }

    guardarImagenEstadio(nombre, form.imagenUrl);
  };

  const sectoresPayload = () =>
    form.sectores.map((s) => ({
      nombreSector: s.nombreSector,
      capacidad: Number(s.capacidad),
      costo: s.costo === "" ? null : Number(s.costo),
    }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    setGuardando(true);

    const payload = {
      nombre: form.nombre.trim(),
      capacidad: Number(form.capacidad),
      ubicacion: form.ubicacion.trim() || null,
      ciudad: form.ciudad.trim(),
      pais: paisAdmin || form.pais,
      sectores: sectoresPayload(),
    };

    try {
      if (esEdicion) {
        await estadioService.actualizar(idEstadio, payload);
        guardarImagenLocal();
        toast.success("Estadio actualizado");
      } else {
        await estadioService.crear(payload);
        guardarImagenLocal();
        toast.success("Estadio creado");
      }
      navigate(routePaths.adminEstadios);
    } catch (err) {
      toast.error(err.detail || "No se pudo guardar el estadio.");
    } finally {
      setGuardando(false);
    }
  };

  if (esEdicion && loading) return <LoadingBlock label="Cargando estadio…" />;
  if (esEdicion && error) return <ErrorMessage error={error} onRetry={refetch} />;

  const fueraDeJurisdiccion = esEdicion && original && paisAdmin && original.pais !== paisAdmin;

  if (fueraDeJurisdiccion) {
    return (
      <>
        <Link to={routePaths.adminEstadios} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:underline">
          <LuArrowLeft className="size-4" /> Volver a estadios
        </Link>
        <ErrorMessage
          title="No podés editar este estadio"
          error={{ detail: `Este estadio pertenece a ${original.pais}. Tu jurisdicción es ${paisAdmin}.` }}
        />
      </>
    );
  }

  return (
    <>
      <Link to={routePaths.adminEstadios} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:underline">
        <LuArrowLeft className="size-4" /> Volver a estadios
      </Link>
      <PageHeader title={esEdicion ? "Editar estadio" : "Nuevo estadio"} />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2" noValidate>
        <Card>
          <CardHeader title="Datos del estadio" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-container-high sm:col-span-2">
              <EstadioImagen nombre={form.nombre} src={form.imagenUrl} className="h-40 w-full" />
            </div>
            <Input className="sm:col-span-2" label="Nombre" value={form.nombre} onChange={set("nombre")} error={errores.nombre} placeholder="MetLife Stadium" />
            <Input className="sm:col-span-2" label="URL de imagen" value={form.imagenUrl} onChange={set("imagenUrl")} error={errores.imagenUrl} placeholder="https://..." hint="No se guarda en la BD: queda vinculado al nombre del estadio como override local del JSON de estadios." />
            <Input label="Ciudad" value={form.ciudad} onChange={set("ciudad")} error={errores.ciudad} placeholder="East Rutherford" />
            <Select
              label="País sede"
              options={paisAdmin ? [paisAdmin] : PAISES_SEDE}
              value={paisAdmin || form.pais}
              onChange={set("pais")}
              disabled={!!paisAdmin}
              hint={paisAdmin ? "Tu usuario admin solo puede gestionar este país sede." : undefined}
            />
            <Input label="Ubicación / dirección" value={form.ubicacion} onChange={set("ubicacion")} placeholder="1 MetLife Stadium Dr" />
            <Input label="Capacidad total" type="number" min="1" step="1" inputMode="numeric" value={form.capacidad} onChange={setCapacidad} error={errores.capacidad} placeholder="82500" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sectores" subtitle="El estadio siempre se guarda con A, B, C y D. La habilitación de venta se define después en cada evento." />
          <CardBody>
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={repartirEquitativamente}>
                Repartir equitativamente
              </Button>
            </div>

            <div className="space-y-3">
              {form.sectores.map((s, i) => (
                <div key={s.nombreSector} className="rounded-xl border border-navy-700 bg-container-low/60 p-3 transition-colors">
                  <div className="font-bold text-ink">Sector {s.nombreSector}</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Input label="Capacidad" type="number" min="1" step="1" inputMode="numeric" value={s.capacidad} onChange={(e) => setSector(i, "capacidad", e.target.value)} placeholder="20000" />
                    <Input label="Costo (USD)" type="number" min="0" step="1" inputMode="numeric" value={s.costo} onChange={(e) => setSector(i, "costo", e.target.value)} placeholder="120" />
                  </div>
                </div>
              ))}
            </div>
            {errores.sectores && <p className="mt-2 text-xs font-medium text-danger-600">{errores.sectores}</p>}

            {capacidadTotal > 0 && (
              <div className={cn(
                "mt-4 rounded-xl border px-3 py-2.5 text-sm",
                diferencia === 0
                  ? "border-ok-500/40 bg-ok-100/60 text-ok-600"
                  : "border-danger-500/40 bg-danger-100/50 text-danger-700"
              )}>
                <div className="flex items-center justify-between font-semibold">
                  <span>Sectores: {sumaSectores.toLocaleString("es-UY")}</span>
                  <span>Capacidad: {capacidadTotal.toLocaleString("es-UY")}</span>
                </div>
                <p className="mt-1 text-xs font-bold">
                  {diferencia === 0
                    ? "Los sectores cubren exactamente la capacidad."
                    : diferencia > 0
                      ? `Faltan ${diferencia.toLocaleString("es-UY")} lugares para cubrir la capacidad.`
                      : `Te pasás por ${Math.abs(diferencia).toLocaleString("es-UY")} lugares.`}
                </p>
              </div>
            )}

            <Button type="submit" size="lg" loading={guardando} className="mt-5 w-full">
              {esEdicion ? "Guardar cambios" : "Crear estadio"}
            </Button>
          </CardBody>
        </Card>
      </form>
    </>
  );
}
