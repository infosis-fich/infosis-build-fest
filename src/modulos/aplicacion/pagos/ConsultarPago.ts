import type { PasarelaPago } from "../../dominio/pagos/PasarelaPago";
import type { RepositorioPagos } from "../../dominio/pagos/RepositorioPagos";
import type { RepositorioInscripciones } from "../../dominio/inscripciones/RepositorioInscripciones";
import { ErrorAplicacion } from "../ErrorAplicacion";

export class ConsultarPago {
  constructor(
    private readonly pasarela: PasarelaPago,
    private readonly repositorioPagos: RepositorioPagos,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async ejecutar(pagoId: string) {
    const pago = await this.repositorioPagos.buscarPorId(pagoId);
    if (!pago) throw new ErrorAplicacion("NO_ENCONTRADO", "El pago no existe.");
    if (!pago.referenciaExterna) {
      throw new ErrorAplicacion(
        "ERROR_PAGO",
        "El pago no tiene referencia externa.",
      );
    }

    if (pago.estado === "pagado") return pago;

    const estadoProveedor = await this.pasarela.obtenerEstado(
      pago.referenciaExterna,
    );
    if (estadoProveedor.monto !== pago.monto) {
      throw new ErrorAplicacion("ERROR_PAGO", "El monto del pago no coincide.");
    }

    if (estadoProveedor.estado === "completado") {
      const actualizado = await this.repositorioPagos.actualizarEstado(
        pago.id,
        "pagado",
        new Date().toISOString(),
        estadoProveedor.datosConfirmacion,
      );
      await this.repositorioInscripciones.actualizarEstado(
        pago.inscripcionId,
        "pagada",
      );
      return actualizado;
    }

    return pago;
  }
}
