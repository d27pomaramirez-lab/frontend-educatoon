import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { SeccionResponse } from '../dto/response/SeccionResponse';
import { SeccionRequest } from '../dto/request/SeccionRequest';
import { HorarioDTO } from '../dto/response/HorarioDTO';
import { SeccionConHorariosDTO } from '../dto/response/SeccionConHorarios';


@Injectable({
  providedIn: 'root',
})
export class SeccionService {

  private apiUrl2 = `${BASE_URL}/coordinador`;
  private apiUrl = `${BASE_URL}/secciones`;

  constructor(private http: HttpClient) { }

  listarSecciones(): Observable<SeccionResponse[]> {
    return this.http.get<SeccionResponse[]>(`${this.apiUrl2}/listar-secciones`);
  }

  registrarSeccion(data: SeccionRequest): Observable<string> {
    return this.http.post(`${this.apiUrl2}/registrar-seccion`, data, 
      { responseType: 'text' }
    );
  }

  actualizarSeccion(id: string, data: SeccionRequest): Observable<SeccionResponse> {
    return this.http.put<SeccionResponse>(`${this.apiUrl2}/actualizar-seccion/${id}`, data);
  }

  eliminarSeccion(id: string): Observable<SeccionResponse> {
    return this.http.delete<SeccionResponse>(`${this.apiUrl}/eliminar-seccion/${id}`);
  }

    // NUEVO: Obtener secciones con horarios
  obtenerSeccionesConHorarios(): Observable<SeccionConHorariosDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/con-horarios`).pipe(
      map(secciones => secciones.map(this.convertirASeccionConHorariosDTO))
    );
  }

  // NUEVO: Obtener secciones disponibles para un estudiante
  obtenerSeccionesDisponiblesParaEstudiante(estudianteId: string): Observable<SeccionConHorariosDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponibles/${estudianteId}`).pipe(
      map(secciones => secciones.map(this.convertirASeccionConHorariosDTO))
    );
  }

  private convertirASeccionConHorariosDTO(data: any): SeccionConHorariosDTO {
    const horarios: HorarioDTO[] = data.horarios?.map((h: any) => ({
      diaSemana: h.diaSemana,
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      horarioFormateado: `${h.diaSemana} ${h.horaInicio}-${h.horaFin}`
    })) || [];

    return {
      id: data.id,
      codigoSeccion: data.codigoSeccion,
      cursoNombre: data.cursoNombre || data.curso?.nombre || 'Sin curso',
      aula: data.aula || 'No asignada',
      docenteNombre: data.docenteNombre || data.docente?.nombreCompleto || 'No asignado',
      capacidad: data.capacidad || 0,
      inscritos: data.inscritos || 0,
      cuposDisponibles: data.cuposDisponibles || 0,
      horarios: horarios
    };
  }
}
