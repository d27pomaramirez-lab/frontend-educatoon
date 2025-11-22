

export interface CrearAsesoriaRequest {
  estudianteId: string;
  docenteId: string;
  cursoId: string;
  fecha: string;
  duracionMinutos: number;
  modalidad: string;
  enlaceReunion?: string;
  lugarPresencial?: string;
  tema: string;
  areasRefuerzo?: string;
}