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
  private arriendosBaseUrl = `${environment.apiUrl}/arriendos/`;

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

  // Aprobar o rechazar solicitud (solo admins)
  aprobarSolicitud(id: number, data: {accion: 'APROBAR' | 'RECHAZAR', observaciones?: string, monto_pago?: number}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${id}/aprobar/`, data);
  }

  // Subir comprobante de pago como base64
  subirComprobantePago(id: number, comprobanteBase64: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${id}/subir-comprobante/`, { 
      comprobante_pago_base64: comprobanteBase64 
    });
  }

  // Marcar como pagado (solo admins)
  marcarPagado(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${id}/marcar-pagado/`, {});
  }

  // Eliminar una solicitud
  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Obtener disponibilidad para una fecha específica
  getDisponibilidad(fecha: string): Observable<{
    fecha: string,
    ocupados: {inicio: string, fin: string, motivo: string, solicitante: string, estado: string}[],
    disponibles: {inicio: string, fin: string}[],
    total_reservas: number
  }> {
    return this.http.get<any>(`${this.arriendosBaseUrl}disponibilidad/?fecha=${fecha}`);
  }

  // Obtener estadísticas de arriendos (solo admins)
  getEstadisticas(): Observable<{
    resumen: {
      total_solicitudes: number,
      solicitudes_mes: number,
      ingresos_mes: number,
      pendientes_revision: number,
      con_comprobante_pendiente: number
    },
    por_estado: {[key: string]: number},
    proximos_eventos: any[]
  }> {
    return this.http.get<any>(`${this.arriendosBaseUrl}estadisticas/`);
  }

  // MÉTODOS LEGACY PARA COMPATIBILIDAD
  
  // Subir comprobante usando FormData (legacy)
  subirComprobanteEspecifico(id: number, formData: FormData): Observable<{mensaje: string, comprobante_url: string}> {
    // Convertir FormData a base64 y usar el método nuevo
    const file = formData.get('comprobante_pago') as File;
    return new Observable(observer => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.subirComprobantePago(id, base64String).subscribe({
            next: (response) => observer.next({mensaje: 'Comprobante subido', comprobante_url: ''}),
            error: (error) => observer.error(error)
          });
        };
        reader.readAsDataURL(file);
      } else {
        observer.error('No se encontró archivo');
      }
    });
  }

  // Obtener comprobante de pago (si el backend lo requiere por separado)
  obtenerComprobantePago(id: number): Observable<{comprobante_pago: string}> {
    return this.http.get<{comprobante_pago: string}>(`${this.apiUrl}${id}/comprobante/`);
  }
}