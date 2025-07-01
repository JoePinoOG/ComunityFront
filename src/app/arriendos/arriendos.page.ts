import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ArriendosService } from '../services/arriendos.service';

@Component({
  selector: 'app-arriendos',
  templateUrl: './arriendos.page.html',
  styleUrls: ['./arriendos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ArriendosPage implements OnInit {
  solicitudes: any[] = [];

  constructor(private arriendosService: ArriendosService) {}

  ngOnInit() {
    const token = 'TU_TOKEN_JWT'; // Reemplaza por el token real del usuario autenticado
    this.arriendosService.getSolicitudes(token).subscribe(data => {
      this.solicitudes = data;
    });
  }
}