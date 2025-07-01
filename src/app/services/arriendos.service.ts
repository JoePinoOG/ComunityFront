import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArriendosService {
  private apiUrl = 'https://backendcomunity.onrender.com/api/arriendos/solicitudes/';

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes de arriendo
  getSolicitudes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Puedes agregar más métodos para POST, PUT, DELETE, etc.
}