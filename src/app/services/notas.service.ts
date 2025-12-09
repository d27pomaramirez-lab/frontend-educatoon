import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { EstudianteActaDTO } from '../dto/response/EstudianteActaDTO';
import { RegistroNotasRequest } from '../dto/request/RegistroNotasRequest';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = `${BASE_URL}/coordinador/notas`;

  constructor(private http: HttpClient) {}

  obtenerActaPorSeccion(seccionId: string): Observable<EstudianteActaDTO[]> {
    return this.http.get<EstudianteActaDTO[]>(`${this.apiUrl}/acta/${seccionId}`);
  }

  registrarNotas(request: RegistroNotasRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, request, { responseType: 'text'});
  }
}