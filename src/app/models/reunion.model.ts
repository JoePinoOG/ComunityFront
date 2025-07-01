export interface Reunion {
  id?: number;
  titulo: string;
  fecha: string; // RECORDAR USAR FORMATO ISO 8601 QUE ES LA QUE MANEJA LA BD
  lugar: string;
  motivo: 'ORDINARIA' | 'EXTRAORDINARIA' | 'INFORMATIVA';
}

export interface ReunionResponse {
  count?: number;
  next?: string;
  previous?: string;
  results: Reunion[];
}
