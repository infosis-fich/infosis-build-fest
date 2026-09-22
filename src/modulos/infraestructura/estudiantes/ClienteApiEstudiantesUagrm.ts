import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";
import type {
  ConsultaEstudiante,
  DatosEstudiante,
} from "../../dominio/estudiantes/ConsultaEstudiante";

interface ConfiguracionApiEstudiantesUagrm {
  urlBase: string;
  apiKey: string;
}

interface RespuestaEstudianteUagrm {
  registro?: unknown;
  apellidos_nombres?: unknown;
  documento_identidad?: unknown;
}

export class ClienteApiEstudiantesUagrm implements ConsultaEstudiante {
  constructor(
    private readonly configuracion: ConfiguracionApiEstudiantesUagrm,
  ) {}

  async consultar(registro: string): Promise<DatosEstudiante> {
    const url = new URL(
      `${registro}/`,
      `${this.configuracion.urlBase.replace(/\/+$/, "")}/`,
    );
    const respuesta = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        apikey: this.configuracion.apiKey,
      },
      signal: AbortSignal.timeout(10_000),
    });

    const contenido = await respuesta.text();
    const mensajeApi = extraerMensaje(contenido);

    if (respuesta.status === 404) {
      throw new ErrorAplicacion(
        "ERROR_ESTUDIANTE",
        "No se encontró un estudiante con ese número de registro.",
      );
    }

    if (respuesta.status === 400) {
      throw new ErrorAplicacion(
        "ERROR_VALIDACION",
        "El registro estudiantil no es válido.",
      );
    }

    if (
      respuesta.status === 500 &&
      /no se encuentra el estudiante|estudiante.*no.*encuentra/i.test(
        mensajeApi,
      )
    ) {
      throw new ErrorAplicacion(
        "ERROR_ESTUDIANTE",
        `No se encuentra el estudiante con registro: ${registro}.`,
      );
    }

    if (!respuesta.ok) {
      throw new ErrorAplicacion(
        "SERVICIO_NO_DISPONIBLE",
        "No se pudo consultar el registro estudiantil en este momento.",
      );
    }

    let datos: RespuestaEstudianteUagrm;
    try {
      datos = JSON.parse(contenido) as RespuestaEstudianteUagrm;
    } catch (error) {
      throw new ErrorAplicacion(
        "SERVICIO_NO_DISPONIBLE",
        "La API de estudiantes devolvió una respuesta inválida.",
        error,
      );
    }

    const registroDevuelto = stringValue(datos.registro);
    const nombreCompleto = stringValue(datos.apellidos_nombres);
    const ci = stringValue(datos.documento_identidad)?.split(" ")[0];

    if (!registroDevuelto || !nombreCompleto || !ci) {
      throw new ErrorAplicacion(
        "ERROR_ESTUDIANTE",
        "La API de estudiantes no devolvió datos completos.",
      );
    }

    return {
      registro: registroDevuelto,
      nombreCompleto,
      ci,
    };
  }
}

function extraerMensaje(contenido: string): string {
  try {
    const datos = JSON.parse(contenido) as Record<string, unknown>;
    for (const campo of ["message", "mensaje", "error", "detail"]) {
      if (typeof datos[campo] === "string") return datos[campo];
    }
  } catch {
    // La API también puede responder con texto plano.
  }

  return contenido.replace(/\s+/g, " ").trim();
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
