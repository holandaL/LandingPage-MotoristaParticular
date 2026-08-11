import { ChevronRight, MessageCircle, Navigation, Star } from 'lucide-react';
import heroCar from '@/assets/fiat-argo-hero-optimized.jpg';
import sampaioPhoto from '@/assets/sampaio-driver.jpg';
import { hasConfiguredWhatsapp } from '@/config/contact';
import { useToast } from '@/hooks/useToast';
import { buildIntroWhatsappMessage, createWhatsappUrl } from '@/utils/whatsapp';

export function Hero() {
  const { notify } = useToast();

  function speakOnWhatsapp() {
    if (!hasConfiguredWhatsapp()) {
      notify('Configure o número do WhatsApp no arquivo .env para abrir a conversa real.', 'info');
      return;
    }
    window.open(createWhatsappUrl(buildIntroWhatsappMessage()), '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="inicio" className="hero-section">
      <img
        src={heroCar}
        alt="Fiat Argo branco em Fortaleza"
        className="absolute inset-0 h-full w-full object-cover object-[64%_50%]"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,14,0.99),rgba(6,14,24,0.88)_38%,rgba(7,13,18,0.28)_72%,rgba(5,8,12,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050910] via-[#050910]/90 to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[650px] max-w-7xl items-center px-5 pb-28 pt-28 sm:px-7 lg:px-10 lg:pt-32">
        <div className="max-w-[43rem] text-white">
          <p className="hero-kicker">
            <Navigation className="h-4 w-4" aria-hidden />
            Motorista particular em Fortaleza e região
          </p>

          <h1 className="max-w-[38rem] text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            Sua viagem começa com tranquilidade.
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg leading-8 text-white/80">
            Corridas particulares, aeroporto, shows, passeios, viagens executivas e muito mais.
          </p>

          <div className="hero-stats">
            <div>
              <strong>+4 mil</strong>
              <span>viagens realizadas</span>
            </div>
            <div>
              <strong>
                5.0 <Star className="h-4 w-4 fill-current" aria-hidden />
              </strong>
              <span>avaliação</span>
            </div>
            <div>
              <strong>Até 4</strong>
              <span>passageiros</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a className="btn btn-primary justify-center" href="#solicitar">
              Solicitar orçamento
              <ChevronRight className="h-4 w-4" aria-hidden />
            </a>
            <button type="button" className="btn btn-glass justify-center" onClick={speakOnWhatsapp}>
              <MessageCircle className="h-4 w-4" aria-hidden />
              Falar com Sampaio
            </button>
          </div>

          <aside className="driver-card" aria-label="Informações do motorista">
            <img src={sampaioPhoto} alt="Foto do motorista Sampaio" className="driver-photo" loading="eager" decoding="async" />
            <div>
              <p className="text-2xl font-black leading-6">Sampaio</p>
              <p className="mt-1 text-sm font-semibold text-[#5d8dff]">Motorista Particular</p>
              <div className="mt-2 flex items-center gap-1 text-brandBlue" aria-label="5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-1 text-sm text-white/80">+4 mil viagens</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
