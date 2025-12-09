export interface DetalleMatriculaDTO {
  id: string;
  seccionId: string;
  seccionCodigo: string;
  cursoNombre: string;
  aula: string;
  docenteNombre: string;
  estado: string;
  notaFinal?: number;
}