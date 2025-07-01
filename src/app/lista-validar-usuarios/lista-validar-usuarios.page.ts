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
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonChip,
  IonTextarea,
  IonModal,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle, 
  closeCircle, 
  timeOutline, 
  personOutline,
  mailOutline,
  homeOutline,
  callOutline,
  idCardOutline,
  informationCircleOutline,
  statsChartOutline,
  refreshOutline
} from 'ionicons/icons';

import { ValidacionUsuariosService } from '../services/validacion-usuarios.service';
import { UsuarioValidacion, ValidarUsuarioRequest, EstadisticasValidacion } from '../models';

@Component({
  selector: 'app-lista-validar-usuarios',
  templateUrl: './lista-validar-usuarios.page.html',
  styleUrls: ['./lista-validar-usuarios.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon,
    IonItem, IonLabel, IonList, IonBadge, IonRefresher, IonRefresherContent,
    IonSpinner, IonGrid, IonRow, IonCol, IonText,
    IonChip, IonTextarea, IonModal
  ]
})
export class ListaValidarUsuariosPage implements OnInit {
  usuariosPendientes: UsuarioValidacion[] = [];
  estadisticas: EstadisticasValidacion | null = null;
  isLoading = false;
  showObservacionModal = false;
  observacion = '';
  usuarioSeleccionado: UsuarioValidacion | null = null;
  accionSeleccionada: 'APROBAR' | 'RECHAZAR' | null = null;

  constructor(
    private validacionService: ValidacionUsuariosService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({
      checkmarkCircle,
      closeCircle,
      timeOutline,
      personOutline,
      mailOutline,
      homeOutline,
      callOutline,
      idCardOutline,
      informationCircleOutline,
      statsChartOutline,
      refreshOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.cargarUsuariosPendientes(),
        this.cargarEstadisticas()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar datos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async cargarUsuariosPendientes() {
    try {
      const response = await this.validacionService.getUsuariosPendientes().toPromise();
      this.usuariosPendientes = response?.usuarios_pendientes || [];
    } catch (error) {
      console.error('Error al cargar usuarios pendientes:', error);
      throw error;
    }
  }

  async cargarEstadisticas() {
    try {
      const response = await this.validacionService.getEstadisticasValidacion().toPromise();
      this.estadisticas = response || null;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      throw error;
    }
  }

  async onRefresh(event: any) {
    try {
      await this.cargarDatos();
    } finally {
      event.target.complete();
    }
  }

  async prepararValidacion(usuario: UsuarioValidacion, accion: 'APROBAR' | 'RECHAZAR') {
    this.usuarioSeleccionado = usuario;
    this.accionSeleccionada = accion;
    
    if (accion === 'RECHAZAR') {
      // Para rechazar, mostrar modal para observación obligatoria
      this.observacion = '';
      this.showObservacionModal = true;
    } else {
      // Para aprobar, mostrar confirmación directa
      const alert = await this.alertController.create({
        header: 'Confirmar Aprobación',
        message: `¿Estás seguro de que deseas aprobar a ${usuario.first_name} ${usuario.last_name}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aprobar',
            handler: () => {
              this.validarUsuario(usuario, 'APROBAR');
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async validarUsuario(usuario?: UsuarioValidacion, accion?: 'APROBAR' | 'RECHAZAR', observacion?: string) {
    const usuarioAValidar = usuario || this.usuarioSeleccionado;
    const accionAEjecutar = accion || this.accionSeleccionada;
    
    if (!usuarioAValidar || !accionAEjecutar) return;

    const loading = await this.loadingController.create({
      message: accionAEjecutar === 'APROBAR' ? 'Aprobando usuario...' : 'Rechazando usuario...'
    });
    await loading.present();

    try {
      const data: ValidarUsuarioRequest = {
        accion: accionAEjecutar,
        observacion: observacion || this.observacion || undefined
      };

      await this.validacionService.validarUsuario(usuarioAValidar.id, data).toPromise();
      
      // Actualizar la lista local
      this.usuariosPendientes = this.usuariosPendientes.filter(u => u.id !== usuarioAValidar.id);
      
      // Actualizar estadísticas
      await this.cargarEstadisticas();
      
      const mensaje = accionAEjecutar === 'APROBAR' 
        ? `Usuario ${usuarioAValidar.first_name} ${usuarioAValidar.last_name} aprobado exitosamente`
        : `Usuario ${usuarioAValidar.first_name} ${usuarioAValidar.last_name} rechazado`;
      
      this.mostrarToast(mensaje, 'success');
      
      // Limpiar variables
      this.limpiarSeleccion();
      
    } catch (error: any) {
      console.error('Error al validar usuario:', error);
      const mensaje = error?.error?.error || 'Error al procesar la validación';
      this.mostrarToast(mensaje, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  confirmarValidacionConObservacion() {
    if (this.accionSeleccionada === 'RECHAZAR' && !this.observacion.trim()) {
      this.mostrarToast('La observación es obligatoria para rechazar un usuario', 'warning');
      return;
    }
    
    this.showObservacionModal = false;
    this.validarUsuario();
  }

  cancelarValidacion() {
    this.limpiarSeleccion();
    this.showObservacionModal = false;
  }

  limpiarSeleccion() {
    this.usuarioSeleccionado = null;
    this.accionSeleccionada = null;
    this.observacion = '';
  }

  getRolColor(rol: string): string {
    switch (rol) {
      case 'PRESIDENTE': return 'danger';
      case 'SECRETARIO': return 'warning';
      case 'TESORERO': return 'success';
      case 'VECINO': return 'primary';
      default: return 'medium';
    }
  }

  getRolDisplayName(rol: string): string {
    switch (rol) {
      case 'PRESIDENTE': return 'Presidente';
      case 'SECRETARIO': return 'Secretario';
      case 'TESORERO': return 'Tesorero';
      case 'VECINO': return 'Vecino';
      default: return rol;
    }
  }

  private async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
