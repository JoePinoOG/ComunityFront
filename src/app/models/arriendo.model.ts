// Modelo para las solicitudes de arriendo
export interface SolicitudArriendo {
  id?: number; // ID único de la solicitud
  solicitante?: number; // ID del usuario que solicita
  fecha_evento: string; // Fecha del evento (formato YYYY-MM-DD)
  hora_inicio?: string; // Hora de inicio del evento
  hora_fin?: string; // Hora de fin del evento
  motivo: string; // Motivo del arriendo
  cantidad_asistentes: number; // Número de asistentes esperados
  estado?: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'; // Estado de la solicitud
  monto_pago?: number; // Monto a pagar
  fecha_solicitud?: string; // Fecha cuando se creó la solicitud
  observaciones?: string; // Observaciones adicionales (sin límite de caracteres)
  token_webpay?: string; // Token para integración con Webpay
  comprobante_pago?: string; // Comprobante como url64 (base64 con prefijo de tipo de imagen)
}

// Alias para compatibilidad
export interface Arriendo extends SolicitudArriendo {}

// Respuesta paginada del backend para solicitudes de arriendo
export interface ArriendoResponse {
  results: SolicitudArriendo[]; // Lista de solicitudes
  count: number; // Total de resultados
  next: string | null; // URL de la siguiente página
  previous: string | null; // URL de la página anterior
}
