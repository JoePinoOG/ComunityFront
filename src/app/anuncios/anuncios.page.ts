import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,  
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar, } from '@ionic/angular/standalone';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PublicacionesService } from 'src/servicios/publicaciones.service';
import { addIcons } from 'ionicons';
import {trashOutline, trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
  standalone: true,
  imports: [
  IonButton,
    CommonModule,
    IonCard,
    IonCardContent,
    RouterLink,IonContent, IonHeader,
    IonIcon, IonTab, IonTabBar, IonTabButton,
     IonTabs, IonTitle, IonToolbar]
})
export class AnunciosPage implements OnInit {

  publicaciones: { texto: string; imagen: string | null }[] = [];

  constructor(private publicacionesService: PublicacionesService) {
    
    addIcons({trashBin,trashOutline});   
  
  }

  ngOnInit() {
    this.publicaciones = this.publicacionesService.obtenerPublicaciones();
  }
  borrarPublicacion(index: number) {
    this.publicacionesService.eliminarPublicacion(index);
    this.publicaciones = this.publicacionesService.obtenerPublicaciones(); // Actualiza la lista
  }
}
