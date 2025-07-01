import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { PublicacionesService } from '../services/publicaciones.service';
import { Publicacion, TIPOS_PUBLICACION } from '../models';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class PublicarPage implements OnInit {
  publicacionForm: FormGroup;
  imagenSeleccionada: File | null = null;
  loading = false;
  tiposPublicacion = TIPOS_PUBLICACION;

  constructor(
    private formBuilder: FormBuilder,
    private publicacionesService: PublicacionesService,
    private router: Router
  ) {
    this.publicacionForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      contenido: ['', [Validators.required]],
      tipo: ['ANUNCIO', Validators.required]
    });
  }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      this.imagenSeleccionada = file;
    }
  }

  async crearPublicacion() {
    if (this.publicacionForm.invalid) {
      this.marcarCamposComoTocados();
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Verificar si hay token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Necesitas iniciar sesión para crear una publicación');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    try {
      const formData = this.publicacionForm.value;
      
      const nuevaPublicacion: Publicacion = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        tipo: formData.tipo,
        imagen: this.imagenSeleccionada || undefined
      };

      console.log('Intentando crear publicación:', nuevaPublicacion);

      this.publicacionesService.createPublicacion(nuevaPublicacion).subscribe({
        next: (response) => {
          console.log('Publicación creada:', response);
          alert('Publicación creada exitosamente');
          this.limpiarFormulario();
          this.router.navigate(['/anuncios']);
        },
        error: (error) => {
          console.error('Error al crear publicación:', error);
          
          if (error.status === 405) {
            alert('Error: El método no está permitido. Verifica la configuración del backend.');
          } else if (error.status === 401) {
            alert('Error de autenticación. Por favor inicia sesión nuevamente.');
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            alert('No tienes permisos para crear publicaciones.');
          } else {
            alert('Error al crear la publicación. Intenta nuevamente.');
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      this.loading = false;
      console.error('Error:', error);
      alert('Error inesperado al crear la publicación');
    }
  }

  marcarCamposComoTocados() {
    Object.keys(this.publicacionForm.controls).forEach(key => {
      this.publicacionForm.get(key)?.markAsTouched();
    });
  }

  limpiarFormulario() {
    this.publicacionForm.reset();
    this.publicacionForm.patchValue({ tipo: 'ANUNCIO' });
    this.imagenSeleccionada = null;
  }

  cancelar() {
    this.router.navigate(['/anuncios']);
  }

  // Getters para validación en template
  get titulo() { return this.publicacionForm.get('titulo'); }
  get contenido() { return this.publicacionForm.get('contenido'); }
  get tipo() { return this.publicacionForm.get('tipo'); }
}
