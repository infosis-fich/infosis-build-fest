# Base del proyecto — Infosis Build Fest 2026

## Estado actual

Landing estática para **Infosis Build Fest 2026**, actividad presencial de la carrera de Ingeniería Informática y Sistemas de la Facultad Integral del Chaco.

La interfaz utiliza contenido real del evento y mantiene una estética oscura, editorial y pixelada con componentes, animaciones y recursos propios.

## Información oficial

- **Evento:** Infosis Build Fest 2026.
- **Fechas:** 30 de septiembre y 1 de octubre de 2026.
- **Modalidad:** presencial.
- **Sede:** laboratorio de cómputo de la Facultad Integral del Chaco.
- **Público:** estudiantes inscritos en el semestre de Ingeniería Informática y Sistemas.
- **Costo:** 30 Bs.
- **Día 1:** workshop guiado de desarrollo web, de 09:00 a 12:00 y de 14:30 a 17:30.
- **Día 2:** challenge de desarrollo web, de 09:00 a 15:00.
- **Contacto:** WhatsApp +591 67786830.
- **GitHub:** https://github.com/infosis-fich.
- **TikTok:** https://www.tiktok.com/@infosis.uagrm.fich.

## Stack utilizado

- **Astro** para generar la landing estática y optimizada para SEO.
- **TypeScript** para la información central del evento y scripts.
- **CSS** para layout, responsive, tokens visuales y componentes.
- **Canvas** para la lluvia del cursor, la silueta institucional y la lluvia pixelada de las cards.
- **GSAP** para la aparición animada de los bloques del título pixelado.
- **Lenis** para scroll suave y navegación por anclas.
- **simple-icons** para los logos reales de WhatsApp, GitHub y TikTok.

## Estructura de la landing

### Header

- Header sticky con fondo oscuro y borde inferior sutil.
- Logo institucional monocromático.
- Enlace **Inicio** junto al logo.
- Navegación: Evento, Tecnología, Agenda y Participa.
- Iconos oficiales de WhatsApp, GitHub y TikTok antes de **Inscribirme**.
- Menú compacto para pantallas pequeñas.

### Hero

- Fecha y modalidad.
- Título pixelado `INFOSIS BUILD` / `FEST`.
- Descripción del evento.
- CTAs para inscripción y agenda.
- Lluvia de cursor a todo lo ancho del hero.
- Silueta institucional renderizada en Canvas.
- Banda de organización integrada con logo monocromático.

### Qué es Build Fest 2026

- Subtítulo breve y objetivo.
- Cuatro cards con lluvia pixelada:
  - Workshop · Taller práctico.
  - Challenge · Reto de desarrollo.
  - Para estudiantes.
  - Desde cero.
- Sin numeración para liberar espacio visual.

### Cómo construimos

- Cuatro cards con la misma estructura y lluvia pixelada que la sección anterior.
- Contenido resumido sobre Spec-Driven Development, OpenCode, Full-stack y flujo profesional con Visual Studio Code, Git y GitHub.

### Agenda

- Dos cards en desktop y una columna en móvil.
- Misma lluvia pixelada que las demás cards.
- Día 1: workshop guiado, sin plantearlo como reto.
- Día 2: challenge de desarrollo web.

### Inscripción

- Sección abierta, sin apariencia de card, visualmente cercana al hero.
- Lluvia de cursor a todo el ancho de la sección.
- Contenido centrado.
- Costo visible como texto normal: **30 Bs**.
- CTA: **Inscribirme ahora**.

### Footer

- Footer reducido únicamente a contacto.
- WhatsApp con mensaje prellenado: “Hola Fernando, quiero más información sobre la Infosis Build Fest 2026”.
- Enlaces a GitHub y TikTok.
- Iconos oficiales mediante `simple-icons`.

## Lenguaje visual

- Fondo oscuro y superficies casi negras.
- Paleta institucional basada en azul profundo, azul medio, celeste y un acento rojo puntual.
- Tipografía JetBrains Mono.
- Bordes rectos y separadores finos.
- Espaciado amplio y composición basada en grids.
- Lluvia pixelada sutil en cards y lluvia interactiva de cursor en hero e inscripción.
- Logo institucional procesado como `public/ico-infosis-transparent.png`.

## Animaciones y accesibilidad

- Entrada progresiva del título pixelado mediante GSAP.
- Revelado de secciones al entrar en viewport.
- Lluvia pixelada en cards con Canvas.
- Lluvia asociada al movimiento del cursor en hero e inscripción.
- Scroll suave con Lenis.
- Botón para volver arriba.
- `pointer-events: none` en capas decorativas para no bloquear contenido.
- Soporte para `prefers-reduced-motion`.
- Skip link, focus visible, navegación por teclado y etiquetas ARIA.

## Arquitectura actual

```text
src/
├── components/
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── PixelTitle.astro
│   ├── LogoSilhouette.astro
│   ├── CursorRain.astro
│   ├── Organizer.astro
│   ├── EventInfo.astro
│   ├── PixelCard.astro
│   ├── Tracks.astro
│   ├── Agenda.astro
│   ├── FinalCta.astro
│   ├── Footer.astro
│   └── BackToTop.astro
├── data/
│   └── event.ts
├── pages/
│   └── index.astro
├── scripts/
│   ├── smooth-scroll.ts
│   └── scroll-animations.ts
└── styles/
    ├── global.css
    └── enhancements.css
```

## Recursos públicos

- `ico-infosis-transparent.png`: logo institucional transparente.
- `ico-infosis.png`: versión original del logo.
- `favicon.svg`: favicon pixelado de Infosis.
- `favicon.ico`: favicon generado desde el logo institucional.

## Datos editables

El contenido principal se mantiene en `src/data/event.ts`:

- Nombre y fechas del evento.
- Modalidad, sede y público.
- Descripción y prerrequisitos.
- Costo y enlace de inscripción.
- Highlights.
- Tracks y herramientas.
- Agenda.
- Contactos y redes.

## Validación

La comprobación principal actual es:

```bash
npm run build
```

El build de producción debe completarse correctamente antes de publicar cambios.
