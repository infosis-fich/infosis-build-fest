import { z } from "astro/zod";
import type { VerificarEstudiante } from "../aplicacion/estudiantes/VerificarEstudiante";
import {
  manejarError,
  respuestaJson,
} from "../../compartido/http/respuestaApi";
import { esquemaVerificarEstudiante } from "./esquemas";
import { TokenVerificacionEstudiante } from "../aplicacion/estudiantes/TokenVerificacionEstudiante";

export class ControladorEstudiantes {
  constructor(
    private readonly verificarEstudiante: VerificarEstudiante,
    private readonly tokenVerificacion: TokenVerificacionEstudiante,
  ) {}

  async verificar(peticion: Request): Promise<Response> {
    try {
      const entrada = esquemaVerificarEstudiante.parse(await peticion.json());
      const estudiante = await this.verificarEstudiante.ejecutar(
        entrada.registroEstudiante,
      );
      return respuestaJson({
        ...estudiante,
        tokenVerificacion: this.tokenVerificacion.firmar(estudiante),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return respuestaJson(
          {
            error: "El registro estudiantil debe tener 9 dígitos.",
            problemas: error.issues,
          },
          400,
        );
      }
      return manejarError(error);
    }
  }
}
