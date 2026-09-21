import { createHmac, timingSafeEqual } from "node:crypto";
import type { DatosEstudiante } from "../../dominio/estudiantes/ConsultaEstudiante";
import { ErrorAplicacion } from "../ErrorAplicacion";

interface CargaToken extends DatosEstudiante {
  expiraEn: number;
}

const DURACION_TOKEN_MS = 10 * 60 * 1000;

export class TokenVerificacionEstudiante {
  constructor(private readonly secreto: string) {}

  firmar(estudiante: DatosEstudiante): string {
    const carga: CargaToken = {
      ...estudiante,
      expiraEn: Date.now() + DURACION_TOKEN_MS,
    };
    const contenido = codificar(JSON.stringify(carga));
    return `${contenido}.${this.firma(contenido)}`;
  }

  verificar(token: string): DatosEstudiante {
    const [contenido, firma] = token.split(".");
    if (!contenido || !firma || !this.firmaValida(contenido, firma)) {
      throw new ErrorAplicacion(
        "ERROR_VALIDACION",
        "La verificación del estudiante no es válida o expiró.",
      );
    }

    try {
      const carga = JSON.parse(
        Buffer.from(contenido, "base64url").toString(),
      ) as CargaToken;
      if (
        !carga.expiraEn ||
        carga.expiraEn < Date.now() ||
        !carga.ci ||
        !carga.nombreCompleto ||
        !/^\d{9}$/.test(carga.registro)
      ) {
        throw new Error("Carga inválida");
      }
      return {
        ci: carga.ci,
        nombreCompleto: carga.nombreCompleto,
        registro: carga.registro,
      };
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      throw new ErrorAplicacion(
        "ERROR_VALIDACION",
        "La verificación del estudiante no es válida o expiró.",
        error,
      );
    }
  }

  private firma(contenido: string): string {
    return createHmac("sha256", this.secreto)
      .update(contenido)
      .digest("base64url");
  }

  private firmaValida(contenido: string, firma: string): boolean {
    const esperada = Buffer.from(this.firma(contenido));
    const recibida = Buffer.from(firma);
    return (
      esperada.length === recibida.length && timingSafeEqual(esperada, recibida)
    );
  }
}

function codificar(valor: string): string {
  return Buffer.from(valor).toString("base64url");
}
