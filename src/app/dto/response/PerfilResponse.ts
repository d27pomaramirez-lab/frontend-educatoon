export interface PerfilResponse {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  fotoPerfil: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date;
  email: string;
  rol: string;
  codigoEstudiante?: string;
  fechaMatricula?: Date;
  carreraPostular?: string;
  universidadPostular?: string;
  colegioProcedencia?: string;
  especialidad?: string;
}