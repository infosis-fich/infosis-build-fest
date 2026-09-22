# Base del proyecto — Infosis Build Fest 2026

## Estado actual

Aplicación web para **Infosis Build Fest 2026**, actividad presencial de la carrera de Ingeniería Informática y Sistemas de la Facultad Integral del Chaco. Incluye una landing pública y una API SSR para gestionar inscripciones, verificación de estudiantes y pagos.

La interfaz utiliza contenido real del evento y mantiene una estética oscura, editorial y pixelada con componentes, animaciones y recursos propios. El backend se ejecuta bajo demanda con Astro y Node, y persiste la operación en PostgreSQL mediante Supabase.

## Información oficial

- **Evento:** Infosis Build Fest 2026.
- **Fechas:** 30 de septiembre y 1 de octubre de 2026.
- **Modalidad:** presencial.
- **Sede:** laboratorio de cómputo de la Facultad Integral del Chaco.
- **Público:** estudiantes de la Facultad y público general.
- **Costo:** 30 Bs para estudiantes de la Facultad y 50 Bs para público general.
- **Beneficios:** certificado de participación y refrigerio durante el segundo día.
- **Día 1:** workshop guiado de desarrollo web, de 09:00 a 12:00 y de 14:30 a 17:30.
- **Día 2:** challenge de desarrollo web, de 09:00 a 15:00.
- **Contacto:** WhatsApp +591 67786830.
- **GitHub:** <https://github.com/infosis-fich>.
- **TikTok:** <https://www.tiktok.com/@infosis.uagrm.fich>.

## Stack utilizado

- **Astro** para la interfaz y las rutas API bajo demanda.
- **Vercel** como plataforma SSR mediante `@astrojs/vercel`.
- **TypeScript** para la interfaz, dominio, casos de uso y scripts.
- **Supabase** como cliente y persistencia PostgreSQL.
- **Zod** para validar entradas HTTP.
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
- En la landing: ¿Qué es?, Aprendizaje, Agenda y Participa.
- En páginas externas: logo, Inicio y redes sociales.
- Menú compacto de secciones únicamente en la landing.

### Hero

- Fecha y modalidad.
- Título pixelado `INFOSIS BUILD` / `FEST`.
- Descripción del evento.
- CTAs para inscripción y agenda.
- Lluvia de cursor a todo lo ancho del hero.
- Silueta institucional renderizada en Canvas.
- Banda de organización integrada con logo monocromático.

### Qué es Build Fest

- Explicación breve y directa de la actividad.
- Cuatro cards con lluvia pixelada:
  - Día 1 · Aprende haciendo.
  - Día 2 · Ponlo en práctica.
  - Para estudiantes de la Facultad.
  - Para público general.
- Sin numeración para liberar espacio visual.

### Qué vas a aprender

- Cuatro cards con la misma estructura y lluvia pixelada que la sección anterior.
- Explicación sencilla sobre cómo pasar de una idea a un proyecto web, usar OpenCode, conectar las partes de una aplicación y trabajar con Visual Studio Code, Git y GitHub.

### Agenda

- Dos cards en desktop y una columna en móvil.
- Misma lluvia pixelada que las demás cards.
- Día 1: workshop guiado, sin plantearlo como reto.
- Día 2: challenge de desarrollo web.

### Inscripción

- Sección abierta, sin apariencia de card, visualmente cercana al hero.
- Lluvia de cursor a todo el ancho de la sección.
- Contenido centrado.
- Precios visibles: **30 Bs** para estudiantes de la Facultad y **50 Bs** para público general.
- Beneficios visibles: certificado de participación y refrigerio durante el segundo día.
- Formulario para registrar participantes estudiantes o de público general.
- Verificación del registro estudiantil mediante el servicio de estudiantes.
- Creación de la inscripción con estado inicial `pendiente_pago`.
- Precios y datos enviados al backend según el tipo de participante.

### Footer

- Footer reducido únicamente a contacto.
- WhatsApp con mensaje prellenado: “Hola Fernando, quiero más información sobre la Infosis Build Fest 2026”.
- Enlaces a GitHub y TikTok.
- Iconos oficiales mediante `simple-icons`.

### Entrada digital

- La entrada se genera después de confirmar el pago.
- Reutiliza `EntradaDigital.astro` y el diseño pixelado de la landing.
- El QR apunta a `/entrada/[token]`.
- El token debe tener formato UUID v4 y solo una inscripción `pagada` es válida.
- La descarga usa el formato `IBF2026-TOKEN.png`.

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
- Scroll nativo suave mediante `scroll-behavior` y `scrollIntoView`.
- Botón para volver arriba.
- `pointer-events: none` en capas decorativas para no bloquear contenido.
- Soporte para `prefers-reduced-motion`.
- Skip link, focus visible, navegación por teclado y etiquetas ARIA.

## Backend y persistencia

La aplicación se ejecuta con salida `server` y adapter Vercel. Las rutas de
Astro funcionan como adaptadores HTTP delgados y delegan la lógica en
`src/modulos`.

### Rutas implementadas

- `POST /api/inscripciones`: crea y actualiza inscripciones.
- `POST /api/estudiantes/verificar`: verifica un registro estudiantil mediante
  la API oficial de carnetización de la UAGRM.
- `POST /api/inscripciones/verificar-ci`: verifica el CI de participantes generales.
- `POST /api/pagos/crear`: crea un pago y solicita el QR a Veripagos.
- `GET /api/pagos/estado/:id`: consulta el estado de un pago.
- `POST /api/pagos/webhook`: procesa confirmaciones de la pasarela.
- `GET /entrada/:token`: valida una entrada digital pagada.

### Modelo de datos

La carpeta `database/` contiene los scripts PostgreSQL para Supabase:

- `inscripciones`: identidad del participante, tipo, monto, estado y datos de
  verificación.
- `pagos`: inscripción relacionada, pasarela, referencia externa, monto,
  estado y respuesta de confirmación.

Las claves, relaciones, estados, montos, valores por defecto e índices están
separados en `2.Restricciones.sql`. Las tablas tienen RLS habilitado y las
operaciones del servidor utilizan la clave service role.

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
│   ├── index.astro
│   └── api/
│       ├── inscripciones.ts
│       ├── estudiantes/verificar.ts
│       └── pagos/
│           ├── crear.ts
│           ├── webhook.ts
│           └── estado/[id].ts
├── modulos/
│   ├── dominio/
│   ├── aplicacion/
│   ├── infraestructura/
│   └── presentacion/
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
- Precios, beneficios y enlace de inscripción.
- Highlights.
- Tracks y herramientas.
- Agenda.
- Contactos y redes.
- Variables de entorno de Supabase y Veripagos para el backend.

## Validación

La comprobación principal actual es:

```bash
npm run build
```

El build de producción debe completarse correctamente antes de publicar cambios.
