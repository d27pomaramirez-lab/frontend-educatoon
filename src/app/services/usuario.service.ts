import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';

export interface AdminCrearUsuarioRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  password: string;
  nombreRol: string;
  especialidad?: string;
}

export interface UsuarioPendienteDTO {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  documentosValidados: boolean;
  enabled: boolean;
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

}
