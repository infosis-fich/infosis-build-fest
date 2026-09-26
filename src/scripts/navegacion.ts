const CLAVE_INICIALIZACION = "__infosisNavegacionInicializada";

type VentanaConEstado = Window & {
  [CLAVE_INICIALIZACION]?: boolean;
};

type EstadoInscripcion = "disponible" | "en_curso" | "finalizado";

function obtenerEstadoInscripcion(): EstadoInscripcion | null {
  const contador = document.querySelector<HTMLElement>("[data-countdown]");
  if (!contador?.dataset.inicio || !contador.dataset.fin) return null;

  const ahora = Date.now();
  const inicio = new Date(contador.dataset.inicio).getTime();
  const fin = new Date(contador.dataset.fin).getTime();

  if (ahora < inicio) return "disponible";
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
      if (estado === "disponible") {
        disparador.textContent = textoOriginal;
        disparador.removeAttribute("aria-disabled");
        disparador.classList.remove("button--evento-cerrado");
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
      if (disparador.dataset.estadoInscripcion !== "disponible") return;
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
