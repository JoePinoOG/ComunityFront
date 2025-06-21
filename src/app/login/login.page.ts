import { Component, OnInit } from '@angular/core';
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
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    FormsModule,
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {}

  login() {
    this.http.post<any>('/api/usuarios/login/', {
      email: this.email,
      password: this.password
    }).subscribe(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userRole', res.role);
      this.router.navigate(['/home']);
    }, err => {
      alert('Credenciales incorrectas');
    });
  }

  redirectToRegister() {
    this.router.navigate(['/registro']);
  }
}