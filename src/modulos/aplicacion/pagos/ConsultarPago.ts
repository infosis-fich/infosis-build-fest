import type { RepositorioPagos } from "../../dominio/pagos/RepositorioPagos";
import { ErrorAplicacion } from "../ErrorAplicacion";

export class ConsultarPago {
  constructor(private readonly repositorioPagos: RepositorioPagos) {}

  async ejecutar(pagoId: string) {
    const pago = await this.repositorioPagos.buscarPorId(pagoId);
    if (!pago) throw new ErrorAplicacion("NO_ENCONTRADO", "El pago no existe.");

    return pago;
  }
}
