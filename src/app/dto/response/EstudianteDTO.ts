export interface EstudianteDTO {
  id: string;
  codigoEstudiante: string;
  nombreCompleto: string;
  fechaMatricula: Date;
  documentosValidados: boolean;
  carreraPostular?: string;
  universidadPostular?: string;
  colegioProcedencia?: string;
  yaMatriculado: boolean;
  periodoMatriculado?: string;
}