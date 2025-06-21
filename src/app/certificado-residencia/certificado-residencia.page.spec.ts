import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-certificado-residencia',
  templateUrl: './certificado-residencia.page.html',
  styleUrls: ['./certificado-residencia.page.scss'],
})
export class CertificadoResidenciaPage {
  constructor(private http: HttpClient) {}

  pagarCertificado() {
    // Si necesitas pedir datos al usuario, agrégalos aquí
    const datos = {
      // nombre: 'Ejemplo',
      // rut: '12345678-9',
      // direccion: 'Calle Falsa 123',
    };

    this.http.post<any>('/api/certificado/solicitar/', datos)
      .subscribe(res => {
        // Suponiendo que el backend responde con { webpay_url, token_ws }
        if (res.webpay_url && res.token_ws) {
          window.location.href = `${res.webpay_url}?token_ws=${res.token_ws}`;
        } else {
          alert('No se pudo iniciar el pago. Intenta nuevamente.');
        }
      }, err => {
        alert('Error al solicitar el certificado');
      });
  }
}