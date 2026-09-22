import { z } from "astro/zod";
import type { CrearInscripcion } from "../aplicacion/inscripciones/CrearInscripcion";
import {
  manejarError,
  respuestaJson,
} from "../../compartido/http/respuestaApi";
import { esquemaInscripcion, esquemaVerificarCi } from "./esquemas";
import { TokenVerificacionEstudiante } from "../aplicacion/estudiantes/TokenVerificacionEstudiante";
import { ErrorAplicacion } from "../aplicacion/ErrorAplicacion";
import type { RepositorioInscripciones } from "../dominio/inscripciones/RepositorioInscripciones";
import type { Inscripcion } from "../dominio/inscripciones/Inscripcion";

export class ControladorInscripciones {
  constructor(
    private readonly crearInscripcion: CrearInscripcion,
    private readonly tokenVerificacion: TokenVerificacionEstudiante,
    private readonly repositorioInscripciones: RepositorioInscripciones,
  ) {}

  async listar(): Promise<Inscripcion[]> {
    return this.repositorioInscripciones.listarTodas();
  }

  async verificarCi(peticion: Request): Promise<Response> {
    try {
      const entrada = esquemaVerificarCi.parse(await peticion.json());
      const inscripcion = await this.repositorioInscripciones.buscarPorCi(
        entrada.ci,
      );

      return respuestaJson({
        yaRegistrada: inscripcion?.estado === "pagada",
        estadoInscripcion: inscripcion?.estado ?? null,
        nombreCompleto: inscripcion?.nombreCompleto ?? null,
        entradaUrl:
          inscripcion?.estado === "pagada"
            ? `/entrada/${inscripcion.entradaToken}`
            : null,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return respuestaJson(
          { error: "La cédula de identidad no es válida." },
          400,
        );
      }
      return manejarError(error);
    }
  }

  async crear(peticion: Request): Promise<Response> {
    try {
      const cuerpo = await peticion.json();
      const entrada = esquemaInscripcion.parse({
        ...cuerpo,
        registroEstudiante:
          cuerpo.tipoParticipante === "general"
            ? undefined
            : cuerpo.registroEstudiante,
        tokenVerificacion:
          cuerpo.tipoParticipante === "general"
            ? undefined
            : cuerpo.tokenVerificacion,
        llevaLaptop:
          cuerpo.llevaLaptop === true || cuerpo.llevaLaptop === "true",
      });
      const { tokenVerificacion, ...datosEntrada } = entrada;
      const estudianteVerificado =
        datosEntrada.tipoParticipante === "estudiante"
          ? tokenVerificacion
            ? this.tokenVerificacion.verificar(tokenVerificacion)
            : undefined
          : undefined;
      if (
        estudianteVerificado &&
        (datosEntrada.ci !== estudianteVerificado.ci ||
          datosEntrada.nombreCompleto !== estudianteVerificado.nombreCompleto)
      ) {
        throw new ErrorAplicacion(
          "ERROR_VALIDACION",
          "Los datos del estudiante no coinciden con la verificación.",
        );
      }
      const resultado = await this.crearInscripcion.ejecutar(
        datosEntrada,
        estudianteVerificado,
      );
      const { inscripcion } = resultado;
      const yaRegistrada = inscripcion.estado === "pagada";

      return respuestaJson(
        {
          inscripcionId: inscripcion.id,
          estado: inscripcion.estado,
          monto: inscripcion.montoInscripcion,
          moneda: "BOB",
          existente: resultado.existente,
          yaRegistrada,
          entradaUrl: yaRegistrada
            ? `/entrada/${inscripcion.entradaToken}`
            : null,
          estadoRegistro: yaRegistrada
            ? "ya_pagado"
            : resultado.existente
              ? "existente_pendiente"
              : "nuevo",
          mensaje: yaRegistrada
            ? "Ya te encuentras registrado para la Infosis Build Fest."
            : resultado.existente
              ? "Ya tienes una inscripción pendiente. Generaremos un nuevo QR para completar tu pago."
              : undefined,
        },
        resultado.existente ? 200 : 201,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return respuestaJson(
          {
            error: "Los datos de inscripción no son válidos.",
            problemas: error.issues,
          },
          400,
        );
      }
      return manejarError(error);
    }
  }
}
