import { HorarioDTO } from "./HorarioDTO";

export interface SeccionConHorariosDTO {
  id: string;
  codigoSeccion: string;
  cursoNombre: string;
  aula: string;
  docenteNombre: string;
  capacidad: number;
  inscritos: number;
  cuposDisponibles: number;
  horarios: HorarioDTO[];
}