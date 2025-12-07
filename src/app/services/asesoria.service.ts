import { Injectable } from '@angular/core';
import { BASE_URL } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsesoriaResponse } from '../dto/response/AsesoriaResponse';
import { CrearAsesoriaRequest } from '../dto/request/CrearAsesoriaRequest';
import { UsuarioPendienteResponse } from '../dto/response/UsuarioPendienteResponse';
import { ActualizarAsesoriaRequest } from '../dto/request/ActualizarAsesoriaRequest';


@Injectable({
  providedIn: 'root',
})

export class AsesoriaService {
    private apiUrl = `${BASE_URL}/coordinador/asesorias`;
    private docenteApiUrl = `${BASE_URL}/docente/asesorias`;
    private estudianteApiUrl = `${BASE_URL}/estudiante`;

    constructor(private http: HttpClient) { }

    listarAsesorias(): Observable<AsesoriaResponse[]> {
      return this.http.get<AsesoriaResponse[]>(this.apiUrl);
    }

    crearAsesoria(data: CrearAsesoriaRequest): Observable<string> {
      return this.http.post(`${this.apiUrl}/crear`, data,
        { responseType: 'text' }
      );
    }

    actualizarAsesoria(id: string, data: ActualizarAsesoriaRequest): Observable<string> {
      return this.http.put(`${this.apiUrl}/actualizar/${id}`,data,
        { responseType: 'text'}
      );
    }

    cancelarAsesoria(id: string): Observable<string> {
      return this.http.delete(`${this.apiUrl}/cancelar/${id}`,
        { responseType: 'text'}
      );
    }
    
    listarAsesoriasDocente(): Observable<AsesoriaResponse[]> {
        return this.http.get<AsesoriaResponse[]>(this.docenteApiUrl);
    }

    cambiarEstadoDocente(id: string, nuevoEstado: 'REALIZADA' | 'CANCELADA'): Observable<string> {
        return this.http.put(
            `${this.docenteApiUrl}/estado/${id}?nuevoEstado=${nuevoEstado}`, 
            null, 
            { responseType: 'text' }
        );
    }

    listarAsesoriasEstudiante(): Observable<AsesoriaResponse[]> {
      return this.http.get<AsesoriaResponse[]>(`${this.estudianteApiUrl}/asesorias`);
    }
}
