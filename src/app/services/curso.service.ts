import { Injectable } from '@angular/core';
import { BASE_URL } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { CursoRequest } from '../dto/request/CursoRequest';
import { CursoResponse } from '../dto/response/CursoResponse';
import { Observable } from 'rxjs';
import { ActualizarCursoRequest } from '../dto/request/ActualizarCursoRequest';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrl = `${BASE_URL}/cursos`;

  constructor(private http: HttpClient) { }

  crearCurso(request: CursoRequest): Observable<CursoResponse> {
    return this.http.post<CursoResponse>(`${this.apiUrl}/crear`, request);
  }

  listarCursos(): Observable<CursoResponse[]> {
    return this.http.get<CursoResponse[]>(this.apiUrl);
  }

  actualizarCurso(id: string, request: ActualizarCursoRequest): Observable<CursoResponse> {
    return this.http.put<CursoResponse>(`${this.apiUrl}/actualizar/${id}`, request);
  }

  cambiarEstado(id: string, activo: boolean): Observable<string> {
    return this.http.put(`${this.apiUrl}/cancelar/${id}?activo=${activo}`, null, 
      { responseType: 'text' });
  }
}
