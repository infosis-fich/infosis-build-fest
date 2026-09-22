-- Infosis Build Fest
-- Las tablas y sus columnas deben existir antes de ejecutar este archivo.

-- INSCRIPCIONES
-- restricciones: PRIMARY KEYS
alter table public.inscripciones
  add constraint inscripciones_pk primary key (id);

-- Restricciones: CHECK
alter table public.inscripciones
  add constraint inscripciones_nombre_completo_ck
    check (char_length(nombre_completo) between 3 and 120),
  add constraint inscripciones_registro_estudiante_ck
    check (
      registro_estudiante is null
      or registro_estudiante ~ '^[0-9]{9}$'
    ),
  add constraint inscripciones_tipo_participante_ck
    check (tipo_participante in ('estudiante', 'general')),
  add constraint inscripciones_monto_inscripcion_ck
    check (
      (tipo_participante = 'estudiante' and monto_inscripcion = 30)
      or (tipo_participante = 'general' and monto_inscripcion = 50)
    ),
  add constraint inscripciones_estado_ck
    check (estado in ('pendiente_pago', 'pagada', 'cancelada'));

-- restricciones: DEFAULT
alter table public.inscripciones
  alter column id set default gen_random_uuid(),
  alter column entrada_token set default gen_random_uuid(),
  alter column estado set default 'pendiente_pago',
  alter column lleva_laptop set default false,
  alter column creado_en set default now(),
  alter column actualizado_en set default now();

-- restricciones: UNIQUE
alter table public.inscripciones
  add constraint inscripciones_ci_uq unique (ci),
  add constraint inscripciones_entrada_token_uq unique (entrada_token);

-- restricciones: INDEXES
create unique index inscripciones_registro_estudiante_unico
  on public.inscripciones (registro_estudiante)
  where tipo_participante = 'estudiante';

-- PAGOS
-- restricciones: PRIMARY KEYS
alter table public.pagos
  add constraint pagos_pk primary key (id);

-- restricciones: FOREIGN KEYS
alter table public.pagos
  add constraint pagos_inscripcion_fk
    foreign key (inscripcion_id)
    references public.inscripciones(id);

-- Restricciones: CHECK
alter table public.pagos
  add constraint pagos_monto_ck check (monto > 0),
  add constraint pagos_estado_ck
    check (estado in ('pendiente', 'pagado', 'fallido', 'cancelado'));

-- restricciones: DEFAULT
alter table public.pagos
  alter column moneda set default 'BOB',
  alter column estado set default 'pendiente',
  alter column creado_en set default now();

-- restricciones: UNIQUE
alter table public.pagos
  add constraint pagos_referencia_externa_uq unique (referencia_externa);

-- restricciones: INDEXES
create index pagos_inscripcion_id_idx
  on public.pagos (inscripcion_id);

create index pagos_estado_idx
  on public.pagos (estado);

-- Seguridad de tablas: solo el servidor con service role opera mediante Supabase.
alter table public.inscripciones enable row level security;
alter table public.pagos enable row level security;
