import type { RepositorioPagos } from "../../dominio/pagos/RepositorioPagos";
import type { RepositorioInscripciones } from "../../dominio/inscripciones/RepositorioInscripciones";
import { ErrorAplicacion } from "../ErrorAplicacion";
import type { DatosConfirmacionPago } from "../../dominio/pagos/Pago";

export interface EventoWebhookPago {
  referenciaExterna: string;
  monto: number;
  estado: "completado" | "pendiente" | "fallido";
  datosConfirmacion?: DatosConfirmacionPago;
}

export class ProcesarWebhookPago {
  constructor(
    private readonly repositorioPagos: RepositorioPagos,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async ejecutar(evento: EventoWebhookPago) {
    const pago = await this.repositorioPagos.buscarPorReferenciaExterna(
      evento.referenciaExterna,
    );
    if (!pago)
      throw new ErrorAplicacion("NO_ENCONTRADO", "El pago asociado no existe.");
    if (pago.monto !== evento.monto) {
      throw new ErrorAplicacion(
        "ERROR_PAGO",
        "El monto del webhook no coincide.",
      );
    }
    if (pago.estado === "pagado") return pago;

    const estado =
      evento.estado === "completado"
        ? "pagado"
        : evento.estado === "fallido"
          ? "fallido"
          : "pendiente";
    const pagoActualizado = await this.repositorioPagos.actualizarEstado(
      pago.id,
      estado,
      estado === "pagado" ? new Date().toISOString() : undefined,
      evento.datosConfirmacion,
    );

    if (estado === "pagado") {
      await this.repositorioInscripciones.actualizarEstado(
        pago.inscripcionId,
        "pagada",
      );
    }

    return pagoActualizado;
  }
}
