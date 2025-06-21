import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonLabel,
  IonInput,
  IonButton,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from 'src/services/authservice.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonInput,
    IonButton,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule
  ]
})
export class RegistroPage implements OnInit {
  username = '';
  password = '';
  email = '';
  first_name = '';
  last_name = '';
  rol = '';
  direccion = '';
  telefono = '';
  rut = '';  

  constructor(private authService: AuthService) {}

register() {
  this.authService.register({
    username: this.username,
    email: this.email,
    password: this.password,
    first_name: this.first_name,
    last_name: this.last_name,
    rol: this.rol,
    direccion: this.direccion,
    telefono: this.telefono,
    rut: this.rut
  }).subscribe({
    next: res => {
      console.log('REGISTRO EXITOSO');
      // Registro exitoso
    },
    error: err => {
      console.log('Error al registrarse:', err);
      alert('Error al registrarse: ' + JSON.stringify(err.error));
    }
  });
}

  ngOnInit() { }


}
