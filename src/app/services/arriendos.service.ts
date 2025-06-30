import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArriendosService {
  private apiUrl = 'https://backendcomunity.onrender.com/api/arriendos/solicitudes/'; // Cambia la URL si tu backend está en otro host

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes de arriendo
  getSolicitudes(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  // Puedes agregar más métodos para POST, PUT, DELETE, etc.
}