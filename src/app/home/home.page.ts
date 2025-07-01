import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonIcon,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonCardSubtitle
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/authservice.service';
import { PublicacionesService } from '../services/publicaciones.service';
import { NotificationsService } from '../services/notifications.service';
import { Usuario, Publicacion } from '../models';
import { addIcons } from 'ionicons';
import { logOutOutline, notifications, calendar, alarm, personCircle, apps, documentText, business, cash, people } from 'ionicons/icons';
//import { AnnouncementService } from '../services/announcement.service';
//import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonListHeader,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonIcon,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonCardSubtitle,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {
  userInfo: Usuario | null = null
  userName: string = 'Usuario';
  userRole: string = 'vecino'; // Puede ser 'vecino', 'secretario', 'tesorero', 'presidente'
  unreadNotifications: number = 2;
  nextEvent: any = null;
  recentAnnouncements: any[] = [];
  upcomingEvents: any[] = [];
  quickActions: any[] = [];
  latestPosts: Publicacion[] = [];
  showWelcomeMessage: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private notificationsService: NotificationsService,
    private alertController: AlertController
  ) {
        addIcons({personCircle,notifications,apps,calendar,alarm,logOutOutline,documentText,business,cash,people});

  }

  async ngOnInit() {
    // Verificar si es un login reciente
    this.checkForRecentLogin();
    
    // Suscribirse a las notificaciones de publicaciones no leídas
    this.notificationsService.unreadPublications$.subscribe(count => {
      this.unreadNotifications = count;
    });
    
    this.authService.getProfile().subscribe({
    next: (user) => {
      this.userInfo = user;
      if (user.rol) {
        this.userRole = user.rol;
      }
      this.initializeQuickActions();
    },
    error: (err) => {
      console.log('Error al obtener perfil:', err);
      this.initializeQuickActions();
    }
  });
  
  // Cargar las últimas publicaciones
  this.loadLatestPosts();
  }

  initializeQuickActions() {
    this.quickActions = [
      { title: 'Actas', icon: 'document-text', path: '/minutes', color: 'secondary', available: true },
      { title: 'Reservar Sede', icon: 'business', path: '/book-venue', color: 'tertiary', available: true },
      { title: 'Finanzas', icon: 'cash', path: '/finances', color: 'danger', available: true },
      { title: 'Lista usuarios', icon: 'people', path: '/user-list', color: 'primary', available: this.userRole === 'presidente' }
    ];
  }
// Lógica para refrescar datos
  doRefresh(event: any) {
    setTimeout(() => {
      this.loadLatestPosts();
      event.target.complete();
    }, 1000);
  }

  loadLatestPosts() {
    this.publicacionesService.getPublicaciones().subscribe({
      next: (response) => {
        let publicaciones: Publicacion[] = [];
        
        // Manejar diferentes tipos de respuesta del backend
        if (Array.isArray(response)) {
          publicaciones = response;
        } else if (response && 'results' in response) {
          publicaciones = response.results || [];
        }
        
        // Ordenar por fecha más reciente y tomar las últimas 3
        this.latestPosts = publicaciones
          .sort((a, b) => {
            const dateA = new Date(a.fecha_creacion || '').getTime();
            const dateB = new Date(b.fecha_creacion || '').getTime();
            return dateB - dateA;
          })
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.latestPosts = [];
      }
    });
  }

  viewPost(postId: number | undefined) {
    if (postId) {
      this.router.navigate(['/anuncios', postId]);
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return postDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }

  navigateTo(path: string) {
    if (this.quickActions.find(a => a.path === path)?.available) {
      this.router.navigateByUrl(path);
    }
  }

  navigateToProfile() {
    this.router.navigate(['/perfil-usuario']);
  }

  hasAvailableActions(): boolean {
    return this.quickActions.some(action => action.available);
  }

  navigateToServices() {
    this.showServicesOptions();
  }

  async showServicesOptions() {
    const alert = await this.alertController.create({
      header: 'Servicios Comunitarios',
      message: 'Selecciona el servicio que necesitas:',
      buttons: [
        {
          text: 'Certificado de Residencia',
          handler: () => {
            this.router.navigate(['/certificado-residencia']);
          }
        },
        {
          text: 'Quejas y Sugerencias',
          handler: () => {
            console.log('Navegando a quejas y sugerencias');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  viewAllAnnouncements() {
    this.router.navigateByUrl('/announcements');
  }

  viewCalendar() {
    this.router.navigateByUrl('/calendar');
  }

  async viewAnnouncement(id: string) {
    this.router.navigate(['/announcement', id]);
  }

  async viewEvent(id: string) {
    this.router.navigate(['/event', id]);
  }

  async setReminder(event: any, eventId: string) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Configurar recordatorio',
      inputs: [
        {
          name: 'minutesBefore',
          type: 'number',
          placeholder: 'Minutos antes',
          value: '30'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.scheduleNotification(eventId, data.minutesBefore);
          }
        }
      ]
    });
    await alert.present();
  }

  scheduleNotification(eventId: string, minutesBefore: number) {
    console.log(`Recordatorio programado para ${minutesBefore} minutos antes del evento ${eventId}`);
  }

  openNotifications() {
    // Marcar todas las publicaciones como leídas
    this.notificationsService.markAllPublicationsAsRead();
    // Navegar a la página de anuncios
    this.router.navigateByUrl('/anuncios');
  }

    logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  checkForRecentLogin() {
    // Verificar si hay una marca de login reciente en localStorage
    const recentLogin = localStorage.getItem('recentLogin');
    if (recentLogin === 'true') {
      this.showWelcomeMessage = true;
      // Limpiar la marca de login reciente
      localStorage.removeItem('recentLogin');
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        this.hideWelcomeMessage();
      }, 5000);
    }
  }

  hideWelcomeMessage() {
    this.showWelcomeMessage = false;
  }

}