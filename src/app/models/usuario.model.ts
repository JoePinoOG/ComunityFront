export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: string;
  direccion: string;
  telefono: string;
  rut: string;
  junta_vecinos?: string;
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  date_joined?: string;
  last_login?: string;
  tiempo_pendiente?: string;
}

export interface UsuarioValidacion {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: string;
  direccion: string;
  telefono: string;
  rut: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  date_joined: string;
  tiempo_pendiente?: string;
}

export interface ValidarUsuarioRequest {
  accion: 'APROBAR' | 'RECHAZAR';
  observacion?: string;
}

export interface EstadisticasValidacion {
  pendientes: number;
  aprobados: number;
  rechazados: number;
  total: number;
  por_rol: {
    [key: string]: {
      nombre: string;
      total: number;
      pendientes: number;
      aprobados: number;
      rechazados: number;
    };
  };
}

export interface HistorialValidacion {
  id: number;
  usuario_validado: {
    id: number;
    username: string;
    nombre_completo: string;
    rol: string;
  };
  validado_por: {
    id: number;
    username: string;
    nombre_completo: string;
  };
  accion: 'APROBADO' | 'RECHAZADO';
  observacion?: string;
  fecha_validacion: string;
}

// Interfaces adicionales para autenticación
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: Usuario;
}

export interface RegistroRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  direccion?: string;
  rut?: string;
  junta_vecinos?: string;
}
