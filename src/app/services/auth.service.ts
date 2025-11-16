import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';

interface LoginResponse {
  token: string;
  email: string;
  authorities: any[];
}

export interface RegistroEstudianteRequest {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date;
  carreraPostular: string;
  universidadPostular: string;
  colegioProcedencia: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<LoginResponse> {    
    return this.http.post<LoginResponse>(`${BASE_URL}/auth/login`, credentials);
  }

  register(data: RegistroEstudianteRequest): Observable<string> {
    return this.http.post(`${BASE_URL}/auth/register-student`, data, { 
      responseType: 'text' 
    });
  }
  
}