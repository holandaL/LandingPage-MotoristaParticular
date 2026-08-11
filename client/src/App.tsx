import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Header } from '@/components/Header';
import { ToastProvider } from '@/hooks/useToast';
import { Hero } from '@/sections/Hero';
import { BenefitsSection, ReviewsSection, ServicesSection } from '@/sections/MarketingSections';
import { RideRequestForm } from '@/sections/RideRequestForm';

export function App() {
  return (
    <ToastProvider>
      <Header />
      <main>
        <section className="hero-stage">
          <Hero />
          <RideRequestForm />
        </section>
        <ServicesSection />
        <BenefitsSection />
        <ReviewsSection />
      </main>
      <FloatingWhatsApp />
    </ToastProvider>
  );
}
