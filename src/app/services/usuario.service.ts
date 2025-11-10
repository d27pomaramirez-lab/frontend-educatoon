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
}
