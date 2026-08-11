import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import type { RideRequest } from '@/types/ride';
import { formatDateBR } from '@/utils/format';

type SummaryModalProps = {
  ride: RideRequest | null;
  onClose: () => void;
  onContinue: () => void;
  whatsappLoading: boolean;
};

export function SummaryModal({ ride, onClose, onContinue, whatsappLoading }: SummaryModalProps) {
  if (!ride) return null;

  const items = [
    ['Solicitação', ride.publicId],
    ['Origem', ride.origin],
    ['Destino', ride.destination],
    ['Data', formatDateBR(ride.rideDate)],
    ['Horário', ride.rideTime],
    ['Passageiros', String(ride.passengers)],
    ['Bagagens', ride.luggage],
    ['Serviço', ride.rideType],
    ['Distância estimada', ride.estimatedDistance ?? 'A confirmar'],
    ['Tempo estimado', ride.estimatedDuration ?? 'A confirmar'],
    ['Valor', ride.estimatedPrice ?? 'Valor a confirmar com Sampaio']
  ];

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/75 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-brandBlue/10 p-5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-1 h-6 w-6 text-brandBlue" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-black text-ink">Sua solicitação</h2>
              <p className="text-sm text-ink/60">Registrada com sucesso. Continue pelo WhatsApp para combinar disponibilidade e valor.</p>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar resumo">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <dl className="grid gap-3 p-5 sm:grid-cols-2">
          {items.map(([label, value]) => (
            <div key={label} className="rounded-md border border-brandBlue/10 bg-mist p-3">
              <dt className="text-xs font-semibold uppercase text-brandBlue/80">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-brandBlue/10 bg-white p-5">
          <button type="button" className="btn btn-primary w-full justify-center" onClick={onContinue} disabled={whatsappLoading}>
            {whatsappLoading ? 'Registrando contato...' : 'Continuar pelo WhatsApp'}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
