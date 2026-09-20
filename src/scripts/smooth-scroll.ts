import Lenis from "@studio-freight/lenis";

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const existing = (window as Window & { __infosisLenis?: Lenis })
    .__infosisLenis;
  if (existing) return existing;

  const lenis = new Lenis({
    duration: 1.45,
    smoothWheel: true,
    easing: (value: number) => 1 - Math.pow(1 - value, 4),
  });
  (window as Window & { __infosisLenis?: Lenis }).__infosisLenis = lenis;
  document
    .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    .forEach((anchor) => {
      if (anchor.dataset.lenisBound) return;
      anchor.dataset.lenisBound = "true";
      anchor.addEventListener("click", (event) => {
        const target = document.querySelector(
          anchor.getAttribute("href") || "",
        );
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      });
    });
  const frame = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return lenis;
}
