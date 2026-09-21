import * as cheerio from "cheerio";
import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";
import type {
  ConsultaEstudiante,
  DatosEstudiante,
} from "../../dominio/estudiantes/ConsultaEstudiante";

interface ConfiguracionCajaUagrm {
  urlBase: string;
}

export class ClienteCajaUagrm implements ConsultaEstudiante {
  constructor(private readonly configuracion: ConfiguracionCajaUagrm) {}

  async consultar(registro: string): Promise<DatosEstudiante> {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), 10_000);
    const url = new URL("/Home/buscar_pagos", this.configuracion.urlBase);
    url.searchParams.set("codigo", registro);
    url.searchParams.set("tipo", "1");

    try {
      const respuesta = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/html, */*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "InfosisBuildFest/1.0",
        },
        signal: controlador.signal,
      });

      if (!respuesta.ok) {
        throw new ErrorAplicacion(
          "SERVICIO_NO_DISPONIBLE",
          "No se pudo consultar el registro estudiantil.",
        );
      }

      const html = await respuesta.text();
      if (html.toLowerCase().includes("el estudiante no existe")) {
        throw new ErrorAplicacion(
          "ERROR_ESTUDIANTE",
          "No se encontró un estudiante con ese número de registro.",
        );
      }

      const estudiante = this.extraerDatos(html);
      if (!estudiante) {
        throw new ErrorAplicacion(
          "ERROR_ESTUDIANTE",
          "La respuesta de la universidad no contiene datos válidos del estudiante.",
        );
      }

      return estudiante;
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      throw new ErrorAplicacion(
        "SERVICIO_NO_DISPONIBLE",
        "No se pudo conectar con el servicio de estudiantes de la UAGRM.",
        error,
      );
    } finally {
      clearTimeout(temporizador);
    }
  }

  private extraerDatos(html: string): DatosEstudiante | null {
    const $ = cheerio.load(html);
    const datos = new Map<string, string>();

    $("dl dt").each((_, elemento) => {
      const etiqueta = normalizar($(elemento).text());
      const valor = $(elemento).next("dd").text().replace(/\s+/g, " ").trim();
      if (etiqueta && valor) datos.set(etiqueta, valor);
    });

    const ci = datos.get("cedula de identidad")?.match(/\d+/)?.[0];
    const nombreCompleto = datos.get("nombre");
    const registro = datos.get("registro")?.match(/\d{9}/)?.[0];

    if (!ci || !nombreCompleto || !registro) return null;

    return {
      ci,
      nombreCompleto,
      registro,
    };
  }
}

function normalizar(valor: string): string {
  return valor
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
