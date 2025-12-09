export interface PruebaEntradaDTO {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteCodigo: string;
  fechaRendicion: Date;
  puntajeTotal?: number;
  perfilAprendizaje: string;
  estado: string;
}