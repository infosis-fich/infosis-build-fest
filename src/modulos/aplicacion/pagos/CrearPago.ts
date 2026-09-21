import { randomUUID } from "node:crypto";
import type { PasarelaPago } from "../../dominio/pagos/PasarelaPago";
import type { RepositorioPagos } from "../../dominio/pagos/RepositorioPagos";
import type { RepositorioInscripciones } from "../../dominio/inscripciones/RepositorioInscripciones";
import { ErrorAplicacion } from "../ErrorAplicacion";

export class CrearPago {
  constructor(
    private readonly pasarela: PasarelaPago,
    private readonly repositorioPagos: RepositorioPagos,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async ejecutar(inscripcionId: string) {
    const inscripcion =
      await this.repositorioInscripciones.buscarPorId(inscripcionId);
    if (!inscripcion) {
      throw new ErrorAplicacion("NO_ENCONTRADO", "La inscripción no existe.");
    }
    if (inscripcion.estado === "pagada") {
      throw new ErrorAplicacion(
        "CONFLICTO",
        "Ya te encuentras registrado para la Infosis Build Fest.",
      );
    }

    const existente =
      await this.repositorioPagos.buscarPorInscripcionId(inscripcionId);
    if (existente?.estado === "pendiente") {
      await this.repositorioPagos.actualizarEstado(existente.id, "cancelado");
    }

    const pagoId = randomUUID();
    const qr = await this.pasarela.generarQr({
      monto: inscripcion.montoInscripcion,
      referencia: inscripcion.id,
      inscripcionId: inscripcion.id,
      pagoId,
      detalle: `- IBF26-${pagoId.slice(0, 8).toUpperCase()}`,
    });

    const pago = await this.repositorioPagos.crear({
      id: pagoId,
      inscripcionId,
      pasarela: "veripagos",
      referenciaExterna: qr.referenciaExterna,
      monto: qr.monto,
      moneda: "BOB",
    });

    return { pago, urlDatosQr: convertirAUrlDatosQr(qr.contenidoQr) };
  }
}

function convertirAUrlDatosQr(valor: string): string {
  return valor.startsWith("data:") ? valor : `data:image/png;base64,${valor}`;
}
