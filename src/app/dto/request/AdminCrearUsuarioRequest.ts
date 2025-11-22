export interface AdminCrearUsuarioRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  sexo: string;                
  estadoCivil: string;        
  fechaNacimiento: Date;
  email: string;
  password: string;
  nombreRol: string;
  especialidad?: string;
  carreraPostular?: string;     
  universidadPostular?: string;
  colegioProcedencia?: string;
}