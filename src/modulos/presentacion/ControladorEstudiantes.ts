import { z } from "astro/zod";
import type { VerificarEstudiante } from "../aplicacion/estudiantes/VerificarEstudiante";
import {
  manejarError,
  respuestaJson,
} from "../../compartido/http/respuestaApi";
import { esquemaVerificarEstudiante } from "./esquemas";
import { TokenVerificacionEstudiante } from "../aplicacion/estudiantes/TokenVerificacionEstudiante";
import type { RepositorioInscripciones } from "../dominio/inscripciones/RepositorioInscripciones";

export class ControladorEstudiantes {
  constructor(
    private readonly verificarEstudiante: VerificarEstudiante,
    private readonly tokenVerificacion: TokenVerificacionEstudiante,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async verificar(peticion: Request): Promise<Response> {
    try {
      const entrada = esquemaVerificarEstudiante.parse(await peticion.json());
      const estudiante = await this.verificarEstudiante.ejecutar(
        entrada.registroEstudiante,
      );
      const porRegistro =
        await this.repositorioInscripciones.buscarPorRegistroEstudiante(
          estudiante.registro,
        );
      const inscripcion =
        porRegistro ??
        (await this.repositorioInscripciones.buscarPorCi(estudiante.ci));
      return respuestaJson({
        ...estudiante,
        tokenVerificacion: this.tokenVerificacion.firmar(estudiante),
        yaRegistrada: inscripcion?.estado === "pagada",
        estadoInscripcion: inscripcion?.estado ?? null,
        entradaUrl:
          inscripcion?.estado === "pagada"
            ? `/entrada/${inscripcion.entradaToken}`
            : null,
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
