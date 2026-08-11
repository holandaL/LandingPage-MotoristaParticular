import { ShieldCheck } from 'lucide-react';

export function InfoNotice() {
  return (
    <aside className="info-notice">
      <ShieldCheck className="h-5 w-5 flex-none text-coral" aria-hidden />
      <div>
        <strong>Segurança em primeiro lugar.</strong>
        <p>
          Sampaio pode estar dirigindo neste momento. Caso a resposta demore alguns minutos, ele responderá assim que estiver
          disponível e em segurança.
        </p>
      </div>
    </aside>
  );
}
