import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonAvatar,IonModal,IonSpinner,IonInput,
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
import { AuthService,Usuario } from 'src/app/services/authservice.service';
import { ContactosService, Contacto } from 'src/app/services/contactos.service';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [IonModal,IonSpinner,IonInput,IonFabButton,IonFab,CommonModule,IonBackButton,  IonButton,
    IonButtons,IonLabel,RouterLink,IonContent, IonHeader,
    IonIcon, IonTab, IonTabBar, IonTabButton,
     IonTabs, IonTitle, IonToolbar,IonItem,IonAvatar,FormsModule,IonList]
})
export class ContactoPage implements OnInit {
  contactos: Contacto[] = []; // Inicializar como array vacío

  mostrarEditarContacto = false;
  contactoEditando: Contacto | null = null;
  fotoEditPreview: string | ArrayBuffer | null = null;

  mostrarAgregarContacto = false;
  nuevoContacto: Contacto = { nombre: '', funcion: '', telefono: '', foto: '' };
  nuevaFotoPreview: string | ArrayBuffer | null = null;

  userInfo: Usuario | null = null;
  isLoading = false;

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
  constructor(
    private router: Router,
    private authService: AuthService,
    private contactosService: ContactosService
  ) {
      addIcons({logoWhatsapp,createOutline,trashOutline,add}); }

  ngOnInit() {
    this.cargarContactos();
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.userInfo = user;
        console.log('Usuario logeado:', this.userInfo);
      },
      error: (err) => {
        console.log('Error al obtener perfil:', err);
      }
    });
  }

  cargarContactos() {
    this.isLoading = true;
    
    // Primero intentar con el método normal
    this.contactosService.getContactos().subscribe({
      next: (contactos) => {
        console.log('Contactos recibidos:', contactos);
        if (Array.isArray(contactos)) {
          this.contactos = contactos;
        } else {
          console.warn('Los contactos no son un array:', contactos);
          this.contactos = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar contactos:', err);
        
        // Si falla, intentar con el método raw para debugging
        this.contactosService.getContactosRaw().subscribe({
          next: (response) => {
            console.log('Respuesta cruda del servidor:', response);
            this.manejarRespuestaContactos(response);
            this.isLoading = false;
          },
          error: (rawErr) => {
            console.error('Error en respuesta cruda:', rawErr);
            this.cargarContactosPorDefecto();
            this.isLoading = false;
          }
        });
      }
    });
  }

  private manejarRespuestaContactos(response: any) {
    if (Array.isArray(response)) {
      this.contactos = response;
    } else if (response && typeof response === 'object' && 'results' in response) {
      this.contactos = response.results || [];
    } else if (response && typeof response === 'object' && 'data' in response) {
      this.contactos = response.data || [];
    } else {
      console.warn('Formato de respuesta no reconocido:', response);
      this.cargarContactosPorDefecto();
    }
  }

  private cargarContactosPorDefecto() {
    this.contactos = [
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
  }

  esRolPermitido(): boolean {
    if (!this.userInfo) return false;
    const rol = this.userInfo.rol?.toUpperCase();
    return rol === 'TESORERO' || rol === 'PRESIDENTE' || rol === 'SECRETARIO';
  }

  redirectToAddContact() {
  this.router.navigate(['/add-contact']);
  }
  abrirEditarContacto(contacto: Contacto) {
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
        if (this.contactoEditando) {
          this.contactoEditando.foto = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  guardarEdicionContacto() {
    if (this.contactoEditando && this.contactoEditando.id) {
      this.isLoading = true;
      this.contactosService.actualizarContacto(this.contactoEditando.id, this.contactoEditando).subscribe({
        next: (contactoActualizado) => {
          const idx = this.contactos.findIndex(c => c.id === contactoActualizado.id);
          if (idx > -1) {
            this.contactos[idx] = contactoActualizado;
          }
          this.cerrarEditarContacto();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al actualizar contacto:', err);
          this.isLoading = false;
          alert('Error al actualizar el contacto');
        }
      });
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
      this.isLoading = true;
      // Si no se seleccionó foto, usar una por defecto
      if (!this.nuevoContacto.foto) {
        this.nuevoContacto.foto = 'assets/img/default.png';
      }
      
      this.contactosService.crearContacto(this.nuevoContacto).subscribe({
        next: (contactoCreado) => {
          this.contactos.push(contactoCreado);
          this.cerrarAgregarContacto();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al crear contacto:', err);
          this.isLoading = false;
          alert('Error al crear el contacto');
        }
      });
    }
  }

  eliminarContacto(contacto: Contacto) {
    if (contacto.id && confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      this.isLoading = true;
      this.contactosService.eliminarContacto(contacto.id).subscribe({
        next: () => {
          this.contactos = this.contactos.filter(c => c.id !== contacto.id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al eliminar contacto:', err);
          this.isLoading = false;
          alert('Error al eliminar el contacto');
        }
      });
    }
  }
}
