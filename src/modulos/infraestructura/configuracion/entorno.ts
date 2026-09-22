import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";

function required(_name: string, value: string | undefined): string {
  if (!value) {
    throw new ErrorAplicacion(
      "SERVICIO_NO_DISPONIBLE",
      "El servicio no está disponible temporalmente.",
    );
  }
  return value;
}

export function obtenerEntorno() {
  return {
    urlBaseEstudiantesUagrm: required(
      "UAGRM_ESTUDIANTES_API_URL",
      import.meta.env.UAGRM_ESTUDIANTES_API_URL,
    ),
    apiKeyEstudiantesUagrm: required(
      "UAGRM_ESTUDIANTES_API_KEY",
      import.meta.env.UAGRM_ESTUDIANTES_API_KEY,
    ),
    urlSupabase: required("SUPABASE_URL", import.meta.env.SUPABASE_URL),
    claveServicioSupabase: required(
      "SUPABASE_SERVICE_ROLE_KEY",
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    urlBaseVeripagos: required(
      "VERIPAGOS_BASE_URL",
      import.meta.env.VERIPAGOS_BASE_URL,
    ),
    vigenciaQrVeripagos: required(
      "VERIPAGOS_VIGENCIA_QR",
      import.meta.env.VERIPAGOS_VIGENCIA_QR,
    ),
    secretoVerificacionEstudiante: required(
      "VERIFICACION_ESTUDIANTE_SECRET",
      import.meta.env.VERIFICACION_ESTUDIANTE_SECRET,
    ),
    claveSecretaVeripagos: required(
      "VERIPAGOS_SECRET_KEY",
      import.meta.env.VERIPAGOS_SECRET_KEY,
    ),
    usuarioVeripagos: required(
      "VERIPAGOS_USERNAME",
      import.meta.env.VERIPAGOS_USERNAME,
    ),
    contrasenaVeripagos: required(
      "VERIPAGOS_PASSWORD",
      import.meta.env.VERIPAGOS_PASSWORD,
    ),
  };
}
