import type { TipoParticipante } from "../pagos/PasarelaPago";

export type EstadoInscripcion = "pendiente_pago" | "pagada" | "cancelada";

export interface Inscripcion {
  id: string;
  entradaToken: string;
  nombreCompleto: string;
  ci: string;
  whatsapp: string;
  registroEstudiante: string | null;
  nombreCompletoVerificado: string | null;
  tipoParticipante: TipoParticipante;
  llevaLaptop: boolean;
  montoInscripcion: number;
  estado: EstadoInscripcion;
  creadoEn: string;
  actualizadoEn: string;
}

export interface EntradaCrearInscripcion {
  nombreCompleto: string;
  ci: string;
  whatsapp: string;
  tipoParticipante: TipoParticipante;
  llevaLaptop: boolean;
  registroEstudiante?: string;
}
