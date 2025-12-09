import { NotaEstudianteInput } from "./NotaEstudianteInput";

export interface RegistroNotasRequest {
    seccionId: string;
    notas: NotaEstudianteInput[];
}