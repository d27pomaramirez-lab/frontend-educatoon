import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilResponse } from '../dto/response/PerfilResponse';
import { BASE_URL } from '../../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = BASE_URL+'/perfil';

  constructor(private http: HttpClient) {}

  // Obtener perfil por EMAIL
  getPerfilByEmail(email: string): Observable<PerfilResponse> {
    return this.http.get<PerfilResponse>(`${this.apiUrl}/by-email/${email}`);
  }

  // Obtener perfil por ID (mantener por si acaso)
  getPerfil(usuarioId: string): Observable<PerfilResponse> {
    return this.http.get<PerfilResponse>(`${this.apiUrl}/${usuarioId}`);
  }

  // Subir foto por EMAIL
  subirFotoByEmail(email: string, foto: File): Observable<string> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.post(`${this.apiUrl}/by-email/${email}/foto`, formData, { responseType: 'text' });
  }

  // Subir foto por ID
  subirFoto(usuarioId: string, foto: File): Observable<string> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.post(`${this.apiUrl}/${usuarioId}/foto`, formData, { responseType: 'text' });
  }

  // Eliminar foto por EMAIL
  eliminarFotoByEmail(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/by-email/${email}/foto`);
  }

  // Eliminar foto por ID
  eliminarFoto(usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}/foto`);
  }

  // Obtener URL de la foto
  getFotoUrl(nombreArchivo: string): string {
    return `${this.apiUrl}/foto/${nombreArchivo}`;
  }
}