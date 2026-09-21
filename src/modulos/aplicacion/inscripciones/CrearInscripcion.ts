import type {
  EntradaCrearInscripcion,
  Inscripcion,
} from "../../dominio/inscripciones/Inscripcion";
import type { RepositorioInscripciones } from "../../dominio/inscripciones/RepositorioInscripciones";
import type { DatosEstudiante } from "../../dominio/estudiantes/ConsultaEstudiante";
import { ErrorAplicacion } from "../ErrorAplicacion";

const PRECIOS = {
  estudiante: 30,
  general: 50,
} as const;

export class CrearInscripcion {
  constructor(private readonly repositorio: RepositorioInscripciones) {}

  async ejecutar(
    entrada: EntradaCrearInscripcion,
    estudianteVerificado?: DatosEstudiante,
  ): Promise<{
    inscripcion: Inscripcion;
    existente: boolean;
  }> {
    if (entrada.tipoParticipante === "estudiante") {
      if (!entrada.registroEstudiante) {
        throw new ErrorAplicacion(
          "ERROR_VALIDACION",
          "El registro estudiantil es obligatorio para estudiantes.",
        );
      }

      if (!estudianteVerificado) {
        throw new ErrorAplicacion(
          "ERROR_VALIDACION",
          "La identidad del estudiante debe verificarse antes de inscribirse.",
        );
      }
      if (estudianteVerificado.registro !== entrada.registroEstudiante) {
        throw new ErrorAplicacion(
          "ERROR_VALIDACION",
          "El registro verificado no coincide con la inscripción.",
        );
      }

      const existentePorRegistro =
        await this.repositorio.buscarPorRegistroEstudiante(
          entrada.registroEstudiante,
        );
      if (existentePorRegistro) {
        return { inscripcion: existentePorRegistro, existente: true };
      }

      const existentePorCi = await this.repositorio.buscarPorCi(
        estudianteVerificado.ci,
      );
      if (existentePorCi) {
        if (existentePorCi.tipoParticipante === "general") {
          if (existentePorCi.estado === "pagada") {
            return { inscripcion: existentePorCi, existente: true };
          }
          const actualizada = await this.repositorio.actualizarComoEstudiante(
            existentePorCi.id,
            {
              ci: estudianteVerificado.ci,
              nombreCompleto: estudianteVerificado.nombreCompleto,
              registroEstudiante: estudianteVerificado.registro,
              nombreCompletoVerificado: estudianteVerificado.nombreCompleto,
              montoInscripcion: PRECIOS.estudiante,
            },
          );
          return { inscripcion: actualizada, existente: true };
        }
        return { inscripcion: existentePorCi, existente: true };
      }

      return {
        inscripcion: await this.repositorio.crear({
          ...entrada,
          nombreCompleto: estudianteVerificado.nombreCompleto,
          montoInscripcion: PRECIOS.estudiante,
          ci: estudianteVerificado.ci,
          nombreCompletoVerificado: estudianteVerificado.nombreCompleto,
        }),
        existente: false,
      };
    }

    const existente = await this.repositorio.buscarPorCi(entrada.ci);
    if (existente) {
      if (existente.tipoParticipante === "general") {
        return { inscripcion: existente, existente: true };
      }
      if (existente.estado !== "pagada") {
        const actualizada = await this.repositorio.actualizarComoGeneral(
          existente.id,
          {
            ci: entrada.ci,
            nombreCompleto: entrada.nombreCompleto,
            montoInscripcion: PRECIOS.general,
          },
        );
        return { inscripcion: actualizada, existente: true };
      }
      return { inscripcion: existente, existente: true };
    }

    return {
      inscripcion: await this.repositorio.crear({
        ...entrada,
        montoInscripcion: PRECIOS[entrada.tipoParticipante],
      }),
      existente: false,
    };
  }
}
