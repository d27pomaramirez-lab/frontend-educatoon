export interface SeccionResponse {
  id: string;
  codigoSeccion: string; // Añadir esta línea
  curso: string;
  capacidad: number;
  aula: string;
  docente: string;
}