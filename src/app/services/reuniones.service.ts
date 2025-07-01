import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Reunion {
  id?: number;
  titulo: string;
  fecha: string; // ISO 8601 format
  lugar: string;
  motivo: 'ORDINARIA' | 'EXTRAORDINARIA' | 'INFORMATIVA';
}

export interface ReunionResponse {
  count?: number;
  next?: string;
  previous?: string;
  results: Reunion[];
}

@Injectable({
  providedIn: 'root'
})
export class ReunionesService {
  private apiUrl = 'https://backendcomunity.onrender.com/api/reuniones';
  private reunionesSubject = new BehaviorSubject<Reunion[]>([]);
  public reuniones$ = this.reunionesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todas las reuniones
  getReuniones(): Observable<ReunionResponse | Reunion[]> {
    return this.http.get<ReunionResponse | Reunion[]>(`${this.apiUrl}/reuniones/`);
  }

  // Obtener una reunión específica
  getReunion(id: number): Observable<Reunion> {
    return this.http.get<Reunion>(`${this.apiUrl}/reuniones/${id}/`);
  }

  // Crear nueva reunión
  createReunion(reunion: Reunion): Observable<Reunion> {
    return this.http.post<Reunion>(`${this.apiUrl}/reuniones/`, reunion);
  }

  // Actualizar reunión
  updateReunion(id: number, reunion: Reunion): Observable<Reunion> {
    return this.http.put<Reunion>(`${this.apiUrl}/reuniones/${id}/`, reunion);
  }

  // Eliminar reunión
  deleteReunion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reuniones/${id}/`);
  }

  // Obtener reuniones por fecha específica
  getReunionesByDate(fecha: string): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/reuniones/?fecha=${fecha}`);
  }

  // Actualizar el subject con las reuniones actuales
  updateReuniones(reuniones: Reunion[]) {
    this.reunionesSubject.next(reuniones);
  }

  // Cargar reuniones y actualizar el subject
  loadReuniones() {
    this.getReuniones().subscribe({
      next: (response) => {
        let reuniones: Reunion[];
        if (Array.isArray(response)) {
          reuniones = response;
        } else {
          reuniones = response.results || [];
        }
        this.updateReuniones(reuniones);
      },
      error: (error) => {
        console.error('Error al cargar reuniones:', error);
      }
    });
  }
}
