import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Usuario } from '../models';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})



export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}


  login(username: string, password: string) {
    console.log('Intentando login con:', { username, apiUrl: this.apiUrl });
    return this.httpService.post(`${this.apiUrl}/token/`, { username, password });
  }

  
   refreshToken(refresh: string) {
    return this.httpService.post(`${this.apiUrl}/token/refresh/`, { refresh });
  }


  register(data: Usuario): Observable<any> {
    return this.httpService.post(`${this.apiUrl}/auth/usuarios/`, data);
  }
  
  getProfile(): Observable<Usuario> {
    return this.httpService.get(`${this.apiUrl}/auth/me/`);
  }

  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    return this.httpService.put(`${this.apiUrl}/auth/me/`, userData);
  }
 getUserInfo(): Usuario | null {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode<Usuario>(token);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getTokenAsync(): Promise<string | null> {
    return localStorage.getItem('token');
  }


}