import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonAvatar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonItem,
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar, } from '@ionic/angular/standalone';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {megaphone, homeOutline, todayOutline, callOutline, shareOutline } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, RouterOutlet,CommonModule,IonBackButton,  IonButton,
    IonButtons,IonLabel,RouterLink,IonContent, IonHeader,
    IonIcon, IonTab, IonTabBar, IonTabButton,
     IonTabs, IonTitle, IonToolbar,IonItem,IonAvatar],
})
export class AppComponent {
  showTabBar = true; // Controla la visibilidad del ion-tab-bar

  constructor(private router: Router) {

    // Escucha los cambios de ruta
    this.router.events.subscribe(() => {
      // Oculta la barra de navegación en las rutas específicas
      const currentRoute = this.router.url;
      this.showTabBar = !['/login', '/registro'].includes(currentRoute);
    });
    
    addIcons({homeOutline,todayOutline,callOutline,shareOutline,megaphone});    
    
}


}
