import type { TipoParticipante } from "../pagos/PasarelaPago";

export type EstadoInscripcion = "pendiente_pago" | "pagada" | "cancelada";

export interface Inscripcion {
  id: string;
  nombreCompleto: string;
  ci: string;
  whatsapp: string;
  registroEstudiante: string | null;
  nombreCompletoVerificado: string | null;
  tipoParticipante: TipoParticipante;
  llevaLaptop: boolean;
  montoInscripcion: number;
  estado: EstadoInscripcion;
}

export interface EntradaCrearInscripcion {
  nombreCompleto: string;
  ci: string;
  whatsapp: string;
  tipoParticipante: TipoParticipante;
  llevaLaptop: boolean;
  registroEstudiante?: string;
}
