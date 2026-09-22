const CLAVE_INICIALIZACION = "__infosisNavegacionInicializada";

type VentanaConEstado = Window & {
  [CLAVE_INICIALIZACION]?: boolean;
};

export function initNavegacionGlobal() {
  const ventana = window as VentanaConEstado;
  if (ventana[CLAVE_INICIALIZACION]) return;
  ventana[CLAVE_INICIALIZACION] = true;

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
