import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  UsuarioValidacion, 
  ValidarUsuarioRequest, 
  EstadisticasValidacion,
  HistorialValidacion 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ValidacionUsuariosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener usuarios pendientes de validación
   */
  getUsuariosPendientes(): Observable<{ usuarios_pendientes: UsuarioValidacion[], total: number }> {
    return this.http.get<{ usuarios_pendientes: UsuarioValidacion[], total: number }>(
      `${this.apiUrl}/auth/usuarios/usuarios_pendientes/`
    );
  }

  /**
   * Validar (aprobar o rechazar) un usuario
   */
  validarUsuario(usuarioId: number, data: ValidarUsuarioRequest): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/usuarios/${usuarioId}/validar_usuario/`,
      data
    );
  }

  /**
   * Obtener estadísticas de validación
   */
  getEstadisticasValidacion(): Observable<EstadisticasValidacion> {
    return this.http.get<EstadisticasValidacion>(
      `${this.apiUrl}/auth/usuarios/estadisticas_validacion/`
    );
  }

  /**
   * Obtener historial de validaciones
   */
  getHistorialValidaciones(): Observable<{ historial: HistorialValidacion[], total_registros: number }> {
    return this.http.get<{ historial: HistorialValidacion[], total_registros: number }>(
      `${this.apiUrl}/auth/usuarios/historial_validaciones/`
    );
  }

  /**
   * Método de compatibilidad para aprobar usuario
   */
  aprobarUsuario(usuarioId: number, observacion?: string): Observable<any> {
    return this.validarUsuario(usuarioId, {
      accion: 'APROBAR',
      observacion
    });
  }

  /**
   * Método de compatibilidad para rechazar usuario
   */
  rechazarUsuario(usuarioId: number, observacion?: string): Observable<any> {
    return this.validarUsuario(usuarioId, {
      accion: 'RECHAZAR',
      observacion
    });
  }
}
