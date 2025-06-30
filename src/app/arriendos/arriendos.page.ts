import { Component, OnInit } from '@angular/core';
import { ArriendosService } from '../services/arriendos.service';

@Component({
  selector: 'app-arriendos',
  templateUrl: './arriendos.page.html',
  styleUrls: ['./arriendos.page.scss'],
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