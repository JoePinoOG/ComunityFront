import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonButtons,
  IonAlert,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  IonProgressBar,
  IonNote,
  IonImg,
  IonActionSheet,
  IonLoading
} from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  calendar, 
  location, 
  time, 
  people, 
  trash, 
  create, 
  close, 
  calendarClear, 
  list, 
  add, 
  home,
  camera,
  document,
  checkmark,
  warning,
  refresh, cash } from 'ionicons/icons';
import { ArriendosService } from '../services/arriendos.service';
import { AuthService } from '../services/authservice.service';
import { SolicitudArriendo, Usuario, ROLES_PERMITIDOS } from '../models';

@Component({
  selector: 'app-arriendos',
  templateUrl: './arriendos.page.html',
  styleUrls: ['./arriendos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonDatetime,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonFab,
    IonFabButton,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonTextarea,
    IonButtons,
    IonAlert,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonRefresher,
    IonRefresherContent,
    IonProgressBar,
    IonNote,
    IonImg,
    IonActionSheet,
    IonLoading
  ]
})
export class ArriendosPage implements OnInit {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('deleteAlert', { static: false }) deleteAlert!: IonAlert;
  @ViewChild('actionSheet', { static: false }) actionSheet!: IonActionSheet;
  @ViewChild('loading', { static: false }) loading!: IonLoading;

  solicitudes: SolicitudArriendo[] = [];
  selectedDate: string = '';
  selectedSolicitud: SolicitudArriendo | null = null;
  isModalOpen = false;
  isDeleteAlertOpen = false;
  isEditMode = false;
  isActionSheetOpen = false;
  isLoadingOpen = false;
  solicitudToDelete: SolicitudArriendo | null = null;
  deletingSolicitudIds: Set<number> = new Set();
  userInfo: Usuario | null = null;
  selectedFile: File | null = null;

  // Alert buttons configuration
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.isDeleteAlertOpen = false;
      }
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {
        this.deleteSolicitud();
      }
    }
  ];

  // ActionSheet buttons for image selection
  actionSheetButtons = [
    {
      text: 'Tomar Foto',
      icon: 'camera',
      handler: () => {
        this.takePicture();
      }
    },
    {
      text: 'Seleccionar de Galería',
      icon: 'document',
      handler: () => {
        this.selectFromGallery();
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel'
    }
  ];

  // Form data
  newSolicitud: SolicitudArriendo = {
    fecha_evento: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
    cantidad_asistentes: 1,
    observaciones: ''
  };

  // Fechas con solicitudes para marcar en el calendario
  fechasConSolicitudes: string[] = [];

  // Fecha mínima para el datetime (hoy)
  minDate: string = new Date().toISOString();

  constructor(
    private arriendosService: ArriendosService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({home,calendar,time,people,cash,create,trash,camera,calendarClear,add,list,close,checkmark,location,document,warning,refresh});
  }

  ngOnInit() {
    this.loadSolicitudes();
    // Cargar información del usuario
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.userInfo = user;
        console.log('Usuario logeado en arriendos:', this.userInfo);
      },
      error: (err) => {
        console.log('Error al obtener perfil en arriendos:', err);
      }
    });
  }

  loadSolicitudes() {
    this.arriendosService.getSolicitudes().subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        // Manejar respuesta paginada o array directo
        if (Array.isArray(response)) {
          this.solicitudes = response;
        } else {
          this.solicitudes = response.results || [];
        }
        this.updateFechasConSolicitudes();
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.solicitudes = [];
      }
    });
  }

  updateFechasConSolicitudes() {
    if (Array.isArray(this.solicitudes)) {
      this.fechasConSolicitudes = this.solicitudes.map(solicitud => 
        new Date(solicitud.fecha_evento).toISOString().split('T')[0]
      );
    } else {
      this.fechasConSolicitudes = [];
    }
  }

  // Función para determinar si una fecha tiene solicitudes y configurar el highlighting
  getHighlightedDates() {
    return this.fechasConSolicitudes.map(fecha => ({
      date: fecha,
      textColor: '#ffffff',
      backgroundColor: '#3880ff'
    }));
  }

  onDateSelected(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      this.selectedDate = selectedDate.split('T')[0];
      this.checkSolicitudesForDate(this.selectedDate);
    }
  }

  checkSolicitudesForDate(fecha: string) {
    this.selectedSolicitud = this.solicitudes.find(solicitud => 
      new Date(solicitud.fecha_evento).toISOString().split('T')[0] === fecha
    ) || null;
  }

  openModal(solicitud?: SolicitudArriendo) {
    if (solicitud) {
      this.isEditMode = true;
      this.newSolicitud = { ...solicitud };
    } else {
      this.isEditMode = false;
      this.newSolicitud = {
        fecha_evento: this.selectedDate || '',
        hora_inicio: '',
        hora_fin: '',
        motivo: '',
        cantidad_asistentes: 1,
        observaciones: ''
      };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveSolicitud() {
    if (this.isEditMode && this.newSolicitud.id) {
      this.arriendosService.updateSolicitud(this.newSolicitud.id, this.newSolicitud).subscribe({
        next: () => {
          this.loadSolicitudes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar solicitud:', error);
        }
      });
    } else {
      this.arriendosService.createSolicitud(this.newSolicitud).subscribe({
        next: () => {
          this.loadSolicitudes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear solicitud:', error);
        }
      });
    }
  }

  confirmDelete(solicitud: SolicitudArriendo) {
    this.solicitudToDelete = solicitud;
    this.isDeleteAlertOpen = true;
  }

  deleteSolicitud() {
    if (this.solicitudToDelete?.id) {
      this.deletingSolicitudIds.add(this.solicitudToDelete.id);
      this.arriendosService.deleteSolicitud(this.solicitudToDelete.id).subscribe({
        next: () => {
          this.loadSolicitudes();
          this.deletingSolicitudIds.delete(this.solicitudToDelete!.id!);
          this.solicitudToDelete = null;
          this.isDeleteAlertOpen = false;
        },
        error: (error) => {
          console.error('Error al eliminar solicitud:', error);
          this.deletingSolicitudIds.delete(this.solicitudToDelete!.id!);
        }
      });
    }
  }

  isDeleting(id: number | undefined): boolean {
    return id ? this.deletingSolicitudIds.has(id) : false;
  }

  esRolPermitido(): boolean {
    return this.userInfo ? ROLES_PERMITIDOS.includes(this.userInfo.rol) : false;
  }

  esTesorero(): boolean {
    return this.userInfo?.rol === 'TESORERO';
  }

  navegarATesoreroArriendos(): void {
    this.router.navigate(['/tesorero-arriendos']);
  }

  puedeEditar(solicitud: SolicitudArriendo): boolean {
    return !!(this.userInfo && (
      this.userInfo.id === solicitud.solicitante || 
      this.esRolPermitido()
    ));
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'PAGADO': return 'success';
      case 'CANCELADO': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'PAGADO': return 'Pagado';
      case 'CANCELADO': return 'Cancelado';
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

  // Métodos para manejo de archivos
  openImageSelector() {
    this.isActionSheetOpen = true;
  }

  takePicture() {
    // Aquí implementarías la funcionalidad de cámara usando Capacitor Camera
    console.log('Tomar foto - implementar con Capacitor Camera');
  }

  selectFromGallery() {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.convertFileToBase64(file);
      }
    };
    input.click();
  }

  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.newSolicitud.comprobante_pago = base64String;
    };
    reader.readAsDataURL(file);
  }

  subirComprobante(solicitud: SolicitudArriendo) {
    this.openImageSelector();
    // El comprobante se guardará cuando se cierre el modal y se guarde la solicitud
  }

  doRefresh(event: any) {
    this.loadSolicitudes();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  // Verificar disponibilidad para una fecha
  checkDisponibilidad(fecha: string) {
    this.arriendosService.getDisponibilidad(fecha).subscribe({
      next: (response) => {
        console.log('Horarios ocupados:', response.ocupados);
        // Aquí podrías implementar lógica para mostrar horarios disponibles
      },
      error: (error) => {
        console.error('Error al verificar disponibilidad:', error);
      }
    });
  }

  // Subir comprobante usando FormData (alternativa más robusta)
  subirComprobanteFormData(solicitud: SolicitudArriendo, file: File) {
    if (!solicitud.id) return;

    const formData = new FormData();
    formData.append('comprobante_pago', file);

    this.isLoadingOpen = true;
    this.arriendosService.subirComprobanteEspecifico(solicitud.id, formData).subscribe({
      next: (response) => {
        this.isLoadingOpen = false;
        console.log('Comprobante subido:', response.mensaje);
        this.loadSolicitudes(); // Recargar para ver el comprobante
      },
      error: (error) => {
        this.isLoadingOpen = false;
        console.error('Error al subir comprobante:', error);
      }
    });
  }

  // Validar formulario antes de guardar
  isFormValid(): boolean {
    return !!(
      this.newSolicitud.fecha_evento &&
      this.newSolicitud.motivo?.trim() &&
      this.newSolicitud.cantidad_asistentes &&
      this.newSolicitud.cantidad_asistentes > 0
    );
  }

  // Limpiar formulario
  resetForm() {
    this.newSolicitud = {
      fecha_evento: this.selectedDate || '',
      hora_inicio: '',
      hora_fin: '',
      motivo: '',
      cantidad_asistentes: 1,
      observaciones: ''
    };
    this.selectedFile = null;
  }
}