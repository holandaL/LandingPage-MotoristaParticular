import { MessageCircle } from 'lucide-react';
import { hasConfiguredWhatsapp } from '@/config/contact';
import { buildIntroWhatsappMessage, createWhatsappUrl } from '@/utils/whatsapp';
import { useToast } from '@/hooks/useToast';

export function FloatingWhatsApp() {
  const { notify } = useToast();

  function handleClick() {
    if (!hasConfiguredWhatsapp()) {
      notify('Configure o número do WhatsApp no arquivo .env para abrir a conversa real.', 'info');
      return;
    }
    window.open(createWhatsappUrl(buildIntroWhatsappMessage()), '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:bg-[#168f47] focus:outline-none focus:ring-4 focus:ring-[#1fa855]/25"
      onClick={handleClick}
      aria-label="Falar com Sampaio pelo WhatsApp"
      title="Falar com Sampaio pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </button>
  );
}
