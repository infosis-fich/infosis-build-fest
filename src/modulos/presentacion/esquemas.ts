import { z } from "astro/zod";

export const esquemaInscripcion = z
  .object({
    nombreCompleto: z.string().trim().max(120).optional().default(""),
    ci: z.string().trim().max(30).optional().default(""),
    whatsapp: z.string().trim().min(7).max(30),
    tipoParticipante: z.enum(["estudiante", "general"]),
    llevaLaptop: z.boolean(),
    registroEstudiante: z
      .string()
      .trim()
      .regex(/^\d{9}$/, "Debe tener 9 dígitos.")
      .optional(),
    tokenVerificacion: z
      .string()
      .trim()
      .optional()
      .transform((valor) => valor || undefined),
  })
  .superRefine((entrada, contexto) => {
    if (
      entrada.tipoParticipante === "estudiante" &&
      !entrada.registroEstudiante
    ) {
      contexto.addIssue({
        code: "custom",
        path: ["registroEstudiante"],
        message: "El registro estudiantil es obligatorio.",
      });
    }
    if (
      entrada.tipoParticipante === "general" &&
      entrada.nombreCompleto.length < 3
    ) {
      contexto.addIssue({
        code: "custom",
        path: ["nombreCompleto"],
        message: "El nombre completo es obligatorio.",
      });
    }
    if (entrada.tipoParticipante === "general" && entrada.ci.length < 4) {
      contexto.addIssue({
        code: "custom",
        path: ["ci"],
        message: "La cédula de identidad es obligatoria.",
      });
    }
  });

export const esquemaCrearPago = z.object({
  inscripcionId: z.uuid(),
});

export const esquemaVerificarEstudiante = z.object({
  registroEstudiante: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "Debe tener 9 dígitos."),
});

export const esquemaWebhook = z.object({
  movimiento_id: z.coerce.number().int().positive(),
  monto: z.coerce.number().positive(),
  estado: z.string().min(1),
  data: z.array(z.unknown()).optional(),
  remitente: z
    .object({
      nombre: z.string().trim().max(160).optional(),
      banco: z.string().trim().max(120).optional(),
      documento: z.string().trim().max(40).optional(),
      cuenta: z.string().trim().max(80).optional(),
    })
    .optional(),
  // Compatibilidad con notificaciones de versiones anteriores.
  pagador: z.string().trim().max(160).optional(),
  nombre_pagador: z.string().trim().max(160).optional(),
  documento: z.string().trim().max(40).optional(),
  banco: z.string().trim().max(120).optional(),
  fecha_transaccion: z.string().trim().max(80).optional(),
  metodo: z.string().trim().max(80).optional(),
});
