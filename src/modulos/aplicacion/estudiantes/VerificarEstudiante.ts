import { ErrorAplicacion } from "../ErrorAplicacion";
import type {
  ConsultaEstudiante,
  DatosEstudiante,
} from "../../dominio/estudiantes/ConsultaEstudiante";

export class VerificarEstudiante {
  constructor(private readonly consulta: ConsultaEstudiante) {}

  async ejecutar(registro: string): Promise<DatosEstudiante> {
    const registroNormalizado = registro.trim();
    if (!/^\d{9}$/.test(registroNormalizado)) {
      throw new ErrorAplicacion(
        "ERROR_VALIDACION",
        "El registro estudiantil debe tener exactamente 9 dígitos.",
      );
    }

    const estudiante = await this.consulta.consultar(registroNormalizado);
    if (estudiante.registro !== registroNormalizado) {
      throw new ErrorAplicacion(
        "ERROR_ESTUDIANTE",
        "El registro devuelto no coincide con el registro consultado.",
      );
    }

    return estudiante;
  }
}
