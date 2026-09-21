export type CodigoErrorAplicacion =
  | "ERROR_VALIDACION"
  | "NO_ENCONTRADO"
  | "CONFLICTO"
  | "ERROR_PAGO"
  | "ERROR_ESTUDIANTE"
  | "SERVICIO_NO_DISPONIBLE"
  | "ERROR_INTERNO";

export class ErrorAplicacion extends Error {
  constructor(
    public readonly codigo: CodigoErrorAplicacion,
    mensaje: string,
    public readonly causa?: unknown,
  ) {
    super(mensaje);
    this.name = "ErrorAplicacion";
  }
}
