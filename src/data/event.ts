export const event = {
  title: "Infosis Build Fest 2026",
  shortTitle: "INFOSIS BUILD FEST",
  dates: "30 de septiembre y 1 de octubre de 2026",
  mode: "Presencial",
  location: "Facultad Integral del Chaco",
  audience: "Estudiantes inscritos en el semestre 2026",
  description:
    "Una experiencia intensiva de desarrollo web para construir, aprender y competir usando agentes de IA. No necesitas conocimientos previos.",
  prerequisites: "No se necesitan conocimientos previos",
  registrationUrl: "#inscripcion",
  organizers: ["Ingeniería Informática y Sistemas"],
  tools: ["OpenCode", "Visual Studio Code", "Git", "GitHub"],
  highlights: [
    [
      "01",
      "Workshop · Taller práctico",
      "El primer día construirás un proyecto web completo, guiado paso a paso desde la idea hasta una solución funcional.",
    ],
    [
      "02",
      "Challenge · Reto de desarrollo",
      "El segundo día resolverás un reto de desarrollo web en equipo para construir, probar y presentar una solución.",
    ],
    [
      "03",
      "Para estudiantes",
      "Actividad dirigida a estudiantes de la carrera de Ingeniería Informática y Sistemas.",
    ],
    [
      "04",
      "Desde cero",
      "No necesitas conocimientos previos, solo ganas de aprender, crear y colaborar.",
    ],
  ],
  tracks: [
    [
      "01",
      "Spec-Driven Development · Desarrollo guiado por especificaciones",
      "Define qué construir antes de escribir código y convierte requisitos en una guía ejecutable.",
    ],
    [
      "02",
      "OpenCode · Agente de IA",
      "Explora cómo un agente de IA puede acompañar el análisis, la implementación y la revisión.",
    ],
    [
      "03",
      "Full-stack · Frontend, backend y base de datos",
      "Integra base de datos, backend y frontend en un proyecto funcional.",
    ],
    [
      "04",
      "Flujo profesional · Herramientas de desarrollo",
      "Trabaja con Visual Studio Code, Git, GitHub y buenas prácticas de colaboración.",
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
  contacts: [
    "Carrera de Ingeniería Informática y Sistemas",
    "Facultad Integral del Chaco",
  ],
  socialUrl: "#top",
} as const;

export type Event = typeof event;
