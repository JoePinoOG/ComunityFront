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
import { AuthService,Usuario } from '../services/authservice.service';
import { addIcons } from 'ionicons';
import { logOutOutline, notifications, calendar, alarm } from 'ionicons/icons';
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
    private alertController: AlertController
  ) {
        addIcons({notifications,calendar,alarm,logOutOutline});

  }

  async ngOnInit() {
    this.authService.getProfile().subscribe({
    next: (user) => {
      this.userInfo = user;
    },
    error: (err) => {
      console.log('Error al obtener perfil:', err);
    }
  });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      // Lógica para refrescar datos
      event.target.complete();
    }, 1000);
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

    logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}