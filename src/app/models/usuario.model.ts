export interface Usuario {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: string;
  direccion: string;
  telefono: string;
  rut: string;
  junta_vecinos: string;
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
