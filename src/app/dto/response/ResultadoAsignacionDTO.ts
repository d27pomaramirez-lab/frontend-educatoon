export interface ResultadoAsignacionDTO {
  estudianteId: string;
  estudianteNombre: string;
  perfilAprendizaje: string;
  seccionAsignada?: string;
  horarioAsignado?: string;
  razon?: string;
  exitoso: boolean;
  mensaje: string;
}