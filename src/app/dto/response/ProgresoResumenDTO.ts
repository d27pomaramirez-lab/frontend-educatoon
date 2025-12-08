export interface ProgresoResumenDTO {
    nombreCurso: string;
    codigoSeccion: string;
    nombreDocente: string; 
    notaParcial: number;
    notaFinal?: number;          // Nuevo campo (opcional por si es null)
    promedioSimulacros: number;  // Nuevo campo
    avance: number;
    estado: string;
    observaciones: string;
    ultimaActualizacion: string;
}