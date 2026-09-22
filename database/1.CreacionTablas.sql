-- Infosis Build Fest
-- Motor: PostgreSQL / Supabase.
-- Este archivo contiene exclusivamente definiciones de tablas.

-- Inscripciones de participantes del evento.
create table public.inscripciones (
  id uuid not null,
  entrada_token uuid not null,
  nombre_completo text not null,
  ci text not null,
  whatsapp text not null,
  registro_estudiante text,
  nombre_completo_verificado text,
  tipo_participante text not null,
  monto_inscripcion numeric(10, 2) not null,
  estado text not null,
  lleva_laptop boolean not null,
  creado_en timestamptz not null,
  actualizado_en timestamptz not null
);

-- Pagos asociados a una inscripción y a una referencia de la pasarela.
create table public.pagos (
  id uuid not null,
  inscripcion_id uuid not null,
  pasarela text not null,
  referencia_externa text not null,
  monto numeric(10, 2) not null,
  moneda text not null,
  estado text not null,
  datos_confirmacion jsonb,
  pagado_en timestamptz,
  creado_en timestamptz not null
);
