import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';

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

export interface UsuarioPendienteDTO {
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
export interface ActualizarUsuarioRequest {
  email: string;
  password?: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date;
  carreraPostular?: string;
  universidadPostular?: string;
  colegioProcedencia?: string;
  especialidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    //private apiUrl = `${BASE_URL}/admin/usuarios`;

    constructor(private http: HttpClient) { }

    crearUsuario(data: AdminCrearUsuarioRequest): Observable<string> {
      return this.http.post(`${BASE_URL}/admin/usuarios/crear`, data, { 
        responseType: 'text' }
      );
    }

    getUsuariosPendientes(): Observable<UsuarioPendienteDTO[]> {
      return this.http.get<UsuarioPendienteDTO[]>(`${BASE_URL}/admin/usuarios/pendientes`);
    }

    aprobarUsuario(id: string): Observable<string> {
      return this.http.post(
        `${BASE_URL}/admin/usuarios/aprobar/${id}`,
        null,
        { responseType: 'text' }
      );
    }

    validarDocumentos(id: string): Observable<string> {
      return this.http.post(`${BASE_URL}/coordinador/validar-documentos/${id}`, null, { 
        responseType: 'text'}
      );
    }

    getUsuariosPendientesParaCoordinador(): Observable<UsuarioPendienteDTO[]> {
      return this.http.get<UsuarioPendienteDTO[]>(`${BASE_URL}/coordinador/pendientes`);
    }

    getTodosLosUsuarios(): Observable<UsuarioPendienteDTO[]> {
      return this.http.get<UsuarioPendienteDTO[]>(`${BASE_URL}/admin/usuarios/todos`);
    }

    desactivarUsuario(id: string): Observable<string> {
      return this.http.delete(
        `${BASE_URL}/admin/usuarios/desactivar/${id}`, 
        { responseType: 'text' }
      );
    }

    getUsuarioById(id: string): Observable<UsuarioPendienteDTO> {
      return this.http.get<UsuarioPendienteDTO>(`${BASE_URL}/admin/usuarios/${id}`);
    }

    actualizarUsuario(id: string, data: ActualizarUsuarioRequest): Observable<string> {
      return this.http.put(
        `${BASE_URL}/admin/usuarios/actualizar/${id}`,
        data,
        { responseType: 'text' }
      );
    }


  }
