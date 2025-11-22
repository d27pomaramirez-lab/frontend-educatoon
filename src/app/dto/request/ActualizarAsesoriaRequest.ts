
export interface ActualizarAsesoriaRequest{
    fecha: string;
    duracionMinutos: number;
    modalidad: string;
    enlaceReunion?: string;
    lugarPresencial?: string;
    tema: string;
    areasRefuerzo?: string;
}