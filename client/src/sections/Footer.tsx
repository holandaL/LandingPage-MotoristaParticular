import { MessageCircle, ShieldCheck } from 'lucide-react';
import { hasConfiguredWhatsapp } from '@/config/contact';
import { useToast } from '@/hooks/useToast';
import { buildIntroWhatsappMessage, createWhatsappUrl } from '@/utils/whatsapp';

export function Footer() {
  const { notify } = useToast();

  function openWhatsapp() {
    if (!hasConfiguredWhatsapp()) {
      notify('Configure o número do WhatsApp no arquivo .env para abrir a conversa real.', 'info');
      return;
    }
    window.open(createWhatsappUrl(buildIntroWhatsappMessage()), '_blank', 'noopener,noreferrer');
  }

  return (
    <footer id="contato" className="bg-ink px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-black">Sampaio | Motorista particular</h2>
          <p className="mt-2 max-w-2xl text-white/75">
            Transporte particular, aeroporto, shows, eventos, passeios, viagens e compromissos executivos em Fortaleza e região.
          </p>
          <p className="mt-4 inline-flex items-start gap-2 text-sm text-white/75">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-brandBlue" aria-hidden />
            Caso Sampaio esteja dirigindo, sua mensagem poderá não ser respondida imediatamente. Assim que estiver parado e disponível,
            ele retornará o contato.
          </p>
        </div>
        <button type="button" className="btn btn-light justify-center" onClick={openWhatsapp}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          Falar pelo WhatsApp
        </button>
      </div>
    </footer>
  );
}
