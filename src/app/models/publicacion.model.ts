export interface Publicacion {
  id?: number;
  titulo: string;
  contenido: string;
  tipo: TipoPublicacion;
  estado?: EstadoPublicacion;
  imagen?: File | string;
  autor?: number; // ID del autor
  fecha_creacion?: string;
  fecha_modificacion?: string;
  fecha_evento?: string;
  lugar_evento?: string;
  es_destacada?: boolean;
  fecha_expiracion?: string;
  vistas?: number;
}

export interface PublicacionResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Publicacion[];
}

export type TipoPublicacion = 'ANUNCIO' | 'EVENTO' | 'AVISO' | 'NOTICIA' | 'PERDIDO' | 'VENTA';

export type EstadoPublicacion = 'ACTIVA' | 'PAUSADA' | 'ARCHIVADA';

export const TIPOS_PUBLICACION = [
  { value: 'ANUNCIO', label: 'Anuncio General' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'AVISO', label: 'Aviso Importante' },
  { value: 'NOTICIA', label: 'Noticia' },
  { value: 'PERDIDO', label: 'Objeto Perdido' },
  { value: 'VENTA', label: 'Venta/Intercambio' }
];


