import type { APIRoute } from "astro";
import { crearControladores } from "../../../../modulos/infraestructura/contenedor";
import { manejarError } from "../../../../compartido/http/respuestaApi";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    return await crearControladores().pagos.consultar(params.id);
  } catch (error) {
    return manejarError(error);
  }
};
