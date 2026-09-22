import { z } from "astro/zod";
import type { CrearPago } from "../aplicacion/pagos/CrearPago";
import type { ConsultarPago } from "../aplicacion/pagos/ConsultarPago";
import type { ProcesarWebhookPago } from "../aplicacion/pagos/ProcesarWebhookPago";
import type { ValidadorAutenticacionBasica } from "../infraestructura/http/ValidadorAutenticacionBasica";
import {
  manejarError,
  respuestaJson,
} from "../../compartido/http/respuestaApi";
import { esquemaCrearPago, esquemaWebhook } from "./esquemas";
import type { RepositorioInscripciones } from "../dominio/inscripciones/RepositorioInscripciones";

export class ControladorPagos {
  constructor(
    private readonly crearPago: CrearPago,
    private readonly consultarPago: ConsultarPago,
    private readonly procesarWebhook: ProcesarWebhookPago,
    private readonly validadorAutenticacion: ValidadorAutenticacionBasica,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async crear(peticion: Request): Promise<Response> {
    try {
      const entrada = esquemaCrearPago.parse(await peticion.json());
      const resultado = await this.crearPago.ejecutar(entrada.inscripcionId);
      return respuestaJson(
        {
          pagoId: resultado.pago.id,
          estado: resultado.pago.estado,
          monto: resultado.pago.monto,
          moneda: resultado.pago.moneda,
          qr: resultado.urlDatosQr,
        },
        201,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return respuestaJson({ error: "La inscripción no es válida." }, 400);
      }
      return manejarError(error);
    }
  }

  async consultar(idPago: string | undefined): Promise<Response> {
    try {
      if (!idPago)
        return respuestaJson(
          { error: "Falta el identificador del pago." },
          400,
        );
      const pago = await this.consultarPago.ejecutar(idPago);
      const inscripcion = await this.repositorioInscripciones.buscarPorId(
        pago.inscripcionId,
      );
      return respuestaJson({
        pagoId: pago.id,
        estado: pago.estado,
        monto: pago.monto,
        moneda: pago.moneda,
        pagadoEn: pago.pagadoEn,
        entradaUrl:
          pago.estado === "pagado" && inscripcion
            ? `/entrada/${inscripcion.entradaToken}`
            : null,
      });
    } catch (error) {
      return manejarError(error);
    }
  }

  async webhook(peticion: Request): Promise<Response> {
    if (
      !this.validadorAutenticacion.esValida(
        peticion.headers.get("authorization"),
      )
    ) {
      return new Response("No autorizado", {
        status: 401,
        headers: { "WWW-Authenticate": "Basic realm=veripagos" },
      });
    }

    try {
      const carga = esquemaWebhook.parse(await peticion.json());
      const estadoNormalizado = carga.estado.toLowerCase();
      const estado =
        estadoNormalizado === "completado" ||
        estadoNormalizado === "completed" ||
        estadoNormalizado === "pagado"
          ? "completado"
          : estadoNormalizado === "fallido" ||
              estadoNormalizado === "failed" ||
              estadoNormalizado === "cancelado"
            ? "fallido"
            : "pendiente";
      const pago = await this.procesarWebhook.ejecutar({
        referenciaExterna: String(carga.movimiento_id),
        monto: carga.monto,
        estado,
        datosConfirmacion: Object.fromEntries(
          Object.entries({
            pagador:
              carga.remitente?.nombre || carga.pagador || carga.nombre_pagador,
            documento: carga.remitente?.documento || carga.documento,
            banco: carga.remitente?.banco || carga.banco,
            cuenta: carga.remitente?.cuenta,
            fechaTransaccion: carga.fecha_transaccion,
            metodo: carga.metodo,
          }).filter(([, valor]) => valor !== undefined),
        ),
      });
      return respuestaJson({ recibido: true, pagoId: pago.id });
    } catch (error) {
      if (error instanceof z.ZodError)
        return respuestaJson({ error: "Webhook inválido." }, 400);
      return manejarError(error);
    }
  }
}
