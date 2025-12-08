import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstudianteDTO } from '../dto/response/EstudianteDTO';
import { BASE_URL } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = BASE_URL + '/estudiantes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<EstudianteDTO[]> {
    return this.http.get<EstudianteDTO[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<EstudianteDTO> {
    return this.http.get<EstudianteDTO>(`${this.apiUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<EstudianteDTO> {
    return this.http.get<EstudianteDTO>(`${this.apiUrl}/codigo/${codigo}`);
  }

  buscarPorNombre(nombre: string): Observable<EstudianteDTO[]> {
    return this.http.get<EstudianteDTO[]>(`${this.apiUrl}/buscar?nombre=${nombre}`);
  }

  // Búsqueda rápida (para autocomplete)
  busquedaRapida(termino: string): Observable<EstudianteDTO[]> {
    return this.http.get<EstudianteDTO[]>(
      `${this.apiUrl}/busqueda-rapida`,
      { params: { termino: termino || '', limit: '5' } }
    );
  }

  // Estudiantes disponibles para matrícula en período
  getEstudiantesDisponibles(periodoAcademico: string, termino?: string): 
    Observable<EstudianteDTO[]> {
    
    let params: any = { periodoAcademico };
    if (termino) {
      params.termino = termino;
    }
    
    return this.http.get<EstudianteDTO[]>(
      `${this.apiUrl}/disponibles-matricula`,
      { params }
    );
  }
}