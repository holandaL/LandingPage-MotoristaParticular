import { Car, CheckCircle2, Star } from 'lucide-react';
import sampaioPhoto from '@/assets/sampaio-driver.jpg';
import { benefits, reviews, services, steps } from '@/data/content';

export function ServicesSection() {
  return (
    <section id="servicos" className="section service-band">
      <div className="section-inner">
        <div className="section-heading text-white">
          <p className="text-brandBlue">Serviços</p>
          <h2 className="text-white">Uma solução particular para cada deslocamento.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded-lg border border-white/10 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/20">
                <Icon className="h-6 w-6 text-brandBlue" aria-hidden />
                <h3 className="mt-4 text-lg font-black text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="section bg-paper">
      <div className="section-inner">
        <div className="section-heading">
          <p>Diferenciais</p>
          <h2>Por que viajar com Sampaio?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title} className="item-card bg-white">
                <Icon className="h-6 w-6 text-brandBlue" aria-hidden />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="avaliacoes" className="section bg-white">
      <div className="section-inner">
        <div className="section-heading">
          <p>Avaliações</p>
          <h2>O que os passageiros dizem</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="item-card">
              <div className="flex gap-1 text-brandBlue" aria-label="5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="text-base font-semibold leading-7 text-ink">“{review.text}”</p>
              <p className="text-sm text-ink/60">— {review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="sobre" className="section bg-paper">
      <div className="section-inner grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <div className="section-heading text-left">
            <p>Seu motorista</p>
            <h2>Sampaio</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/70">
            Motorista particular focado em segurança, conforto, pontualidade e atendimento personalizado em Fortaleza e região.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['5 estrelas', '+4 mil viagens', 'Aeroporto', 'Executivo', 'Passeios', 'Shows'].map((item) => (
              <div key={item} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-ink shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-brandBlue" aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </div>
        <figure className="driver-about-card">
          <img src={sampaioPhoto} alt="Foto do motorista Sampaio" className="driver-about-photo" loading="lazy" decoding="async" />
          <figcaption>
            <span>Sampaio</span>
            <strong>Motorista particular em Fortaleza e região.</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function VehicleSection() {
  return (
    <section className="section bg-white">
      <div className="section-inner">
        <div className="section-heading">
          <p>Veículo</p>
          <h2>Seu conforto também importa.</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="item-card bg-mist">
            <Car className="h-8 w-8 text-brandBlue" aria-hidden />
            <h3>Fiat Argo 2026 branco</h3>
            <p>Ar-condicionado, até 4 passageiros, interior limpo, veículo moderno e espaço para bagagens.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Confortável', 'Ideal para cidade', 'Aeroporto', 'Viagens', 'Interior limpo', 'Atendimento executivo'].map((item) => (
              <div key={item} className="feature-row">
                <CheckCircle2 className="h-5 w-5 text-brandBlue" aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="section bg-ink text-white">
      <div className="section-inner">
        <div className="section-heading text-white">
          <p className="text-brandBlue">Como funciona</p>
          <h2>Do pedido ao contato, tudo registrado.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step} className="rounded-lg border border-white/10 bg-white/10 p-5">
              <span className="text-sm font-black text-brandBlue">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-bold">{step}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
