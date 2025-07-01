import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { PublicacionesService } from '../services/publicaciones.service';
import { addIcons } from 'ionicons';
import { trashOutline, trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar
  ]
})
export class AnunciosPage implements OnInit {

  publicaciones: { texto: string; imagen: string | null }[] = [];

  constructor(private publicacionesService: PublicacionesService) {
    addIcons({ trashBin, trashOutline });
  }

  ngOnInit() {
    this.publicaciones = this.publicacionesService.obtenerPublicaciones();
  }

  borrarPublicacion(index: number) {
    this.publicacionesService.eliminarPublicacion(index);
    this.publicaciones = this.publicacionesService.obtenerPublicaciones();
  }
}
