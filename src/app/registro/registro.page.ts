import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonLabel,IonModal, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../services/authservice.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonLabel, 
    IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,IonModal, FormsModule]
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
  junta_vecinos = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

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
      rut: this.rut,
      junta_vecinos: this.junta_vecinos
    }).subscribe({
      next: (_res: any) => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.log('Error al registrarse:', err);
        alert('Error al registrarse: ' + JSON.stringify(err.error));
      }
    });
  }

  async openRoleModal() {
    const alert = await this.alertController.create({
      header: 'Selecciona un rol',
      inputs: [
        { name: 'rol', type: 'radio', label: 'VECINO', value: 'VECINO', checked: this.rol === 'VECINO' },
        { name: 'rol', type: 'radio', label: 'SECRETARIO', value: 'SECRETARIO', checked: this.rol === 'SECRETARIO' },
        { name: 'rol', type: 'radio', label: 'TESORERO', value: 'TESORERO', checked: this.rol === 'TESORERO' },
        { name: 'rol', type: 'radio', label: 'PRESIDENTE', value: 'PRESIDENTE', checked: this.rol === 'PRESIDENTE' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Seleccionar', handler: (data) => { this.rol = data; } }
      ]
    });
    await alert.present();
  }


  async openJuntaModal() {
    const alert = await this.alertController.create({
      header: 'Selecciona una Junta de Vecinos',
      inputs: [
        { name: 'junta', type: 'radio', label: '1', value: '1', checked: this.junta_vecinos === '1' },
        { name: 'junta', type: 'radio', label: '2', value: '2', checked: this.junta_vecinos === '2' },
        { name: 'junta', type: 'radio', label: '3', value: '3', checked: this.junta_vecinos === '3' },
        { name: 'junta', type: 'radio', label: '4', value: '4', checked: this.junta_vecinos === '4' }
      ],
      buttons: [
        {
          text: 'Seleccionar',
          handler: (data) => {
            this.junta_vecinos = data;
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

  
  
  ngOnInit() { }


}