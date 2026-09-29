const CLAVE_INICIALIZACION = "__infosisNavegacionInicializada";

type VentanaConEstado = Window & {
  [CLAVE_INICIALIZACION]?: boolean;
};

type EstadoInscripcion =
  | "antes_del_evento"
  | "inscripciones_cerradas"
  | "en_curso"
  | "finalizado";

function obtenerEstadoInscripcion(): EstadoInscripcion | null {
  const contador = document.querySelector<HTMLElement>("[data-countdown]");
  if (
    !contador?.dataset.inicio ||
    !contador.dataset.fin ||
    !contador.dataset.cierreInscripciones
  )
    return null;

  const ahora = Date.now();
  const inicio = new Date(contador.dataset.inicio).getTime();
  const fin = new Date(contador.dataset.fin).getTime();
  const cierre = new Date(contador.dataset.cierreInscripciones).getTime();

  if (ahora >= cierre && ahora < inicio) return "inscripciones_cerradas";
  if (ahora < inicio) return "antes_del_evento";
  if (ahora <= fin) return "en_curso";
  return "finalizado";
}

function actualizarDisparadoresInscripcion() {
  const estado = obtenerEstadoInscripcion();
  if (!estado) return;

  document
    .querySelectorAll<HTMLAnchorElement>("a[data-disparador-inscripcion]")
    .forEach((disparador) => {
      const textoOriginal =
        disparador.dataset.textoOriginal ?? disparador.textContent ?? "";
      disparador.dataset.textoOriginal = textoOriginal;
      disparador.dataset.estadoInscripcion = estado;
      if (estado === "antes_del_evento") {
        disparador.textContent = "→ Antes del evento";
        disparador.removeAttribute("aria-disabled");
        disparador.classList.remove("button--evento-cerrado");
      } else if (estado === "inscripciones_cerradas") {
        disparador.textContent = "→ Inscripciones cerradas";
        disparador.setAttribute("aria-disabled", "true");
        disparador.classList.add("button--evento-cerrado");
      } else if (estado === "en_curso") {
        disparador.textContent = "→ Evento en curso";
        disparador.setAttribute("aria-disabled", "true");
        disparador.classList.add("button--evento-cerrado");
      } else if (estado === "finalizado") {
        disparador.textContent = "→ Evento finalizado";
        disparador.setAttribute("aria-disabled", "true");
        disparador.classList.add("button--evento-cerrado");
      }
    });
}

export function initNavegacionGlobal() {
  const ventana = window as VentanaConEstado;
  if (ventana[CLAVE_INICIALIZACION]) return;
  ventana[CLAVE_INICIALIZACION] = true;
  actualizarDisparadoresInscripcion();
  window.setInterval(actualizarDisparadoresInscripcion, 1000);

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const objetivo = event.target;
    if (!(objetivo instanceof Element)) return;

    const disparador = objetivo.closest<HTMLAnchorElement>(
      "a[data-disparador-inscripcion]",
    );
    if (disparador) {
      event.preventDefault();
      if (disparador.dataset.estadoInscripcion !== "antes_del_evento") return;
      window.dispatchEvent(new CustomEvent("abrir-inscripcion"));
      return;
    }

    const enlace = objetivo.closest<HTMLAnchorElement>(
      'a[href^="#"]:not([data-disparador-inscripcion])',
    );
    if (!enlace) return;

    const selector = enlace.getAttribute("href") || "";
    const destino =
      selector === "#"
        ? document.body
        : document.querySelector<HTMLElement>(selector);
    if (!destino) return;

    event.preventDefault();
    destino.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  });
}
