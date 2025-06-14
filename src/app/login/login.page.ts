import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/servicios/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonLabel, IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  
  constructor(private authService: AuthService, private router: Router) {}
  login() {
    // El backend espera username, así que usamos el email como username
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        // Guarda el token si es necesario
        if (res && res.access) {
          localStorage.setItem('token', res.access);
        }
        // Redirige al home
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('Credenciales incorrectas o error de conexión');
      }
    });
  }
  
  ngOnInit() {}


  redirectToRegister() {
    this.router.navigate(['/registro']);
  }
}