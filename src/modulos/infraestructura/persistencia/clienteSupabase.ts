import { createClient } from "@supabase/supabase-js";
import { obtenerEntorno } from "../configuracion/entorno";

export function crearClienteSupabase() {
  const entorno = obtenerEntorno();
  return createClient(entorno.urlSupabase, entorno.claveServicioSupabase, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
