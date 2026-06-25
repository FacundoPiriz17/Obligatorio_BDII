import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuMail, LuLockKeyhole, LuArrowRight } from "react-icons/lu";
import AuthShell from "../components/AuthShell";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { routePaths } from "../../../routes/routePaths";
import { ROLES } from "../../../lib/constants";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Iniciar sesión");
  const { login, isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const destinoPorRol = (roles) => {
    if (roles.includes(ROLES.ADMIN)) return routePaths.admin;
    if (roles.includes(ROLES.FUNCIONARIO)) return routePaths.scanner;
    return routePaths.home;
  };

  /*
    Guard de "from": el destino guardado por ProtectedRoute puede pertenecer a
    OTRO rol (p. ej. quedó "/scanner" de una sesión previa y ahora entra un
    admin). Si la ruta no es accesible para el rol recién logueado, ignoramos
    "from" y vamos al home del rol. Esto evita el rebote a "Acceso restringido"
    al cambiar de cuenta.
  */
  const puedeAcceder = (path, roles) => {
  if (
    !path ||
    path.startsWith(routePaths.login) ||
    path.startsWith(routePaths.noAutorizado) ||
    path.startsWith(routePaths.sesionExpirada)
  ) {
    return false;
  }

  const esGeneral = roles.includes(ROLES.GENERAL);
  const esAdmin = roles.includes(ROLES.ADMIN);
  const esFuncionario = roles.includes(ROLES.FUNCIONARIO);

  // Perfil es compartido para cualquier usuario autenticado
  if (path === routePaths.perfil) return true;

  if (path === routePaths.validaciones) {
    return esFuncionario;
  }

  // Funcionario
  if (path === routePaths.scanner) return esFuncionario;

  // Admin
  if (path.startsWith("/admin")) return esAdmin;

  // Usuario general
  if (
    path === routePaths.home ||
    path.startsWith("/partidos") ||
    path.startsWith("/equipos") ||
    path.startsWith("/comprar") ||
    path.startsWith("/mis-compras") ||
    path.startsWith("/mis-entradas") ||
    path.startsWith("/entradas") ||
    path.startsWith("/transferencias")
  ) {
    return esGeneral;
  }

  return false;
};

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const roles = await login(form.email.trim(), form.password);
      toast.success("Sesión iniciada");
      const fromLocation = location.state?.from;
      const from = fromLocation
        ? `${fromLocation.pathname}${fromLocation.search ?? ""}${fromLocation.hash ?? ""}`
        : null;

      const destino = puedeAcceder(from, rolesLogin)
        ? from
        : destinoPorRol(rolesLogin);

      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.detail || "Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={destinoPorRol(roles)} replace />;
  }

  return (
    <AuthShell title="Accedé a tus entradas" subtitle="Ingresá con tu cuenta UCU para gestionar tus entradas del Mundial 2026.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          icon={LuMail}
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.ucu.edu.uy"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <Input
          label="Contraseña"
          icon={LuLockKeyhole}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
          error={error}
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Iniciar sesión <LuArrowRight className="size-4" aria-hidden />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Todavía no tenés cuenta?{" "}
        <Link to={routePaths.registro} className="font-bold text-navy-900 hover:underline">
          Registrate
        </Link>
      </p>
    </AuthShell>
  );
}
