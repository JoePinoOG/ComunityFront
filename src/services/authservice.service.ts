export interface Usuario {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: string;
  direccion: string;
  telefono: string;
  rut: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class AuthService {
  private apiUrl = 'https://backendcomunity.onrender.com/api';

  constructor(private http: HttpClient) {}


  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/token/`, { username, password });
  
  }

  
   refreshToken(refresh: string) {
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh });
  }


  register(data: Usuario): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/usuarios/`, data);
}

}