// Modelo para las solicitudes de arriendo
export interface SolicitudArriendo {
  id?: number; // ID único de la solicitud
  solicitante?: number; // ID del usuario que solicita
  solicitante_nombre?: string; // Nombre completo del solicitante (read-only)
  fecha_evento: string; // Fecha del evento (formato YYYY-MM-DD)
  hora_inicio: string; // Hora de inicio del evento (formato HH:MM:SS)
  hora_fin: string; // Hora de fin del evento (formato HH:MM:SS)
  motivo: string; // Motivo del arriendo
  cantidad_asistentes: number; // Número de asistentes esperados
  estado?: 'PENDIENTE' | 'APROBADO' | 'PAGADO' | 'CANCELADO'; // Estado de la solicitud
  monto_pago?: number; // Monto a pagar
  fecha_solicitud?: string; // Fecha cuando se creó la solicitud
  fecha_pago?: string; // Fecha cuando se marcó como pagado
  observaciones?: string; // Observaciones adicionales
  comprobante_pago_base64?: string; // Comprobante como base64
  tiene_comprobante?: boolean; // Indica si tiene comprobante (read-only)
  
  // Campos legacy para compatibilidad
  comprobante_pago?: string; // Alias para comprobante_pago_base64
  token_webpay?: string; // Para integración con Webpay (legacy)
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

// Interfaz para aprobar/rechazar solicitudes
export interface AprobacionArriendo {
  accion: 'APROBAR' | 'RECHAZAR';
  observaciones?: string;
  monto_pago?: number;
}

// Interfaz para respuesta de disponibilidad
export interface DisponibilidadResponse {
  fecha: string;
  ocupados: {
    inicio: string;
    fin: string;
    motivo: string;
    solicitante: string;
    estado: string;
  }[];
  disponibles: {
    inicio: string;
    fin: string;
  }[];
  total_reservas: number;
}

// Interfaz para estadísticas de arriendos
export interface EstadisticasArriendo {
  resumen: {
    total_solicitudes: number;
    solicitudes_mes: number;
    ingresos_mes: number;
    pendientes_revision: number;
    con_comprobante_pendiente: number;
  };
  por_estado: {[key: string]: number};
  proximos_eventos: {
    id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo: string;
    solicitante: string;
    cantidad_asistentes: number;
  }[];
}
