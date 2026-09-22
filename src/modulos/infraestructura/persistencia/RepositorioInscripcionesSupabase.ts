import type {
  EntradaCrearInscripcion,
  Inscripcion,
  EstadoInscripcion,
} from "../../dominio/inscripciones/Inscripcion";
import type { RepositorioInscripciones } from "../../dominio/inscripciones/RepositorioInscripciones";
import { ErrorAplicacion } from "../../aplicacion/ErrorAplicacion";
import { crearClienteSupabase } from "./clienteSupabase";

interface InscripcionRow {
  id: string;
  entrada_token: string;
  nombre_completo: string;
  ci: string;
  whatsapp: string;
  registro_estudiante: string | null;
  nombre_completo_verificado: string | null;
  tipo_participante: "estudiante" | "general";
  lleva_laptop: boolean;
  monto_inscripcion: number;
  estado: EstadoInscripcion;
  creado_en: string;
  actualizado_en: string;
}

export class RepositorioInscripcionesSupabase implements RepositorioInscripciones {
  async listarTodas(): Promise<Inscripcion[]> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .select()
      .order("creado_en", { ascending: false });

    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudieron consultar las inscripciones.",
        error,
      );

    return (data as InscripcionRow[]).map((row) => this.map(row));
  }

  async crear(
    entrada: EntradaCrearInscripcion & {
      montoInscripcion: number;
      nombreCompletoVerificado?: string;
    },
  ): Promise<Inscripcion> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .insert({
        nombre_completo: entrada.nombreCompleto,
        ci: entrada.ci,
        whatsapp: entrada.whatsapp,
        registro_estudiante: entrada.registroEstudiante || null,
        nombre_completo_verificado: entrada.nombreCompletoVerificado || null,
        tipo_participante: entrada.tipoParticipante,
        lleva_laptop: entrada.llevaLaptop,
        monto_inscripcion: entrada.montoInscripcion,
        estado: "pendiente_pago",
      })
      .select()
      .single();

    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo crear la inscripción.",
        error,
      );
    return this.map(data as InscripcionRow);
  }

  async buscarPorId(id: string): Promise<Inscripcion | null> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar la inscripción.",
        error,
      );
    return data ? this.map(data as InscripcionRow) : null;
  }

  async buscarPorCi(ci: string): Promise<Inscripcion | null> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .select()
      .eq("ci", ci)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar el CI.",
        error,
      );
    return data ? this.map(data as InscripcionRow) : null;
  }

  async buscarPorRegistroEstudiante(
    registro: string,
  ): Promise<Inscripcion | null> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .select()
      .eq("registro_estudiante", registro)
      .eq("tipo_participante", "estudiante")
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar el registro estudiantil.",
        error,
      );
    return data ? this.map(data as InscripcionRow) : null;
  }

  async buscarPorEntradaToken(token: string): Promise<Inscripcion | null> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .select()
      .eq("entrada_token", token)
      .maybeSingle();
    if (error)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo consultar la entrada.",
        error,
      );
    return data ? this.map(data as InscripcionRow) : null;
  }

  async actualizarComoEstudiante(
    id: string,
    datos: {
      ci: string;
      nombreCompleto: string;
      registroEstudiante: string;
      nombreCompletoVerificado: string;
      montoInscripcion: number;
    },
  ): Promise<Inscripcion> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .update({
        ci: datos.ci,
        nombre_completo: datos.nombreCompleto,
        registro_estudiante: datos.registroEstudiante,
        nombre_completo_verificado: datos.nombreCompletoVerificado,
        tipo_participante: "estudiante",
        monto_inscripcion: datos.montoInscripcion,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo actualizar la inscripción como estudiante.",
        error,
      );
    return this.map(data as InscripcionRow);
  }

  async actualizarComoGeneral(
    id: string,
    datos: {
      ci: string;
      nombreCompleto: string;
      montoInscripcion: number;
    },
  ): Promise<Inscripcion> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .update({
        ci: datos.ci,
        nombre_completo: datos.nombreCompleto,
        registro_estudiante: null,
        nombre_completo_verificado: null,
        tipo_participante: "general",
        monto_inscripcion: datos.montoInscripcion,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo actualizar la inscripción como público general.",
        error,
      );
    return this.map(data as InscripcionRow);
  }

  async actualizarEstado(
    id: string,
    estado: EstadoInscripcion,
  ): Promise<Inscripcion> {
    const { data, error } = await crearClienteSupabase()
      .from("inscripciones")
      .update({ estado, actualizado_en: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error || !data)
      throw new ErrorAplicacion(
        "ERROR_INTERNO",
        "No se pudo actualizar la inscripción.",
        error,
      );
    return this.map(data as InscripcionRow);
  }

  private map(row: InscripcionRow): Inscripcion {
    return {
      id: row.id,
      entradaToken: row.entrada_token,
      nombreCompleto: row.nombre_completo,
      ci: row.ci,
      whatsapp: row.whatsapp,
      registroEstudiante: row.registro_estudiante,
      nombreCompletoVerificado: row.nombre_completo_verificado,
      tipoParticipante: row.tipo_participante,
      llevaLaptop: row.lleva_laptop,
      montoInscripcion: row.monto_inscripcion,
      estado: row.estado,
      creadoEn: row.creado_en,
      actualizadoEn: row.actualizado_en,
    };
  }
}
