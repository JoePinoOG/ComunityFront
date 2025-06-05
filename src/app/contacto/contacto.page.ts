import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonAvatar,IonModal,
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
  IonToolbar,IonFab,IonFabButton,
  IonList } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {logoWhatsapp, add, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [IonModal,IonFabButton,IonFab,CommonModule,IonBackButton,  IonButton,
    IonButtons,IonLabel,RouterLink,IonContent, IonHeader,
    IonIcon, IonTab, IonTabBar, IonTabButton,
     IonTabs, IonTitle, IonToolbar,IonItem,IonAvatar,FormsModule,IonList]
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

  mostrarEditarContacto = false;
  contactoEditando: any = null;
  fotoEditPreview: string | ArrayBuffer | null = null;

  mostrarAgregarContacto = false;
  nuevoContacto = { nombre: '', funcion: '', telefono: '', foto: '' };
  nuevaFotoPreview: string | ArrayBuffer | null = null;

  abrirLlamada(telefono: string) {
    const url = `tel:${telefono}`;
    window.open(url, '_blank');
  }
  
  abrirWhatsApp(telefono: string) {
    const url = `https://wa.me/${telefono}`;
    window.open(url, '_blank');
  }
  copiarTelefono(telefono: string) {
    navigator.clipboard.writeText(telefono).then(() => {
      alert('Número copiado al portapapeles');
    });
  }
  constructor(private router: Router
  ) {
      addIcons({logoWhatsapp,createOutline,trashOutline,add}); }

  ngOnInit() {
    console.log('Contactos:', this.contactos);
  }
redirectToAddContact() {
  this.router.navigate(['/add-contact']);
  }
  abrirEditarContacto(contacto: any) {
    this.contactoEditando = { ...contacto };
    this.fotoEditPreview = contacto.foto;
    this.mostrarEditarContacto = true;
  }

  cerrarEditarContacto() {
    this.mostrarEditarContacto = false;
    this.contactoEditando = null;
    this.fotoEditPreview = null;
  }

  onFotoEditSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoEditPreview = e.target?.result ?? null;
        this.contactoEditando.foto = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarEdicionContacto() {
    if (this.contactoEditando) {
      const idx = this.contactos.findIndex(c => c.telefono === this.contactoEditando.telefono);
      if (idx > -1) {
        this.contactos[idx] = { ...this.contactoEditando };
      }
      this.cerrarEditarContacto();
    }
  }
  abrirAgregarContacto() {
    this.nuevoContacto = { nombre: '', funcion: '', telefono: '', foto: '' };
    this.nuevaFotoPreview = null;
    this.mostrarAgregarContacto = true;
  }

  cerrarAgregarContacto() {
    this.mostrarAgregarContacto = false;
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.nuevaFotoPreview = e.target?.result ?? null;
        this.nuevoContacto.foto = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarNuevoContacto() {
    if (
      this.nuevoContacto.nombre &&
      this.nuevoContacto.funcion &&
      this.nuevoContacto.telefono
    ) {
      this.contactos.push({
        ...this.nuevoContacto,
        foto: this.nuevoContacto.foto || 'assets/img/default.png'
      });
      this.cerrarAgregarContacto();
    }
  }

  eliminarContacto(contacto: any) {
    this.contactos = this.contactos.filter(c => c !== contacto);
  }
}
