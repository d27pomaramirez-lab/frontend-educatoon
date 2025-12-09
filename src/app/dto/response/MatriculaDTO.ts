import { DetalleMatriculaDTO } from "./DetalleMatriculaDTO";

export interface MatriculaDTO {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteCodigo: string;
  fechaMatricula: Date;
  estado: string;
  periodoAcademico: string;
  detalles: DetalleMatriculaDTO[];
}