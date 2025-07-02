import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificadosService {
  private baseUrl = `${environment.apiUrl}/documentos/`; // Cambia el host si es producción

  constructor(private http: HttpClient) {}

  // Obtener configuración del certificado
  getConfig(): Observable<any> {
    return this.http.get(this.baseUrl + 'config/');
  }

  // Solicitar un nuevo certificado (requiere autenticación)
  solicitarCertificado(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.baseUrl + 'api/certificado/solicitar/', data, { headers });
  }

  // Callback de Webpay (GET, normalmente lo usa Webpay, pero puedes consultarlo)
  webpayCallback(token_ws: string): Observable<any> {
    return this.http.get(this.baseUrl + `webpay-callback/?token_ws=${token_ws}`);
  }

  // Descargar certificado generado (requiere autenticación)
  descargarCertificado(id: number, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.baseUrl + `${id}/descargar/`, { headers, responseType: 'blob' });
  }
}