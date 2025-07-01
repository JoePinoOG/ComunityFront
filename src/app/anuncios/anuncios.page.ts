import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonButton
} from '@ionic/angular/standalone';
import { PublicacionesService } from '../services/publicaciones.service';
import { Publicacion } from '../models';
import { addIcons } from 'ionicons';
import { refreshOutline, timeOutline, personOutline, documentTextOutline, calendarOutline, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonImg,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
    IonButton,
    CommonModule
  ]
})
export class AnunciosPage implements OnInit {
  publicaciones: Publicacion[] = [];
  loading = true;
  error: string | null = null;

  constructor(private publicacionesService: PublicacionesService) {
    addIcons({refreshOutline,documentTextOutline,timeOutline,calendarOutline,locationOutline,personOutline});
  }

  ngOnInit() {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.loading = true;
    this.error = null;

    this.publicacionesService.getPublicaciones().subscribe({
      next: (response) => {
        console.log('Publicaciones recibidas:', response);
        
        // Manejar diferentes tipos de respuesta del backend
        if (Array.isArray(response)) {
          this.publicaciones = response;
        } else if (response && 'results' in response) {
          this.publicaciones = response.results;
        } else {
          this.publicaciones = [];
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.error = 'Error al cargar las publicaciones';
        this.loading = false;
      }
    });
  }

  onRefresh(event: any) {
    this.cargarPublicaciones();
    // Completar el refresher después de cargar
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  getTipoLabel(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'ANUNCIO': 'Anuncio General',
      'EVENTO': 'Evento',
      'AVISO': 'Aviso Importante',
      'NOTICIA': 'Noticia',
      'PERDIDO': 'Objeto Perdido',
      'VENTA': 'Venta/Intercambio'
    };
    return tipos[tipo] || tipo;
  }

  getTipoColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      'ANUNCIO': 'primary',
      'EVENTO': 'secondary',
      'AVISO': 'warning',
      'NOTICIA': 'tertiary',
      'PERDIDO': 'danger',
      'VENTA': 'success'
    };
    return colores[tipo] || 'medium';
  }
}