import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonLabel, IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  
  constructor(private authService: AuthService, private router: Router) {}
  login() {
    console.log('Iniciando proceso de login...'); // Debug
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);
        if (res && res.access) {
          localStorage.setItem('token', res.access);
          
          // Verificar el estado del usuario después del login
          this.authService.getProfile().subscribe({
            next: (user) => {
              console.log('Usuario obtenido después del login:', user);
              
              // Verificar si el usuario está pendiente de aprobación
              if (user.estado === 'PENDIENTE') {
                alert('Tu cuenta está pendiente de aprobación por el presidente de la junta de vecinos. No puedes acceder hasta que sea aprobada.');
                localStorage.removeItem('token'); // Remover el token
                return;
              }
              
              // Verificar si el usuario fue rechazado
              if (user.estado === 'RECHAZADO') {
                alert('Tu cuenta ha sido rechazada. Contacta al presidente de la junta de vecinos para más información.');
                localStorage.removeItem('token'); // Remover el token
                return;
              }
              
              // Si el usuario está aprobado, continuar con el login
              if (user.estado === 'APROBADO') {
                // Marcar que es un login reciente para mostrar el mensaje de bienvenida
                localStorage.setItem('recentLogin', 'true');
                // Redirige al home
                this.router.navigate(['/home']);
              } else {
                alert('Estado de cuenta no reconocido. Contacta al administrador.');
                localStorage.removeItem('token');
              }
            },
            error: (err) => {
              console.error('Error al obtener el perfil:', err);
              alert('Error al verificar el estado de la cuenta. Detalles: ' + JSON.stringify(err));
              localStorage.removeItem('token');
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        let errorMessage = 'Error de conexión o credenciales incorrectas';
        
        if (err.error && err.error.detail) {
          errorMessage = err.error.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`Error de login: ${errorMessage}`);
      }
    });
  }
  
  ngOnInit() {}


  redirectToRegister() {
    this.router.navigate(['/registro']);
  }
}