import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButtons,
  IonAlert,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, settings, megaphone, add, calendar, location, time, people, trash, create, close, calendarClear, list } from 'ionicons/icons';
import { ReunionesService } from '../services/reuniones.service';
import { AuthService } from '../services/authservice.service';
import { Usuario, Reunion, ReunionResponse, ROLES_PERMITIDOS } from '../models';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.page.html',
  styleUrls: ['./reuniones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButtons,
    IonAlert,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class ReunionesPage implements OnInit {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('deleteAlert', { static: false }) deleteAlert!: IonAlert;

  reuniones: Reunion[] = [];
  selectedDate: string = '';
  selectedReunion: Reunion | null = null;
  isModalOpen = false;
  isDeleteAlertOpen = false;
  isEditMode = false;
  reunionToDelete: Reunion | null = null;
  deletingReunionIds: Set<number> = new Set();
  userInfo: Usuario | null = null;

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
        this.deleteReunion();
      }
    }
  ];

  // Form data
  newReunion: Reunion = {
    titulo: '',
    fecha: '',
    lugar: '',
    motivo: 'ORDINARIA'
  };

  // Fechas con reuniones para marcar en el calendario
  fechasConReuniones: string[] = [];

  constructor(
    private reunionesService: ReunionesService,
    private authService: AuthService
  ) {
    addIcons({calendar,location,create,trash,calendarClear,add,list,time,people,close,playCircle,radio,library,search,megaphone});
  }

  ngOnInit() {
    this.loadReuniones();
    // Cargar información del usuario para control de roles
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.userInfo = user;
        console.log('Usuario logeado en reuniones:', this.userInfo);
      },
      error: (err) => {
        console.log('Error al obtener perfil en reuniones:', err);
      }
    });
  }

  loadReuniones() {
    this.reunionesService.getReuniones().subscribe({
      next: (response: ReunionResponse | Reunion[]) => {
        console.log('Respuesta del backend:', response);
        // Manejar respuesta paginada o array directo
        if (Array.isArray(response)) {
          this.reuniones = response;
        } else {
          this.reuniones = response.results || [];
        }
        this.updateFechasConReuniones();
      },
      error: (error) => {
        console.error('Error al cargar reuniones:', error);
        this.reuniones = []; // Asegurar que sea un array vacío en caso de error
      }
    });
  }

  updateFechasConReuniones() {
    // Verificar que reuniones sea un array antes de usar map
    if (Array.isArray(this.reuniones)) {
      this.fechasConReuniones = this.reuniones.map(reunion => 
        new Date(reunion.fecha).toISOString().split('T')[0]
      );
    } else {
      this.fechasConReuniones = [];
    }
  }

  // Función para determinar si una fecha tiene reuniones y configurar el highlighting
  getHighlightedDates() {
    return this.fechasConReuniones.map(fecha => ({
      date: fecha,
      textColor: '#ffffff',
      backgroundColor: '#e74c3c'
    }));
  }

  onDateSelected(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      this.selectedDate = selectedDate.split('T')[0];
      this.checkReunionesForDate(this.selectedDate);
    }
  }

  checkReunionesForDate(fecha: string) {
    this.selectedReunion = this.reuniones.find(reunion => 
      new Date(reunion.fecha).toISOString().split('T')[0] === fecha
    ) || null;
  }

  openModal(reunion?: Reunion) {
    if (reunion) {
      this.isEditMode = true;
      this.newReunion = { ...reunion };
      // Convertir fecha para el datetime picker
      if (reunion.fecha) {
        this.newReunion.fecha = new Date(reunion.fecha).toISOString();
      }
    } else {
      this.isEditMode = false;
      this.newReunion = {
        titulo: '',
        fecha: this.selectedDate ? `${this.selectedDate}T10:00:00` : '',
        lugar: '',
        motivo: 'ORDINARIA'
      };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newReunion = {
      titulo: '',
      fecha: '',
      lugar: '',
      motivo: 'ORDINARIA'
    };
  }

  saveReunion() {
    if (this.newReunion.titulo && this.newReunion.fecha && this.newReunion.lugar) {
      if (this.isEditMode && this.newReunion.id) {
        this.reunionesService.updateReunion(this.newReunion.id, this.newReunion).subscribe({
          next: () => {
            this.loadReuniones();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar reunión:', error);
          }
        });
      } else {
        this.reunionesService.createReunion(this.newReunion).subscribe({
          next: () => {
            this.loadReuniones();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al crear reunión:', error);
          }
        });
      }
    }
  }

  confirmDelete(reunion: Reunion) {
    this.reunionToDelete = reunion;
    this.isDeleteAlertOpen = true;
  }

  deleteReunion() {
    if (this.reunionToDelete && this.reunionToDelete.id) {
      // Agregar ID a la lista de elementos que se están eliminando para activar la animación
      this.deletingReunionIds.add(this.reunionToDelete.id);
      
      // Esperar un poco para que se active la animación antes de eliminar del backend
      setTimeout(() => {
        if (this.reunionToDelete?.id) {
          this.reunionesService.deleteReunion(this.reunionToDelete.id).subscribe({
            next: () => {
              // Eliminar después de la animación
              setTimeout(() => {
                this.loadReuniones();
                const deletedId = this.reunionToDelete?.id;
                if (deletedId) {
                  this.deletingReunionIds.delete(deletedId);
                }
                this.reunionToDelete = null;
                if (this.selectedReunion?.id === deletedId) {
                  this.selectedReunion = null;
                }
              }, 300); // Duración de la animación
            },
            error: (error) => {
              console.error('Error al eliminar reunión:', error);
              // Remover de la lista de eliminación si hay error
              if (this.reunionToDelete?.id) {
                this.deletingReunionIds.delete(this.reunionToDelete.id);
              }
            }
          });
        }
      }, 50); // Pequeño delay para que se aplique la clase CSS
    }
    this.isDeleteAlertOpen = false;
  }

  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMotivoColor(motivo: string): string {
    switch (motivo) {
      case 'ORDINARIA': return 'primary';
      case 'EXTRAORDINARIA': return 'danger';
      case 'INFORMATIVA': return 'warning';
      default: return 'medium';
    }
  }

  getMotivoText(motivo: string): string {
    switch (motivo) {
      case 'ORDINARIA': return 'Ordinaria';
      case 'EXTRAORDINARIA': return 'Extraordinaria';
      case 'INFORMATIVA': return 'Informativa';
      default: return motivo;
    }
  }

  // Función para determinar si una reunión se está eliminando
  isDeleting(reunionId: number | undefined): boolean {
    return reunionId ? this.deletingReunionIds.has(reunionId) : false;
  }

  // Función para verificar si el usuario tiene permisos de administración
  esRolPermitido(): boolean {
    if (!this.userInfo) return false;
    const rol = this.userInfo.rol?.toUpperCase();
    return ROLES_PERMITIDOS.includes(rol);
  }

  // Función para determinar si una fecha tiene reuniones (para el CSS)
  shouldHighlightDate = (dateIsoString: string) => {
    const date = dateIsoString.split('T')[0];
    return this.fechasConReuniones.includes(date);
  };
}
