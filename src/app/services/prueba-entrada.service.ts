import { Injectable } from '@angular/core';
import { BASE_URL } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPruebaRequest } from '../dto/request/CrearPruebaRequest';
import { PruebaEntradaDTO } from '../dto/response/PruebaEntradaDTO';
import { AsignacionAulaDTO } from '../dto/response/AsignacionAulaDTO';

@Injectable({ providedIn: 'root' })
export class PruebaEntradaService {

  private apiUrl = BASE_URL+'/pruebas-entrada';

  constructor(private http: HttpClient) {}

  registrarPrueba(request: CrearPruebaRequest): Observable<PruebaEntradaDTO> {
    return this.http.post<PruebaEntradaDTO>(this.apiUrl, request);
  }

  obtenerPruebasPorEstado(estado: string): Observable<PruebaEntradaDTO[]> {
    return this.http.get<PruebaEntradaDTO[]>(`${this.apiUrl}/estado/${estado}`);
  }

  obtenerReporteAsignaciones(): Observable<AsignacionAulaDTO[]> {
    return this.http.get<AsignacionAulaDTO[]>(`${this.apiUrl}/reporte-asignaciones`);
  }

  obtenerAsignacionPorEstudiante(estudianteId: string): Observable<AsignacionAulaDTO> {
    return this.http.get<AsignacionAulaDTO>(`${this.apiUrl}/asignaciones/estudiante/${estudianteId}`);
  }

  obtenerAsignacionesPorEstado(estado: string): Observable<AsignacionAulaDTO[]> {
    return this.http.get<AsignacionAulaDTO[]>(`${this.apiUrl}/asignaciones/estado/${estado}`);
  }
}