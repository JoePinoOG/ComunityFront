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
      next: (res: any) => {
        console.log('Registro exitoso:', res);
        
        // Mostrar mensaje diferente según el rol
        if (this.rol === 'VECINO') {
          this.showSuccessAlert(
            'Registro Exitoso',
            'Tu cuenta ha sido creada y aprobada automáticamente. Ya puedes iniciar sesión.',
            true
          );
        } else {
          this.showSuccessAlert(
            'Registro Enviado',
            `Tu solicitud de registro como ${this.rol} ha sido enviada. Tu cuenta está pendiente de aprobación por el presidente de la junta de vecinos. Recibirás una notificación una vez que sea aprobada.`,
            false
          );
        }
      },
      error: (err: any) => {
        console.log('Error al registrarse:', err);
        let errorMessage = 'Error al registrarse.';
        
        if (err.error && err.error.detail) {
          errorMessage = err.error.detail;
        } else if (err.error) {
          errorMessage = JSON.stringify(err.error);
        }
        
        this.showErrorAlert('Error de Registro', errorMessage);
      }
    });
  }

  async showSuccessAlert(header: string, message: string, canLogin: boolean) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: canLogin ? 'Ir a Login' : 'Entendido',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
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