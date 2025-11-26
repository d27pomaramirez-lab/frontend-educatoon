import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { SeccionResponse } from '../dto/response/SeccionResponse';
import { SeccionRequest } from '../dto/request/SeccionRequest';


@Injectable({
  providedIn: 'root',
})
export class SeccionService {

  private apiUrl = `${BASE_URL}/coordinador`;

  constructor(private http: HttpClient) { }

  listarSecciones(): Observable<SeccionResponse[]> {
    return this.http.get<SeccionResponse[]>(`${this.apiUrl}/listar-secciones`);
  }

  registrarSeccion(data: SeccionRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/registrar-seccion`, data, 
      { responseType: 'text' }
    );
  }

  actualizarSeccion(id: string, data: SeccionRequest): Observable<SeccionResponse> {
    return this.http.put<SeccionResponse>(`${this.apiUrl}/actualizar-seccion/${id}`, data);
  }

  eliminarSeccion(id: string): Observable<SeccionResponse> {
    return this.http.delete<SeccionResponse>(`${this.apiUrl}/eliminar-seccion/${id}`);
  }
}
