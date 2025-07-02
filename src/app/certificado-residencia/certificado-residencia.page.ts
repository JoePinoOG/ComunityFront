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
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { CertificadosService } from '../services/certificado-residencia.service'; // importa el servicio
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
    IonSpinner, // <-- AGREGA ESTA LÍNEA
    CommonModule,
    FormsModule
  ]
})
export class CertificadoResidenciaPage implements OnInit {
  loading = false;

  constructor(
    private http: HttpClient,
    private certificadosService: CertificadosService,
    private toastController: ToastController,
    private route: ActivatedRoute // <--- agrega esto
  ) { }

  ngOnInit() {
    // Detecta si hay token_ws en la URL (callback de Webpay)
    this.route.queryParams.subscribe(params => {
      const token_ws = params['token_ws'];
      if (token_ws) {
        this.validarPagoYDescargar(token_ws);
      }
    });
  }

  async pagarCertificado() {
    this.loading = true;
    // Aquí deberías obtener el token de autenticación del usuario logueado
    const token = localStorage.getItem('token'); // ajusta según tu auth
    if (!token) {
      this.loading = false;
      this.showToast('Debes iniciar sesión para solicitar el certificado');
      return;
    }
    this.certificadosService.solicitarCertificado({}, token).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.webpay_url && res.token_ws) {
          window.location.href = `${res.webpay_url}?token_ws=${res.token_ws}`;
        } else {
          this.showToast('No se pudo iniciar el pago. Intenta nuevamente.');
        }
      },
      error: () => {
        this.loading = false;
        this.showToast('Error al solicitar el certificado');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'danger'
    });
    toast.present();
  }

  validarPagoYDescargar(token_ws: string) {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.loading = false;
      this.showToast('Debes iniciar sesión para descargar el certificado');
      return;
    }
    // 1. Valida el pago con el backend
    this.certificadosService.webpayCallback(token_ws).subscribe({
      next: (res) => {
        if (res && res.certificado_id) {
          // 2. Descarga el certificado
          this.certificadosService.descargarCertificado(res.certificado_id, token).subscribe({
            next: (blob) => {
              this.loading = false;
              // Descarga el archivo PDF
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'certificado_residencia.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
              this.showToast('¡Certificado descargado!');
            },
            error: () => {
              this.loading = false;
              this.showToast('No se pudo descargar el certificado');
            }
          });
        } else {
          this.loading = false;
          this.showToast('No se pudo validar el pago');
        }
      },
      error: () => {
        this.loading = false;
        this.showToast('Error al validar el pago');
      }
    });
  }
}
