import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { BASE_URL } from '../../utils/constants';

interface LoginResponse {
  token: string;
  email: string;
  authorities: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<LoginResponse> {    
    return this.http.post<LoginResponse>(`${BASE_URL}/auth/login`, credentials);
  }

  register(data: any): Observable<string> {
    return this.http.post(`${BASE_URL}/auth/register-student`, data, { 
      responseType: 'text' 
    });
  }
  
}