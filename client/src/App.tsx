import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Header } from '@/components/Header';
import { ToastProvider } from '@/hooks/useToast';
import { Footer } from '@/sections/Footer';
import { Hero } from '@/sections/Hero';
import {
  AboutSection,
  BenefitsSection,
  HowItWorksSection,
  ReviewsSection,
  ServicesSection,
  VehicleSection
} from '@/sections/MarketingSections';
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
        <AboutSection />
        <VehicleSection />
        <HowItWorksSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </ToastProvider>
  );
}
