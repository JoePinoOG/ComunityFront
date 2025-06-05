import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBadge, IonContent, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonListHeader, IonLabel, IonItem } from '@ionic/angular/standalone';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from 'src/servicios/authservice.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    // Ionic Components
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBadge,
    IonContent, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonListHeader, IonLabel, IonItem,
    // Angular Pipes/Modules
    DatePipe, CommonModule
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
    private alertController: AlertController
  ) {}

  async ngOnInit() {
  }
//nose para k sirve

  doRefresh(event: any) {
    // Aquí puedes recargar datos, por ejemplo:
    setTimeout(() => {
      // Lógica para refrescar datos
      event.target.complete();
    }, 1000);
  }


  
//aqui termina lo k no se para que sirve



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