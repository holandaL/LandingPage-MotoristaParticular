import {
  Car,
  ChevronRight,
  Clock3,
  Loader2,
  LocateFixed,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { rideRequestServerSchema, rideTypes, type RideRequestInput } from '@shared/ride';
import { AddressInput } from '@/components/AddressInput';
import { InfoNotice } from '@/components/InfoNotice';
import { SummaryModal } from '@/components/SummaryModal';
import { hasConfiguredWhatsapp } from '@/config/contact';
import { useToast } from '@/hooks/useToast';
import { createRideRequest, markWhatsappOpened } from '@/services/api';
import { reverseGeocode, routeEstimate } from '@/services/maps';
import type { AddressValue, RideRequest } from '@/types/ride';
import { getTodayInputValue } from '@/utils/format';
import { buildRideWhatsappMessage, createWhatsappUrl } from '@/utils/whatsapp';

type FormErrors = Partial<Record<keyof RideRequestInput | 'form', string>>;

const initialInput: RideRequestInput = {
  customerName: '',
  customerPhone: '',
  origin: '',
  originLatitude: null,
  originLongitude: null,
  destination: '',
  destinationLatitude: null,
  destinationLongitude: null,
  rideDate: getTodayInputValue(),
  rideTime: '',
  passengers: 1,
  luggage: 'Nenhuma',
  rideType: 'Corrida particular',
  notes: '',
  estimatedDistance: null,
  estimatedDuration: null,
  estimatedPrice: 'Valor a confirmar com Sampaio'
};

const serviceCards = [
  {
    title: 'Viagem tranquila e segura',
    description: 'Discrição, segurança e cuidado em cada detalhe da sua viagem.',
    icon: ShieldCheck
  },
  {
    title: 'Pontualidade garantida',
    description: 'Compromisso com horários e roteiros combinados.',
    icon: Clock3
  },
  {
    title: 'Atendimento personalizado',
    description: 'Conforto, atenção e experiência pensada para você.',
    icon: UserRound
  }
];

const bottomBenefits = [
  { title: 'Atendimento Personalizado', icon: UserRound },
  { title: 'Carro Higienizado e Confortável', icon: Sparkles },
  { title: 'Ar-condicionado Sempre Ligado', icon: ShieldCheck },
  { title: 'Veículo 2026 Fiat Argo', icon: Car },
  { title: 'Pagamento Seguro e Transparente', icon: ShieldCheck }
];

export function RideRequestForm() {
  const { notify } = useToast();
  const [form, setForm] = useState<RideRequestInput>(initialInput);
  const [errors, setErrors] = useState<FormErrors>({});
  const [origin, setOrigin] = useState<AddressValue>({ address: '' });
  const [destination, setDestination] = useState<AddressValue>({ address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [submittedRide, setSubmittedRide] = useState<RideRequest | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      origin: origin.address,
      originLatitude: origin.latitude ?? null,
      originLongitude: origin.longitude ?? null
    }));
  }, [origin]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      destination: destination.address,
      destinationLatitude: destination.latitude ?? null,
      destinationLongitude: destination.longitude ?? null
    }));
  }, [destination]);

  useEffect(() => {
    const canEstimate =
      origin.latitude != null &&
      origin.longitude != null &&
      destination.latitude != null &&
      destination.longitude != null;

    if (!canEstimate) {
      setForm((current) => ({ ...current, estimatedDistance: null, estimatedDuration: null }));
      return;
    }

    let ignore = false;
    setRouteLoading(true);
    routeEstimate({
      originLatitude: origin.latitude!,
      originLongitude: origin.longitude!,
      destinationLatitude: destination.latitude!,
      destinationLongitude: destination.longitude!
    })
      .then((result) => {
        if (ignore) return;
        setForm((current) => ({
          ...current,
          estimatedDistance: result.available ? result.distance : null,
          estimatedDuration: result.available ? result.duration : null
        }));
      })
      .catch(() => {
        if (!ignore) {
          setForm((current) => ({ ...current, estimatedDistance: null, estimatedDuration: null }));
        }
      })
      .finally(() => {
        if (!ignore) setRouteLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [destination.latitude, destination.longitude, origin.latitude, origin.longitude]);

  const routeSummary = useMemo(() => {
    if (routeLoading) return 'Calculando rota...';
    if (form.estimatedDistance && form.estimatedDuration) {
      return `${form.estimatedDistance} · ${form.estimatedDuration}`;
    }
    return 'Distância e tempo serão confirmados com Sampaio.';
  }, [form.estimatedDistance, form.estimatedDuration, routeLoading]);

  function updateField<Key extends keyof RideRequestInput>(field: Key, value: RideRequestInput[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function collectErrors(error: z.ZodError<RideRequestInput>): FormErrors {
    const nextErrors: FormErrors = {};
    for (const issue of error.issues) {
      const key = issue.path[0] as keyof RideRequestInput | undefined;
      if (key) nextErrors[key] = issue.message;
    }
    return nextErrors;
  }

  function validate() {
    const payload = { ...form, estimatedPrice: 'Valor a confirmar com Sampaio' };
    const result = rideRequestServerSchema.safeParse(payload);
    if (!result.success) {
      setErrors(collectErrors(result.error));
      return null;
    }
    setErrors({});
    return result.data;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = validate();
    if (!payload) {
      notify('Revise os campos destacados antes de enviar.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { ride } = await createRideRequest(payload);
      setSubmittedRide(ride);
      notify(`Solicitação ${ride.publicId} registrada com sucesso.`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Backend indisponível no momento.';
      setErrors({ form: message });
      notify(message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      notify('GPS indisponível neste navegador. Informe o endereço manualmente.', 'info');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const result = await reverseGeocode(latitude, longitude);
          if (result.available && result.address) {
            setOrigin({ address: result.address, latitude, longitude });
            notify('Localização preenchida com sucesso.', 'success');
            return;
          }
          setOrigin((current) => ({ ...current, latitude, longitude }));
          notify('GPS capturado. Informe o endereço manualmente para completar a origem.', 'info');
        } catch {
          setOrigin((current) => ({ ...current, latitude, longitude }));
          notify('Não conseguimos acessar sua localização completa. Você pode informar o endereço manualmente.', 'info');
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        notify('Não conseguimos acessar sua localização. Você pode informar o endereço manualmente.', 'info');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  async function continueWhatsapp() {
    if (!submittedRide) return;

    if (!hasConfiguredWhatsapp()) {
      notify('Configure o número real do WhatsApp no .env para abrir a conversa com Sampaio.', 'info');
      return;
    }

    setWhatsappLoading(true);
    try {
      await markWhatsappOpened(submittedRide.publicId);
    } catch {
      notify('Solicitação salva. Não foi possível registrar o clique no WhatsApp agora.', 'info');
    } finally {
      setWhatsappLoading(false);
    }

    window.open(createWhatsappUrl(buildRideWhatsappMessage(submittedRide)), '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="solicitar" className="hero-form-section">
      <div className="mx-auto max-w-7xl px-5 pb-7 sm:px-7 lg:px-10">
        <div className="form-grid">
          <form className="request-form" onSubmit={handleSubmit} noValidate>
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-white">Para onde vamos?</h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md text-xs font-bold text-[#5d8dff] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue"
                onClick={useCurrentLocation}
                disabled={gpsLoading}
              >
                {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LocateFixed className="h-4 w-4" aria-hidden />}
                Usar minha localização
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="customerName">Nome</label>
                <input
                  id="customerName"
                  className={`input ${errors.customerName ? 'input-error' : ''}`}
                  value={form.customerName}
                  onChange={(event) => updateField('customerName', event.target.value)}
                  autoComplete="name"
                  placeholder="Nome do passageiro"
                />
                {errors.customerName ? <p className="error-text">{errors.customerName}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="customerPhone">Telefone com WhatsApp</label>
                <input
                  id="customerPhone"
                  className={`input ${errors.customerPhone ? 'input-error' : ''}`}
                  value={form.customerPhone ?? ''}
                  onChange={(event) => updateField('customerPhone', event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Opcional"
                />
                {errors.customerPhone ? <p className="error-text">{errors.customerPhone}</p> : null}
              </div>
            </div>

            <AddressInput
              id="origin"
              label="Origem"
              value={origin}
              placeholder="Digite ou use sua localização"
              error={errors.origin}
              onChange={setOrigin}
            />

            <AddressInput
              id="destination"
              label="Destino"
              value={destination}
              placeholder="Para onde você vai?"
              error={errors.destination}
              onChange={setDestination}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="rideDate">Data</label>
                <input
                  id="rideDate"
                  type="date"
                  min={getTodayInputValue()}
                  className={`input ${errors.rideDate ? 'input-error' : ''}`}
                  value={form.rideDate}
                  onChange={(event) => updateField('rideDate', event.target.value)}
                />
                {errors.rideDate ? <p className="error-text">{errors.rideDate}</p> : null}
              </div>
              <div className="field">
                <label htmlFor="rideTime">Horário</label>
                <input
                  id="rideTime"
                  type="time"
                  className={`input ${errors.rideTime ? 'input-error' : ''}`}
                  value={form.rideTime}
                  onChange={(event) => updateField('rideTime', event.target.value)}
                />
                {errors.rideTime ? <p className="error-text">{errors.rideTime}</p> : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="field">
                <label htmlFor="passengers">Passageiros</label>
                <select
                  id="passengers"
                  className="input"
                  value={form.passengers}
                  onChange={(event) => updateField('passengers', Number(event.target.value))}
                >
                  {[1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>
                      {value} {value === 1 ? 'passageiro' : 'passageiros'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="luggage">Bagagens</label>
                <select id="luggage" className="input" value={form.luggage} onChange={(event) => updateField('luggage', event.target.value as RideRequestInput['luggage'])}>
                  {['Nenhuma', '1', '2', '3', '4', 'Mais de 4'].map((value) => (
                    <option key={value} value={value}>
                      {value === 'Nenhuma' ? value : `${value} ${value === '1' ? 'bagagem' : 'bagagens'}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="rideType">Tipo de serviço</label>
                <select id="rideType" className="input" value={form.rideType} onChange={(event) => updateField('rideType', event.target.value as RideRequestInput['rideType'])}>
                  {rideTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                className="input min-h-20 resize-y"
                value={form.notes ?? ''}
                onChange={(event) => updateField('notes', event.target.value)}
                placeholder="Ex.: aeroporto, executivo, passeios, shows, eventos, WhatsApp etc."
              />
              {errors.notes ? <p className="error-text">{errors.notes}</p> : null}
            </div>

            <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/60">
              {routeSummary} Valor a confirmar com Sampaio.
            </p>

            {errors.form ? <p className="rounded-md bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-100">{errors.form}</p> : null}

            <button type="submit" className="btn btn-primary w-full justify-center" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              {submitting ? 'Registrando solicitação...' : 'Ver orçamento e continuar'}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </form>

          <aside className="side-benefits" aria-label="Diferenciais do serviço">
            {serviceCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="glass-card">
                  <Icon className="h-7 w-7 text-white" aria-hidden />
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              );
            })}
            <InfoNotice />
          </aside>
        </div>

        <div className="benefit-rail">
          {bottomBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="benefit-pill">
                <Icon className="h-6 w-6" aria-hidden />
                <span>{benefit.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <SummaryModal ride={submittedRide} onClose={() => setSubmittedRide(null)} onContinue={continueWhatsapp} whatsappLoading={whatsappLoading} />
    </section>
  );
}
