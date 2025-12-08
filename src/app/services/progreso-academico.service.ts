import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../utils/constants';
import { Observable } from 'rxjs';
import { ProgresoResumenDTO } from '../dto/response/ProgresoResumenDTO';

@Injectable({
  providedIn: 'root',
})
export class ProgresoAcademicoService {
  private apiUrl = `${BASE_URL}/estudiante`; 

  constructor(private http: HttpClient) {}

  consultarProgreso(dni: string): Observable<ProgresoResumenDTO[] | { mensaje: string }> {
    return this.http.get<ProgresoResumenDTO[] | { mensaje: string }>(
      `${this.apiUrl}/progreso-academico/${dni}`
    );
  }
}
