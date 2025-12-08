export interface CrearPruebaRequest {
  estudianteId: string;
  puntajeTotal?: number;
  perfilAprendizaje: string;
  fechaRendicion?: Date;
}