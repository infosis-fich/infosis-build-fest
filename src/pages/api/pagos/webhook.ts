import type { APIRoute } from "astro";
import { crearControladores } from "../../../modulos/infraestructura/contenedor";
import { manejarError } from "../../../compartido/http/respuestaApi";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    return await crearControladores().pagos.webhook(request);
  } catch (error) {
    return manejarError(error);
  }
};
