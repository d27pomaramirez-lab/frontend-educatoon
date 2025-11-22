import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';
import { RegistroEstudianteRequest } from '../dto/request/RegistroEstudianteRequest';
import { JwtResponse } from '../dto/response/JwtResponse';
import { LoginRequest } from '../dto/request/LoginRequest';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<JwtResponse> {    
    return this.http.post<JwtResponse>(`${BASE_URL}/auth/login`, credentials);
  }

  register(data: RegistroEstudianteRequest): Observable<string> {
    return this.http.post(`${BASE_URL}/auth/register-student`, data, { 
      responseType: 'text' 
    });
  }
  
}