import { Injectable } from '@angular/core';
import { BASE_URL } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsesoriaResponse } from '../dto/response/AsesoriaResponse';
import { CrearAsesoriaRequest } from '../dto/request/CrearAsesoriaRequest';
import { UsuarioPendienteResponse } from '../dto/response/UsuarioPendienteResponse';


@Injectable({
  providedIn: 'root',
})

export class AsesoriaService {
    private apiUrl = `${BASE_URL}/coordinador/asesorias`;

    constructor(private http: HttpClient) { }

    listarAsesorias(): Observable<AsesoriaResponse[]> {
      return this.http.get<AsesoriaResponse[]>(this.apiUrl);
    }

    crearAsesoria(data: CrearAsesoriaRequest): Observable<string> {
      return this.http.post(`${this.apiUrl}/crear`, data,
        { responseType: 'text' }
      );
    }
    
}
