export interface Contacto {
  id?: number;
  nombre: string;
  funcion: string;
  foto: string;
  telefono: string;
  junta_vecinos?: string;
}

export interface ContactoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contacto[];
}
