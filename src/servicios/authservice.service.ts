import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backendcomunity.onrender.com/api/auth/';

  constructor(private http: HttpClient) {}


  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/token/`, { username, password });
  
  }

  
   refreshToken(refresh: string) {
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh });
  }


}