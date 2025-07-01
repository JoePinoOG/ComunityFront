import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonAvatar,
  IonChip,
  IonButtons,
  IonBackButton,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../services/authservice.service';
import { Usuario } from '../models';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  callOutline, 
  locationOutline, 
  idCardOutline, 
  homeOutline,
  createOutline,
  saveOutline,
  closeOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonAvatar,
    IonChip,
    IonButtons,
    IonBackButton,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class PerfilUsuarioPage implements OnInit {
  usuario: Usuario | null = null;
  perfilForm: FormGroup;
  loading = true;
  saving = false;
  editMode = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      idCardOutline,
      homeOutline,
      createOutline,
      saveOutline,
      closeOutline,
      logOutOutline
    });

    this.perfilForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]{8,15}$/)]],
      direccion: [''],
      rut: ['', [Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]],
      junta_vecinos: ['']
    });
  }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.loading = true;
    this.error = null;

    this.authService.getProfile().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.perfilForm.patchValue({
          first_name: usuario.first_name || '',
          last_name: usuario.last_name || '',
          email: usuario.email || '',
          telefono: usuario.telefono || '',
          direccion: usuario.direccion || '',
          rut: usuario.rut || '',
          junta_vecinos: usuario.junta_vecinos || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.error = 'Error al cargar la información del perfil';
        this.loading = false;
        
        if (error.status === 401) {
          this.mostrarToast('Sesión expirada. Por favor inicia sesión nuevamente.', 'danger');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Si cancelamos la edición, restauramos los valores originales
      this.cargarPerfil();
    }
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      this.marcarCamposComoTocados();
      this.mostrarToast('Por favor corrige los errores en el formulario', 'warning');
      return;
    }

    const confirmAlert = await this.alertController.create({
      header: 'Confirmar cambios',
      message: '¿Estás seguro de que deseas guardar los cambios en tu perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: () => {
            this.ejecutarGuardado();
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  ejecutarGuardado() {
    this.saving = true;
    const datosActualizados = this.perfilForm.value;

    this.authService.updateProfile(datosActualizados).subscribe({
      next: (usuarioActualizado) => {
        this.usuario = usuarioActualizado;
        this.saving = false;
        this.editMode = false;
        this.mostrarToast('Perfil actualizado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.saving = false;
        
        if (error.status === 401) {
          this.mostrarToast('Sesión expirada. Por favor inicia sesión nuevamente.', 'danger');
          this.router.navigate(['/login']);
        } else if (error.status === 400) {
          this.mostrarToast('Datos inválidos. Por favor revisa la información.', 'warning');
        } else {
          this.mostrarToast('Error al actualizar el perfil. Intenta nuevamente.', 'danger');
        }
      }
    });
  }

  marcarCamposComoTocados() {
    Object.keys(this.perfilForm.controls).forEach(key => {
      this.perfilForm.get(key)?.markAsTouched();
    });
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  // Getters para validación en template
  get firstName() { return this.perfilForm.get('first_name'); }
  get lastName() { return this.perfilForm.get('last_name'); }
  get email() { return this.perfilForm.get('email'); }
  get telefono() { return this.perfilForm.get('telefono'); }
  get direccion() { return this.perfilForm.get('direccion'); }
  get rut() { return this.perfilForm.get('rut'); }
  get juntaVecinos() { return this.perfilForm.get('junta_vecinos'); }

  getRolDisplayName(rol: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'Administrador',
      'resident': 'Residente',
      'board_member': 'Miembro de Junta',
      'user': 'Usuario'
    };
    return roles[rol] || rol;
  }

  getInitials(): string {
    if (!this.usuario) return 'U';
    const firstName = this.usuario.first_name || '';
    const lastName = this.usuario.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
