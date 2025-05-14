import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonFab,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton
 } from '@ionic/angular/standalone';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PublicacionesService } from '../../servicios/publicaciones.service';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: true,
  imports: [IonTextarea,IonLabel,
    IonItem,IonFabButton,IonFab,
    RouterLink,IonContent,
    IonHeader, IonIcon,
    IonTab,IonTabBar, IonTabButton,
    IonTabs,IonButton,
    IonTitle,IonToolbar,FormsModule]
})
export class PublicarPage implements OnInit {

  constructor(private publicacionesService: PublicacionesService) { }
  publicacionTexto: string = '';
  imagenSeleccionada: File | null = null;
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
    // Crear la publicación
    const nuevaPublicacion = {
      texto: this.publicacionTexto,
      imagen: this.imagenSeleccionada ? URL.createObjectURL(this.imagenSeleccionada) : null,
    };

    // Guardar la publicación en el servicio
    this.publicacionesService.agregarPublicacion(nuevaPublicacion);
    //console log de prueba
    console.log('Texto:', this.publicacionTexto);
    console.log('Imagen:', this.imagenSeleccionada);

    // Reiniciar el formulario
    this.publicacionTexto = '';
    this.imagenSeleccionada = null;
    alert('Publicación creada con éxito.');
  }




  ngOnInit() {
  }

}
