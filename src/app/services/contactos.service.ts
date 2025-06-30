export interface Contacto {
  id?: number;
  nombre: string;
  funcion: string;
  foto: string;
  telefono: string;
  junta_vecinos?: string;
}

// Interface para respuestas paginadas de DRF
export interface ContactoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contacto[];
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private apiUrl = 'https://backendcomunity.onrender.com/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener todos los contactos
  getContactos(): Observable<Contacto[]> {
    return this.http.get<any>(`${this.apiUrl}/contactos/`).pipe(
      map(response => {
        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta tiene paginación (DRF), devolver los results
        if (response && response.results && Array.isArray(response.results)) {
          return response.results;
        }
        // Si la respuesta está en una propiedad data
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        // Si no coincide con ningún formato, devolver array vacío
        console.warn('Formato de respuesta inesperado en getContactos:', response);
        return [];
      })
    );
  }

  // Crear un nuevo contacto usando fetch con autenticación manual
  crearContacto(contacto: Contacto): Observable<Contacto> {
    return from(this.crearContactoFetch(contacto));
  }

  private async crearContactoFetch(contacto: Contacto): Promise<Contacto> {
    const token = await this.authService.getTokenAsync(); // Obtener token del storage
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // ✅ Importante: incluir el token si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.apiUrl}/contactos/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(contacto)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  // Actualizar un contacto existente usando fetch
  actualizarContacto(id: number, contacto: Contacto): Observable<Contacto> {
    return from(this.actualizarContactoFetch(id, contacto));
  }

  private async actualizarContactoFetch(id: number, contacto: Contacto): Promise<Contacto> {
    const token = await this.authService.getTokenAsync();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.apiUrl}/contactos/${id}/`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(contacto)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  // Eliminar un contacto usando fetch
  eliminarContacto(id: number): Observable<void> {
    return from(this.eliminarContactoFetch(id));
  }

  private async eliminarContactoFetch(id: number): Promise<void> {
    const token = await this.authService.getTokenAsync();
    
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.apiUrl}/contactos/${id}/`, {
      method: 'DELETE',
      headers: headers
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }
  }

  // Obtener un contacto por ID
  getContacto(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.apiUrl}/contactos/${id}/`);
  }

  // Método temporal para debugging - obtener respuesta cruda
  getContactosRaw(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/contactos/`);
  }
}
