import type { Pago, EstadoPago } from "../../dominio/pagos/Pago";
import type {
  RegistroCrearPago,
  RepositorioPagos,
} from "../../dominio/pagos/RepositorioPagos";
import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";
import { crearClienteSupabase } from "./clienteSupabase";

interface PagoRow {
  id: string;
  inscripcion_id: string;
  pasarela: string;
  referencia_externa: string | null;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  datos_confirmacion: Record<string, unknown> | null;
  pagado_en: string | null;
}

export class RepositorioPagosSupabase implements RepositorioPagos {
  async crear(entrada: RegistroCrearPago): Promise<Pago> {
    const { data, error } = await crearClienteSupabase()
      .from("pagos")
      .insert({
        id: entrada.id,
        inscripcion_id: entrada.inscripcionId,
        pasarela: entrada.pasarela,
        referencia_externa: entrada.referenciaExterna,
        monto: entrada.monto,
        moneda: entrada.moneda,
        estado: "pendiente",
        datos_confirmacion: entrada.datosConfirmacion || null,
      })
      .select()
      .single();
    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo crear el pago.",
        error,
      );
    return this.map(data as PagoRow);
  }

  async buscarPorId(id: string): Promise<Pago | null> {
    const { data, error } = await crearClienteSupabase()
      .from("pagos")
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar el pago.",
        error,
      );
    return data ? this.map(data as PagoRow) : null;
  }

  async buscarPorInscripcionId(inscripcionId: string): Promise<Pago | null> {
    const { data, error } = await crearClienteSupabase()
      .from("pagos")
      .select()
      .eq("inscripcion_id", inscripcionId)
      .order("creado_en", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar el pago.",
        error,
      );
    return data ? this.map(data as PagoRow) : null;
  }

  async buscarPorReferenciaExterna(
    referenciaExterna: string,
  ): Promise<Pago | null> {
    const { data, error } = await crearClienteSupabase()
      .from("pagos")
      .select()
      .eq("referencia_externa", referenciaExterna)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar la referencia del pago.",
        error,
      );
    return data ? this.map(data as PagoRow) : null;
  }

  async actualizarEstado(
    id: string,
    estado: EstadoPago,
    pagadoEn?: string,
    datosConfirmacion?: Record<string, unknown>,
  ): Promise<Pago> {
    const { data, error } = await crearClienteSupabase()
      .from("pagos")
      .update({
        estado,
        ...(pagadoEn ? { pagado_en: pagadoEn } : {}),
        ...(datosConfirmacion ? { datos_confirmacion: datosConfirmacion } : {}),
      })
      .eq("id", id)
      .select()
      .single();
    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo actualizar el pago.",
        error,
      );
    return this.map(data as PagoRow);
  }

  private map(row: PagoRow): Pago {
    return {
      id: row.id,
      inscripcionId: row.inscripcion_id,
      pasarela: row.pasarela,
      referenciaExterna: row.referencia_externa,
      monto: row.monto,
      moneda: row.moneda,
      estado: row.estado,
      datosConfirmacion: row.datos_confirmacion,
      pagadoEn: row.pagado_en,
    };
  }
}
