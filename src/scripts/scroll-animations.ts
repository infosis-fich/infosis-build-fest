import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(items, { autoAlpha: 1, y: 0 });
    return;
  }
  gsap.set(items, { autoAlpha: 0, y: 24 });
  items.forEach((item) => {
    gsap.to(item, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 86%", once: true },
    });
  });
}
