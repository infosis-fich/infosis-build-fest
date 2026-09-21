import { ErrorAplicacion } from "../../modulos/aplicacion/ErrorAplicacion";

export function respuestaJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function manejarError(error: unknown): Response {
  if (error instanceof ErrorAplicacion) {
    const estadosHttp = {
      ERROR_VALIDACION: 400,
      NO_ENCONTRADO: 404,
      CONFLICTO: 409,
      ERROR_PAGO: 502,
      ERROR_ESTUDIANTE: 422,
      SERVICIO_NO_DISPONIBLE: 503,
      ERROR_INTERNO: 500,
    } as const;
    return respuestaJson(
      { error: error.message, codigo: error.codigo },
      estadosHttp[error.codigo],
    );
  }
  console.error(error);
  return respuestaJson({ error: "Ocurrió un error interno." }, 500);
}
