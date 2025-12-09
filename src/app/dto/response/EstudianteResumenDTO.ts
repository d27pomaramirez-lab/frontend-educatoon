export interface EstudianteResumenDTO {
  id: string;
  nombreCompleto: string;
  codigoEstudiante: string;
  fechaMatricula: string; // El backend envía Date, Angular lo recibe como string ISO
  matriculadoActual: boolean;
}