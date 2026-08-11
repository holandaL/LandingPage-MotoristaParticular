import type { RideRequest } from '@/types/ride';
import { CONTACT } from '@/config/contact';
import { formatDateBR } from './format';

const serviceTitles: Record<string, string> = {
  Aeroporto: '✈️ TRANSFER AEROPORTO',
  Show: '🎤 TRANSPORTE PARA SHOW',
  Evento: '🎟️ TRANSPORTE PARA EVENTO',
  'Viagem executiva': '💼 TRANSPORTE EXECUTIVO',
  Empresarial: '💼 TRANSPORTE EXECUTIVO',
  Passeio: '🏖️ PASSEIO PARTICULAR',
  Viagem: '🛣️ VIAGEM PARTICULAR',
  'Corrida particular': '🚗 CORRIDA PARTICULAR',
  Outro: '🚗 CORRIDA PARTICULAR'
};

export function buildRideWhatsappMessage(ride: RideRequest) {
  const title = serviceTitles[ride.rideType] ?? serviceTitles['Corrida particular'];
  return [
    'Olá, Sampaio! Gostaria de solicitar um orçamento.',
    '',
    `${title}`,
    '',
    `🚗 *SOLICITAÇÃO ${ride.publicId}*`,
    '',
    `👤 *Passageiro:* ${ride.customerName}`,
    ride.customerPhone ? `📱 *Telefone:* ${ride.customerPhone}` : null,
    `📍 *Origem:* ${ride.origin}`,
    `🏁 *Destino:* ${ride.destination}`,
    `📅 *Data:* ${formatDateBR(ride.rideDate)}`,
    `🕐 *Horário:* ${ride.rideTime}`,
    `👥 *Passageiros:* ${ride.passengers}`,
    `🧳 *Bagagens:* ${ride.luggage}`,
    `📝 *Serviço:* ${ride.rideType}`,
    `📏 *Distância estimada:* ${ride.estimatedDistance ?? 'A confirmar'}`,
    `⏱️ *Tempo estimado:* ${ride.estimatedDuration ?? 'A confirmar'}`,
    '',
    '*Observações:*',
    ride.notes?.trim() ? ride.notes.trim() : 'Sem observações.',
    '',
    'Gostaria de saber o valor e confirmar sua disponibilidade.'
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildIntroWhatsappMessage() {
  return 'Olá, Sampaio! Encontrei seu site e gostaria de informações sobre seu serviço de motorista particular.';
}

export function createWhatsappUrl(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
