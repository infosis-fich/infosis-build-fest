import type {
  EntradaCrearInscripcion,
  EstadoInscripcion,
  Inscripcion,
} from "./Inscripcion";

export interface RepositorioInscripciones {
  crear(
    entrada: EntradaCrearInscripcion & {
      montoInscripcion: number;
      nombreCompletoVerificado?: string;
    },
  ): Promise<Inscripcion>;
  buscarPorId(id: string): Promise<Inscripcion | null>;
  buscarPorCi(ci: string): Promise<Inscripcion | null>;
  buscarPorRegistroEstudiante(registro: string): Promise<Inscripcion | null>;
  buscarPorEntradaToken(token: string): Promise<Inscripcion | null>;
  actualizarComoEstudiante(
    id: string,
    datos: {
      ci: string;
      nombreCompleto: string;
      registroEstudiante: string;
      nombreCompletoVerificado: string;
      montoInscripcion: number;
    },
  ): Promise<Inscripcion>;
  actualizarComoGeneral(
    id: string,
    datos: {
      ci: string;
      nombreCompleto: string;
      montoInscripcion: number;
    },
  ): Promise<Inscripcion>;
  actualizarEstado(id: string, estado: EstadoInscripcion): Promise<Inscripcion>;
}
