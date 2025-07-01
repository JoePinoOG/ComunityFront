import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Publicacion, PublicacionResponse } from '../models';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private baseUrl = `${environment.apiUrl}/publicaciones/publicaciones`;
  private publicaciones: Publicacion[] = [];

  constructor(private http: HttpClient, private notificationsService: NotificationsService) {}

  // Métodos para trabajar con el backend
  getPublicaciones(): Observable<PublicacionResponse | Publicacion[]> {
    return this.http.get<PublicacionResponse | Publicacion[]>(this.baseUrl + '/');
  }

  createPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    console.log('Enviando publicación a:', `${this.baseUrl}/`);
    console.log('Datos de publicación:', publicacion);
    
    // Preparar datos JSON con imagen base64
    const publicacionData = {
      titulo: publicacion.titulo,
      contenido: publicacion.contenido,
      tipo: publicacion.tipo,
      ...(publicacion.fecha_evento && { fecha_evento: publicacion.fecha_evento }),
      ...(publicacion.lugar_evento && { lugar_evento: publicacion.lugar_evento }),
      ...(publicacion.imagen && { imagen: publicacion.imagen })
    };

    console.log('Datos JSON preparados para envío:', publicacionData);

    return this.http.post<Publicacion>(`${this.baseUrl}/`, publicacionData).pipe(
      tap((newPublicacion) => {
        // Incrementar el contador de notificaciones cuando se crea una nueva publicación
        this.notificationsService.incrementUnreadPublications();
      })
    );
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
