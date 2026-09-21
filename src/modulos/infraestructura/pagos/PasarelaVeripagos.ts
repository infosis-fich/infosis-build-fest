import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";
import type {
  EntradaGenerarQr,
  QrGenerado,
  PasarelaPago,
  ResultadoEstadoPago,
} from "../../dominio/pagos/PasarelaPago";

interface ConfiguracionVeripagos {
  urlBase: string;
  vigenciaQr: string;
  claveSecreta: string;
  usuario: string;
  contrasena: string;
}

interface RespuestaGenerarQr {
  Codigo: number;
  Data: { movimiento_id: number; qr: string } | null;
  Mensaje: string;
}

interface RespuestaConsultarEstado {
  Codigo: number;
  Data: {
    movimiento_id: number;
    monto: number;
    estado: string;
    remitente?: {
      nombre?: string;
      banco?: string;
      documento?: string;
      cuenta?: string;
    };
  } | null;
  Mensaje: string;
}

export interface CargaUtilWebhookVeripagos {
  movimiento_id: number;
  monto: number;
  estado: string;
}

export class PasarelaVeripagos implements PasarelaPago {
  constructor(private readonly configuracion: ConfiguracionVeripagos) {}

  async generarQr(entrada: EntradaGenerarQr): Promise<QrGenerado> {
    const respuesta = await this.solicitar<RespuestaGenerarQr>("/generar-qr", {
      secret_key: this.configuracion.claveSecreta,
      monto: entrada.monto,
      data: [
        {
          inscripcionId: entrada.inscripcionId,
          pagoId: entrada.pagoId,
          referencia: entrada.referencia,
        },
      ],
      uso_unico: true,
      vigencia: this.configuracion.vigenciaQr,
      detalle: entrada.detalle,
    });

    if (respuesta.Codigo !== 0 || !respuesta.Data) {
      throw new ErrorAplicacion(
        "ERROR_PAGO",
        respuesta.Mensaje || "Veripagos no pudo generar el QR.",
      );
    }

    return {
      referenciaExterna: String(respuesta.Data.movimiento_id),
      contenidoQr: respuesta.Data.qr,
      monto: entrada.monto,
    };
  }

  async obtenerEstado(referenciaExterna: string): Promise<ResultadoEstadoPago> {
    const respuesta = await this.solicitar<RespuestaConsultarEstado>(
      "/verificar-estado-qr",
      {
        secret_key: this.configuracion.claveSecreta,
        movimiento_id: referenciaExterna,
      },
    );

    if (respuesta.Codigo !== 0 || !respuesta.Data) {
      throw new ErrorAplicacion(
        "ERROR_PAGO",
        respuesta.Mensaje || "Veripagos no pudo consultar el estado.",
      );
    }

    return {
      referenciaExterna,
      monto: respuesta.Data.monto,
      estado: normalizarEstado(respuesta.Data.estado),
      datosConfirmacion: normalizarRemitente(respuesta.Data.remitente),
    };
  }

  private async solicitar<T>(ruta: string, cuerpo: object): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(
        `${this.configuracion.urlBase.replace(/\/$/, "")}${ruta}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${this.configuracion.usuario}:${this.configuracion.contrasena}`)}`,
          },
          body: JSON.stringify(cuerpo),
          signal: controller.signal,
        },
      );

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new ErrorAplicacion(
          "ERROR_PAGO",
          `Respuesta inválida de Veripagos (HTTP ${response.status}).`,
        );
      }
      const result = (await response.json()) as T;
      if (!response.ok)
        throw new ErrorAplicacion(
          "ERROR_PAGO",
          `Veripagos respondió HTTP ${response.status}.`,
        );
      return result;
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      throw new ErrorAplicacion(
        "ERROR_PAGO",
        "No se pudo conectar con Veripagos.",
        error,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

function normalizarRemitente(
  remitente: NonNullable<RespuestaConsultarEstado["Data"]>["remitente"],
): Record<string, unknown> | undefined {
  if (!remitente) return undefined;
  const datos = {
    pagador: remitente.nombre,
    banco: remitente.banco,
    documento: remitente.documento,
    cuenta: remitente.cuenta,
  };
  return Object.fromEntries(
    Object.entries(datos).filter(([, valor]) => valor !== undefined),
  );
}

function normalizarEstado(
  value: string,
): "pendiente" | "completado" | "fallido" {
  const normalized = value.toLowerCase();
  if (
    normalized === "completado" ||
    normalized === "completed" ||
    normalized === "pagado"
  )
    return "completado";
  if (
    normalized === "fallido" ||
    normalized === "failed" ||
    normalized === "cancelado"
  )
    return "fallido";
  return "pendiente";
}
