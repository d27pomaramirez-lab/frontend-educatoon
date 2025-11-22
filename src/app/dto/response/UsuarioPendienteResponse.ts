export interface UsuarioPendienteResponse{
  id: string;
  email: string;
  rolNombre: string;
  enabled: boolean;
  nombres: string;
  apellidos: string;
  dni: string;               
  telefono: string;
  sexo: string;
  estadoCivil: string;      
  fechaNacimiento: Date;   
  documentosValidados: boolean;
  carreraPostular: string;   
  universidadPostular: string; 
  colegioProcedencia: string;  
  especialidad?: string;       
}