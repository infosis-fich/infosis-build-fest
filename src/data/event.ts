export const event = {
  title: "Infosis Build Fest 2026",
  dates: "30 de septiembre y 1 de octubre de 2026",
  mode: "Presencial",
  description:
    "Una experiencia intensiva de desarrollo web para estudiantes de la Facultad y público general. No necesitas conocimientos previos: construye, aprende y compite usando agentes de IA.",
  seoDescription:
    "Workshop y challenge presencial de desarrollo web el 30 de septiembre y 1 de octubre de 2026, para estudiantes de la Facultad y público general.",
  urlInscripcion: "#inscripcion",
  copy: {
    eventIntro:
      "Es un evento presencial de dos días para aprender a crear proyectos web de forma práctica, trabajar en equipo y resolver un reto usando herramientas actuales.",
    learningIntro:
      "Aprenderás el proceso completo para pasar de una idea a un proyecto web funcional, con explicaciones claras y acompañamiento durante el camino.",
    agendaIntro:
      "Dos días para aprender, construir y resolver un reto en equipo.",
    tituloInscripcion: "Construye el futuro",
    introduccionInscripcion:
      "Forma parte de dos días de aprendizaje práctico, colaboración y desarrollo con agentes de IA. Todos los participantes reciben:",
    inscripcionPendiente:
      "La inscripción para la Infosis Build Fest 2026 todavía no se encuentra disponible. Pronto compartiremos el formulario y toda la información para registrarte.",
  },
  pricing: [
    ["Estudiantes de la Facultad", "30 Bs"],
    ["Público general", "50 Bs"],
  ],
  benefits: [
    "Certificado de participación",
    "Refrigerio durante el segundo día",
  ],
  organizers: ["Ingeniería Informática y Sistemas"],
  contact: {
    whatsapp:
      "https://wa.me/59167786830?text=Hola%20Fernando%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20Infosis%20Build%20Fest%202026",
    github: "https://github.com/infosis-fich",
    tiktok: "https://www.tiktok.com/@infosis.uagrm.fich",
  },
  highlights: [
    [
      "01",
      "Día 1 · Aprende haciendo",
      "Durante el primer día crearás un proyecto web paso a paso, desde la idea inicial hasta una solución funcional.",
    ],
    [
      "02",
      "Día 2 · Ponlo en práctica",
      "Durante el segundo día trabajarás en equipo para resolver un reto, probar tu solución y presentarla.",
    ],
    [
      "03",
      "Para estudiantes de la Facultad",
      "Una actividad pensada para estudiantes de la Facultad que quieren aprender y construir un proyecto web.",
    ],
    [
      "04",
      "Para público general",
      "También puedes participar si formas parte del público general y quieres aprender, crear y colaborar.",
    ],
  ],
  tracks: [
    [
      "01",
      "Planifica antes de programar",
      "Define qué construir antes de escribir código y convierte las ideas en pasos claros.",
    ],
    [
      "02",
      "Construye con apoyo de IA",
      "Aprende cómo usar OpenCode para analizar ideas, escribir código y revisar tu proyecto.",
    ],
    [
      "03",
      "Conecta las partes de una aplicación",
      "Conoce cómo se relacionan la interfaz, el backend y la base de datos en un proyecto funcional.",
    ],
    [
      "04",
      "Trabaja con herramientas reales",
      "Usa Visual Studio Code, Git y GitHub para organizar tu trabajo y colaborar con otras personas.",
    ],
  ],
  agenda: [
    {
      day: "DÍA 01 · 30 SEP",
      title: "Workshop · Taller práctico: construye un proyecto completo",
      items: [
        ["09:00", "Inicio y presentación del workshop"],
        ["09:20", "Presentación y especificaciones del proyecto"],
        ["10:00", "Diseño de la base de datos y arquitectura"],
        ["11:00", "Implementación guiada de backend y frontend"],
        ["12:00", "Receso"],
        ["14:30", "Retorno y continuidad del desarrollo"],
        ["15:30", "Integración, pruebas y control de versiones"],
        ["17:00", "Demo, conclusiones y cierre del workshop"],
        ["17:30", "Fin del día"],
      ],
    },
    {
      day: "DÍA 02 · 01 OCT",
      title: "Challenge · Reto de desarrollo: resuelve y presenta",
      items: [
        ["09:00", "Presentación del reto y criterios de evaluación"],
        ["09:20", "Formación de equipos y definición de la solución"],
        ["10:00", "Especificaciones y planificación del desarrollo"],
        ["10:30", "Construcción de la solución con OpenCode"],
        ["12:00", "Revisión de avances y mentoría"],
        ["13:00", "Integración final y preparación de demos"],
        ["14:00", "Presentación de soluciones y evaluación"],
        ["15:00", "Cierre del challenge"],
      ],
    },
  ],
} as const;

export type Event = typeof event;
