import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SolicitudArriendo, ArriendoResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ArriendosService {
  private apiUrl = `${environment.apiUrl}/arriendos/solicitudes/`;

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes de arriendo
  getSolicitudes(): Observable<ArriendoResponse | SolicitudArriendo[]> {
    return this.http.get<ArriendoResponse | SolicitudArriendo[]>(this.apiUrl);
  }

  // Obtener solicitudes del usuario logueado
  getMisSolicitudes(): Observable<ArriendoResponse | SolicitudArriendo[]> {
    return this.http.get<ArriendoResponse | SolicitudArriendo[]>(`${this.apiUrl}mis-solicitudes/`);
  }

  // Crear una nueva solicitud de arriendo
  createSolicitud(solicitud: SolicitudArriendo): Observable<SolicitudArriendo> {
    return this.http.post<SolicitudArriendo>(this.apiUrl, solicitud);
  }

  // Obtener una solicitud específica por ID
  getSolicitudById(id: number): Observable<SolicitudArriendo> {
    return this.http.get<SolicitudArriendo>(`${this.apiUrl}${id}/`);
  }

  // Actualizar una solicitud existente
  updateSolicitud(id: number, solicitud: Partial<SolicitudArriendo>): Observable<SolicitudArriendo> {
    return this.http.patch<SolicitudArriendo>(`${this.apiUrl}${id}/`, solicitud);
  }

  // Subir comprobante de pago como url64 (cadena base64 con prefijo de tipo de imagen)
  // Formato esperado: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
  subirComprobantePago(id: number, comprobanteUrl64: string): Observable<SolicitudArriendo> {
    return this.http.patch<SolicitudArriendo>(`${this.apiUrl}${id}/`, { 
      comprobante_pago: comprobanteUrl64 
    });
  }

  // Obtener comprobante de pago (si el backend lo requiere por separado)
  obtenerComprobantePago(id: number): Observable<{comprobante_pago: string}> {
    return this.http.get<{comprobante_pago: string}>(`${this.apiUrl}${id}/comprobante/`);
  }

  // Eliminar una solicitud
  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Subir comprobante de pago usando el endpoint específico
  subirComprobanteEspecifico(id: number, formData: FormData): Observable<{mensaje: string, comprobante_url: string}> {
    return this.http.post<{mensaje: string, comprobante_url: string}>(`${this.apiUrl}${id}/subir-comprobante/`, formData);
  }

  // Obtener disponibilidad para una fecha específica
  getDisponibilidad(fecha: string): Observable<{ocupados: {inicio: string, fin: string}[]}> {
    return this.http.get<{ocupados: {inicio: string, fin: string}[]}>(`${environment.apiUrl}/arriendos/disponibilidad/?fecha=${fecha}`);
  }
}