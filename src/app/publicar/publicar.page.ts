import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonTabs,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton
} from '@ionic/angular/standalone';
import { PublicacionesService } from '../services/publicaciones.service';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class PublicarPage implements OnInit {

  publicacionTexto: string = '';
  imagenSeleccionada: File | null = null;

  constructor(private publicacionesService: PublicacionesService) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('Imagen seleccionada:', file);
    }
  }

  crearPublicacion() {
    if (!this.publicacionTexto && !this.imagenSeleccionada) {
      alert('Por favor, agrega texto o una imagen para la publicación.');
      return;
    }
    const nuevaPublicacion = {
      texto: this.publicacionTexto,
      imagen: this.imagenSeleccionada ? URL.createObjectURL(this.imagenSeleccionada) : null,
    };
    this.publicacionesService.agregarPublicacion(nuevaPublicacion);
    console.log('Texto:', this.publicacionTexto);
    console.log('Imagen:', this.imagenSeleccionada);
    this.publicacionTexto = '';
    this.imagenSeleccionada = null;
    alert('Publicación creada con éxito.');
  }

  ngOnInit() {}
}
