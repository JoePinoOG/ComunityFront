export interface Arriendo {
  id?: number;
  titulo?: string;
  descripcion?: string;
  precio?: number;
  ubicacion?: string;
  propietario?: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  fecha_creacion?: string;
  estado?: string;
}

export interface ArriendoResponse {
  results: Arriendo[];
  count: number;
  next: string | null;
  previous: string | null;
}
