export type TipoParticipante = "estudiante" | "general";

export interface EntradaGenerarQr {
  monto: number;
  referencia: string;
  inscripcionId: string;
  pagoId: string;
  detalle: string;
}

export interface QrGenerado {
  referenciaExterna: string;
  contenidoQr: string;
  monto: number;
}

export type EstadoPagoProveedor = "pendiente" | "completado" | "fallido";

export interface ResultadoEstadoPago {
  referenciaExterna: string;
  estado: EstadoPagoProveedor;
  monto: number;
  datosConfirmacion?: Record<string, unknown>;
}

export interface PasarelaPago {
  generarQr(entrada: EntradaGenerarQr): Promise<QrGenerado>;
  obtenerEstado(referenciaExterna: string): Promise<ResultadoEstadoPago>;
}
