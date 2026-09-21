import type { DatosConfirmacionPago, EstadoPago, Pago } from "./Pago";

export interface RegistroCrearPago {
  id: string;
  inscripcionId: string;
  pasarela: string;
  referenciaExterna: string;
  monto: number;
  moneda: string;
  datosConfirmacion?: DatosConfirmacionPago;
}

export interface RepositorioPagos {
  crear(entrada: RegistroCrearPago): Promise<Pago>;
  buscarPorId(id: string): Promise<Pago | null>;
  buscarPorInscripcionId(inscripcionId: string): Promise<Pago | null>;
  buscarPorReferenciaExterna(referenciaExterna: string): Promise<Pago | null>;
  actualizarEstado(
    id: string,
    estado: EstadoPago,
    pagadoEn?: string,
    datosConfirmacion?: DatosConfirmacionPago,
  ): Promise<Pago>;
}
