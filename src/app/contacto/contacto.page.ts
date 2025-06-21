import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonItem,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoWhatsapp, add } from 'ionicons/icons';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class ContactoPage implements OnInit {
  contactos = [
    {
      nombre: 'María López',
      funcion: 'Secretaria',
      foto: 'assets/img/mujer.png',
      telefono: '521987654321',
    },
    {
      nombre: 'Carlos Gómez',
      funcion: 'Tesorero',
      foto: 'assets/img/carlos.png',
      telefono: '5211122334455',
    },
  ];

  abrirWhatsApp(telefono: string) {
    const url = `https://wa.me/${telefono}`;
    window.open(url, '_blank');
  }
  copiarTelefono(telefono: string) {
    navigator.clipboard.writeText(telefono).then(() => {
      alert('Número copiado al portapapeles');
    });
  }
  constructor(private router: Router) {
    addIcons({ logoWhatsapp, add });
  }

  ngOnInit() {
    console.log('Contactos:', this.contactos);
  }
  redirectToAddContact() {
    this.router.navigate(['/add-contact']);
  }
}
