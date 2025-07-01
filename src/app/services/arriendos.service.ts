import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Arriendo, ArriendoResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ArriendosService {
  private apiUrl = `${environment.apiUrl}/arriendos/solicitudes/`;

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes de arriendo
  getSolicitudes(): Observable<ArriendoResponse | Arriendo[]> {
    return this.http.get<ArriendoResponse | Arriendo[]>(this.apiUrl);
  }

  // Crear una nueva solicitud de arriendo
  createSolicitud(arriendo: Arriendo): Observable<Arriendo> {
    return this.http.post<Arriendo>(this.apiUrl, arriendo);
  }

  // Puedes agregar más métodos para POST, PUT, DELETE, etc.
}