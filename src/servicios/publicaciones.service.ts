import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private publicaciones: { texto: string; imagen: string | null }[] = [];

  constructor() {}

  agregarPublicacion(publicacion: { texto: string; imagen: string | null }) {
    this.publicaciones.unshift(publicacion); // Agregar al inicio de la lista
  }

  obtenerPublicaciones() {
    return this.publicaciones;
  }
    eliminarPublicacion(index: number) {
    this.publicaciones.splice(index, 1); // Elimina la publicación en el índice especificado
  }
}
