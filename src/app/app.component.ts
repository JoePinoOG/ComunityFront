import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { megaphone, homeOutline, todayOutline, callOutline, shareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    CommonModule,
    RouterLink,
    RouterOutlet
  ]
})
export class AppComponent {
  showTabBar = true;

  constructor(private router: Router) {
    // Escucha los cambios de ruta
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showTabBar = !['/login', '/registro'].includes(currentRoute);
    });

    addIcons({ homeOutline, todayOutline, callOutline, shareOutline, megaphone });
  }
}
