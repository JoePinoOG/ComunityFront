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
import { AuthService } from '../services/auth.service';
import { AnnouncementService } from '../services/announcement.service';
import { EventService } from '../services/event.service';

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
  userName: string = 'Usuario';
  userRole: string = 'vecino'; // Puede ser 'vecino', 'secretario', 'tesorero', 'presidente'
  unreadNotifications: number = 2;
  nextEvent: any = null;
  recentAnnouncements: any[] = [];
  upcomingEvents: any[] = [];
  
  quickActions = [
    { title: 'Reuniones', icon: 'people', path: '/meetings', color: 'primary', available: true },
    { title: 'Anuncios', icon: 'megaphone', path: '/announcements', color: 'warning', available: true },
    { title: 'Contactos', icon: 'call', path: '/contacts', color: 'success', available: true },
    { title: 'Reservar Sede', icon: 'business', path: '/book-venue', color: 'tertiary', available: this.userRole !== 'vecino' },
    { title: 'Actas', icon: 'document-text', path: '/minutes', color: 'secondary', available: this.userRole !== 'vecino' },
    { title: 'Finanzas', icon: 'cash', path: '/finances', color: 'danger', available: this.userRole === 'tesorero' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private eventService: EventService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.loadUserData();
    this.loadNextEvent();
    this.loadAnnouncements();
    this.loadUpcomingEvents();
  }

  async loadUserData() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
      
      // Actualizar disponibilidad de acciones rápidas según rol
      this.quickActions.forEach(action => {
        if (action.path === '/book-venue' || action.path === '/minutes') {
          action.available = this.userRole !== 'vecino';
        } else if (action.path === '/finances') {
          action.available = this.userRole === 'tesorero';
        }
      });
    }
  }

  async loadNextEvent() {
    this.nextEvent = await this.eventService.getNextEvent();
  }

  async loadAnnouncements() {
    this.recentAnnouncements = await this.announcementService.getRecent(3);
  }

  async loadUpcomingEvents() {
    this.upcomingEvents = await this.eventService.getUpcoming(3);
  }

  navigateTo(path: string) {
    if (this.quickActions.find(a => a.path === path)?.available) {
      this.router.navigateByUrl(path);
    }
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
    // Implementar lógica de notificaciones locales
    console.log(`Recordatorio programado para ${minutesBefore} minutos antes del evento ${eventId}`);
  }

  openNotifications() {
    this.router.navigateByUrl('/notifications');
  }
}