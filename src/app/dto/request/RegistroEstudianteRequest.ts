
export interface RegistroEstudianteRequest {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date;
  carreraPostular: string;
  universidadPostular: string;
  colegioProcedencia: string;
}