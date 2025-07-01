import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Publicacion, PublicacionResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private baseUrl = `${environment.apiUrl}/publicaciones/publicaciones`;
  private publicaciones: Publicacion[] = [];

  constructor(private http: HttpClient) {}

  // Métodos para trabajar con el backend
  getPublicaciones(): Observable<PublicacionResponse | Publicacion[]> {
    return this.http.get<PublicacionResponse | Publicacion[]>(this.baseUrl + '/');
  }

  createPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    console.log('Enviando publicación a:', `${this.baseUrl}/`);
    console.log('Datos de publicación:', publicacion);
    
    // Para manejar archivos, necesitamos FormData
    const formData = new FormData();
    formData.append('titulo', publicacion.titulo);
    formData.append('contenido', publicacion.contenido);
    formData.append('tipo', publicacion.tipo);
    
    // Campos opcionales para eventos
    if (publicacion.fecha_evento) {
      formData.append('fecha_evento', publicacion.fecha_evento);
    }
    
    if (publicacion.lugar_evento) {
      formData.append('lugar_evento', publicacion.lugar_evento);
    }
    
    // Agregar imagen si existe
    if (publicacion.imagen && publicacion.imagen instanceof File) {
      formData.append('imagen', publicacion.imagen);
    }

    console.log('FormData preparado para envío');

    return this.http.post<Publicacion>(`${this.baseUrl}/`, formData);
  }

  updatePublicacion(id: number, publicacion: Publicacion): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.baseUrl}/${id}/`, publicacion);
  }

  deletePublicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }

  // Métodos locales (para fallback o desarrollo)
  agregarPublicacion(publicacion: Publicacion) {
    this.publicaciones.unshift(publicacion);
  }

  obtenerPublicaciones(): Publicacion[] {
    return this.publicaciones;
  }

  eliminarPublicacion(index: number) {
    this.publicaciones.splice(index, 1);
  }
}
