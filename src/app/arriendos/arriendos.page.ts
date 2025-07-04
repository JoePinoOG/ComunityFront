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
    console.log('=== DEBUG SOLICITUD ===');
    console.log('Datos originales del formulario:', this.newSolicitud);
    console.log('Tipo de hora_inicio:', typeof this.newSolicitud.hora_inicio, this.newSolicitud.hora_inicio);
    console.log('Tipo de hora_fin:', typeof this.newSolicitud.hora_fin, this.newSolicitud.hora_fin);
    
    if (this.isEditMode && this.newSolicitud.id) {
      this.arriendosService.updateSolicitud(this.newSolicitud.id, this.newSolicitud).subscribe({
        next: () => {
          this.loadSolicitudes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar solicitud:', error);
          console.error('Detalles del error:', error.error);
        }
      });
    } else {
      // Preparar los datos para envío con formateo correcto
      const solicitudData = this.formatSolicitudData(this.newSolicitud);
      
      console.log('Datos formateados para enviar:', solicitudData);
      console.log('=== FIN DEBUG ===');
      
      this.arriendosService.createSolicitud(solicitudData as SolicitudArriendo).subscribe({
        next: () => {
          this.loadSolicitudes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear solicitud:', error);
          console.error('Detalles del error:', error.error);
        }
      });
    }
  }

  private formatSolicitudData(solicitud: SolicitudArriendo): any {
    console.log('formatSolicitudData - solicitud original:', JSON.stringify(solicitud, null, 2));
    
    // Formatear fecha (YYYY-MM-DD)
    let fechaEvento = '';
    if (solicitud.fecha_evento) {
      const fecha = new Date(solicitud.fecha_evento);
      fechaEvento = fecha.toISOString().split('T')[0];
    }

    // Las horas ya deberían estar en formato HH:MM:SS desde los event handlers
    const horaInicio = solicitud.hora_inicio || '';
    const horaFin = solicitud.hora_fin || '';

    console.log('Hora inicio:', horaInicio, 'tipo:', typeof horaInicio);
    console.log('Hora fin:', horaFin, 'tipo:', typeof horaFin);
    
    // Validar que las horas no estén vacías
    if (!horaInicio || !horaFin) {
      console.error('Error: horas no pueden estar vacías');
      throw new Error('Las horas de inicio y fin son requeridas');
    }
    
    // Validar que sean strings (no arrays ni otros tipos)
    if (typeof horaInicio !== 'string' || typeof horaFin !== 'string') {
      console.error('Error: las horas deben ser strings, recibidos:', typeof horaInicio, typeof horaFin);
      throw new Error('Error interno: formato de hora inválido');
    }
    
    // Validar formato de hora HH:MM:SS
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(horaInicio) || !timeRegex.test(horaFin)) {
      console.error('Error: formato de hora inválido - horaInicio:', horaInicio, 'horaFin:', horaFin);
      throw new Error('Las horas deben estar en formato HH:MM:SS');
    }

    const formattedData = {
      fecha_evento: fechaEvento,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      motivo: solicitud.motivo?.trim() || '',
      cantidad_asistentes: Number(solicitud.cantidad_asistentes) || 1,
      observaciones: solicitud.observaciones?.trim() || ''
    };
    
    console.log('formatSolicitudData - datos finales:', JSON.stringify(formattedData, null, 2));
    
    return formattedData;
  }

  // Métodos específicos para manejar cambios de hora desde ion-datetime
  onHoraInicioChange(event: any): void {
    const value = event.detail?.value;
    console.log('onHoraInicioChange - valor recibido:', value, 'tipo:', typeof value);
    
    this.newSolicitud.hora_inicio = this.extractTimeString(value);
    console.log('hora_inicio asignada:', this.newSolicitud.hora_inicio);
  }

  onHoraFinChange(event: any): void {
    const value = event.detail?.value;
    console.log('onHoraFinChange - valor recibido:', value, 'tipo:', typeof value);
    
    this.newSolicitud.hora_fin = this.extractTimeString(value);
    console.log('hora_fin asignada:', this.newSolicitud.hora_fin);
  }

  private extractTimeString(timeValue: any): string {
    console.log('extractTimeString recibió:', timeValue, 'tipo:', typeof timeValue);
    
    if (!timeValue) {
      return '';
    }

    // Si es un string, verificar si es una fecha ISO
    if (typeof timeValue === 'string') {
      try {
        // Si contiene 'T', es un datetime ISO
        if (timeValue.includes('T')) {
          const date = new Date(timeValue);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const result = `${hours}:${minutes}:${seconds}`;
            console.log('Extraído desde datetime ISO:', result);
            return result;
          }
        }
        
        // Si ya es formato HH:MM o HH:MM:SS, normalizarlo
        const timeRegex = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
        const match = timeValue.match(timeRegex);
        if (match) {
          const hours = parseInt(match[1]).toString().padStart(2, '0');
          const minutes = parseInt(match[2]).toString().padStart(2, '0');
          const seconds = match[3] ? parseInt(match[3]).toString().padStart(2, '0') : '00';
          
          if (parseInt(hours) >= 0 && parseInt(hours) <= 23 && 
              parseInt(minutes) >= 0 && parseInt(minutes) <= 59) {
            const result = `${hours}:${minutes}:${seconds}`;
            console.log('Normalizado formato hora:', result);
            return result;
          }
        }
      } catch (error) {
        console.error('Error procesando timeValue string:', error);
      }
    }

    console.warn('No se pudo extraer hora válida de:', timeValue);
    return '';
  }

  private formatTimeString(timeValue: any): string {
    // Este método ahora es más simple porque los valores ya deberían estar normalizados
    if (!timeValue || typeof timeValue !== 'string') {
      console.warn('formatTimeString: valor inválido:', timeValue);
      return '';
    }

    // Validar que ya esté en formato HH:MM:SS
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (timeRegex.test(timeValue)) {
      return timeValue;
    }

    console.warn('formatTimeString: formato inválido:', timeValue);
    return '';
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
      this.newSolicitud.comprobante_pago_base64 = base64String;
      console.log('Archivo convertido a base64');
    };
    reader.readAsDataURL(file);
  }

  subirComprobante(solicitud: SolicitudArriendo) {
    if (!solicitud.id) return;
    
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.convertFileToBase64(file);
        // Después de convertir, llamar al servicio
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.arriendosService.subirComprobantePago(solicitud.id!, base64String).subscribe({
            next: (response) => {
              console.log('Comprobante subido exitosamente');
              this.loadSolicitudes(); // Recargar para ver cambios
            },
            error: (error) => {
              console.error('Error al subir comprobante:', error);
            }
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
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

  // Aprobar solicitud (solo admins)
  aprobarSolicitud(solicitud: SolicitudArriendo) {
    if (!solicitud.id) return;

    const data = {
      accion: 'APROBAR' as const,
      monto_pago: 50000, // Valor por defecto, debería ser configurable
      observaciones: 'Solicitud aprobada'
    };

    this.arriendosService.aprobarSolicitud(solicitud.id, data).subscribe({
      next: (response) => {
        console.log('Solicitud aprobada:', response);
        this.loadSolicitudes();
      },
      error: (error) => {
        console.error('Error al aprobar solicitud:', error);
      }
    });
  }

  // Rechazar solicitud (solo admins)
  rechazarSolicitud(solicitud: SolicitudArriendo) {
    if (!solicitud.id) return;

    const data = {
      accion: 'RECHAZAR' as const,
      observaciones: 'Solicitud rechazada por el administrador'
    };

    this.arriendosService.aprobarSolicitud(solicitud.id, data).subscribe({
      next: (response) => {
        console.log('Solicitud rechazada:', response);
        this.loadSolicitudes();
      },
      error: (error) => {
        console.error('Error al rechazar solicitud:', error);
      }
    });
  }

  // Marcar como pagado (solo admins)
  marcarComoPagado(solicitud: SolicitudArriendo) {
    if (!solicitud.id) return;

    this.arriendosService.marcarPagado(solicitud.id).subscribe({
      next: (response) => {
        console.log('Marcado como pagado:', response);
        this.loadSolicitudes();
      },
      error: (error) => {
        console.error('Error al marcar como pagado:', error);
      }
    });
  }

  // Verificar si la solicitud puede ser aprobada
  puedeAprobar(solicitud: SolicitudArriendo): boolean {
    return solicitud.estado === 'PENDIENTE' && this.esRolPermitido();
  }

  // Verificar si la solicitud puede ser marcada como pagada
  puedeMarcarPagado(solicitud: SolicitudArriendo): boolean {
    return solicitud.estado === 'APROBADO' && this.esRolPermitido() && (solicitud.tiene_comprobante || false);
  }

  // Mostrar información de disponibilidad
  mostrarDisponibilidad(fecha: string) {
    this.arriendosService.getDisponibilidad(fecha).subscribe({
      next: (response) => {
        console.log('Disponibilidad para', fecha, ':', response);
        // Aquí podrías mostrar un modal o alerta con la información
      },
      error: (error) => {
        console.error('Error al obtener disponibilidad:', error);
      }
    });
  }

}