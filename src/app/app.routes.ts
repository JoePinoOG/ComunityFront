import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path:'home', loadComponent:() => import('./home/home.page').then(m=>m.HomePage)
  },
  {
    path:'login', loadComponent:() => import('./login/login.page').then(m=>m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'reuniones',
    loadComponent: () => import('./reuniones/reuniones.page').then( m => m.ReunionesPage)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./contacto/contacto.page').then( m => m.ContactoPage)
  },
  {
    path: 'publicar',
    loadComponent: () => import('./publicar/publicar.page').then( m => m.PublicarPage)
  },
  {
    path: 'anuncios',
    loadComponent: () => import('./anuncios/anuncios.page').then( m => m.AnunciosPage)
  },
  {
    path: 'certificado-residencia',
    loadComponent: () => import('./certificado-residencia/certificado-residencia.page').then( m => m.CertificadoResidenciaPage)
  },
  {
    path: 'arriendos',
    loadComponent: () => import('./arriendos/arriendos.page').then( m => m.ArriendosPage)
  },
  {
    path: 'perfil-usuario',
    loadComponent: () => import('./perfil-usuario/perfil-usuario.page').then( m => m.PerfilUsuarioPage)
  },  {
    path: 'lista-validar-usuarios',
    loadComponent: () => import('./lista-validar-usuarios/lista-validar-usuarios.page').then( m => m.ListaValidarUsuariosPage)
  }




];
