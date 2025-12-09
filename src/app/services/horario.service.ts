import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';

@Injectable({
  providedIn: 'root',
})
// horario.service.ts
export class HorarioService {
  private apiUrl = `${BASE_URL}/horarios`;
  
  constructor(private http: HttpClient) {}

  crearHorario(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
  
  actualizarHorario(id: string, request: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request);
  }
  
  eliminarHorario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getHorariosPorSeccion(seccionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/secciones/${seccionId}`);
  }

  getMiHorario(): Observable<HorarioUsuario[]> {
    return this.http.get<HorarioUsuario[]>(`${this.apiUrl}/mi-horario`);
  }
  
  getHorariosPorEstudiante(estudianteId: string): Observable<HorarioUsuario[]> {
    return this.http.get<HorarioUsuario[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }
  
  getHorariosPorDocente(docenteId: string): Observable<HorarioUsuario[]> {
    return this.http.get<HorarioUsuario[]>(`${this.apiUrl}/docente/${docenteId}`);
  }
}