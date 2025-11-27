export interface CursoResponse {
    id: string;
    nombre: string;
    descripcion: string;
    ciclo: string;
    estado: boolean;
    fechaCreacion?: Date; 
}