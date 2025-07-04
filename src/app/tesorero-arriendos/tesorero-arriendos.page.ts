import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonAlert,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonImg,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonToast
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  calendar, 
  time, 
  people, 
  checkmark, 
  close, 
  eye,
  list, 
  home,
  camera,
  document,
  warning,
  refresh,
  cashOutline,
  banOutline, 
  arrowBack, 
  checkmarkCircle 
} from 'ionicons/icons';
import { ArriendosService } from '../services/arriendos.service';
import { AuthService } from '../services/authservice.service';
import { SolicitudArriendo, Usuario, ROLES_PERMITIDOS } from '../models';

@Component({
  selector: 'app-tesorero-arriendos',
  templateUrl: './tesorero-arriendos.page.html',
  styleUrls: ['./tesorero-arriendos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonAlert,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonImg,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonToast
  ]
})
export class TesoreroArriendosPage implements OnInit {
  @ViewChild('detailModal', { static: false }) detailModal!: IonModal;
  @ViewChild('imageModal', { static: false }) imageModal!: IonModal;
  @ViewChild('approvalAlert', { static: false }) approvalAlert!: IonAlert;

  solicitudes: SolicitudArriendo[] = [];
  solicitudesFiltradas: SolicitudArriendo[] = [];
  selectedSolicitud: SolicitudArriendo | null = null;
  selectedImage: string = '';
  isDetailModalOpen = false;
  isImageModalOpen = false;
  isApprovalAlertOpen = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'success';
  userInfo: Usuario | null = null;
  filterEstado: string = 'todas';
  
  // Observaciones para aprobar/rechazar
  observacionesAprobacion: string = '';
  accionAprobacion: 'aprobar' | 'rechazar' = 'aprobar';
  montoAprobacion: number = 50000; // Monto por defecto

  // Alert buttons configuration
  approvalAlertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.isApprovalAlertOpen = false;
        this.observacionesAprobacion = '';
      }
    },
    {
      text: 'Confirmar',
      role: 'confirm',
      handler: (data: any) => {
        this.observacionesAprobacion = data.observaciones || '';
        this.procesarAprobacion();
      }
    }
  ];

  constructor(
    private arriendosService: ArriendosService,
    private authService: AuthService
  ) {
    addIcons({arrowBack,cashOutline,list,home,checkmark,close,camera,document,calendar,time,people,eye,banOutline,warning,checkmarkCircle,refresh});
  }

  ngOnInit() {
    this.loadSolicitudes();
    this.checkUserPermissions();
  }

  checkUserPermissions() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.userInfo = user;
        console.log('Usuario logeado en tesorero arriendos:', this.userInfo);
        // Verificar que sea tesorero
        if (!this.esTesorero()) {
          console.warn('Usuario no autorizado para esta página');
          // Aquí podrías redirigir o mostrar mensaje de error
        }
      },
      error: (err) => {
        console.log('Error al obtener perfil en tesorero arriendos:', err);
      }
    });
  }

  esTesorero(): boolean {
    return this.userInfo?.rol === 'TESORERO' || ROLES_PERMITIDOS.includes(this.userInfo?.rol || '');
  }

  loadSolicitudes() {
    this.arriendosService.getSolicitudes().subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (Array.isArray(response)) {
          this.solicitudes = response;
        } else {
          this.solicitudes = response.results || [];
        }
        this.filtrarSolicitudes();
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.solicitudes = [];
        this.solicitudesFiltradas = [];
      }
    });
  }

  filtrarSolicitudes() {
    if (this.filterEstado === 'todas') {
      this.solicitudesFiltradas = this.solicitudes;
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(
        solicitud => solicitud.estado === this.filterEstado
      );
    }
  }

  onFilterChange(event: any) {
    this.filterEstado = event.detail.value;
    this.filtrarSolicitudes();
  }

  openDetailModal(solicitud: SolicitudArriendo) {
    this.selectedSolicitud = solicitud;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedSolicitud = null;
  }

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImage = '';
  }

  confirmarAprobacion(solicitud: SolicitudArriendo, accion: 'aprobar' | 'rechazar') {
    this.selectedSolicitud = solicitud;
    this.accionAprobacion = accion;
    this.observacionesAprobacion = '';
    this.isApprovalAlertOpen = true;
  }

  procesarAprobacion() {
    if (!this.selectedSolicitud?.id) return;

    const data = {
      accion: this.accionAprobacion === 'aprobar' ? 'APROBAR' as const : 'RECHAZAR' as const,
      observaciones: this.observacionesAprobacion || (this.accionAprobacion === 'aprobar' ? 'Aprobado por tesorero' : 'Rechazado por tesorero'),
      ...(this.accionAprobacion === 'aprobar' && this.montoAprobacion && { monto_pago: this.montoAprobacion })
    };

    this.arriendosService.aprobarSolicitud(this.selectedSolicitud.id, data).subscribe({
      next: (response) => {
        const accionTexto = this.accionAprobacion === 'aprobar' ? 'aprobada' : 'rechazada';
        console.log(`Solicitud ${accionTexto} exitosamente:`, response);
        
        // Mostrar toast de éxito
        this.toastMessage = `Solicitud ${accionTexto} exitosamente`;
        this.toastColor = this.accionAprobacion === 'aprobar' ? 'success' : 'warning';
        this.isToastOpen = true;
        
        this.loadSolicitudes();
        this.closeDetailModal();
        this.isApprovalAlertOpen = false;
        this.observacionesAprobacion = '';
      },
      error: (error) => {
        console.error('Error al procesar aprobación:', error);
        this.toastMessage = 'Error al procesar la solicitud';
        this.toastColor = 'danger';
        this.isToastOpen = true;
        this.isApprovalAlertOpen = false;
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'APROBADO': return 'primary';
      case 'PAGADO': return 'success';
      case 'CANCELADO': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'APROBADO': return 'Aprobado';
      case 'PAGADO': return 'Pagado';
      case 'CANCELADO': return 'Rechazado';
      default: return estado;
    }
  }

  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // HH:MM
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  doRefresh(event: any) {
    this.loadSolicitudes();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getSolicitudesPendientes(): number {
    return this.solicitudes.filter(s => s.estado === 'PENDIENTE').length;
  }

  getSolicitudesAprobadas(): number {
    return this.solicitudes.filter(s => s.estado === 'APROBADO').length;
  }

  getSolicitudesPagadas(): number {
    return this.solicitudes.filter(s => s.estado === 'PAGADO').length;
  }

  getSolicitudesRechazadas(): number {
    return this.solicitudes.filter(s => s.estado === 'CANCELADO').length;
  }

  // Marcar solicitud como pagada
  marcarComoPagado(solicitud: SolicitudArriendo) {
    if (!solicitud.id) return;

    this.arriendosService.marcarPagado(solicitud.id).subscribe({
      next: (response) => {
        this.toastMessage = 'Solicitud marcada como pagada exitosamente';
        this.toastColor = 'success';
        this.isToastOpen = true;
        this.loadSolicitudes();
        this.closeDetailModal();
      },
      error: (error) => {
        console.error('Error al marcar como pagado:', error);
        this.toastMessage = 'Error al marcar como pagado';
        this.toastColor = 'danger';
        this.isToastOpen = true;
      }
    });
  }

  // Verificar si se puede marcar como pagado
  puedeMarcarPagado(solicitud: SolicitudArriendo): boolean {
    return solicitud.estado === 'APROBADO' && (solicitud.tiene_comprobante || false);
  }

  // Cargar estadísticas (opcional)
  loadEstadisticas() {
    this.arriendosService.getEstadisticas().subscribe({
      next: (stats) => {
        console.log('Estadísticas de arriendos:', stats);
        // Aquí podrías mostrar las estadísticas en la UI
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }
}
