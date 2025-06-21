import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  IonDatetime
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, settings, megaphone } from 'ionicons/icons';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.page.html',
  styleUrls: ['./reuniones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
    IonDatetime
  ]
})
export class ReunionesPage implements OnInit {

  constructor() {
    addIcons({ playCircle, radio, library, search, megaphone });
  }

  ngOnInit() {}
}
