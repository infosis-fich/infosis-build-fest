export interface DatosEstudiante {
  ci: string;
  nombreCompleto: string;
  registro: string;
}

export interface ConsultaEstudiante {
  consultar(registro: string): Promise<DatosEstudiante>;
}
