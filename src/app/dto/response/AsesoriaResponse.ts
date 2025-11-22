
export interface AsesoriaResponse {
  id: string;
  nombreEstudiante: string;
  nombreDocente: string;
  tema: string;
  fecha: string;
  duracionMinutos: number;
  modalidad: string;
  ubicacion: string;
  estado: string;
  areasRefuerzo?: string;
  observaciones?: string;
  asistencia?: boolean;
}