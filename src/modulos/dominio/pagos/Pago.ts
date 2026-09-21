export type EstadoPago = "pendiente" | "pagado" | "fallido" | "cancelado";
export type DatosConfirmacionPago = Record<string, unknown>;

export interface Pago {
  id: string;
  inscripcionId: string;
  pasarela: string;
  referenciaExterna: string | null;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  datosConfirmacion: DatosConfirmacionPago | null;
  pagadoEn: string | null;
}
