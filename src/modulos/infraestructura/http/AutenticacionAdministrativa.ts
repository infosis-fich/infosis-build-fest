import { createHmac, timingSafeEqual } from "node:crypto";

const nombreCookie = "infosis_admin_session";
const duracionSesion = 60 * 60 * 8;

function obtenerConfiguracion() {
  const usuario = import.meta.env.ADMIN_USERNAME;
  const contrasena = import.meta.env.ADMIN_PASSWORD;
  const secreto = import.meta.env.ADMIN_SESSION_SECRET;

  if (!usuario || !contrasena || !secreto) {
    throw new Error(
      "Faltan ADMIN_USERNAME, ADMIN_PASSWORD o ADMIN_SESSION_SECRET.",
    );
  }

  return { usuario, contrasena, secreto };
}

function sonIguales(actual: string, esperado: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const esperadoBuffer = Buffer.from(esperado);
  return (
    actualBuffer.length === esperadoBuffer.length &&
    timingSafeEqual(actualBuffer, esperadoBuffer)
  );
}

function firmar(payload: string, secreto: string): string {
  return createHmac("sha256", secreto).update(payload).digest("base64url");
}

export function credencialesAdministrativasValidas(
  usuario: string,
  contrasena: string,
): boolean {
  const configuracion = obtenerConfiguracion();
  return (
    sonIguales(usuario, configuracion.usuario) &&
    sonIguales(contrasena, configuracion.contrasena)
  );
}

export function crearCookieSesion(): string {
  const { secreto } = obtenerConfiguracion();
  const payload = String(Date.now());
  return `${payload}.${firmar(payload, secreto)}`;
}

export function sesionAdministrativaValida(request: Request): boolean {
  const { secreto } = obtenerConfiguracion();
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((parte) => parte.trim())
    .find((parte) => parte.startsWith(`${nombreCookie}=`))
    ?.slice(nombreCookie.length + 1);

  if (!cookie) return false;

  const [payload, firma] = cookie.split(".");
  if (!payload || !firma) return false;

  const fecha = Number(payload);
  const ahora = Date.now();
  if (
    !Number.isFinite(fecha) ||
    ahora - fecha < 0 ||
    ahora - fecha > duracionSesion * 1000
  ) {
    return false;
  }

  return sonIguales(firma, firmar(payload, secreto));
}

export function configuracionCookieSesion() {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax" as const,
    path: "/",
    maxAge: duracionSesion,
  };
}

export { nombreCookie };
