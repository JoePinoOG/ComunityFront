import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private unreadPublicationsSubject = new BehaviorSubject<number>(0);
  public unreadPublications$ = this.unreadPublicationsSubject.asObservable();

  constructor() {
    // Cargar el contador desde localStorage al inicializar
    const saved = localStorage.getItem('unreadPublications');
    if (saved) {
      this.unreadPublicationsSubject.next(parseInt(saved, 10));
    }
  }

  // Incrementar el contador cuando hay una nueva publicación
  incrementUnreadPublications() {
    const current = this.unreadPublicationsSubject.value;
    const newCount = current + 1;
    this.unreadPublicationsSubject.next(newCount);
    localStorage.setItem('unreadPublications', newCount.toString());
  }

  // Marcar todas como leídas (cuando se visita la sección de anuncios)
  markAllPublicationsAsRead() {
    this.unreadPublicationsSubject.next(0);
    localStorage.removeItem('unreadPublications');
  }

  // Obtener el número actual de publicaciones no leídas
  getUnreadCount(): number {
    return this.unreadPublicationsSubject.value;
  }
}
