import { CrearInscripcion } from "../aplicacion/inscripciones/CrearInscripcion";
import { ConsultarPago } from "../aplicacion/pagos/ConsultarPago";
import { CrearPago } from "../aplicacion/pagos/CrearPago";
import { ProcesarWebhookPago } from "../aplicacion/pagos/ProcesarWebhookPago";
import { VerificarEstudiante } from "../aplicacion/estudiantes/VerificarEstudiante";
import { TokenVerificacionEstudiante } from "../aplicacion/estudiantes/TokenVerificacionEstudiante";
import { ControladorInscripciones } from "../presentacion/ControladorInscripciones";
import { ControladorPagos } from "../presentacion/ControladorPagos";
import { ControladorEstudiantes } from "../presentacion/ControladorEstudiantes";
import { ValidadorAutenticacionBasica } from "./http/ValidadorAutenticacionBasica";
import { obtenerEntorno } from "./configuracion/entorno";
import { PasarelaVeripagos } from "./pagos/PasarelaVeripagos";
import { RepositorioPagosSupabase } from "./persistencia/RepositorioPagosSupabase";
import { RepositorioInscripcionesSupabase } from "./persistencia/RepositorioInscripcionesSupabase";
import { ClienteCajaUagrm } from "./estudiantes/ClienteCajaUagrm";

export function crearControladores() {
  const entorno = obtenerEntorno();
  const repositorioInscripciones = new RepositorioInscripcionesSupabase();
  const repositorioPagos = new RepositorioPagosSupabase();
  const pasarelaPagos = new PasarelaVeripagos({
    urlBase: entorno.urlBaseVeripagos,
    vigenciaQr: entorno.vigenciaQrVeripagos,
    claveSecreta: entorno.claveSecretaVeripagos,
    usuario: entorno.usuarioVeripagos,
    contrasena: entorno.contrasenaVeripagos,
  });
  const verificadorEstudiante = new VerificarEstudiante(
    new ClienteCajaUagrm({ urlBase: entorno.urlBaseCajaUagrm }),
  );
  const tokenVerificacion = new TokenVerificacionEstudiante(
    entorno.secretoVerificacionEstudiante,
  );

  const crearInscripcion = new CrearInscripcion(repositorioInscripciones);
  const crearPago = new CrearPago(
    pasarelaPagos,
    repositorioPagos,
    repositorioInscripciones,
  );
  const consultarPago = new ConsultarPago(
    pasarelaPagos,
    repositorioPagos,
    repositorioInscripciones,
  );
  const procesarWebhook = new ProcesarWebhookPago(
    repositorioPagos,
    repositorioInscripciones,
  );

  return {
    inscripciones: new ControladorInscripciones(
      crearInscripcion,
      tokenVerificacion,
    ),
    estudiantes: new ControladorEstudiantes(
      verificadorEstudiante,
      tokenVerificacion,
    ),
    pagos: new ControladorPagos(
      crearPago,
      consultarPago,
      procesarWebhook,
      new ValidadorAutenticacionBasica(
        entorno.usuarioVeripagos,
        entorno.contrasenaVeripagos,
      ),
    ),
  };
}
