import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { ArriendosService } from '../services/arriendos.service';

@Component({
  selector: 'app-arriendos',
  templateUrl: './arriendos.page.html',
  styleUrls: ['./arriendos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ]
})
export class ArriendosPage implements OnInit {
  solicitudes: any[] = [];

  constructor(private arriendosService: ArriendosService) {}

  ngOnInit() {
    this.arriendosService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
      }
    });
  }
}