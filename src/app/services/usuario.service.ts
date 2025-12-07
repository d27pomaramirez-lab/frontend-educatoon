import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { AdminCrearUsuarioRequest } from '../dto/request/AdminCrearUsuarioRequest';
import { UsuarioPendienteResponse } from '../dto/response/UsuarioPendienteResponse';
import { ActualizarUsuarioRequest } from '../dto/request/ActualizarUsuarioRequest';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //private apiUrl = `${BASE_URL}/admin/usuarios`;

  constructor(private http: HttpClient) { }

  crearUsuario(data: AdminCrearUsuarioRequest): Observable<string> {
    return this.http.post(`${BASE_URL}/admin/usuarios/crear`, data, {
      responseType: 'text'
    }
    );
  }

  getUsuariosPendientes(): Observable<UsuarioPendienteResponse[]> {
    return this.http.get<UsuarioPendienteResponse[]>(`${BASE_URL}/admin/usuarios/pendientes`);
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
      responseType: 'text'
    }
    );
  }

  getUsuariosPendientesParaCoordinador(): Observable<UsuarioPendienteResponse[]> {
    return this.http.get<UsuarioPendienteResponse[]>(`${BASE_URL}/coordinador/pendientes`);
  }

  getTodosLosUsuarios(): Observable<UsuarioPendienteResponse[]> {
    return this.http.get<UsuarioPendienteResponse[]>(`${BASE_URL}/admin/usuarios/todos`);
  }

  cambiarEstado(id: string): Observable<string> {
    return this.http.delete(
      `${BASE_URL}/admin/usuarios/estado/${id}`,
      { responseType: 'text' }
    );
  }

  activarUsuario(id: string): Observable<string> {
    return this.http.put(`${BASE_URL}/admin/usuarios/estado/${id}?enabled=true`,
       {},
        { responseType: 'text' });
  }

  desactivarUsuario(id: string): Observable<string> {
    return this.http.put(`${BASE_URL}/admin/usuarios/estado/${id}?enabled=false`,
       {},
        { responseType: 'text' });
  }

  getUsuarioById(id: string): Observable<UsuarioPendienteResponse> {
    return this.http.get<UsuarioPendienteResponse>(`${BASE_URL}/admin/usuarios/${id}`);
  }

  actualizarUsuario(id: string, data: ActualizarUsuarioRequest): Observable<string> {
    return this.http.put(
      `${BASE_URL}/admin/usuarios/actualizar/${id}`,
      data,
      { responseType: 'text' }
    );
  }

  getUsuariosParaCoordinador(): Observable<UsuarioPendienteResponse[]> {
    return this.http.get<UsuarioPendienteResponse[]>(`${BASE_URL}/coordinador/usuarios`);
  }


}
