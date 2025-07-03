import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { ArriendosService } from '../services/arriendos.service';
import { SolicitudArriendo } from '../models';

@Component({
  selector: 'app-solicitar-arriendo',
  templateUrl: './solicitar-arriendo.page.html',
  styleUrls: ['./solicitar-arriendo.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SolicitarArriendoPage implements OnInit {
  solicitudForm: FormGroup;
  loading = false;
  today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  constructor(
    private formBuilder: FormBuilder,
    private arriendosService: ArriendosService,
    private router: Router
  ) {
    this.solicitudForm = this.formBuilder.group({
      fecha_evento: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      motivo: ['', Validators.required],
      cantidad_asistentes: [1, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
  }

  ngOnInit() {}

  async crearSolicitud() {
    if (this.solicitudForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    // Verificar si hay token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Necesitas iniciar sesión para crear una solicitud');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    try {
      const formData = this.solicitudForm.value;
      const fechaEvento = formData.fecha_evento;
      
      const nuevaSolicitud: SolicitudArriendo = {
        fecha_evento: fechaEvento,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        motivo: formData.motivo,
        cantidad_asistentes: formData.cantidad_asistentes,
        observaciones: formData.observaciones
      };

      this.arriendosService.createSolicitud(nuevaSolicitud).subscribe({
        next: (response) => {
          console.log('Solicitud creada:', response);
          alert('Solicitud de arriendo creada exitosamente');
          this.limpiarFormulario();
          this.router.navigate(['/arriendos']);
        },
        error: (error) => {
          console.error('Error al crear solicitud:', error);
          
          if (error.status === 400 && error.error) {
            const errorMsg = typeof error.error === 'string' 
              ? error.error 
              : error.error.non_field_errors?.[0] || 'Error de validación';
            alert(errorMsg);
          } else if (error.status === 401) {
            alert('Error de autenticación. Por favor inicia sesión nuevamente.');
            this.router.navigate(['/login']);
          } else {
            alert('Error al crear la solicitud. Intenta nuevamente.');
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      this.loading = false;
      console.error('Error:', error);
      alert('Error inesperado al crear la solicitud');
    }
  }

  marcarCamposComoTocados() {
    Object.keys(this.solicitudForm.controls).forEach(key => {
      this.solicitudForm.get(key)?.markAsTouched();
    });
  }

  limpiarFormulario() {
    this.solicitudForm.reset();
    this.solicitudForm.patchValue({ cantidad_asistentes: 1 });
  }

  cancelar() {
    this.router.navigate(['/arriendos']);
  }

  validarHorarios() {
    const horaInicio = this.solicitudForm.get('hora_inicio')?.value;
    const horaFin = this.solicitudForm.get('hora_fin')?.value;
    
    if (horaInicio && horaFin) {
      const inicio = new Date(`2000-01-01T${horaInicio}`);
      const fin = new Date(`2000-01-01T${horaFin}`);
      
      if (fin <= inicio) {
        this.solicitudForm.get('hora_fin')?.setErrors({ 'horaInvalida': true });
      } else {
        this.solicitudForm.get('hora_fin')?.setErrors(null);
      }
    }
  }

  // Getters para validación en plantilla
  get fecha_evento() { return this.solicitudForm.get('fecha_evento'); }
  get hora_inicio() { return this.solicitudForm.get('hora_inicio'); }
  get hora_fin() { return this.solicitudForm.get('hora_fin'); }
  get motivo() { return this.solicitudForm.get('motivo'); }
  get cantidad_asistentes() { return this.solicitudForm.get('cantidad_asistentes'); }
  get observaciones() { return this.solicitudForm.get('observaciones'); }
}
