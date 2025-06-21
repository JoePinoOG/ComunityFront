import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-certificado-residencia',
  templateUrl: './certificado-residencia.page.html',
  styleUrls: ['./certificado-residencia.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class CertificadoResidenciaPage implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  pagarCertificado() {
    // No es necesario enviar datos, el backend usará el usuario autenticado
    this.http.post<any>('/api/certificado/solicitar/', {})
      .subscribe(res => {
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
