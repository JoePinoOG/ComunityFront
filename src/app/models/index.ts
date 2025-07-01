// Exportar todos los modelos desde un solo lugar
export * from './usuario.model';
export * from './publicacion.model';
export * from './contacto.model';
export * from './arriendo.model';
export * from './reunion.model';

// Tipos de respuesta comunes
export interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Enums comunes basados en las implementaciones actuales
export enum TiposReunion {
  ORDINARIA = 'ORDINARIA',
  EXTRAORDINARIA = 'EXTRAORDINARIA',
  INFORMATIVA = 'INFORMATIVA'
}

// Roles del sistema (basado en authservice actual)
export const ROLES_PERMITIDOS = ['TESORERO', 'PRESIDENTE', 'SECRETARIO'];
