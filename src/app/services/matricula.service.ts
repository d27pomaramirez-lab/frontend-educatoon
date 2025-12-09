import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { MatriculaDTO } from '../dto/response/MatriculaDTO';
import { CrearMatriculaRequest } from '../dto/request/CrearMatriculaRequest';
import { DetalleMatriculaDTO } from '../dto/response/DetalleMatriculaDTO';

@Injectable({
  providedIn: 'root',
})
export class MatriculaService {
  private apiUrl = `${BASE_URL}/matriculas`;

  constructor(private http: HttpClient) {}

  crearMatricula(request: CrearMatriculaRequest): Observable<MatriculaDTO> {
    return this.http.post<MatriculaDTO>(this.apiUrl, request);
  }

  obtenerTodas(): Observable<MatriculaDTO[]> {
    return this.http.get<MatriculaDTO[]>(this.apiUrl);
  }

  agregarSeccion(matriculaId: string, seccionId: string): Observable<DetalleMatriculaDTO> {
    return this.http.post<DetalleMatriculaDTO>(
      `${this.apiUrl}/${matriculaId}/secciones`,
      { seccionId }
    );
  }

  actualizarEstado(matriculaId: string, estado: string): Observable<MatriculaDTO> {
    return this.http.put<MatriculaDTO>(
      `${this.apiUrl}/${matriculaId}/estado`,
      { estado }
    );
  }

  actualizarNota(detalleId: string, nota: number): Observable<DetalleMatriculaDTO> {
    return this.http.put<DetalleMatriculaDTO>(
      `${this.apiUrl}/detalles/${detalleId}/nota`,
      null,
      { params: { nota: nota.toString() } }
    );
  }

  eliminar(matriculaId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matriculaId}`);
  }

  retirarSeccion(detalleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detalles/${detalleId}`);
  }
    // Obtener por estudiante (endpoint nuevo)
  obtenerMatriculasPorEstudiante(estudianteId: string): Observable<MatriculaDTO[]> {
    return this.http.get<MatriculaDTO[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }
}